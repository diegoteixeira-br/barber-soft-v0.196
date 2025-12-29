import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUnit } from "@/contexts/UnitContext";
import { toast } from "sonner";

export interface Product {
  id: string;
  unit_id: string;
  company_id: string | null;
  name: string;
  description: string | null;
  sku: string | null;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  min_stock_alert: number | null;
  is_active: boolean | null;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  name: string;
  description?: string;
  sku?: string;
  cost_price: number;
  sale_price: number;
  stock_quantity: number;
  min_stock_alert?: number;
  is_active?: boolean;
}

export function useProducts() {
  const { currentUnitId, currentCompanyId } = useCurrentUnit();
  const queryClient = useQueryClient();

  const { data: products = [], isLoading, error, refetch } = useQuery({
    queryKey: ["products", currentUnitId],
    queryFn: async () => {
      if (!currentUnitId) return [];

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("unit_id", currentUnitId)
        .order("name", { ascending: true });

      if (error) throw error;
      return data as Product[];
    },
    enabled: !!currentUnitId,
  });

  const createProduct = useMutation({
    mutationFn: async (formData: ProductFormData) => {
      if (!currentUnitId) throw new Error("Nenhuma unidade selecionada");

      const { data, error } = await supabase
        .from("products")
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
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto cadastrado com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating product:", error);
      toast.error("Erro ao cadastrar produto");
    },
  });

  const updateProduct = useMutation({
    mutationFn: async ({ id, ...formData }: ProductFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("products")
        .update(formData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error("Erro ao atualizar produto");
    },
  });

  const deleteProduct = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Produto removido com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error("Erro ao remover produto");
    },
  });

  const adjustStock = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const { data, error } = await supabase
        .from("products")
        .update({ stock_quantity: quantity })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Estoque ajustado com sucesso!");
    },
    onError: (error) => {
      console.error("Error adjusting stock:", error);
      toast.error("Erro ao ajustar estoque");
    },
  });

  // Computed values
  const lowStockProducts = products.filter(
    (p) => p.is_active && p.stock_quantity <= (p.min_stock_alert || 5)
  );

  const totalStockValue = products.reduce(
    (sum, p) => sum + p.stock_quantity * p.cost_price,
    0
  );

  return {
    products,
    isLoading,
    error,
    refetch,
    createProduct,
    updateProduct,
    deleteProduct,
    adjustStock,
    lowStockProducts,
    totalStockValue,
  };
}
