<?php

require_once(__DIR__ . "/../config/database.php");

startAppSession();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, "Método no permitido.", null, 405, [
        "errorCode" => "METHOD_NOT_ALLOWED"
    ]);
}

$_SESSION = [];
clearAppSessionCookie();
session_destroy();

jsonResponse(true, "Sesión cerrada correctamente.");
