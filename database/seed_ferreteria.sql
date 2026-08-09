-- Script de Datos de Prueba para Ferretería
-- Preserva los datos existentes e inserta datos con contexto de Ferretería si no existen

USE softwarefacturacion;

-- 1. PROVEEDORES DE FERRETERÍA
INSERT IGNORE INTO proveedores (IdProveedor, Nombre_Proveedor, NIT, Nombre_Contacto, NCelular, Email) VALUES
(10, 'Distribuciones El Constructor S.A.S.', 900123456, 'Roberto Gómez', '3104567890', 'contacto@elconstructor.com'),
(11, 'Ferretería Mayorista Colombia', 900654321, 'María Fernanda Ruiz', '3157890123', 'ventas@ferremayorista.co'),
(12, 'Herramientas y Equipos Industriales', 900987654, 'Carlos Alberto Mendoza', '3182345678', 'servicio@herramientasind.com'),
(13, 'Plomería y Tubos del Norte', 900456789, 'Jorge Eliécer Silva', '3209876543', 'pedidos@tubosnorte.com');

-- 2. CLIENTES DE FERRETERÍA
INSERT IGNORE INTO clientes (`IdCliente`, `Nombre`, `Apellido`, `Cédula`, `NCelular`, `Email`, `Dirección`) VALUES
(10, 'Pedro', 'Gómez (Maestro de Obra)', '1098765432', '3112223344', 'maestro.pedro@gmail.com', 'Calle 45 # 12-34 Barrio Centro'),
(11, 'Constructora Bolívar', 'S.A.S.', '900111222', '3145556677', 'compras@constructorabolivar.com', 'Av. Empresarial # 80-10'),
(12, 'Juan Carlos', 'Pérez (Particular)', '1012345678', '3168889900', 'juan.perez@hotmail.com', 'Cra 15 # 23-45 San José'),
(13, 'ElectriServicios', 'R&M S.A.S.', '900333444', '3174445566', 'proyectos@electriservicios.co', 'Calle 100 # 15-20');

-- 3. PRODUCTOS DE FERRETERÍA
INSERT IGNORE INTO productos (IdProducto, IdProveedor, Nombre_Producto, Codigo_SKU, Stock, Precio_Unitario, Precio_Compra, Categoria, Imagen, Fecha_Vencimiento, Descripcion) VALUES
(10, 12, 'Martillo de Uña 16 oz Mango de Fibra', 'FER-MAR-001', 25, 32000.00, 22000.00, 'Herramientas Manuales', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300', '2030-12-31', 'Martillo de uña curva 16oz con mango ergonómico de fibra de vidrio anti-deslizante.'),
(11, 12, 'Juego de Destornilladores 6 Piezas', 'FER-DES-002', 18, 45000.00, 30000.00, 'Herramientas Manuales', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300', '2030-12-31', 'Set de 3 destornilladores de pala y 3 de estrella con puntas magnéticas en acero Cromo Vanadio.'),
(12, 12, 'Alicate Universal 8 Pulgadas', 'FER-ALI-003', 12, 28000.00, 18000.00, 'Herramientas Manuales', 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=300', '2030-12-31', 'Alicate universal de 8" aislado para 1000V, cuerpo en acero forjado.'),
(13, 12, 'Taladro Percutor 1/2" 650W', 'FER-TAL-004', 6, 185000.00, 130000.00, 'Herramientas Eléctricas', 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300', '2030-12-31', 'Taladro percutor profesional de 650W con velocidad variable y reversa.'),
(14, 12, 'Juego de Brocas para Concreto/Metal 10 Pzas', 'FER-BRO-005', 4, 38000.00, 24000.00, 'Herramientas Eléctricas', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300', '2030-12-31', 'Estuche con 5 brocas para concreto y 5 para metal de alta resistencia.'),
(15, 13, 'Tubo PVC Sanitario 3" x 3 Metros', 'FER-TUB-006', 40, 42000.00, 29000.00, 'Plomería', 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300', '2030-12-31', 'Tubo de PVC rígido para desaguës sanitarios y de aguas lluvias.'),
(16, 13, 'Pegante para PVC 1/4 Galón', 'FER-PEG-007', 3, 26000.00, 17000.00, 'Plomería', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300', '2027-06-30', 'Soldadura líquida de secado rápido para tubería y accesorios de PVC.'),
(17, 10, 'Cinta Aislante Negra 20 Metros', 'FER-CIN-008', 50, 4500.00, 2500.00, 'Electricidad', 'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=300', '2030-12-31', 'Cinta aislante de vinilo autoextinguible para instalaciones eléctricas.'),
(18, 10, 'Cable Eléctrico THHN N° 12 AWG 100m', 'FER-CAB-009', 5, 210000.00, 155000.00, 'Electricidad', 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=300', '2030-12-31', 'Rollo de cable de cobre suave con aislamiento de PVC anticorrosivo 90°C.'),
(19, 11, 'Pintura Esmalte Sintético Blanco Galón', 'FER-PIN-010', 15, 78000.00, 52000.00, 'Pintura', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=300', '2028-12-31', 'Pintura esmalte de alta durabilidad y brillo para superficies metálicas y de madera.'),
(20, 11, 'Rodillo Antigota 9" con Felpa', 'FER-ROD-011', 22, 14500.00, 9000.00, 'Pintura', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=300', '2030-12-31', 'Rodillo para pintura acrílica y vinílica con felpa antigota de alta cobertura.'),
(21, 10, 'Caja de Tornillos M4x30mm con Chazos (100 Pzas)', 'FER-TOR-012', 0, 16000.00, 9500.00, 'Fijaciones y Tornillería', 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=300', '2030-12-31', 'Kit de tornillos de ensamble drywall con chazos plásticos N° 6.');


