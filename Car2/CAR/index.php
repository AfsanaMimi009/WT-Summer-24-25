<?php
// index.php - Main entry point for Car Owner Dashboard

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/controllers/DashboardController.php';

// Check authentication
checkCarOwnerAuth();

// Get the requested page
$page = $_GET['page'] ?? 'dashboard';
$controller = new DashboardController();

// Handle different pages
switch ($page) {
    case 'dashboard':
        $controller->dashboard();
        break;
        
    case 'cars':
        $controller->cars();
        break;
        
    case 'add_car':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->addCar();
        } else {
            $controller->addCarForm();
        }
        break;
        
    case 'edit_car':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->editCar();
        } else {
            $controller->editCarForm();
        }
        break;
        
    case 'delete_car':
        $controller->deleteCar();
        break;
        
    case 'bookings':
        $controller->bookings();
        break;
        
    case 'view_booking':
        $controller->viewBooking();
        break;
        
    case 'earnings':
        $controller->earnings();
        break;
        
    case 'reviews':
        $controller->reviews();
        break;
        
    case 'availability':
        $controller->availability();
        break;
        
    case 'logout':
        session_destroy();
        header('Location: ../auth/login.php');
        exit;
        break;
        
    default:
        // 404 page or redirect to dashboard
        header('Location: index.php?page=dashboard');
        exit;
}
?>