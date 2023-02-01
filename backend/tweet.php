<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');

include('connection.php');


$userID = $_POST['user_id'];
$text = $_POST['text'];
$tweetDate = $_POST['date'];

// Save the tweet into database 
function insertTweet($userID, $text, $tweetDate, $mysqli){
    $insert_query = $mysqli -> prepare("INSERT INTO tweets (text,tweet_date,user_id) VALUES (?,?,?) ");
    $insert_query -> bind_param('ssi', $text, $tweetDate, $userID);
    $insert_query -> execute();
}

insertTweet($userID, $text, $tweetDate, $mysqli);

function getTweet($userID, $mysqli){

    $select_query = $mysqli -> prepare("SELECT tweets.tweet_id AS id ,tweets.text,tweets.tweet_date, users.username,users.f_name,users.l_name
    FROM tweets INNER JOIN users ON users.user_id = tweets.user_id AND tweets.user_id = '$userID' ");
    $select_query -> execute();
    $response = [];
    $array = $select_query -> get_result();
    
    while($a = $array->fetch_assoc()) {
        $response = $a;  
    }
    return $response;
}
// Get the tweet from database
$data = getTweet($userID, $mysqli);
echo json_encode($data);

?>