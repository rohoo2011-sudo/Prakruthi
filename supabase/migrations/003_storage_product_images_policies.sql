-- Storage RLS for product-images bucket
-- INSERT: admins can upload
CREATE POLICY "product_images_admin_insert" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND public.is_admin()
);

-- SELECT: public read (images on storefront)
CREATE POLICY "product_images_public_select" ON storage.objects
FOR SELECT
USING (bucket_id = 'product-images');

-- UPDATE: admins (needed for upsert)
CREATE POLICY "product_images_admin_update" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin())
WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

-- DELETE: admins
CREATE POLICY "product_images_admin_delete" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'product-images' AND public.is_admin());
