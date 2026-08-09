package com.sena.controlador;

import com.sena.dao.ProveedorDAO;
import com.sena.modelo.Proveedor;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet({
    "/ProveedorServlet",
    "/api/proveedores"
})
public class ProveedorServlet extends HttpServlet {

    private final ProveedorDAO dao = new ProveedorDAO();

    private void setCorsHeaders(HttpServletResponse response) {

        response.setHeader(
                "Access-Control-Allow-Origin",
                "*"
        );

        response.setHeader(
                "Access-Control-Allow-Headers",
                "Content-Type"
        );

        response.setHeader(
                "Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS"
        );

    }

    @Override
    protected void doOptions(
            HttpServletRequest request,
            HttpServletResponse response
    ) {

        setCorsHeaders(response);

    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws ServletException, IOException {

        setCorsHeaders(response);

        String accion =
                request.getParameter("accion");

        if (accion == null)
            accion = "listar";

        switch (accion) {

            case "nuevo":

                request.getRequestDispatcher(
                        "web/proveedor/registrar.jsp"
                ).forward(
                        request,
                        response
                );

                break;

            case "eliminar":

                try {

                    int id =
                            Integer.parseInt(
                                    request.getParameter("id")
                            );

                    dao.eliminar(id);

                } catch (Exception e) {

                    e.printStackTrace();

                }

                response.sendRedirect(
                        "ProveedorServlet"
                );

                break;

            default:

                List<Proveedor> lista =
                        dao.listar();

                String accept =
                        request.getHeader("Accept");

                if (
                        accept != null &&
                        accept.contains("application/json")
                ) {

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

                        Proveedor p =
                                lista.get(i);

                        json.append("{")
                                .append("\"idProveedor\":")
                                .append(p.getIdProveedor())
                                .append(",")

                                .append("\"nombreProveedor\":\"")
                                .append(p.getNombreProveedor())
                                .append("\",")

                                .append("\"nit\":")
                                .append(p.getNit())
                                .append(",")

                                .append("\"nombreContacto\":\"")
                                .append(p.getNombreContacto())
                                .append("\",")

                                .append("\"nCelular\":\"")
                                .append(p.getNCelular())
                                .append("\",")

                                .append("\"email\":\"")
                                .append(p.getEmail())
                                .append("\"")

                                .append("}");

                        if (
                                i < lista.size() - 1
                        ) {
                            json.append(",");
                        }

                    }

                    json.append("]");

                    response.getWriter()
                            .write(
                                    json.toString()
                            );

                } else {

                    request.setAttribute(
                            "proveedores",
                            lista
                    );

                    request.getRequestDispatcher(
                            "web/proveedor/listar.jsp"
                    ).forward(
                            request,
                            response
                    );

                }

                break;
        }
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        setCorsHeaders(response);

        if (
                request.getContentType() != null &&
                request.getContentType()
                        .contains("application/json")
        ) {

            StringBuilder sb =
                    new StringBuilder();

            String line;

            while (
                    (
                            line =
                                    request.getReader()
                                            .readLine()
                    ) != null
            ) {

                sb.append(line);

            }

            String json =
                    sb.toString();

            Proveedor p =
                    new Proveedor();

            p.setNombreProveedor(
                    json.split("\"nombreProveedor\":\"")[1]
                            .split("\"")[0]
            );

            p.setNombreContacto(
                    json.split("\"nombreContacto\":\"")[1]
                            .split("\"")[0]
            );

            p.setNCelular(
                    json.split("\"nCelular\":\"")[1]
                            .split("\"")[0]
            );

            p.setEmail(
                    json.split("\"email\":\"")[1]
                            .split("\"")[0]
            );

            p.setNit(
                    Integer.parseInt(
                            json.split("\"nit\":\"")[1]
                                    .split("\"")[0]
                    )
            );

            dao.insertar(p);

            response.setContentType(
                    "application/json"
            );

            response.getWriter()
                    .write(
                            "{\"mensaje\":\"ok\"}"
                    );

            return;
        }

        String accion =
                request.getParameter("accion");

        String nombre =
                request.getParameter("nombreProveedor");

        String telefono =
                request.getParameter("nCelular");

        String email =
                request.getParameter("email");

        String contacto =
                request.getParameter("nombreContacto");

        String nit =
                request.getParameter("nit");

        Proveedor p =
                new Proveedor();

        p.setNombreProveedor(nombre);
        p.setNCelular(telefono);
        p.setEmail(email);
        p.setNombreContacto(contacto);

        try {

            p.setNit(
                    Integer.parseInt(nit)
            );

        } catch (Exception e) {

            p.setNit(0);

        }

        if (
                "insertar".equals(accion)
        ) {

            dao.insertar(p);

        } else if (
                "actualizar".equals(accion)
        ) {

            int id =
                    Integer.parseInt(
                            request.getParameter("id")
                    );

            p.setIdProveedor(id);

            dao.actualizar(p);

        }

        response.sendRedirect(
                "ProveedorServlet"
        );

    }

    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        setCorsHeaders(response);

        StringBuilder sb =
                new StringBuilder();

        String line;

        while (
                (
                        line =
                                request.getReader()
                                        .readLine()
                ) != null
        ) {

            sb.append(line);

        }

        String json =
                sb.toString();

        Proveedor p =
                new Proveedor();

        p.setIdProveedor(
                Integer.parseInt(
                        json.split("\"idProveedor\":")[1]
                                .split(",")[0]
                )
        );

        p.setNombreProveedor(
                json.split("\"nombreProveedor\":\"")[1]
                        .split("\"")[0]
        );

        p.setNombreContacto(
                json.split("\"nombreContacto\":\"")[1]
                        .split("\"")[0]
        );

        p.setNCelular(
                json.split("\"nCelular\":\"")[1]
                        .split("\"")[0]
        );

        p.setEmail(
                json.split("\"email\":\"")[1]
                        .split("\"")[0]
        );

        p.setNit(
                Integer.parseInt(
                        json.split("\"nit\":\"")[1]
                                .split("\"")[0]
                )
        );

        dao.actualizar(p);

        response.getWriter()
                .write(
                        "{\"mensaje\":\"actualizado\"}"
                );

    }

    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {

        setCorsHeaders(response);

        int id =
                Integer.parseInt(
                        request.getParameter("id")
                );

        dao.eliminar(id);

        response.getWriter()
                .write(
                        "{\"mensaje\":\"eliminado\"}"
                );

    }
}