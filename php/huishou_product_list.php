<?php
    REQUIRE("init.php");
    @$eid=$_REQUEST["eid"];
    $sql="SELECT * FROM huishou_product_list WHERE titleId=$eid";
    $result=mysqli_query($conn,$sql);
    $arr=mysqli_fetch_all($result,MYSQLI_ASSOC);
    $str=json_encode($arr);
    echo $str;
?>