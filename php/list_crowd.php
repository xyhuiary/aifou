<?php
require("init.php");
@$sid = $_REQUEST["sid"];
@$cid = $_REQUEST["cid"];
if ($sid) {
    if ($sid < 40) {
        $sql = "SELECT *,(SELECT COUNT(*) FROM list_head WHERE list_head.cid=list_crowd.cid) AS sum FROM list_crowd WHERE sid=$sid";
    } else {
        $sql = "SELECT *,(SELECT COUNT(*) FROM list_head WHERE list_head.cid=list_crowd.cid AND istop=1) AS sum FROM list_crowd WHERE sid=$sid";
    }
}
if ($cid) {
    if ($cid < 4000) {
        $sql = "SELECT *,(SELECT sname FROM list_source WHERE sid=(SELECT sid FROM list_crowd WHERE cid=$cid)) AS sname FROM list_head WHERE cid=$cid";
    } else {
        $sql = "SELECT *,(SELECT sname FROM list_source WHERE sid=(SELECT sid FROM list_crowd WHERE cid=$cid)) AS sname FROM list_head WHERE cid=$cid AND istop=1";
    }
}
$result = mysqli_query($conn, $sql);
echo json_encode(mysqli_fetch_all($result, MYSQL_ASSOC));
?>