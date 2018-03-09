<?php
require("init.php");
SESSION_START();
@$uid = $_SESSION["uid"];
if ($uid) {
    $sql = "SELECT uname FROM aifou_user WHERE uid=$uid";
    $result = mysqli_query($conn, $sql);
    $output = [
        "ok" => 1,
        "uname" => mysqli_fetch_row($result)[0]
    ];
    echo json_encode($output);
} else {
    echo json_encode(["ok" => 0]);
}
?>