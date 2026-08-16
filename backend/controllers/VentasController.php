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
                "errorCode" => "INVALID_FECHAS",
                "message" =>
                    "Formato de fecha inválido."
            ];
        }


        if ($inicio > $fin) {

            return [
                "success" => false,
                "errorCode" => "INVALID_FECHAS",
                "message" =>
                    "La fecha inicial no puede ser posterior a la final."
            ];
        }

        try {

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

        } catch (Exception $e) {

            error_log('Error en resumen de ventas: ' . $e->getMessage());

            return [
                "success" => false,
                "errorCode" => "DATABASE_ERROR",
                "message" =>
                    "No fue posible obtener el resumen de ventas. Inténtalo nuevamente."
            ];
        }
    }
}