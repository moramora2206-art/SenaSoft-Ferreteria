<?php

require_once(__DIR__ . "/../models/Dashboard.php");

class DashboardController
{
    private $model;

    public function __construct($conexion)
    {
        $this->model = new Dashboard($conexion);
    }

    public function obtenerMetricas()
    {
        try {

            $metricas = $this->model->obtenerMetricas();
            return [
                "success" => true,
                "data" => $metricas
            ];

        } catch (Exception $e) {

            error_log('Error en métricas del dashboard: ' . $e->getMessage());

            return [
                "success" => false,
                "errorCode" => "DATABASE_ERROR",
                "message" => "No fue posible cargar las métricas. Inténtalo nuevamente."
            ];
        }
    }
}
