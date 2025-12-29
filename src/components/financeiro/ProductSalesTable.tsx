import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ShoppingCart } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductSale } from "@/hooks/useProductSales";

interface ProductSalesTableProps {
  sales: ProductSale[];
  isLoading: boolean;
}

export function ProductSalesTable({ sales, isLoading }: ProductSalesTableProps) {
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

  if (sales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Nenhuma venda registrada neste período</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Data/Hora</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead className="text-center">Qtd</TableHead>
            <TableHead className="text-right">Unitário</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Cliente</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">
                {format(new Date(sale.sale_date), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>{sale.product?.name || "-"}</TableCell>
              <TableCell className="text-center">{sale.quantity}</TableCell>
              <TableCell className="text-right">
                {formatCurrency(Number(sale.unit_price))}
              </TableCell>
              <TableCell className="text-right font-semibold text-green-500">
                +{formatCurrency(Number(sale.total_price))}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {sale.barber?.name || "-"}
              </TableCell>
              <TableCell className="text-muted-foreground">
                {sale.client_name || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
