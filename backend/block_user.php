<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');

include('connection.php');

$user_id = $_POST['user_id'];
$userName = $_POST['userName'];
// Check if login user block target user previoulsy
function check_previous_block($user_id, $block_user_id,$mysqli){
   $check = $mysqli -> prepare("SELECT user_id FROM user_block_user 
                                WHERE user_id = '$user_id' AND blocked_user_id = '$block_user_id'");
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

// Return id of target blocked username
function returnId($userName,$mysqli){
    $check = $mysqli -> prepare("SELECT user_id FROM users 
                                WHERE username = '$userName' ");
    $check -> execute();
    $array = $check -> get_result();
    $response = [];
    $response[] = $array -> fetch_assoc();
    return $response[0]['user_id'] ;
}
// Block target user
function block($user_id, $block_user_id,$mysqli){
    $insert_query = $mysqli -> prepare('INSERT INTO user_block_user (user_id, blocked_user_id) VALUES (?,?)');
    if (!$insert_query) {
        die("error: " . $mysqli -> error);
    }

    $insert_query -> bind_param('ii',$user_id,$block_user_id);
    $insert_query -> execute();

}
// Unblock target user
function unBlock($user_id, $block_user_id,$mysqli){
    $remove_query = $mysqli -> prepare(" DELETE FROM user_block_user 
                                        WHERE user_id = '$user_id' AND blocked_user_id = '$block_user_id'");

    if (!$remove_query) {
        die("error: " . $mysqli -> error);
    }

    $remove_query -> execute();

}

$blockedUserId = returnId($userName,$mysqli);
// IF not blocked previously then block target user
if(!check_previous_block($user_id,$blockedUserId,$mysqli)){

    block($user_id,$blockedUserId,$mysqli);
    echo json_encode('block successfully');
    
// Else Unblock target user
}else{

    unBlock($user_id,$blockedUserId,$mysqli);
    echo json_encode('unblock successfully');

}

?>