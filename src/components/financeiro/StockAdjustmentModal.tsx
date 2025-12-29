import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProducts, Product } from "@/hooks/useProducts";
import { Plus, Minus } from "lucide-react";

interface StockAdjustmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product?: Product | null;
}

export function StockAdjustmentModal({ open, onOpenChange, product }: StockAdjustmentModalProps) {
  const { adjustStock } = useProducts();
  const [newQuantity, setNewQuantity] = useState(0);
  const [adjustmentType, setAdjustmentType] = useState<"set" | "add" | "remove">("add");
  const [adjustmentAmount, setAdjustmentAmount] = useState(0);

  useEffect(() => {
    if (product) {
      setNewQuantity(product.stock_quantity);
      setAdjustmentAmount(0);
      setAdjustmentType("add");
    }
  }, [product]);

  if (!product) return null;

  const handleAdjustment = () => {
    let finalQuantity = newQuantity;
    
    if (adjustmentType === "add") {
      finalQuantity = product.stock_quantity + adjustmentAmount;
    } else if (adjustmentType === "remove") {
      finalQuantity = Math.max(0, product.stock_quantity - adjustmentAmount);
    } else {
      finalQuantity = newQuantity;
    }

    adjustStock.mutate({ id: product.id, quantity: finalQuantity });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Ajustar Estoque</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="font-medium">{product.name}</p>
            <p className="text-sm text-muted-foreground">
              Estoque atual: <span className="font-semibold text-foreground">{product.stock_quantity}</span> unidades
            </p>
          </div>

          <div className="space-y-3">
            <Label>Tipo de Ajuste</Label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant={adjustmentType === "add" ? "default" : "outline"}
                onClick={() => setAdjustmentType("add")}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Adicionar
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "remove" ? "default" : "outline"}
                onClick={() => setAdjustmentType("remove")}
                className="gap-2"
              >
                <Minus className="h-4 w-4" />
                Remover
              </Button>
              <Button
                type="button"
                variant={adjustmentType === "set" ? "default" : "outline"}
                onClick={() => setAdjustmentType("set")}
              >
                Definir
              </Button>
            </div>
          </div>

          {adjustmentType === "set" ? (
            <div className="space-y-2">
              <Label>Nova Quantidade</Label>
              <Input
                type="number"
                min="0"
                value={newQuantity}
                onChange={(e) => setNewQuantity(parseInt(e.target.value) || 0)}
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label>
                Quantidade a {adjustmentType === "add" ? "adicionar" : "remover"}
              </Label>
              <Input
                type="number"
                min="0"
                value={adjustmentAmount}
                onChange={(e) => setAdjustmentAmount(parseInt(e.target.value) || 0)}
              />
              <p className="text-sm text-muted-foreground">
                Estoque final:{" "}
                <span className="font-semibold text-foreground">
                  {adjustmentType === "add"
                    ? product.stock_quantity + adjustmentAmount
                    : Math.max(0, product.stock_quantity - adjustmentAmount)}
                </span>{" "}
                unidades
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAdjustment} disabled={adjustStock.isPending}>
              Confirmar Ajuste
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
