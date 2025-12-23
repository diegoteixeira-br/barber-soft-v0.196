import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Calendar as CalendarIcon } from "lucide-react";

export default function Agenda() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Agenda</h1>
          <p className="mt-1 text-muted-foreground">Gerencie seus agendamentos</p>
        </div>
        
        <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-card/50">
          <div className="flex flex-col items-center gap-4 text-center">
            <CalendarIcon className="h-12 w-12 text-muted-foreground/50" />
            <div>
              <h3 className="text-lg font-medium text-foreground">Calendário em breve</h3>
              <p className="text-sm text-muted-foreground">A funcionalidade de agenda será implementada na próxima fase</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
