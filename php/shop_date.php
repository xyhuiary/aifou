<?php
require("init.php");
@$pid = $_REQUEST["pid"];
@$sids = $_REQUEST["sids"];
if ($pid) {
    $sql = "DELETE FROM aifou_shop WHERE pid = $pid";
    mysqli_query($conn, $sql);
    $sql = "UPDATE list_head SET isshop = 0 WHERE pid= $pid";
    mysqli_query($conn, $sql);
}
if ($sids) {
    $arr = explode("_", $sids);
    $j = $arr[0];
    $sql = "DELETE FROM aifou_shop WHERE sid=$j";
    if (count($arr) > 1) {
        for ($i = 1; $i < count($arr); $i++) {
            $j = $arr[$i];
            $sql .= " OR sid=$j";
        }
    }
    mysqli_query($conn, $sql);
}
?>