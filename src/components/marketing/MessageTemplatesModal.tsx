import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { useMessageTemplates, MessageTemplate } from "@/hooks/useMessageTemplates";

interface MessageTemplatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CATEGORIES = [
  { value: "promocao", label: "Promoção" },
  { value: "lembrete", label: "Lembrete" },
  { value: "aniversario", label: "Aniversário" },
  { value: "boas-vindas", label: "Boas-vindas" },
  { value: "resgate", label: "Resgate de Cliente" },
  { value: "personalizado", label: "Personalizado" },
];

export function MessageTemplatesModal({ open, onOpenChange }: MessageTemplatesModalProps) {
  const { templates, isLoading, createTemplate, updateTemplate, deleteTemplate } = useMessageTemplates();
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    category: "personalizado",
  });

  const handleOpenForm = (template?: MessageTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        content: template.content,
        category: template.category || "personalizado",
      });
    } else {
      setEditingTemplate(null);
      setFormData({ name: "", content: "", category: "personalizado" });
    }
    setIsEditing(true);
  };

  const handleCloseForm = () => {
    setIsEditing(false);
    setEditingTemplate(null);
    setFormData({ name: "", content: "", category: "personalizado" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.content.trim()) {
      return;
    }

    if (editingTemplate) {
      await updateTemplate.mutateAsync({ id: editingTemplate.id, ...formData });
    } else {
      await createTemplate.mutateAsync(formData);
    }
    handleCloseForm();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este template?")) {
      await deleteTemplate.mutateAsync(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Templates de Mensagem</DialogTitle>
        </DialogHeader>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Template</Label>
              <Input
                id="name"
                placeholder="Ex: Promoção de Corte"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo da Mensagem</Label>
              <p className="text-xs text-muted-foreground">
                Use {"{{nome}}"} para personalizar com o nome do cliente
              </p>
              <Textarea
                id="content"
                placeholder="Olá {{nome}}! Temos uma promoção especial para você..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleCloseForm}>
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={createTemplate.isPending || updateTemplate.isPending}
              >
                {editingTemplate ? "Salvar Alterações" : "Criar Template"}
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <Button onClick={() => handleOpenForm()} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Criar Novo Template
            </Button>

            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Carregando templates...</p>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Nenhum template criado ainda.</p>
                <p className="text-sm">Crie templates para agilizar suas campanhas!</p>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <div className="space-y-2">
                  {templates.map((template) => (
                    <Card key={template.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium truncate">{template.name}</h4>
                              <span className="text-xs px-2 py-0.5 bg-muted rounded-full">
                                {CATEGORIES.find(c => c.value === template.category)?.label || "Personalizado"}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {template.content}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenForm(template)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(template.id)}
                              disabled={deleteTemplate.isPending}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
