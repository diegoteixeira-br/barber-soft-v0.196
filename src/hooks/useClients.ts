import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUnit } from "@/contexts/UnitContext";
import { useToast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  company_id: string | null;
  unit_id: string;
  name: string;
  phone: string;
  birth_date: string | null;
  last_visit_at: string | null;
  total_visits: number;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export type ClientFilter = "all" | "birthday_month" | "inactive";

export function useClients(filter: ClientFilter = "all") {
  const { currentUnitId } = useCurrentUnit();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["clients", currentUnitId, filter],
    queryFn: async () => {
      if (!currentUnitId) return [];

      let query = supabase
        .from("clients")
        .select("*")
        .eq("unit_id", currentUnitId)
        .order("name", { ascending: true });

      const { data, error } = await query;

      if (error) throw error;

      let clients = data as Client[];

      // Apply filters
      if (filter === "birthday_month") {
        const currentMonth = new Date().getMonth() + 1;
        clients = clients.filter((client) => {
          if (!client.birth_date) return false;
          const birthMonth = new Date(client.birth_date).getMonth() + 1;
          return birthMonth === currentMonth;
        });
      } else if (filter === "inactive") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        clients = clients.filter((client) => {
          if (!client.last_visit_at) return true;
          return new Date(client.last_visit_at) < thirtyDaysAgo;
        });
      }

      return clients;
    },
    enabled: !!currentUnitId,
  });

  const updateClient = useMutation({
    mutationFn: async ({ id, ...data }: Partial<Client> & { id: string }) => {
      const { error } = await supabase
        .from("clients")
        .update({
          name: data.name,
          phone: data.phone,
          birth_date: data.birth_date,
          tags: data.tags,
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Cliente atualizado com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao atualizar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteClient = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast({ title: "Cliente removido com sucesso!" });
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao remover cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    clients: query.data || [],
    isLoading: query.isLoading,
    updateClient,
    deleteClient,
  };
}
