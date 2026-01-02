import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FileText, ChevronDown } from "lucide-react";
import { useMessageTemplates } from "@/hooks/useMessageTemplates";

interface TemplateSelectorProps {
  onSelectTemplate: (content: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  promocao: "Promoção",
  lembrete: "Lembrete",
  aniversario: "Aniversário",
  "boas-vindas": "Boas-vindas",
  resgate: "Resgate de Cliente",
  personalizado: "Personalizado",
};

export function TemplateSelector({ onSelectTemplate }: TemplateSelectorProps) {
  const { templates, isLoading } = useMessageTemplates();

  if (isLoading || templates.length === 0) {
    return null;
  }

  // Group templates by category
  const groupedTemplates = templates.reduce((acc, template) => {
    const category = template.category || "personalizado";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(template);
    return acc;
  }, {} as Record<string, typeof templates>);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="h-4 w-4 mr-2" />
          Usar Template
          <ChevronDown className="h-4 w-4 ml-2" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Selecionar Template</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
          <div key={category}>
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              {CATEGORY_LABELS[category] || category}
            </DropdownMenuLabel>
            {categoryTemplates.map((template) => (
              <DropdownMenuItem
                key={template.id}
                onClick={() => onSelectTemplate(template.content)}
                className="cursor-pointer"
              >
                <span className="truncate">{template.name}</span>
              </DropdownMenuItem>
            ))}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
