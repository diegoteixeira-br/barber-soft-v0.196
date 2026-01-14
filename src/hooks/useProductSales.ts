import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUnit } from "@/contexts/UnitContext";
import { toast } from "sonner";

export interface ProductSale {
  id: string;
  unit_id: string;
  company_id: string | null;
  product_id: string;
  barber_id: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  client_name: string | null;
  client_phone: string | null;
  appointment_id: string | null;
  created_at: string;
  payment_method: string | null;
  product?: {
    id: string;
    name: string;
  };
  barber?: {
    id: string;
    name: string;
  };
}

export interface ProductSaleFormData {
  product_id: string;
  barber_id?: string;
  quantity: number;
  unit_price: number;
  client_name?: string;
  client_phone?: string;
  appointment_id?: string;
  payment_method?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export function useProductSales(dateRange?: DateRange) {
  const { currentUnitId, currentCompanyId } = useCurrentUnit();
  const queryClient = useQueryClient();

  const { data: sales = [], isLoading, error, refetch } = useQuery({
    queryKey: ["product-sales", currentUnitId, dateRange?.start?.toISOString(), dateRange?.end?.toISOString()],
    queryFn: async () => {
      if (!currentUnitId) return [];

      let query = supabase
        .from("product_sales")
        .select(`
          *,
          product:products(id, name),
          barber:barbers(id, name)
        `)
        .eq("unit_id", currentUnitId)
        .order("sale_date", { ascending: false });

      if (dateRange) {
        query = query
          .gte("sale_date", dateRange.start.toISOString())
          .lte("sale_date", dateRange.end.toISOString());
      }

      const { data, error } = await query;
      if (error) throw error;

      return (data || []).map(item => ({
        ...item,
        product: Array.isArray(item.product) ? item.product[0] : item.product,
        barber: Array.isArray(item.barber) ? item.barber[0] : item.barber,
      })) as ProductSale[];
    },
    enabled: !!currentUnitId,
  });

  const createSale = useMutation({
    mutationFn: async (formData: ProductSaleFormData) => {
      if (!currentUnitId) throw new Error("Nenhuma unidade selecionada");

      const total_price = formData.quantity * formData.unit_price;

      const { data, error } = await supabase
        .from("product_sales")
        .insert({
          unit_id: currentUnitId,
          company_id: currentCompanyId,
          ...formData,
          total_price,
          sale_date: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-sales"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Venda registrada com sucesso!");
    },
    onError: (error) => {
      console.error("Error creating sale:", error);
      toast.error("Erro ao registrar venda");
    },
  });

  const deleteSale = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("product_sales").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-sales"] });
      toast.success("Venda removida com sucesso!");
    },
    onError: (error) => {
      console.error("Error deleting sale:", error);
      toast.error("Erro ao remover venda");
    },
  });

  return {
    sales,
    isLoading,
    error,
    refetch,
    createSale,
    deleteSale,
  };
}
