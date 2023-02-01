<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');

include('connection.php');

$user_id = $_POST['user_id'];
$userName = $_POST['userName'];

// Check if login user follow target user previoulsy
function check_previous_follow($user_id, $follow_user_id,$mysqli){
   $check = $mysqli -> prepare("SELECT user_id FROM user_follow_user
                                WHERE user_id = '$user_id' AND followed_user_id = '$follow_user_id'");
    $check -> execute();
    $array = $check -> get_result();

    $response = [];
    $response[] = $array -> fetch_assoc();

    if($response[0]){
       
        return true;
    }else{
        return false;
    }

}

// Return id of target followed username
function returnId($userName,$mysqli){
    $check = $mysqli -> prepare("SELECT user_id FROM users 
                                WHERE username = '$userName' ");
    $check -> execute();
    $array = $check -> get_result();

    $response = [];
    $response[] = $array -> fetch_assoc();
    return $response[0]['user_id'] ;
}

// Follow target user
function follow($user_id, $follow_user_id,$mysqli){
    $insert_query = $mysqli -> prepare('INSERT INTO user_follow_user (user_id, followed_user_id) VALUES (?,?)');

    if (!$insert_query) {
        die("error: " . $mysqli -> error);
    }

    $insert_query -> bind_param('ii',$user_id,$follow_user_id);
    $insert_query -> execute();

}

// Unfollow target user
function unFollow($user_id, $follow_user_id,$mysqli){
    $remove_query = $mysqli -> prepare(" DELETE FROM user_follow_user
                                        WHERE user_id = '$user_id' AND followed_user_id = '$follow_user_id'");

    if (!$remove_query) {
        die("error: " . $mysqli -> error);
    }

   
    $remove_query -> execute();

}

$followedUserId = returnId($userName,$mysqli);

// IF not followed previously then follow target user
if(!check_previous_follow($user_id,$followedUserId,$mysqli)){

    follow($user_id,$followedUserId,$mysqli);
    echo json_encode('follow successfully');
    
// Else Unfollow target user
}else{

    unFollow($user_id,$followedUserId,$mysqli);
    echo json_encode('unfollow successfully');

}


 
 

?>