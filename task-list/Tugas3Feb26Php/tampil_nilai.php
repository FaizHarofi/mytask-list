<?php
session_start();
if (!isset($_SESSION['username'])) {
    header("Location: login.php");
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Data Nilai Siswa</title>
<body>
        <h2>Data Nilai Siswa</h2>

        <table border="1">
        <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Kelas</th>
            <th>Mata Pelajaran</th>
            <th>Nilai</th>
        </tr>

        <?php
        if (file_exists("data_nilai.txt")) {
            $file = fopen("data_nilai.txt", "r");
            $no = 1;

            while (($data = fgets($file)) !== false) {
                $pisah = explode("|", $data);
                echo "<tr>";
                echo "<td>".$no++."</td>";
                echo "<td>".$pisah[0]."</td>";
                echo "<td>".$pisah[1]."</td>";
                echo "<td>".$pisah[2]."</td>";
                echo "<td>".$pisah[3]."</td>";
                echo "</tr>";
            }
            fclose($file);
        }
        ?>
    </table>

    <br>
    <a href="form_nilai.php">Tambah Data</a><br>
    <a href="logout.php">Logout</a>
</body>
</html>
