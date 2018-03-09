<?php
    REQUIRE("init.php");
    $uname=$_REQUEST["uname"];
    $upwd=$_REQUEST["upwd"];
    $sql="INSERT INTO aifou_user(uname,upwd) VALUES('$uname','$upwd')";
    $result=mysqli_query($conn,$sql);
    if($result==true){
        $uid=mysqli_insert_id($conn);
        SESSION_START();
        $_SESSION["uid"]=$uid;
        echo json_encode(["ok"=>1]);
    }else{
        echo json_encode(["ok"=>0]);
    }
?>