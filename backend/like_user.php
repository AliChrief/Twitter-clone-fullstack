<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
include('connection.php');


$userName = $_POST['username'];
$tweetId = $_POST["tweetId"];

// Extract the user ID 
function returnId($user, $mysqli) {
    $check = $mysqli -> prepare(
        "SELECT user_id FROM users
        WHERE username = ?"
    );

    $check -> bind_param("s", $user);
    $check -> execute();
    $array = $check -> get_result();
    $response = [];
    $response[] = $array -> fetch_assoc();
    return $response[0]["user_id"];
}

// Check if the same user make more than 1 like 
function checkLiked($user, $tweet, $mysqli) {
    $check = $mysqli -> prepare(
        "SELECT COUNT('user_id') as likes FROM  user_like 
        WHERE user_id = '$user' AND tweet_id = '$tweet' "
    );

    $check -> execute();
    $array = $check -> get_result();

    $response = [];
    $response[] = $array -> fetch_assoc();

    if ($response[0]["likes"] == 1) {
        return true;
    } else {
        return false;
    }
}


// like the tweet
function likeTweet($user, $tweet, $mysqli) {
    $query = $mysqli -> prepare(
        "INSERT INTO user_like(`user_id`, tweet_id)
        VALUE (?, ?)");

    if ($query === false) {
        die("error: " . $mysqli -> error);
    }

    $query -> bind_param("ii", $user, $tweet);
    $query -> execute();
};
// Unlike the tweet
function unlikeTweet($user, $tweet, $mysqli) {
    $query = $mysqli -> prepare(
        "DELETE FROM user_like
        WHERE `user_id` = ? AND tweet_id = ?");

    if ($query === false) {
        die("error: " . $mysqli -> error);
    }

    $query -> bind_param("ii", $user, $tweet);
    $query -> execute();
}


$userId = returnId($userName, $mysqli);

// like the tweet for 1st time for same user else unlike for 2nd time also for same user
if (checkLiked($userId, $tweetId, $mysqli)) {
    unlikeTweet($userId, $tweetId, $mysqli);
    echo json_encode("unliked successfully");
} else {
    likeTweet($userId, $tweetId, $mysqli);
    echo json_encode("liked successfully");
}

?>