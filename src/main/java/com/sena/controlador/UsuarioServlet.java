package com.sena.controlador;

import com.sena.dao.UsuarioDAO;
import com.sena.modelo.Usuario;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import java.io.IOException;
import java.util.List;

@WebServlet({
        "/UsuarioServlet",
        "/api/usuarios"
})
public class UsuarioServlet extends HttpServlet {

    private final UsuarioDAO dao = new UsuarioDAO();

    private void setCorsHeaders(HttpServletResponse response) {

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Content-Type");
        response.setHeader("Access-Control-Allow-Methods",
                "GET, POST, PUT, DELETE, OPTIONS");

    }

    @Override
    protected void doOptions(
            HttpServletRequest request,
            HttpServletResponse response) {

        setCorsHeaders(response);

    }

    @Override
    protected void doGet(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        setCorsHeaders(response);

        List<Usuario> lista = dao.listar();

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

                Usuario u =
                        lista.get(i);

                json.append("{")
                        .append("\"idUsuario\":")
                        .append(u.getIdUsuario())
                        .append(",")

                        .append("\"usuario\":\"")
                        .append(u.getUsuario())
                        .append("\",")

                        .append("\"nombre\":\"")
                        .append(u.getNombre())
                        .append("\",")

                        .append("\"apellido\":\"")
                        .append(u.getApellido())
                        .append("\",")

                        .append("\"email\":\"")
                        .append(u.getEmail())
                        .append("\",")

                        .append("\"nCelular\":\"")
                        .append(u.getNCelular())
                        .append("\",")

                        .append("\"rol\":\"")
                        .append(u.getRol())
                        .append("\"")

                        .append("}");

                if (i < lista.size() - 1) {
                    json.append(",");
                }

            }

            json.append("]");

            response.getWriter()
                    .write(json.toString());

        } else {

            request.setAttribute(
                    "usuarios",
                    lista
            );

            request.getRequestDispatcher(
                    "web/usuario/listar.jsp"
            ).forward(
                    request,
                    response
            );

        }

    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

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

            System.out.println("JSON RECIBIDO:");       
            System.out.println(json);

            Usuario u =
                    new Usuario();

            u.setUsuario(
                    json.split("\"usuario\":\"")[1]
                            .split("\"")[0]
            );

            u.setContraseña(
                    json.split("\"password\":\"")[1]
                            .split("\"")[0]
            );

            u.setNombre(
                    json.split("\"nombre\":\"")[1]
                            .split("\"")[0]
            );

            u.setApellido(
                    json.split("\"apellido\":\"")[1]
                            .split("\"")[0]
            );

            u.setEmail(
                    json.split("\"email\":\"")[1]
                            .split("\"")[0]
            );

            u.setNCelular(
                    json.split("\"nCelular\":\"")[1]
                            .split("\"")[0]
            );

            u.setRol(
                    json.split("\"rol\":\"")[1]
                            .split("\"")[0]
            );

            dao.insertar(u);

            response.setContentType(
                    "application/json"
            );

            response.getWriter()
                    .write("{\"mensaje\":\"ok\"}");

            return;
        }

        String usuario =
                request.getParameter("usuario");

        String password =
                request.getParameter("password");

        String nombre =
                request.getParameter("nombre");

        String apellido =
                request.getParameter("apellido");

        String email =
                request.getParameter("email");

        String ncelular =
                request.getParameter("ncelular");

        String rol =
                request.getParameter("rol");

        Usuario u =
                new Usuario();

        u.setUsuario(usuario);
        u.setContraseña(password);
        u.setNombre(nombre);
        u.setApellido(apellido);
        u.setEmail(email);
        u.setNCelular(ncelular);
        u.setRol(rol);

        dao.insertar(u);

        response.sendRedirect(
                "UsuarioServlet"
        );

    }

    @Override
    protected void doPut(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

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

        Usuario u =
                new Usuario();

        u.setIdUsuario(
                Integer.parseInt(
                        json.split("\"id\":")[1]
                                .split(",")[0]
                )
        );

        u.setUsuario(
                json.split("\"usuario\":\"")[1]
                        .split("\"")[0]
        );

        u.setContraseña(
                json.split("\"password\":\"")[1]
                        .split("\"")[0]
        );

        u.setNombre(
                json.split("\"nombre\":\"")[1]
                        .split("\"")[0]
        );

        u.setApellido(
                json.split("\"apellido\":\"")[1]
                        .split("\"")[0]
        );

        u.setEmail(
                json.split("\"email\":\"")[1]
                        .split("\"")[0]
        );

        u.setNCelular(
                json.split("\"nCelular\":\"")[1]
                        .split("\"")[0]
        );

        u.setRol(
                json.split("\"rol\":\"")[1]
                        .split("\"")[0]
        );

        dao.actualizar(u);

        response.getWriter()
                .write("{\"mensaje\":\"actualizado\"}");

    }

    @Override
    protected void doDelete(
            HttpServletRequest request,
            HttpServletResponse response)
            throws IOException {

        setCorsHeaders(response);

        int id =
                Integer.parseInt(
                        request.getParameter("id")
                );

        dao.eliminar(id);

        response.getWriter()
                .write("{\"mensaje\":\"eliminado\"}");

    }
}