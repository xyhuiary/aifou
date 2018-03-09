<?php
require("init.php");
@$pid = $_REQUEST["pid"];
@$now = $_REQUEST["now"];
@$en = $now + 900000;
$sql = "SELECT isshop FROM list_head WHERE pid=$pid";
$result = mysqli_fetch_row(mysqli_query($conn, $sql))[0];
if ($result != 0) {
    echo json_encode(["code" => 0, "msg" => "该商品已被他人下单或购买"]);
} else {
    SESSION_START();
    @$uid = $_SESSION["uid"];
    $sql = "INSERT INTO aifou_shop VALUES(NUll,1,$now,$en,$uid,$pid)";
    $result = mysqli_query($conn, $sql);
    if ($result) {
        $sql = "UPDATE list_head SET isshop = $en WHERE pid = $pid";
        $rsult = mysqli_query($conn, $sql);
        if ($result) {
            echo json_encode(["code" => 1]);
        } else {
            echo json_encode(["code" => 0, "msg" => "未知错误"]);
        }
    } else {
        echo json_encode(["code" => 0, "msg" => "未知错误"]);
    }
}
?>