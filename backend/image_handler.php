<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');
include('connection.php');

function imageSave($image, $id, $flag, $mysqli) {
    // Decode the base64 image after reomve pattern 
    $image = base64_decode(preg_replace('#^data:image/\w+;base64,#i', '', $image));
    // Create an address of decoded base64 image 
    $photoAddress = dirname(__FILE__) . "../images/" . $flag . $id . ".png"; // ex: profile38.png
    // put the image contents into that address
    file_put_contents($photoAddress,$image);
    // Save the address of saved image into database
    $photoAddress = "images/" . $flag . $id . ".png";

    if($flag == 'profile'){
        $query = $mysqli -> prepare("UPDATE users SET profile_pic = '$photoAddress' WHERE user_id = '$id' ");
    }else{
        $query = $mysqli -> prepare("INSERT INTO images (tweet_id,image) VALUES (?,?)");
        $query -> bindparam('is',$id,$photoAddress);
    }
    
    if ($query === false) {
        die("error: " . $mysql -> error);
    }

    $query -> execute();

}

function retrieveImage($id, $flag, $mysqli){
    // Get the profile image address
    if($flag == 'profile'){
        $select = $mysqli -> prepare("SELECT profile_pic AS img FROM users WHERE user_id = '$id'");
    }
    // Get the tweet image address
    else{
        $select = $mysqli -> prepare("SELECT image AS img FROM images  WHERE tweet_id = '$id'");
    }

    if ($select === false) {
        die("error: " . $mysql -> error);
    }

    $select -> execute();
    $array = $select -> get_result();
    $response = [];
    $response[] = $array -> fetch_assoc();
    // if image not found 
    if(!($response[0]['img'])){
        return "./assets/images/pp.png";
    }
    // Get the decoded image using its address
    $decoded_image =  file_get_contents($response[0]['img']);
    // Encode the image
    $encoded_image = base64_encode($decoded_image);
    // return complete base64 image
    return "data:image/png;base64," . $encoded_image;

}
// User profile
// if(isset($_GET['USER_ID'])){
//     $user_id = $_GET['USER_ID'];
//     $user_profile = retrieveImage($user_id,'profile',$mysqli);
//     echo json_encode($user_profile);
// }

?> 