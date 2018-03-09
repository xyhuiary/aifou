<?php
require("init.php");
$hid = $_REQUEST["hid"];
$sql = "SELECT * FROM list_source WHERE hid=$hid";
$result = mysqli_query($conn, $sql);
echo json_encode(mysqli_fetch_all($result, MYSQL_ASSOC));
?>