<?php
// auth/register.php - Direct register access

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/controllers/AuthController.php';

$controller = new AuthController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->processRegister();
} else {
    $controller->showRegister();
}
?>