<?php
    REQUIRE("init.php");
    @$tid=$_REQUEST["tid"];
    $sql="SELECT * FROM huishou_product_title WHERE typeId=$tid";
    $result=mysqli_query($conn,$sql);
    $arr=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $str=json_encode($arr);
    echo $str;
?>