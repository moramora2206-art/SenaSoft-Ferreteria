package com.sena.controlador;

import com.sena.dao.FacturaDAO;
import com.sena.modelo.DetalleFactura;
import com.sena.modelo.Factura;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@WebServlet({
    "/FacturaServlet",
    "/api/facturas"
})
public class FacturaServlet extends HttpServlet {

    private FacturaDAO facturaDAO;

    @Override
    public void init() {
        facturaDAO = new FacturaDAO();
    }

    private void cors(HttpServletResponse response) {

        response.setHeader(
            "Access-Control-Allow-Origin",
            "*"
        );

        response.setHeader(
            "Access-Control-Allow-Methods",
            "GET,POST,PUT,DELETE,OPTIONS"
        );

        response.setHeader(
            "Access-Control-Allow-Headers",
            "Content-Type"
        );
    }

    @Override
    protected void doOptions(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        cors(response);

        response.setStatus(
            HttpServletResponse.SC_OK
        );
    }

    @Override
    protected void doGet(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        cors(response);

        String accept =
            request.getHeader("Accept");

        // PETICIÓN DESDE REACT
        if (
            accept != null &&
            accept.contains("application/json")
        ) {

            List<Factura> lista =
                facturaDAO.consultarTodas();

            response.setContentType(
                "application/json;charset=UTF-8"
            );

            StringBuilder json =
                new StringBuilder("[");

            for (
                int i = 0;
                i < lista.size();
                i++
            ) {

                Factura f =
                    lista.get(i);

                json.append("{")
                    .append("\"idFactura\":")
                    .append(f.getIdFactura())
                    .append(",")

                    .append("\"idCliente\":")
                    .append(f.getIdCliente())
                    .append(",")

                    .append("\"nombreCliente\":\"")
                    .append(f.getNombreCliente())
                    .append("\",")

                    .append("\"formaDePago\":\"")
                    .append(f.getFormaDePago())
                    .append("\",")

                    .append("\"total\":")
                    .append(f.getTotal())

                    .append("}");

                if (i < lista.size() - 1) {
                    json.append(",");
                }
            }

            json.append("]");

            response.getWriter()
                    .write(json.toString());

            return;
        }

        // PETICIÓN DESDE JSP
        String accion =
            request.getParameter("accion");

        if (accion == null) {
            accion = "listar";
        }

        switch (accion) {

            case "listar":

                request.setAttribute(
                    "lista",
                    facturaDAO.consultarTodas()
                );

                request.getRequestDispatcher(
                    "/web/factura/facturas.jsp"
                ).forward(
                    request,
                    response
                );

                break;

            case "nuevo":

                request.getRequestDispatcher(
                    "/web/factura/crearFactura.jsp"
                ).forward(
                    request,
                    response
                );

                break;

            default:

                response.sendRedirect(
                    "FacturaServlet?accion=listar"
                );
        }
    }

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws ServletException, IOException {

        cors(response);

        System.out.println(
            "CONTENT TYPE: " +
            request.getContentType()
        );

        // ==========================
        // PETICIONES DESDE REACT
        // ==========================
        if (request.getContentType() != null &&
        request.getContentType().contains("application/json")) {

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }

        Gson gson = new Gson();
        JsonObject json = gson.fromJson(sb.toString(), JsonObject.class);

        Factura factura = new Factura();

        factura.setFechaVenta(new java.util.Date());

        factura.setIdCliente(json.get("idCliente").getAsInt());
        factura.setIdUsuario(json.get("idUsuario").getAsInt());
        factura.setFormaDePago(json.get("formaDePago").getAsString());

        factura.setDescuento(
            BigDecimal.valueOf(json.get("descuento").getAsDouble())
        );

        factura.setTotal(
            BigDecimal.valueOf(json.get("total").getAsDouble())
        );

        factura.setObservaciones(
            json.has("observaciones")
                ? json.get("observaciones").getAsString()
                : ""
        );

        // DETALLES
        List<DetalleFactura> detalles = new ArrayList<>();
        JsonArray array = json.getAsJsonArray("detalles");

        for (int i = 0; i < array.size(); i++) {

            JsonObject d = array.get(i).getAsJsonObject();

            DetalleFactura detalle = new DetalleFactura();
            detalle.setIdProducto(d.get("idProducto").getAsInt());
            detalle.setCantidad(d.get("cantidad").getAsInt());
            detalle.setPrecioUnitario(
                BigDecimal.valueOf(d.get("precioUnitario").getAsDouble())
            );
            detalle.setSubtotal(
                BigDecimal.valueOf(d.get("subtotal").getAsDouble())
            );

            detalles.add(detalle);
        }

        boolean exito = facturaDAO.crearFactura(factura, detalles);

        response.setContentType("application/json");
        response.getWriter().write("{\"success\":" + exito + "}");
        return;
    }

        
    }
}