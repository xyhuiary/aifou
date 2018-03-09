<?php
require("init.php");
$pid = $_REQUEST["pid"];
$sql = "SELECT * FROM list_head WHERE pid=$pid";
$result = mysqli_fetch_assoc(mysqli_query($conn, $sql));
$sql = "SELECT pid,iscolor,pprice FROM list_head WHERE pname = (SELECT pname FROM list_head WHERE pid=$pid)";
$result2 = mysqli_fetch_all(mysqli_query($conn, $sql), MYSQL_ASSOC);
$arr = [
    "data" => $result,
    "type" => $result2
];
echo json_encode($arr);
?>