import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  Download, 
  Database, 
  Table2, 
  Loader2,
  CheckSquare,
  Square,
  FileSpreadsheet
} from "lucide-react";

const DATABASE_TABLES = [
  { name: "appointment_deletions", description: "Histórico de agendamentos deletados", category: "Agendamentos" },
  { name: "appointments", description: "Agendamentos", category: "Agendamentos" },
  { name: "automation_logs", description: "Logs de automações", category: "Marketing" },
  { name: "barbers", description: "Profissionais/Barbeiros", category: "Equipe" },
  { name: "business_hours", description: "Horários de funcionamento", category: "Configurações" },
  { name: "business_settings", description: "Configurações do negócio", category: "Configurações" },
  { name: "campaign_message_logs", description: "Logs de mensagens de campanhas", category: "Marketing" },
  { name: "cancellation_history", description: "Histórico de cancelamentos", category: "Agendamentos" },
  { name: "client_dependents", description: "Dependentes de clientes", category: "Clientes" },
  { name: "clients", description: "Clientes", category: "Clientes" },
  { name: "companies", description: "Empresas/Barbearias", category: "Sistema" },
  { name: "expenses", description: "Despesas", category: "Financeiro" },
  { name: "feedbacks", description: "Feedbacks dos usuários", category: "Sistema" },
  { name: "holidays", description: "Feriados", category: "Configurações" },
  { name: "marketing_campaigns", description: "Campanhas de marketing", category: "Marketing" },
  { name: "message_templates", description: "Templates de mensagens", category: "Marketing" },
  { name: "page_visits", description: "Visitas de páginas", category: "Analytics" },
  { name: "partnership_terms", description: "Termos de parceria", category: "Sistema" },
  { name: "plan_features", description: "Recursos dos planos", category: "Sistema" },
  { name: "product_sales", description: "Vendas de produtos", category: "Financeiro" },
  { name: "products", description: "Produtos", category: "Financeiro" },
  { name: "saas_settings", description: "Configurações do SaaS", category: "Sistema" },
  { name: "services", description: "Serviços oferecidos", category: "Serviços" },
  { name: "term_acceptances", description: "Aceites de termos", category: "Sistema" },
  { name: "units", description: "Unidades/Filiais", category: "Sistema" },
  { name: "user_roles", description: "Roles de usuários", category: "Sistema" },
];

const CATEGORIES = [...new Set(DATABASE_TABLES.map(t => t.category))];

export default function AdminExportData() {
  const { toast } = useToast();
  const [selectedTables, setSelectedTables] = useState<string[]>([]);
  const [loadingTable, setLoadingTable] = useState<string | null>(null);
  const [exportingAll, setExportingAll] = useState(false);

  const toggleTable = (tableName: string) => {
    setSelectedTables(prev => 
      prev.includes(tableName) 
        ? prev.filter(t => t !== tableName)
        : [...prev, tableName]
    );
  };

  const selectAll = () => {
    setSelectedTables(DATABASE_TABLES.map(t => t.name));
  };

  const deselectAll = () => {
    setSelectedTables([]);
  };

  const selectCategory = (category: string) => {
    const categoryTables = DATABASE_TABLES.filter(t => t.category === category).map(t => t.name);
    const allSelected = categoryTables.every(t => selectedTables.includes(t));
    
    if (allSelected) {
      setSelectedTables(prev => prev.filter(t => !categoryTables.includes(t)));
    } else {
      setSelectedTables(prev => [...new Set([...prev, ...categoryTables])]);
    }
  };

  const convertToCSV = (data: any[], tableName: string): string => {
    if (!data || data.length === 0) {
      return `# Tabela: ${tableName}\n# Sem dados disponíveis\n`;
    }

    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(",")];

    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        if (value === null || value === undefined) return "";
        if (typeof value === "object") return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
        const stringValue = String(value);
        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }
        return stringValue;
      });
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportTable = async (tableName: string) => {
    setLoadingTable(tableName);
    try {
      const { data, error } = await supabase
        .from(tableName as any)
        .select("*")
        .limit(50000);

      if (error) throw error;

      const csv = convertToCSV(data || [], tableName);
      const timestamp = new Date().toISOString().split("T")[0];
      downloadCSV(csv, `${tableName}_${timestamp}.csv`);

      toast({
        title: "Exportação concluída",
        description: `Tabela ${tableName} exportada com ${data?.length || 0} registros.`,
      });
    } catch (error: any) {
      console.error(`Error exporting ${tableName}:`, error);
      toast({
        title: "Erro na exportação",
        description: error.message || `Não foi possível exportar a tabela ${tableName}`,
        variant: "destructive",
      });
    } finally {
      setLoadingTable(null);
    }
  };

  const exportSelected = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "Nenhuma tabela selecionada",
        description: "Selecione pelo menos uma tabela para exportar.",
        variant: "destructive",
      });
      return;
    }

    setExportingAll(true);
    const timestamp = new Date().toISOString().split("T")[0];
    let combinedCSV = "";
    let totalRecords = 0;
    let exportedTables = 0;

    for (const tableName of selectedTables) {
      try {
        const { data, error } = await supabase
          .from(tableName as any)
          .select("*")
          .limit(50000);

        if (error) {
          console.error(`Error exporting ${tableName}:`, error);
          combinedCSV += `\n\n# ========== TABELA: ${tableName} ==========\n`;
          combinedCSV += `# ERRO: ${error.message}\n`;
          continue;
        }

        combinedCSV += `\n\n# ========== TABELA: ${tableName} (${data?.length || 0} registros) ==========\n`;
        combinedCSV += convertToCSV(data || [], tableName);
        totalRecords += data?.length || 0;
        exportedTables++;
      } catch (err: any) {
        combinedCSV += `\n\n# ========== TABELA: ${tableName} ==========\n`;
        combinedCSV += `# ERRO: ${err.message}\n`;
      }
    }

    downloadCSV(combinedCSV, `barbersoft_export_${timestamp}.csv`);

    toast({
      title: "Exportação concluída",
      description: `${exportedTables} tabelas exportadas com ${totalRecords} registros no total.`,
    });

    setExportingAll(false);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Agendamentos": "bg-blue-500/20 text-blue-400 border-blue-500/30",
      "Marketing": "bg-purple-500/20 text-purple-400 border-purple-500/30",
      "Equipe": "bg-green-500/20 text-green-400 border-green-500/30",
      "Configurações": "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      "Clientes": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      "Sistema": "bg-slate-500/20 text-slate-400 border-slate-500/30",
      "Financeiro": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      "Analytics": "bg-pink-500/20 text-pink-400 border-pink-500/30",
      "Serviços": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    };
    return colors[category] || "bg-slate-500/20 text-slate-400 border-slate-500/30";
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Database className="h-6 w-6 text-blue-400" />
              Exportar Dados
            </h1>
            <p className="text-slate-400 mt-1">
              Exporte os dados do banco de dados em formato CSV
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-blue-500/30 text-blue-400">
              {selectedTables.length} de {DATABASE_TABLES.length} selecionadas
            </Badge>
          </div>
        </div>

        {/* Actions Card */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5 text-green-400" />
              Ações Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={selectAll}
                className="border-slate-600 hover:bg-slate-700"
              >
                <CheckSquare className="h-4 w-4 mr-2" />
                Selecionar Todas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={deselectAll}
                className="border-slate-600 hover:bg-slate-700"
              >
                <Square className="h-4 w-4 mr-2" />
                Limpar Seleção
              </Button>
              <div className="border-l border-slate-600 mx-2" />
              {CATEGORIES.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => selectCategory(category)}
                  className={`border-slate-600 hover:bg-slate-700 ${
                    DATABASE_TABLES.filter(t => t.category === category)
                      .every(t => selectedTables.includes(t.name))
                      ? "bg-blue-600/20 border-blue-500/50"
                      : ""
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
              <Button
                onClick={exportSelected}
                disabled={selectedTables.length === 0 || exportingAll}
                className="bg-green-600 hover:bg-green-700"
              >
                {exportingAll ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Exportando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Exportar {selectedTables.length} Tabela(s) Selecionada(s)
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DATABASE_TABLES.map(table => (
            <Card 
              key={table.name}
              className={`bg-slate-800/50 border-slate-700 transition-all cursor-pointer hover:border-blue-500/50 ${
                selectedTables.includes(table.name) ? "border-blue-500 bg-blue-500/10" : ""
              }`}
              onClick={() => toggleTable(table.name)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={selectedTables.includes(table.name)}
                      onCheckedChange={() => toggleTable(table.name)}
                      className="mt-1"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <Table2 className="h-4 w-4 text-slate-400" />
                        <span className="font-mono text-sm text-white">{table.name}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{table.description}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 text-[10px] ${getCategoryColor(table.category)}`}
                      >
                        {table.category}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      exportTable(table.name);
                    }}
                    disabled={loadingTable === table.name}
                    className="text-slate-400 hover:text-white hover:bg-slate-700"
                  >
                    {loadingTable === table.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Card */}
        <Card className="bg-amber-500/10 border-amber-500/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Database className="h-5 w-5 text-amber-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-400">Informações sobre a exportação</h4>
                <ul className="text-sm text-amber-300/80 mt-2 space-y-1 list-disc list-inside">
                  <li>Os dados são exportados em formato CSV (compatível com Excel)</li>
                  <li>Limite de 50.000 registros por tabela</li>
                  <li>Algumas tabelas podem ter dados restritos por políticas de segurança (RLS)</li>
                  <li>A exportação múltipla combina todas as tabelas em um único arquivo</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
