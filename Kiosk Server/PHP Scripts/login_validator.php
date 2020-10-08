<?php
$username = 'fname';
$pwd = 'fpwd';
$email = 'femail';
$client_username = null;
$client_password = null;
$client_email = null;
$client_authcode = null;
session_start();
ob_start();

if (isset($_POST[$username])) {
    $client_username = $_POST[$username];
    //echo 'username: ' . $client_username;
}
if (isset($_POST[$pwd])) {
    $client_password = $_POST[$pwd];
   // echo 'password: ' .$client_password;
}

if (isset($_POST[$email])) {
    $client_email = $_POST[$email];
    //echo 'email: ' . $client_email;
}

if(isset($_POST['fauthcode'])){
    $client_authcode = $_POST['fauthcode'];
}


if (is_validated($client_username, $client_password)){
    $location = "../../kiosk program/src/main page/index.html";
    $paramString = null;
    if ($client_username != null && $client_password != null){
        $paramString = addParameters([['key'=> 'authcode', 'value'=> $client_authcode]]);
    }
    $location = $paramString != null ? $location . $paramString : $location;
    header("Location: " . $location);
    //readfile('../../kiosk program/src/main page/index.html');  //'var/www/html/OSF Project/Kiosk Program/src/main page/index.html'
    exit();
}

function addParameters($params = null){
    if ($params != null){
        $str = "?";
        for ($i =0; $i < sizeof($params); $i++){
            if ($i > 0){
                $str .= "&";
            }
            $key = $params[$i]['key'];
            $value =  $params[$i]['value'];
            $str .= $key . '=' . $value;
        }
        return $str;
    }

    return null;
}

/**
 * Checks if is validated
 */
function is_validated($username = null, $password = null){
    return validate_cred($username, $password);
}

/**
 * Checks to see if credentials are validated
 */
function validate_cred($username_local = null, $password_local = null){
    global $username;
    global $pwd;
    if ($username_local != null && $password_local != null){
        return true;
    }
    else{
        $username_local = isset($_REQUEST[$username]) ? $_REQUEST[$username] : null;
        $password_local = isset($_REQUEST[$pwd]) ? $_REQUEST[$pwd] : null;
        if ($username_local != null && $password_local != null){
            return true;
        }
    }

    return false;
}
?>