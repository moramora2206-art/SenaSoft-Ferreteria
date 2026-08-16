<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../config/auth.php");
require_once(__DIR__ . "/../controllers/VentasController.php");

requerirUsuario();

$controller =
    new VentasController($conn);

$method =
    $_SERVER["REQUEST_METHOD"];

switch ($method) {

    case "GET":

        $inicio =
            $_GET["inicio"]
            ?? date("Y-m-01");

        $fin =
            $_GET["fin"]
            ?? date("Y-m-d");

        $res =
            $controller->resumen(
                $inicio,
                $fin
            );

        $code = $res["success"]
            ? 200
            : (isset($res["errorCode"]) ? codigoHttpParaError($res["errorCode"]) : 400);

        jsonResponse(
            $res["success"],
            $res["message"] ?? "",
            $res["data"] ?? null,
            $code,
            isset($res["errorCode"]) ? ["errorCode" => $res["errorCode"]] : []
        );

        break;


    default:

        jsonResponse(
            false,
            "Método no permitido.",
            null,
            405,
            ["errorCode" => "METHOD_NOT_ALLOWED"]
        );

        break;
}