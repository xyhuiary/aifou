<?php
    REQUIRE("init.php");
    $uname=$_REQUEST["uname"];
    $sql="SELECT * FROM aifou_user WHERE uname=$uname";
    $result=mysqli_query($conn,$sql);
    echo json_encode(mysqli_fetch_row($result));
?>