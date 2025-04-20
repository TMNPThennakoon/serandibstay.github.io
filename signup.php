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

$name = $_POST['name'];
$email = $_POST['email'];
$password = $_POST['password'];
$phone = $_POST['phone'];

$sql = "INSERT INTO users (name, email, password, phone) VALUES ('$name', '$email', '$password', '$phone')";

if ($conn->query($sql) === TRUE) {
    echo "<script>alert('Account created successfully!'); window.location.href='index.html';</script>";
} else {
    echo "<script>alert('Error: " . $sql . "<br>" . $conn->error . "'); window.location.href='index.html';</script>";
}

$conn->close();
?>