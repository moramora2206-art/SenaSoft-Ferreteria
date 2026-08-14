-- Actualiza SOLO el usuario root de la aplicacion.
-- No cambia la contraseña del usuario root de MySQL.
--
-- Password de aplicacion: Car*2011
-- Hash generado con: password_hash('Car*2011', PASSWORD_DEFAULT)

USE softwarefacturacion;

UPDATE usuarios
SET `Contraseña` = '$2y$10$qddtjCqv9snPWZeIsgSVMeCzWWkQoEMpgATm0v1Ja7bRX4MZtK4xq'
WHERE Usuario = 'root';
