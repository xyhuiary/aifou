<?php
    REQUIRE("init.php");
    $uname=$_REQUEST["uname"];
    $upwd=$_REQUEST["upwd"];
    $sql="SELECT uid FROM aifou_user WHERE uname='$uname' AND binary upwd='$upwd'";
    $result=mysqli_query($conn,$sql);
    $uid=mysqli_fetch_row($result);
    if($uid){
        SESSION_START();
        $_SESSION["uid"]=$uid[0];
        echo json_encode(["i"=>1]);
    }else{
        echo json_encode(["i"=>0]);
    }
?>