-- Migracion: unicidad del campo Email en la tabla usuarios.
--
-- Paso 1: Libera duplicados existentes de Email (conserva el registro con
--         menor IdUsuario y pone NULL al resto).
-- Paso 2: Convierte los emails vacios ('') en NULL (NULL no choca con UNIQUE).
-- Paso 3: Habilita valores NULL y agrega indice UNIQUE sobre Email.
--
-- Nota: MySQL permite multiples NULL en un indice UNIQUE, por lo que el email
--       puede seguir siendo opcional en el formulario.

USE softwarefacturacion;

UPDATE usuarios
SET Email = NULL
WHERE Email = '' OR Email IS NULL;

UPDATE usuarios u
JOIN (
    SELECT Email, MIN(IdUsuario) AS keep_id
    FROM usuarios
    WHERE Email IS NOT NULL AND Email <> ''
    GROUP BY Email
    HAVING COUNT(*) > 1
) d ON u.Email = d.Email AND u.IdUsuario <> d.keep_id
SET u.Email = NULL;

ALTER TABLE usuarios
    MODIFY Email varchar(100) NULL,
    ADD UNIQUE KEY uq_usuarios_email (Email);