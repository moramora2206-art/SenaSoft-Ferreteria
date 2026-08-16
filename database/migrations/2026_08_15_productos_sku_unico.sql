-- Aplica unicidad a productos.Codigo_SKU.
-- Los datos actuales ya son únicos (12 productos, sin SKU vacíos ni duplicados),
-- por lo que la restricción es segura para los datos existentes.
ALTER TABLE productos
    ADD CONSTRAINT uq_productos_codigo_sku UNIQUE (Codigo_SKU);