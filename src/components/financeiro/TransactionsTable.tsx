import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FinancialAppointment } from "@/hooks/useFinancialData";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentBadge } from "./PaymentMethodModal";

interface TransactionsTableProps {
  appointments: FinancialAppointment[];
  isLoading: boolean;
}

export function TransactionsTable({ appointments, isLoading }: TransactionsTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <p>Nenhuma transação encontrada no período selecionado.</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Data/Hora</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Barbeiro</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="hover:bg-muted/30">
              <TableCell className="font-medium">
                {format(new Date(appointment.start_time), "dd/MM HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>{appointment.client_name}</TableCell>
              <TableCell>{appointment.barber?.name || "-"}</TableCell>
              <TableCell>{appointment.service?.name || "-"}</TableCell>
              <TableCell>
                <PaymentBadge method={appointment.payment_method} />
              </TableCell>
              <TableCell className="text-right font-semibold text-emerald-500">
                {formatCurrency(appointment.total_price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
