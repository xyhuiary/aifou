<?php
require("init.php");
$pid = $_REQUEST["pid"];
$sql = "SELECT * FROM list_head_img WHERE pid=$pid";
$result = mysqli_query($conn, $sql);
echo json_encode(mysqli_fetch_all($result, MYSQL_ASSOC));
?>