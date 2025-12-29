import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenses, EXPENSE_CATEGORIES, PAYMENT_METHODS, Expense } from "@/hooks/useExpenses";
import { format } from "date-fns";

const formSchema = z.object({
  category: z.string().min(1, "Selecione uma categoria"),
  description: z.string().optional(),
  amount: z.coerce.number().positive("O valor deve ser maior que zero"),
  expense_date: z.string().min(1, "Selecione uma data"),
  payment_method: z.string().optional(),
  is_recurring: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface ExpenseFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense?: Expense | null;
}

export function ExpenseFormModal({ open, onOpenChange, expense }: ExpenseFormModalProps) {
  const { createExpense, updateExpense } = useExpenses();
  const isEditing = !!expense;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      description: "",
      amount: 0,
      expense_date: format(new Date(), "yyyy-MM-dd"),
      payment_method: "",
      is_recurring: false,
    },
  });

  useEffect(() => {
    if (expense) {
      form.reset({
        category: expense.category,
        description: expense.description || "",
        amount: Number(expense.amount),
        expense_date: expense.expense_date,
        payment_method: expense.payment_method || "",
        is_recurring: expense.is_recurring || false,
      });
    } else {
      form.reset({
        category: "",
        description: "",
        amount: 0,
        expense_date: format(new Date(), "yyyy-MM-dd"),
        payment_method: "",
        is_recurring: false,
      });
    }
  }, [expense, form]);

  const onSubmit = async (data: FormData) => {
    if (isEditing && expense) {
      await updateExpense.mutateAsync({
        id: expense.id,
        category: data.category,
        description: data.description,
        amount: data.amount,
        expense_date: data.expense_date,
        payment_method: data.payment_method,
        is_recurring: data.is_recurring,
      });
    } else {
      await createExpense.mutateAsync({
        category: data.category,
        description: data.description,
        amount: data.amount,
        expense_date: data.expense_date,
        payment_method: data.payment_method,
        is_recurring: data.is_recurring,
      });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Despesa" : "Nova Despesa"}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {EXPENSE_CATEGORIES.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
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
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0,00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expense_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="payment_method"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione (opcional)" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {PAYMENT_METHODS.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descrição detalhada da despesa..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="is_recurring"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Despesa recorrente</FormLabel>
                    <p className="text-xs text-muted-foreground">
                      Marque se esta despesa se repete mensalmente
                    </p>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={createExpense.isPending || updateExpense.isPending}
              >
                {isEditing ? "Salvar" : "Registrar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
