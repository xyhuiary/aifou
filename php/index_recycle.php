<?php
    REQUIRE("init.php");
    $sql="SELECT * FROM index_recycle";
    $result=mysqli_query($conn,$sql);
    $arr=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $str=json_encode($arr);
    echo $str;
?>