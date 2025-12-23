import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Scissors } from "lucide-react";

export default function Servicos() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Serviços</h1>
          <p className="mt-1 text-muted-foreground">Cadastre cortes e defina preços</p>
        </div>
        
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
          <div className="flex flex-col items-center gap-4 text-center">
            <Scissors className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-medium text-foreground">Catálogo de serviços em breve</h3>
              <p className="text-sm text-muted-foreground">A funcionalidade será implementada na próxima fase</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
