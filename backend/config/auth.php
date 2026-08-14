<?php

startAppSession();

/*
 * Devuelve el ID del usuario autenticado.
 */
function obtenerUsuarioActual()
{
    if (
        !isset($_SESSION["idUsuario"]) ||
        intval($_SESSION["idUsuario"]) <= 0
    ) {
        return null;
    }

    return intval($_SESSION["idUsuario"]);
}

/*
 * Obliga a que exista un usuario autenticado.
 */
function requerirUsuario()
{
    $idUsuario = obtenerUsuarioActual();

    if ($idUsuario === null) {
        jsonResponse(
            false,
            "Sesión no válida.",
            null,
            401,
            ["errorCode" => "INVALID_SESSION"]
        );
    }

    return $idUsuario;
}
