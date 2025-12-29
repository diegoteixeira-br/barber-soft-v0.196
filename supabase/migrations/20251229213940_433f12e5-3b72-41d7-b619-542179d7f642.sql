-- Tabela de Despesas/Gastos
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  amount NUMERIC NOT NULL,
  expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
  payment_method TEXT,
  is_recurring BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Produtos
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  sku TEXT,
  cost_price NUMERIC NOT NULL DEFAULT 0,
  sale_price NUMERIC NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  min_stock_alert INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de Vendas de Produtos
CREATE TABLE public.product_sales (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  unit_id UUID NOT NULL REFERENCES public.units(id) ON DELETE CASCADE,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  barber_id UUID REFERENCES public.barbers(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  total_price NUMERIC NOT NULL,
  sale_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  client_name TEXT,
  client_phone TEXT,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_sales ENABLE ROW LEVEL SECURITY;

-- RLS Policies for expenses
CREATE POLICY "Users can view expenses from their units" ON public.expenses FOR SELECT USING (user_owns_unit(unit_id));
CREATE POLICY "Users can create expenses in their units" ON public.expenses FOR INSERT WITH CHECK (user_owns_unit(unit_id));
CREATE POLICY "Users can update expenses in their units" ON public.expenses FOR UPDATE USING (user_owns_unit(unit_id));
CREATE POLICY "Users can delete expenses from their units" ON public.expenses FOR DELETE USING (user_owns_unit(unit_id));

-- RLS Policies for products
CREATE POLICY "Users can view products from their units" ON public.products FOR SELECT USING (user_owns_unit(unit_id));
CREATE POLICY "Users can create products in their units" ON public.products FOR INSERT WITH CHECK (user_owns_unit(unit_id));
CREATE POLICY "Users can update products in their units" ON public.products FOR UPDATE USING (user_owns_unit(unit_id));
CREATE POLICY "Users can delete products from their units" ON public.products FOR DELETE USING (user_owns_unit(unit_id));

-- RLS Policies for product_sales
CREATE POLICY "Users can view product_sales from their units" ON public.product_sales FOR SELECT USING (user_owns_unit(unit_id));
CREATE POLICY "Users can create product_sales in their units" ON public.product_sales FOR INSERT WITH CHECK (user_owns_unit(unit_id));
CREATE POLICY "Users can update product_sales in their units" ON public.product_sales FOR UPDATE USING (user_owns_unit(unit_id));
CREATE POLICY "Users can delete product_sales from their units" ON public.product_sales FOR DELETE USING (user_owns_unit(unit_id));

-- Trigger para atualizar estoque após venda
CREATE OR REPLACE FUNCTION public.update_stock_on_sale()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.products
  SET stock_quantity = stock_quantity - NEW.quantity,
      updated_at = now()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_product_sale
  AFTER INSERT ON public.product_sales
  FOR EACH ROW
  EXECUTE FUNCTION public.update_stock_on_sale();

-- Trigger para atualizar updated_at em products
CREATE OR REPLACE FUNCTION public.update_products_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_products_timestamp
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_products_updated_at();