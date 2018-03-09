<?php
require("init.php");
$sids = $_REQUEST["sids"];
if ($sids) {
    $arr = explode("*", $sids);
    $j = $arr[0];
    $sql = "DELETE FROM aifou_shop WHERE sid=$j";
    if (count($arr) > 1) {
        for ($i = 1; $i < count($arr); $i++) {
            $j = $arr[$i];
            $sql .= " OR sid=$j";
        }
    }
    mysqli_query($conn,$sql);
    if(mysqli_affected_rows($conn)>0){
        $sql = "";
    }else{
        echo '{"code":-10}';
    }
}
?>