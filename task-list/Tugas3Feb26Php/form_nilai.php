<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Form Nilai</title>
<body>
        <h2>Form Input Nilai Siswa</h2>
        <form action="simpan_nilai.php" method="post">
            <label>Nama Siswa :</label><br>
            <input type="text" name="nama" required><br>
            <label>Kelas :</label><br>
            <select name="kelas" style="width: 170px;"required >
            <option value="10 PPLG">10 PPLG</option>
            <option value="10 TKJ">10 TKJ</option>
            <option value="10 TJKT">10 TJKT</option>
            <option value="10 Elektro">10 Elektro</option>
            <option value="10 DPIB">10 DPIB</option>
            <option value="11 PPLG">11 PPLG</option>
            <option value="11 TKJ">11 TKJ</option>
            <option value="11 TJKT">11 TJKT</option>
            <option value="11 Elektro">11 Elektro</option>
            <option value="11 DPIB">11 DPIB</option>
            <option value="12 PPLG">12 PPLG</option>
            <option value="12 TKJ">12 TKJ</option>
            <option value="12 TJKT">12 TJKT</option>
            <option value="12 Elektro">12 Elektro</option>
            <option value="12 DPIB">12 DPIB</option>
            </select><br>
            <label>Mata Pelajaran :</label><br>
            <input type="text" name="mapel" required><br>
            <label>Nilai (0-100):</label><br>
            <input type="number" name="nilai" min="0" max="100" required><br><br>
            <button type="submit">Simpan</button>
        </form>

        <br>
        <a href="tampil_nilai.php">Lihat Data Nilai</a><br>
        <a href="logout.php">Logout</a>
</body>
</html>
