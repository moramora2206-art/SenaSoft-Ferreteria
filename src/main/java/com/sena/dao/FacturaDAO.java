package com.sena.dao;

import com.sena.modelo.Conexion;
import com.sena.modelo.DetalleFactura;
import com.sena.modelo.Factura;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class FacturaDAO {

    private final Conexion conexion;

    public FacturaDAO() {
        this.conexion = new Conexion();
    }

    // ==========================
    // CREAR FACTURA (TRANSACCIÓN)
    // ==========================
    public boolean crearFactura(Factura factura, List<DetalleFactura> detalles) {

        String sqlFactura = "INSERT INTO factura " +
                "(IdUsuario, IdCliente, Fecha_Venta, Forma_dePago, Descuento, Total, Observaciones) " +
                "VALUES (?, ?, CURDATE(), ?, ?, ?, ?)";

        String sqlDetalle = "INSERT INTO detalle_factura " +
                "(IdFactura, IdProducto, Cantidad, Subtotal) VALUES (?, ?, ?, ?)";

        Connection conn = null;

        try {
            conn = conexion.getConnection();
            conn.setAutoCommit(false);

            int facturaId = 0;

            try (PreparedStatement psFactura = conn.prepareStatement(sqlFactura, Statement.RETURN_GENERATED_KEYS)) {

                psFactura.setInt(1, factura.getIdUsuario());
                psFactura.setInt(2, factura.getIdCliente());
                psFactura.setString(3, factura.getFormaDePago());
                psFactura.setBigDecimal(4, factura.getDescuento());
                psFactura.setBigDecimal(5, factura.getTotal());
                psFactura.setString(6, factura.getObservaciones());

                psFactura.executeUpdate();

                try (ResultSet rs = psFactura.getGeneratedKeys()) {
                    if (rs.next()) {
                        facturaId = rs.getInt(1);
                    }
                }
            }

            try (PreparedStatement psDetalle = conn.prepareStatement(sqlDetalle)) {

                ProductoDAO productoDAO = new ProductoDAO();

                for (DetalleFactura d : detalles) {

                    psDetalle.setInt(1, facturaId);
                    psDetalle.setInt(2, d.getIdProducto());
                    psDetalle.setInt(3, d.getCantidad());
                    psDetalle.setBigDecimal(4, d.getSubtotal());
                    psDetalle.addBatch();

                    // actualizar stock
                    productoDAO.actualizarStock(d.getIdProducto(), d.getCantidad());
                }

                psDetalle.executeBatch();
            }

            conn.commit();
            return true;

        } catch (Exception e) {

            if (conn != null) {
                try {
                    conn.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }

            System.err.println("Error creando factura: " + e.getMessage());
            return false;

        } finally {

            if (conn != null) {
                try {
                    conn.setAutoCommit(true);
                    conn.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    // ==========================
    // ELIMINAR FACTURA (CORREGIDO)
    // ==========================
    public boolean eliminarFactura(int idFactura) {

        String sql = "DELETE FROM factura WHERE IdFactura = ?";

        try (Connection conn = conexion.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, idFactura);

            return ps.executeUpdate() > 0;

        } catch (Exception e) {
            System.err.println("Error eliminando factura: " + e.getMessage());
            return false;
        }
    }

    // ==========================
    // LISTAR TODAS
    // ==========================
    public List<Factura> consultarTodas() {

        List<Factura> lista = new ArrayList<>();

        String sql = "SELECT f.*, c.Nombre, c.Apellido " +
                "FROM factura f " +
                "INNER JOIN clientes c ON f.IdCliente = c.IdCliente " +
                "ORDER BY f.IdFactura DESC";

        try (Connection conn = conexion.getConnection();
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(sql)) {

            while (rs.next()) {

                Factura f = new Factura();

                f.setIdFactura(rs.getInt("IdFactura"));
                f.setIdUsuario(rs.getInt("IdUsuario"));
                f.setIdCliente(rs.getInt("IdCliente"));
                f.setNombreCliente(rs.getString("Nombre") + " " + rs.getString("Apellido"));
                f.setFechaVenta(rs.getDate("Fecha_Venta"));
                f.setFormaDePago(rs.getString("Forma_dePago"));
                f.setDescuento(rs.getBigDecimal("Descuento"));
                f.setTotal(rs.getBigDecimal("Total"));
                f.setObservaciones(rs.getString("Observaciones"));

                lista.add(f);
            }

        } catch (Exception e) {
            System.err.println("Error consultando facturas: " + e.getMessage());
        }

        return lista;
    }

    // ==========================
    // CONSULTAR POR ID
    // ==========================
    public Factura consultarPorId(int id) {

        String sql = "SELECT f.*, c.Nombre, c.Apellido " +
                "FROM factura f " +
                "INNER JOIN clientes c ON f.IdCliente = c.IdCliente " +
                "WHERE f.IdFactura = ?";

        try (Connection conn = conexion.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {

                    Factura f = new Factura();

                    f.setIdFactura(rs.getInt("IdFactura"));
                    f.setIdUsuario(rs.getInt("IdUsuario"));
                    f.setIdCliente(rs.getInt("IdCliente"));
                    f.setNombreCliente(rs.getString("Nombre") + " " + rs.getString("Apellido"));
                    f.setFechaVenta(rs.getDate("Fecha_Venta"));
                    f.setFormaDePago(rs.getString("Forma_dePago"));
                    f.setDescuento(rs.getBigDecimal("Descuento"));
                    f.setTotal(rs.getBigDecimal("Total"));
                    f.setObservaciones(rs.getString("Observaciones"));

                    f.setDetalles(consultarDetalles(id));

                    return f;
                }
            }

        } catch (Exception e) {
            System.err.println("Error consultando factura: " + e.getMessage());
        }

        return null;
    }

    // ==========================
    // DETALLES FACTURA
    // ==========================
    public List<DetalleFactura> consultarDetalles(int facturaId) {

        List<DetalleFactura> lista = new ArrayList<>();

        String sql = "SELECT df.*, p.Nombre_Producto " +
                "FROM detalle_factura df " +
                "INNER JOIN productos p ON df.IdProducto = p.IdProducto " +
                "WHERE df.IdFactura = ?";

        try (Connection conn = conexion.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, facturaId);

            try (ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    DetalleFactura d = new DetalleFactura();

                    d.setIdDetalle(rs.getInt("IdDetalle"));
                    d.setIdFactura(rs.getInt("IdFactura"));
                    d.setIdProducto(rs.getInt("IdProducto"));
                    d.setNombreProducto(rs.getString("Nombre_Producto"));
                    d.setCantidad(rs.getInt("Cantidad"));
                    d.setSubtotal(rs.getBigDecimal("Subtotal"));

                    lista.add(d);
                }
            }

        } catch (Exception e) {
            System.err.println("Error consultando detalles: " + e.getMessage());
        }

        return lista;
    }

    // ==========================
    // CERRAR CONEXIÓN (OPCIONAL)
    // ==========================
    public void cerrar() {
        conexion.cerrarConexion();
    }
}