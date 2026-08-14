<?php

require_once(__DIR__ . "/../config/database.php");
require_once(__DIR__ . "/../controllers/VentasController.php");

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

        jsonResponse(
            $res["success"],
            $res["message"],
            $res["data"],
            $res["success"] ? 200 : 400
        );

        break;


    default:

        jsonResponse(
            false,
            "Método no permitido.",
            null,
            405
        );

        break;
}