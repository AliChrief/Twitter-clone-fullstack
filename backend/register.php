<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');

include('connection.php');


if(isset($_POST['username']) && isset($_POST['password']) && isset($_POST['email']) && isset($_POST['firstName']) && isset($_POST['lastName']) ){
    $email = $_POST['email'] ; 
    $firstName = $_POST["firstName"];
    $lastName = $_POST["lastName"];                                                
    $username =$_POST['username'];
    $dateJoined = date("d M Y ");
    $password = hash("sha256", $_POST["password"] );
}
// Check if username and email is taken previously
$select_query = $mysqli -> prepare("SELECT username, email FROM users WHERE username = '$username' OR email = '$email' ");
$select_query -> execute();
$response = [];
$array = $select_query -> get_result();

while($a = $array->fetch_assoc()) {
    $response[] = $a;  
}
// IF not insert the NEW user identity information into database
if(!$response){
    $insert_query = $mysqli -> prepare('INSERT INTO users (f_name,l_name,date_of_joining,username, email, password) VALUES (?,?,?,?,?,?)');
    $insert_query -> bind_param('ssssss',$firstName,$lastName,$dateJoined,$username, $email, $password );
    $insert_query -> execute();
    echo json_encode('success');
}
// username is taken previously
elseif($response[0]['username'] === $username ){
    die(json_encode("error: username already in use."));
}
// email is taken previously
else {
    die(json_encode("error: email already in use."));
}

?>