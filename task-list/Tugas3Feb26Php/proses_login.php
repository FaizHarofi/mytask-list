<?php
session_start();

$username = isset($_POST['username']) ? trim($_POST['username']) : '';
$password = isset($_POST['password']) ? trim($_POST['password']) : '';

if ($username === "admin" && $password === "123") {
    $_SESSION['username'] = $username;
    header("Location: form_nilai.php");
    exit;
} else {
    ?>
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login Gagal</title>
    </head>
    <body>
            <h2>Login gagal!</h2>
            <p><a href="login.php">Kembali</a></p>
    </body>
    </html>
    <?php
}
?>
