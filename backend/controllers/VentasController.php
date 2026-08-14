<?php

require_once(__DIR__ . "/../models/Ventas.php");

class VentasController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model =
            new Ventas($conexion);
    }


    public function resumen(
        $inicio,
        $fin
    ) {

        if (
            !preg_match(
                "/^\d{4}-\d{2}-\d{2}$/",
                $inicio
            ) ||
            !preg_match(
                "/^\d{4}-\d{2}-\d{2}$/",
                $fin
            )
        ) {

            return [
                "success" => false,
                "message" =>
                    "Formato de fecha inválido."
            ];
        }


        if ($inicio > $fin) {

            return [
                "success" => false,
                "message" =>
                    "La fecha inicial no puede ser posterior a la final."
            ];
        }


        return [
            "success" => true,
            "message" =>
                "Análisis de ventas.",
            "data" =>
                $this->model->resumen(
                    $inicio,
                    $fin
                )
        ];
    }
}