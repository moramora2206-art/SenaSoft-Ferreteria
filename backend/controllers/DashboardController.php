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
        $metricas = $this->model->obtenerMetricas();
        return [
            "success" => true,
            "data" => $metricas
        ];
    }
}
