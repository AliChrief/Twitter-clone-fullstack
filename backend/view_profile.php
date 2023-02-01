<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include("connection.php");
include("image_handler.php");

$userID = $_GET['user_id'];


// Load user profile
function getUserData($userID,$mysqli){
    $select_query = $mysqli -> prepare("SELECT f_name, l_name, username, date_of_joining, description FROM users
                                        WHERE user_id = '$userID' ");
    $select_query -> execute();
    $response = [];
    $array = $select_query -> get_result();

    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
        
    }
    return $response;
}


// Get user followings
function getFollowing($userID,$mysqli){
    $select_query = $mysqli -> prepare("SELECT COUNT(user_id) AS following FROM user_follow_user WHERE 
                                        user_id = '$userID' ");
    $select_query -> execute();
    $array = $select_query -> get_result();
    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
        
    }

    return $response;

}
// Get user followers
function getFollowers($userID,$mysqli){
    $select_query = $mysqli -> prepare("SELECT COUNT(followed_user_id) AS followers FROM user_follow_user WHERE 
                                        followed_user_id = '$userID' ");
    $select_query -> execute();
    $array = $select_query -> get_result();
    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
        
    }

    return $response;
}

// Get user tweets
function getUserTweets($userID, $mysqli){

    $select_query = $mysqli -> prepare("SELECT text, tweet_date  FROM tweets WHERE 
                                        user_id = '$userID' ");
    $select_query -> execute();
    $array = $select_query -> get_result();
    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
    }

    return $response;
}


$profile[] = retrieveImage($userID,'profile',$mysqli);
$data = getUserData($userID, $mysqli);
$userFollowing = getFollowing($userID, $mysqli);
$userFollowers = getFollowers($userID, $mysqli);
$tweets = getUserTweets($userID, $mysqli);
$json = array_merge($data,$profile, $userFollowing, $userFollowers, $tweets);
echo json_encode($json);






?>