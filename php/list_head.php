<?php
require("init.php");
$hid = $_REQUEST["hid"];
@$current = $_REQUEST["current"];
@$rows = $_REQUEST["rows"];
$sum = ($current - 1) * $rows;
if ($hid != 4) {
    $sql = "SELECT *,(SELECT sname FROM list_source WHERE sid=(SELECT sid FROM list_crowd WHERE list_crowd.cid=list_head.cid)) AS sname FROM list_head WHERE hid=$hid";
} else {
    $sql = "SELECT * FROM list_head WHERE hid=$hid AND istop=1";
}
if ($current) {
    $sql .= " ORDER BY list_head.istop DESC LIMIT $sum,$rows";
}
$result = mysqli_query($conn, $sql);
echo json_encode(mysqli_fetch_all($result, MYSQL_ASSOC));
?>