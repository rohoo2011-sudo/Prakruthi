-- Fix RLS recursion: admin check via SECURITY DEFINER so policies don't SELECT from profiles under RLS.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Store
DROP POLICY IF EXISTS "store_update_admin" ON store;
DROP POLICY IF EXISTS "store_insert_admin" ON store;
CREATE POLICY "store_update_admin" ON store FOR UPDATE USING (is_admin());
CREATE POLICY "store_insert_admin" ON store FOR INSERT WITH CHECK (is_admin());

-- Products
DROP POLICY IF EXISTS "products_insert_admin" ON products;
DROP POLICY IF EXISTS "products_update_admin" ON products;
DROP POLICY IF EXISTS "products_delete_admin" ON products;
CREATE POLICY "products_insert_admin" ON products FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "products_update_admin" ON products FOR UPDATE USING (is_admin());
CREATE POLICY "products_delete_admin" ON products FOR DELETE USING (is_admin());

-- Orders
DROP POLICY IF EXISTS "orders_select_admin" ON orders;
DROP POLICY IF EXISTS "orders_update_admin" ON orders;
DROP POLICY IF EXISTS "orders_delete_admin" ON orders;
CREATE POLICY "orders_select_admin" ON orders FOR SELECT USING (is_admin());
CREATE POLICY "orders_update_admin" ON orders FOR UPDATE USING (is_admin());
CREATE POLICY "orders_delete_admin" ON orders FOR DELETE USING (is_admin());

-- Profiles
DROP POLICY IF EXISTS "profiles_select_admin" ON profiles;
CREATE POLICY "profiles_select_admin" ON profiles FOR SELECT USING (is_admin());
