<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Request-With');

include('connection.php');

if(isset($_POST['user-input']) && isset($_POST['password'])){
    // User-input can be etheir email or username
    $user_input = $_POST['user-input'];
    // Hash the password
    $password =  hash("sha256" , $_POST['password']);
    // 
    $select_query = $mysqli -> prepare("SELECT username,email, password,user_id FROM users 
                                        WHERE  password = '$password' AND username = '$user_input' OR password = '$password' AND email = '$user_input' ");
    $select_query -> execute();
    $response = [];
    
    $array = $select_query -> get_result();
    
    while($a = $array->fetch_assoc()) {
    
        $response[] = $a;  
    }
    // IF user-input and password match that in database => Login
    if($response){
        $myObj = new stdClass();
        $myObj -> result = "success";
        $response[] = $myObj ;
        die(json_encode($response));
    }
    else{
        $myObj = new stdClass();
        $myObj -> result = "faild";
        $response[] = $myObj ;
        die(json_encode($response));
    }
}

?>