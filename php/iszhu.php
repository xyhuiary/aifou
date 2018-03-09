<?php
REQUIRE("init.php");
SESSION_START();
@$uid = $_SESSION["uid"];
$sql = "SELECT DISTINCT cid FROM aifou_shop LEFT OUTER JOIN list_head ON aifou_shop.pid=list_head.pid WHERE uid=$uid AND cid<4000";
$result = mysqli_fetch_all(mysqli_query($conn,$sql),MYSQL_ASSOC);
//var_dump($result);
if($result){
    echo json_encode(["code"=>0]);
}else{
    echo json_encode(["code"=>1]);
}
// echo json_encode($result);
?>