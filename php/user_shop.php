<?php
require("init.php");
SESSION_START();
@$uid = $_SESSION["uid"];
@$sid = $_REQUEST["sid"];
$arr = [];
if ($uid) {
    $sql = "SELECT * FROM aifou_shop , list_head WHERE list_head.pid = aifou_shop.pid AND uid = $uid AND cid<4000";
    $result1 = mysqli_fetch_all(mysqli_query($conn, $sql), MYSQL_ASSOC);
    $sql = "SELECT * FROM aifou_shop , list_head WHERE list_head.pid = aifou_shop.pid AND uid = $uid AND cid>4000 ORDER BY sid DESC";
    $result3 = mysqli_fetch_all(mysqli_query($conn, $sql), MYSQL_ASSOC);
    $arr = [
        "shop" => $result1,
        "af" => $result3
    ];
    echo json_encode($arr);
}
if ($sid) {
    $sql = "UPDATE list_head SET isshop = 0 WHERE pid = (SELECT pid FROM aifou_shop WHERE sid=$sid)";
    mysqli_query($conn, $sql);
    $sql = "DELETE FROM aifou_shop WHERE sid = $sid";
    mysqli_query($conn, $sql);
}
?>