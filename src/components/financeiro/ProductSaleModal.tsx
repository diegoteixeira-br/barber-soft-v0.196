import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useProducts, Product } from "@/hooks/useProducts";
import { useProductSales } from "@/hooks/useProductSales";
import { useBarbers } from "@/hooks/useBarbers";
import { useMemo, useEffect } from "react";

const formSchema = z.object({
  product_id: z.string().min(1, "Selecione um produto"),
  barber_id: z.string().optional(),
  quantity: z.coerce.number().int().positive("Quantidade deve ser maior que zero"),
  client_name: z.string().optional(),
  client_phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ProductSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductSaleModal({ open, onOpenChange }: ProductSaleModalProps) {
  const { products } = useProducts();
  const { createSale } = useProductSales();
  const { barbers } = useBarbers();

  const activeProducts = useMemo(
    () => products.filter((p) => p.is_active && p.stock_quantity > 0),
    [products]
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product_id: "",
      barber_id: "",
      quantity: 1,
      client_name: "",
      client_phone: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        product_id: "",
        barber_id: "",
        quantity: 1,
        client_name: "",
        client_phone: "",
      });
    }
  }, [open, form]);

  const selectedProductId = form.watch("product_id");
  const quantity = form.watch("quantity");

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId),
    [products, selectedProductId]
  );

  const totalPrice = selectedProduct ? Number(selectedProduct.sale_price) * quantity : 0;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const onSubmit = async (data: FormData) => {
    if (!selectedProduct) return;

    await createSale.mutateAsync({
      product_id: data.product_id,
      barber_id: data.barber_id || undefined,
      quantity: data.quantity,
      unit_price: Number(selectedProduct.sale_price),
      client_name: data.client_name || undefined,
      client_phone: data.client_phone || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Registrar Venda de Produto</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="product_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {activeProducts.map((product) => (
                        <SelectItem key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(Number(product.sale_price))} ({product.stock_quantity} em estoque)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max={selectedProduct?.stock_quantity || 999}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="barber_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vendedor</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {barbers.map((barber) => (
                          <SelectItem key={barber.id} value={barber.id}>
                            {barber.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="client_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="client_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telefone do Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Opcional" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total */}
            {selectedProduct && (
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Valor Unitário:</span>
                  <span className="font-medium">{formatCurrency(Number(selectedProduct.sale_price))}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm text-muted-foreground">Quantidade:</span>
                  <span className="font-medium">{quantity}</span>
                </div>
                <div className="border-t border-border mt-3 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Total:</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(totalPrice)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createSale.isPending}>
                Registrar Venda
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
