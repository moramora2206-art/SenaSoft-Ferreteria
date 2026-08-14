<?php

class Usuario
{
    private $conn;
<<<<<<< HEAD
    private $passwordColumn = 'Contraseña';
=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566

    public function __construct($conexion)
    {
        $this->conn = $conexion;
<<<<<<< HEAD
        $this->passwordColumn = $this->resolverColumnaPassword();
    }

    private function resolverColumnaPassword()
    {
        $sql = "
            SELECT COLUMN_NAME
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_SCHEMA = DATABASE()
              AND TABLE_NAME = 'usuarios'
              AND COLUMN_NAME IN ('Contraseña', 'Contrasena', 'Password', 'password')
            ORDER BY FIELD(COLUMN_NAME, 'Contraseña', 'Contrasena', 'Password', 'password')
            LIMIT 1
        ";

        $result = $this->conn->query($sql);

        if ($result && ($row = $result->fetch_assoc())) {
            return $row['COLUMN_NAME'];
        }

        return 'Contraseña';
    }

    private function col($name)
    {
        return '`' . str_replace('`', '``', $name) . '`';
    }

    private function selectUsuarioBase()
    {
        return "
            SELECT
                IdUsuario AS idUsuario,
                Usuario AS usuario,
                {$this->col($this->passwordColumn)} AS passwordHash,
                Nombre AS nombre,
                Apellido AS apellido,
                Email AS email,
                NCelular AS nCelular,
                Rol AS rol
            FROM usuarios
        ";
=======
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    }

    public function buscarPorUsuario($usuario)
    {
<<<<<<< HEAD
        $sql = $this->selectUsuarioBase() . " WHERE Usuario = ? LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            error_log('Error preparando buscarPorUsuario: ' . $this->conn->error);
            return null;
        }

        $stmt->bind_param("s", $usuario);

        if (!$stmt->execute()) {
            error_log('Error ejecutando buscarPorUsuario: ' . $stmt->error);
            return null;
        }

        return $stmt->get_result()->fetch_assoc() ?: null;
=======
        $sql = "SELECT * FROM usuarios WHERE Usuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $usuario);
        $stmt->execute();
        return $stmt->get_result();
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    }

    public function buscarPorId($id)
    {
<<<<<<< HEAD
        $sql = "
            SELECT
                IdUsuario AS idUsuario,
                Usuario AS usuario,
                Nombre AS nombre,
                Apellido AS apellido,
                Email AS email,
                NCelular AS nCelular,
                Rol AS rol
            FROM usuarios
            WHERE IdUsuario = ?
        ";

        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            error_log('Error preparando buscarPorId: ' . $this->conn->error);
            return null;
        }

        $stmt->bind_param("i", $id);

        if (!$stmt->execute()) {
            error_log('Error ejecutando buscarPorId: ' . $stmt->error);
            return null;
        }

        return $stmt->get_result()->fetch_assoc() ?: null;
=======
        $sql = "SELECT IdUsuario as idUsuario, Usuario as usuario, Nombre as nombre, Apellido as apellido, Email as email, NCelular as nCelular, Rol as rol FROM usuarios WHERE IdUsuario = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
    }

    public function registrar($usuario, $password, $nombre, $apellido, $email, $celular, $rol)
    {
<<<<<<< HEAD
        $sql = "
            INSERT INTO usuarios
                (Usuario, {$this->col($this->passwordColumn)}, Nombre, Apellido, Email, NCelular, Rol)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ";

        $stmt = $this->conn->prepare($sql);

        if (!$stmt) {
            error_log('Error preparando registrar usuario: ' . $this->conn->error);
            return false;
        }

=======
        $sql = "INSERT INTO usuarios (Usuario, Contraseña, Nombre, Apellido, Email, NCelular, Rol) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        $stmt->bind_param("sssssss", $usuario, $password, $nombre, $apellido, $email, $celular, $rol);
        return $stmt->execute();
    }

    public function listar()
    {
<<<<<<< HEAD
        $sql = "
            SELECT
                IdUsuario AS idUsuario,
                Usuario AS usuario,
                Nombre AS nombre,
                Apellido AS apellido,
                Email AS email,
                NCelular AS nCelular,
                Rol AS rol
            FROM usuarios
            ORDER BY Nombre ASC
        ";

        $result = $this->conn->query($sql);

        if (!$result) {
            error_log('Error listando usuarios: ' . $this->conn->error);
            return [];
        }

        $usuarios = [];

        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }

=======
        $sql = "SELECT IdUsuario as idUsuario, Usuario as usuario, Nombre as nombre, Apellido as apellido, Email as email, NCelular as nCelular, Rol as rol FROM usuarios ORDER BY Nombre ASC";
        $result = $this->conn->query($sql);
        $usuarios = [];
        while ($row = $result->fetch_assoc()) {
            $usuarios[] = $row;
        }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        return $usuarios;
    }

    public function actualizar($id, $usuario, $nombre, $apellido, $email, $celular, $rol, $password = null)
    {
        if ($password) {
<<<<<<< HEAD
            $sql = "
                UPDATE usuarios
                SET Usuario = ?,
                    {$this->col($this->passwordColumn)} = ?,
                    Nombre = ?,
                    Apellido = ?,
                    Email = ?,
                    NCelular = ?,
                    Rol = ?
                WHERE IdUsuario = ?
            ";

            $stmt = $this->conn->prepare($sql);

            if (!$stmt) {
                error_log('Error preparando actualizar usuario con password: ' . $this->conn->error);
                return false;
            }

            $stmt->bind_param("sssssssi", $usuario, $password, $nombre, $apellido, $email, $celular, $rol, $id);
        } else {
            $sql = "
                UPDATE usuarios
                SET Usuario = ?,
                    Nombre = ?,
                    Apellido = ?,
                    Email = ?,
                    NCelular = ?,
                    Rol = ?
                WHERE IdUsuario = ?
            ";

            $stmt = $this->conn->prepare($sql);

            if (!$stmt) {
                error_log('Error preparando actualizar usuario: ' . $this->conn->error);
                return false;
            }

            $stmt->bind_param("ssssssi", $usuario, $nombre, $apellido, $email, $celular, $rol, $id);
        }

=======
            $sql = "UPDATE usuarios SET Usuario=?, Contraseña=?, Nombre=?, Apellido=?, Email=?, NCelular=?, Rol=? WHERE IdUsuario=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("sssssssi", $usuario, $password, $nombre, $apellido, $email, $celular, $rol, $id);
        } else {
            $sql = "UPDATE usuarios SET Usuario=?, Nombre=?, Apellido=?, Email=?, NCelular=?, Rol=? WHERE IdUsuario=?";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("ssssssi", $usuario, $nombre, $apellido, $email, $celular, $rol, $id);
        }
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
        return $stmt->execute();
    }

    public function eliminar($id)
    {
        $sql = "DELETE FROM usuarios WHERE IdUsuario = ?";
        $stmt = $this->conn->prepare($sql);
<<<<<<< HEAD

        if (!$stmt) {
            error_log('Error preparando eliminar usuario: ' . $this->conn->error);
            return false;
        }

        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
=======
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }
}
>>>>>>> c37403677ede87369dedc9b9b5069f1114d37566
