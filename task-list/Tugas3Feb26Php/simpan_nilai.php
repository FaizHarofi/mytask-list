<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
    exit;
}

$nama  = isset($_POST['nama']) ? trim($_POST['nama']) : '';
$kelas = isset($_POST['kelas']) ? trim($_POST['kelas']) : '';
$mapel = isset($_POST['mapel']) ? trim($_POST['mapel']) : '';
$nilai = isset($_POST['nilai']) ? trim($_POST['nilai']) : '';

if ($nama !== '') {
    $data = $nama . "|" . $kelas . "|" . $mapel . "|" . $nilai . "\n";
    $file = fopen("data_nilai.txt", "a");
    fwrite($file, $data);
    fclose($file);
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Simpan Nilai</title>
</head>
<body>
        <h2>Data berhasil disimpan!</h2>
        <p>
            <a href="form_nilai.php">Input Lagi</a> |
            <a href="tampil_nilai.php">Lihat Data</a>
        </p>
</body>
</html>
