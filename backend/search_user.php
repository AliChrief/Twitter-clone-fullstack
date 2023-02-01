<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include("connection.php");
include("image_handler.php");

$user_id = $_POST['user_id'];
$name = $_POST['name']; // consist of first name and last name separated by space
// split the name 
$name = explode(" ",$name);
$firstName = $name[0];
$lastName = $name[1];

// Get the searched for users
function getUser($firstName, $lastName,$user_id, $mysqli){
    // By matching either his firstname or lastname
    $query = $mysqli -> prepare("SELECT user_id,f_name, l_name, username, profile_pic FROM users 
    WHERE (user_id != '$user_id') AND (f_name = '$firstName' OR l_name = '$lastName')  ");
    $query -> execute();
    $array = $query -> get_result();
    $response = [];

    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
    }
    // Get profile of each matched user 
    if($response){
        foreach($response as $resp){

           $test []= retrieveImage($resp['user_id'],'profile', $mysqli);
        }
        $response[] = array_merge($test);
        echo json_encode($response);

    }else{

        die(json_encode('Not Found'));
    }
    
}
getUser($firstName, $lastName,$user_id, $mysqli);

?>
  
  