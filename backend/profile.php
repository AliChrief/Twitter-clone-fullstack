<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include("connection.php");
include("image_handler.php");

$userID = $_GET['USER_ID'];

// Load user profile
function getUserData($userID,$mysqli){
    $select_query = $mysqli -> prepare("SELECT f_name, l_name, username FROM users
                                        WHERE user_id = '$userID' ");
    $select_query -> execute();
    $response = [];
    $array = $select_query -> get_result();

    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
        
    }
    return $response;
}

$data = getUserData($userID, $mysqli);
$profile = retrieveImage($userID,'profile',$mysqli);
$myObj = new stdClass();
$myObj -> img = $profile;
$myObj -> user = $data;
$json = $myObj ;

echo json_encode($json);

?>