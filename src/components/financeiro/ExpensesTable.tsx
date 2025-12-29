import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MoreVertical, Pencil, Trash2, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Expense } from "@/hooks/useExpenses";

interface ExpensesTableProps {
  expenses: Expense[];
  isLoading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

export function ExpensesTable({ expenses, isLoading, onEdit, onDelete }: ExpensesTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Nenhuma despesa registrada neste período</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Data</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium">
                {format(new Date(expense.expense_date), "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {expense.category}
                  {expense.is_recurring && (
                    <span title="Recorrente">
                      <RefreshCw className="h-3 w-3 text-purple-500" />
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="max-w-[200px] truncate text-muted-foreground">
                {expense.description || "-"}
              </TableCell>
              <TableCell>
                {expense.payment_method ? (
                  <Badge variant="outline" className="text-xs">
                    {expense.payment_method}
                  </Badge>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell className="text-right font-semibold text-destructive">
                -{formatCurrency(Number(expense.amount))}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onEdit(expense)}>
                      <Pencil className="mr-2 h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(expense.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
