import { useState, useMemo } from "react";
import { Plus, Package, AlertTriangle, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProducts } from "@/hooks/useProducts";
import { useProductSales } from "@/hooks/useProductSales";
import { ProductFormModal } from "./ProductFormModal";
import { ProductSaleModal } from "./ProductSaleModal";
import { ProductsTable } from "./ProductsTable";
import { ProductSalesTable } from "./ProductSalesTable";
import { StockAdjustmentModal } from "./StockAdjustmentModal";
import { startOfMonth, endOfMonth } from "date-fns";

export function InventoryTab() {
  const [activeTab, setActiveTab] = useState<"products" | "sales">("products");
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isStockModalOpen, setIsStockModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [adjustingProduct, setAdjustingProduct] = useState<any>(null);

  const now = new Date();
  const monthRange = { start: startOfMonth(now), end: endOfMonth(now) };

  const { products, isLoading, deleteProduct, lowStockProducts, totalStockValue } = useProducts();
  const { sales, isLoading: salesLoading } = useProductSales(monthRange);

  const activeProducts = useMemo(
    () => products.filter((p) => p.is_active),
    [products]
  );

  const monthSalesTotal = useMemo(
    () => sales.reduce((sum, s) => sum + Number(s.total_price), 0),
    [sales]
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    deleteProduct.mutate(id);
  };

  const handleAdjustStock = (product: any) => {
    setAdjustingProduct(product);
    setIsStockModalOpen(true);
  };

  const handleCloseProductModal = () => {
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleCloseStockModal = () => {
    setIsStockModalOpen(false);
    setAdjustingProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Gestão de Estoque</h3>
          <p className="text-sm text-muted-foreground">Produtos e vendas do seu estabelecimento</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsSaleModalOpen(true)} className="gap-2">
            <ShoppingCart className="h-4 w-4" />
            Registrar Venda
          </Button>
          <Button onClick={() => setIsProductModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Produto
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{activeProducts.length}</div>
            <p className="text-xs text-muted-foreground">produtos ativos</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Valor em Estoque</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(totalStockValue)}</div>
            <p className="text-xs text-muted-foreground">custo total</p>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Vendas do Mês</CardTitle>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{formatCurrency(monthSalesTotal)}</div>
            <p className="text-xs text-muted-foreground">{sales.length} venda(s)</p>
          </CardContent>
        </Card>

        <Card className={`border-border bg-card ${lowStockProducts.length > 0 ? 'border-orange-500/50' : ''}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Estoque Baixo</CardTitle>
            <AlertTriangle className={`h-4 w-4 ${lowStockProducts.length > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${lowStockProducts.length > 0 ? 'text-orange-500' : 'text-foreground'}`}>
              {lowStockProducts.length}
            </div>
            <p className="text-xs text-muted-foreground">produto(s) com alerta</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "products" | "sales")}>
        <TabsList className="bg-muted">
          <TabsTrigger value="products">Produtos</TabsTrigger>
          <TabsTrigger value="sales">Histórico de Vendas</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4">
          <ProductsTable
            products={products}
            isLoading={isLoading}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onAdjustStock={handleAdjustStock}
          />
        </TabsContent>

        <TabsContent value="sales" className="mt-4">
          <ProductSalesTable sales={sales} isLoading={salesLoading} />
        </TabsContent>
      </Tabs>

      <ProductFormModal
        open={isProductModalOpen}
        onOpenChange={handleCloseProductModal}
        product={editingProduct}
      />

      <ProductSaleModal
        open={isSaleModalOpen}
        onOpenChange={setIsSaleModalOpen}
      />

      <StockAdjustmentModal
        open={isStockModalOpen}
        onOpenChange={handleCloseStockModal}
        product={adjustingProduct}
      />
    </div>
  );
}
