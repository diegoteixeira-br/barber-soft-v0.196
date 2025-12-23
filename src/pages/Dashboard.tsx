import { DollarSign, Calendar, TrendingUp, Users, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

function MetricCard({ title, value, change, changeType, icon, description }: MetricCardProps) {
  return (
    <Card className="border-border bg-card transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-foreground">{value}</div>
        <div className="mt-2 flex items-center gap-2">
          <span
            className={`flex items-center text-sm font-medium ${
              changeType === "positive"
                ? "text-success"
                : changeType === "negative"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {changeType === "positive" ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : changeType === "negative" ? (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            ) : null}
            {change}
          </span>
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </div>
      </CardContent>
    </Card>
  );
}

function UpcomingAppointments() {
  const appointments = [
    { id: 1, client: "João Silva", service: "Corte + Barba", time: "09:00", professional: "Carlos" },
    { id: 2, client: "Pedro Santos", service: "Corte Degradê", time: "09:30", professional: "André" },
    { id: 3, client: "Lucas Oliveira", service: "Barba", time: "10:00", professional: "Carlos" },
    { id: 4, client: "Marcos Costa", service: "Corte Navalhado", time: "10:30", professional: "Felipe" },
    { id: 5, client: "Rafael Lima", service: "Corte + Sobrancelha", time: "11:00", professional: "André" },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Clock className="h-5 w-5 text-primary" />
          Próximos Agendamentos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {appointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-secondary/50">
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{apt.client}</span>
                <span className="text-sm text-muted-foreground">{apt.service}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="font-semibold text-primary">{apt.time}</span>
                <span className="text-sm text-muted-foreground">{apt.professional}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function TopProfessionals() {
  const professionals = [
    { id: 1, name: "Carlos Mendes", revenue: "R$ 2.450", appointments: 28, avatar: "CM" },
    { id: 2, name: "André Souza", revenue: "R$ 2.120", appointments: 24, avatar: "AS" },
    { id: 3, name: "Felipe Rocha", revenue: "R$ 1.890", appointments: 21, avatar: "FR" },
  ];

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <TrendingUp className="h-5 w-5 text-accent" />
          Top Profissionais do Mês
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {professionals.map((pro, index) => (
            <div key={pro.id} className="flex items-center gap-4 px-6 py-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>
              <div className="flex flex-1 flex-col">
                <span className="font-medium text-foreground">{pro.name}</span>
                <span className="text-sm text-muted-foreground">{pro.appointments} atendimentos</span>
              </div>
              <div className="text-right">
                <span className="font-semibold text-gold">{pro.revenue}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Visão geral da sua barbearia hoje</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Faturamento Hoje"
            value="R$ 1.850"
            change="+12%"
            changeType="positive"
            description="vs. ontem"
            icon={<DollarSign className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Agendamentos Hoje"
            value="18"
            change="+3"
            changeType="positive"
            description="vs. ontem"
            icon={<Calendar className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Ticket Médio"
            value="R$ 85"
            change="-5%"
            changeType="negative"
            description="vs. semana passada"
            icon={<TrendingUp className="h-5 w-5 text-primary" />}
          />
          <MetricCard
            title="Clientes Atendidos"
            value="156"
            change="+8%"
            changeType="positive"
            description="este mês"
            icon={<Users className="h-5 w-5 text-primary" />}
          />
        </div>

        {/* Charts and Lists */}
        <div className="grid gap-6 lg:grid-cols-2">
          <UpcomingAppointments />
          <TopProfessionals />
        </div>
      </div>
    </DashboardLayout>
  );
}
