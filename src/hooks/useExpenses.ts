import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUnit } from "@/contexts/UnitContext";
import { toast } from "sonner";

export interface Expense {
  id: string;
  unit_id: string;
  company_id: string | null;
  category: string;
  description: string | null;
  amount: number;
  expense_date: string;
  payment_method: string | null;
  is_recurring: boolean | null;
  created_at: string;
}

export interface ExpenseFormData {
  category: string;
  description?: string;
  amount: number;
  expense_date: string;
  payment_method?: string;
  is_recurring?: boolean;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export function useExpenses(dateRange?: DateRange) {
  const { currentUnitId, currentCompanyId } = useCurrentUnit();
  const queryClient = useQueryClient();

  const { data: expenses = [], isLoading, error, refetch } = useQuery({
    queryKey: ["expenses", currentUnitId, dateRange?.start?.toISOString(), dateRange?.end?.toISOString()],
    queryFn: async () => {
      if (!currentUnitId) return [];

      let query = supabase
        .from("expenses")
        .select("*")
        .eq("unit_id", currentUnitId)
        .order("expense_date", { ascending: false });

      if (dateRange) {
        query = query
          .gte("expense_date", dateRange.start.toISOString().split('T')[0])
          .lte("expense_date", dateRange.end.toISOString().split('T')[0]);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Expense[];
    },
    enabled: !!currentUnitId,
  });

  const createExpense = useMutation({
    mutationFn: async (formData: ExpenseFormData) => {
      if (!currentUnitId) throw new Error("Nenhuma unidade selecionada");

      const { data, error } = await supabase
        .from("expenses")
        .insert({
          unit_id: currentUnitId,
          company_id: currentCompanyId,
          ...formData,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating expense:", error);
      toast.error("Erro ao registrar despesa");
    },
  });

  const updateExpense = useMutation({
    mutationFn: async ({ id, ...formData }: ExpenseFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("expenses")
        .update(formData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa atualizada com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating expense:", error);
      toast.error("Erro ao atualizar despesa");
    },
  });

  const deleteExpense = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Despesa removida com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting expense:", error);
      toast.error("Erro ao remover despesa");
    },
  });

  return {
    expenses,
    isLoading,
    error,
    refetch,
    createExpense,
    updateExpense,
    deleteExpense,
  };
}

export const EXPENSE_CATEGORIES = [
  "Aluguel",
  "Energia",
  "Água",
  "Telefone/Internet",
  "Materiais de Consumo",
  "Manutenção",
  "Salários",
  "Impostos",
  "Marketing",
  "Fornecedores",
  "Outros",
] as const;

export const PAYMENT_METHODS = [
  "Dinheiro",
  "PIX",
  "Cartão de Crédito",
  "Cartão de Débito",
  "Boleto",
  "Transferência",
] as const;
