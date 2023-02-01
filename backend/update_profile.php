<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");


include("connection.php");
include("image_handler.php");


$firstName = $_POST["firstName"];
$lastName = $_POST["lastName"];
$description = $_POST['description'];
$userID = $_POST["user_id"];
// Update user profile
function updateData($userID, $fname, $last, $descrip, $mysqli) {
    $query = $mysqli -> prepare(
        "UPDATE users SET f_name = '$fname', l_name = '$last', description = '$descrip'
        WHERE user_id = '$userID'"
    );
    $query -> execute();
    return true;
}
// Update user profile image
if(isset($_POST['profile'])){

    $profile = $_POST['profile'];
    imageSave($profile, $userID, 'profile' ,$mysqli);
    
}

$update = updateData($userID, $firstName, $lastName,$description, $mysqli);
json_encode($update);

?>