<?php

startAppSession();

/*
 * Devuelve el ID del usuario autenticado.
 * Retorna null si no hay sesión o si la sesión expiró por inactividad.
 */
function obtenerUsuarioActual()
{
    if (
        !isset($_SESSION["idUsuario"]) ||
        intval($_SESSION["idUsuario"]) <= 0
    ) {
        return null;
    }

    if (sesionExpirada()) {
        return null;
    }

    return intval($_SESSION["idUsuario"]);
}

/*
 * Indica si la sesión superó el tiempo máximo de inactividad.
 */
function sesionExpirada()
{
    if (!isset($_SESSION["lastActivity"])) {
        return false;
    }

    $tiempoLimite = defined('SESSION_IDLE_TIMEOUT')
        ? (int) SESSION_IDLE_TIMEOUT
        : 1800;

    return (time() - intval($_SESSION["lastActivity"])) > $tiempoLimite;
}

/*
 * Destruye la sesión y limpia la cookie (usado al expirar).
 */
function destruirSesionExpirada()
{
    $_SESSION = [];

    if (session_status() === PHP_SESSION_ACTIVE) {
        session_destroy();
    }

    clearAppSessionCookie();
}

/*
 * Obliga a que exista un usuario autenticado.
 * Si la sesión expiró, destruye la sesión y responde 401 SESSION_EXPIRED.
 */
function requerirUsuario()
{
    $idUsuario = obtenerUsuarioActual();

    if ($idUsuario === null) {
        if (sesionExpirada()) {
            destruirSesionExpirada();

            jsonResponse(
                false,
                "Tu sesión ha expirado. Inicia sesión nuevamente.",
                null,
                401,
                ["errorCode" => "SESSION_EXPIRED"]
            );
        }

        jsonResponse(
            false,
            "Sesión no válida.",
            null,
            401,
            ["errorCode" => "INVALID_SESSION"]
        );
    }

    // Actividad válida: renovar la marca de actividad.
    $_SESSION["lastActivity"] = time();

    return $idUsuario;
}

/*
 * Devuelve el rol del usuario autenticado ("" si no hay sesión).
 */
function obtenerRolActual()
{
    return isset($_SESSION["rol"]) ? $_SESSION["rol"] : "";
}

/*
 * Obliga a que el usuario autenticado tenga uno de los roles permitidos.
 * Primero exige sesión válida y luego valida el rol. Un usuario
 * autenticado sin permisos recibe 403 FORBIDDEN (no 401).
 */
function requerirRol(array $rolesPermitidos)
{
    requerirUsuario();

    $rol = obtenerRolActual();

    if (!in_array($rol, $rolesPermitidos, true)) {
        jsonResponse(
            false,
            "No tienes permisos para realizar esta acción.",
            null,
            403,
            ["errorCode" => "FORBIDDEN"]
        );
    }

    return $rol;
}