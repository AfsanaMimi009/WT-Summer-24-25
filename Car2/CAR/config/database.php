<?php
// config/database.php - Database configuration file

class Database {
    private $host = 'localhost';
    private $db_name = 'car_rental_system';
    private $username = 'root';  // Change according to your setup
    private $password = '';      // Change according to your setup
    private $conn;
    
    public function connect() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password,
                array(
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"
                )
            );
        } catch(PDOException $e) {
            echo 'Connection Error: ' . $e->getMessage();
        }
        
        return $this->conn;
    }
}

// Function to get database connection
function getDBConnection() {
    $database = new Database();
    return $database->connect();
}

// Session configuration
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Check if user is logged in and is a car owner
function checkCarOwnerAuth() {
    if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'car_owner') {
        header('Location: auth/login.php'); // Updated path for CAR/auth structure
        exit;
    }
}

// Sanitize input data
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

// Format currency
function formatCurrency($amount) {
    return '$' . number_format($amount, 2);
}

// Format date
function formatDate($date) {
    return date('M d, Y', strtotime($date));
}
?>