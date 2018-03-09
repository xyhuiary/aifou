<?php
require("init.php");
session_start();
$uid = $_SESSION["uid"];
$num = $_REQUEST["num"];
$pid = $_REQUEST["pid"];

//查询该用户是否有相同的商品
$sql = "SELECT sid,sum FROM aifou_shop WHERE uid=$uid AND pid=$pid";
$result = mysqli_query($conn,$sql);
//var_dump ($result);
$row = mysqli_fetch_assoc($result);
if($row){
    //重复商品sid
    $sid = $row["sid"];
    $sum = $row["sum"];
    $nums = $num + $sum;
    $sql = "UPDATE aifou_shop SET sum = $nums WHERE sid = $sid";
    mysqli_query($conn,$sql);
    $row = mysqli_affected_rows($conn);
    if($row>0){
        echo '{"code":10}';
    }else{
        echo '{"code":-10}';
    }
}else{
    $sql = "INSERT INTO aifou_shop VALUES(NUll,$num,NUll,NULL,$uid,$pid)";
    $result = mysqli_query($conn,$sql);
    if($result){
        echo '{"code":1}';
    }else{
        echo '{"code":-1}';
    }
}
?>