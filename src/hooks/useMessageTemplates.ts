import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface MessageTemplate {
  id: string;
  user_id: string;
  name: string;
  content: string;
  category: string | null;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplateFormData {
  name: string;
  content: string;
  category?: string;
}

export function useMessageTemplates() {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ["message-templates"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("message_templates")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      return data as MessageTemplate[];
    },
  });

  const createTemplate = useMutation({
    mutationFn: async (templateData: MessageTemplateFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const { data, error } = await supabase
        .from("message_templates")
        .insert({
          user_id: user.id,
          name: templateData.name,
          content: templateData.content,
          category: templateData.category || "personalizado",
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      toast.success("Template criado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao criar template:", error);
      toast.error("Erro ao criar template");
    },
  });

  const updateTemplate = useMutation({
    mutationFn: async ({ id, ...templateData }: MessageTemplateFormData & { id: string }) => {
      const { data, error } = await supabase
        .from("message_templates")
        .update({
          name: templateData.name,
          content: templateData.content,
          category: templateData.category,
        })
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      toast.success("Template atualizado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao atualizar template:", error);
      toast.error("Erro ao atualizar template");
    },
  });

  const deleteTemplate = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("message_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["message-templates"] });
      toast.success("Template excluído com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao excluir template:", error);
      toast.error("Erro ao excluir template");
    },
  });

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  };
}
