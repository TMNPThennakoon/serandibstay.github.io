<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "serendib_stays";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM users WHERE email='$email' AND password='$password'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    // Login successful
    session_start();
    $_SESSION['loggedin'] = true;
    $_SESSION['email'] = $email;
    echo "<script>alert('Login successful!'); window.location.href='index.html';</script>";
} else {
    // Login failed
    echo "<script>alert('Invalid email or password'); window.location.href='index.html';</script>";
}

$conn->close();
?>