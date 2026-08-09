package com.sena.controlador;

import com.google.gson.Gson;
import com.sena.dao.ClienteDAO;
import com.sena.modelo.Cliente;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/clientes")
public class ClienteServlet extends HttpServlet {

    private final ClienteDAO dao = new ClienteDAO();
    private final Gson gson = new Gson();

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
    ) throws IOException {

        cors(response);

        response.setContentType(
            "application/json"
        );

        List<Cliente> clientes =
            dao.listar();

        response.getWriter().print(
            gson.toJson(clientes)
        );
    }

    @Override
    protected void doPost(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        cors(response);

        BufferedReader reader =
            request.getReader();

        Cliente cliente =
            gson.fromJson(
                reader,
                Cliente.class
            );

        boolean ok =
            dao.insertar(cliente);

        response.setContentType(
            "application/json"
        );

        response.getWriter().print(
            "{\"success\":" + ok + "}"
        );
    }

    @Override
    protected void doPut(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        cors(response);

        BufferedReader reader =
            request.getReader();

        Cliente cliente =
            gson.fromJson(
                reader,
                Cliente.class
            );

        boolean ok =
            dao.actualizar(cliente);

        response.setContentType(
            "application/json"
        );

        response.getWriter().print(
            "{\"success\":" + ok + "}"
        );
    }

    @Override
    protected void doDelete(
        HttpServletRequest request,
        HttpServletResponse response
    ) throws IOException {

        cors(response);

        int id = Integer.parseInt(
            request.getParameter("id")
        );

        boolean ok =
            dao.eliminar(id);

        response.setContentType(
            "application/json"
        );

        response.getWriter().print(
            "{\"success\":" + ok + "}"
        );
    }
}