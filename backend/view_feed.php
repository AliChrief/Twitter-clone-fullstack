<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

include("connection.php");
include("image_handler.php");

// Load the tweet with tweet user's profile
function getData($mysqli){

    $select_query = $mysqli -> prepare("SELECT tweets.tweet_id,tweets.text,tweets.tweet_date, users.username,users.f_name,users.l_name,users.profile_pic
    FROM tweets INNER JOIN users ON users.user_id = tweets.user_id");
    $select_query -> execute();
    $response = [];
    $array = $select_query -> get_result();

    while($a = $array->fetch_assoc()) {
        $response[] = $a;  
    }

    return $response;
}
// Load tweet likes
function getLikes($response,$mysqli){

    foreach($response as $resp) {
        $ids[] = $resp["tweet_id"];
    }

    foreach($ids as $id) {
        
        $query = $mysqli -> prepare(
            "SELECT COUNT('user_id') as likes, tweet_id FROM user_like
            WHERE tweet_id = '$id'"
        );
        $query -> execute();
        $array = $query -> get_result();
        
        while($i = $array -> fetch_assoc()){
            $new_response[] = $i;
        };
    }    
    return $new_response;
}

$json = [];
$data = getData($mysqli);
$json[] = $data;
$getLikes = getLikes($data, $mysqli);
$json[] = $getLikes;

foreach($json[0] as $t) {
    $userNames[] = $t['username'];
}

// Load every user profile who make tweet
function getUsersProfile($mysqli){

    global $userNames;
    foreach($userNames as $name){
        $select_query = $mysqli -> prepare("SELECT user_id
        FROM users WHERE username = '$name' ");
        $select_query -> execute();
        $array = $select_query -> get_result();

        while($a = $array->fetch_assoc()) {
            $result[] = $a;  
            
        }  
    }

    foreach($result as $a){
        $ids[] = $a['user_id'];
    }
    // Load every user profile image who make tweet
    foreach ($ids as $id){

        $test[] = retrieveImage($id, 'profile', $mysqli);
    }
 
    return $test;
}

$profile = getUsersProfile($mysqli);
$json [] = $profile;
echo json_encode($json);
?>