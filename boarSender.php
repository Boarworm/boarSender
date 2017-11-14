<?php
use PHPMailer\PHPMailer\PHPMailer;

//if ($_POST) {
date_default_timezone_set('Etc/UTC');
require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';
//var_dump($_FILES);
//    function saveAttachedPhotos()
//    {
//        if (!empty($_FILES)) {
//            $uploadpath=[];
//            $filename=[];
//            for ($i = 0; $i < count($_FILES[$i]['tmp_name']); $i++) {
//
//                $uploadpath .= tempnam(sys_get_temp_dir(), hash('sha256', $_FILES[$i]['name']));
//                $filename .= $_FILES[$i]['name'];
//               // var_dump($uploadpath);
//                if (move_uploaded_file($_FILES[$i]['tmp_name'], $uploadpath)) {
//                    //$mail->addAttachment($uploadpath, $filename);
//
//                    $msg .= 'okay';
//                    global  $imgpath;
//                    global  $imgnames;
//                    $imgpath = $uploadpath;
//                    $imgnames = $filename;
//                } else {
//                    $msg .= 'Failed to move file to ' . $uploadpath;
//                }
//            }
//        }
//    }

$response = [];
//var_dump($_POST);
/********************************
 * Recaptcha
 * /*******************************/

if (isset($_POST['g-recaptcha-response'])) {
    if (empty($_POST['g-recaptcha-response'])) {
        $response['error'] = 'invalid';
        echo json_encode($response);
        exit;
    }
}
/********************************
 * Config
 * /*******************************/
$emailSubject = 'Новая заявка';
$smtp_host = "smtp.gmail.com";
$smtp_username = "zl3.animals@gmail.com";
$smtp_password = "yAmEgT|@*g1";
$smtp_port = 587;
$smtp_secure = 'tls';
$to_email = "zl3.animals@gmail.com";
$to_name = 'Оператору';
$from_email = 'noreply@zl3.ru';
$from_name = "zl3.ru";

$i = 0;
$break = "\r\n";
$sep = ': ';
$msg = '';
$ruNames = json_decode($_POST['ruNames_']);
$requireds = json_decode($_POST['requireds_']);
foreach ($_POST['name'] as $val) {
    $msg .= $ruNames[$i] . $sep . $val . $break;
    $i++;
}
$mail = new PHPMailer;
$mail->isSMTP();
$mail->isHTML(false);
//$mail->SMTPDebug = 2;
//$mail->Debugoutput = 'html';
$mail->SMTPSecure = $smtp_secure;
$mail->Host = $smtp_host;
$mail->Port = $smtp_port;
$mail->SMTPAuth = true;
$mail->Username = $smtp_username;
$mail->Password = $smtp_password;
$mail->setFrom($from_email, $from_name);
$mail->addAddress($to_email, $to_name);
$mail->Subject = $emailSubject;
$mail->CharSet = "UTF-8";
$mail->ContentType = 'text/plain';

if (!empty($_FILES['photos']['tmp_name'][0])) {

    for ($ct = 0; $ct < count($_FILES['photos']['tmp_name']); $ct++) {
        $uploadfile = tempnam(sys_get_temp_dir(), hash('sha256', $_FILES['photos']['name'][$ct]));
        $filename = $_FILES['photos']['name'][$ct];
        if (move_uploaded_file($_FILES['photos']['tmp_name'][$ct], $uploadfile)) {
            $mail->addAttachment($uploadfile, $filename);
        } else {
            $msg .= 'Failed to move file to ' . $uploadfile;
        }
    }
}

$mail->Body = $msg;
//   $mail->send();
//if (!$mail->send()) {
//    echo json_encode('Debug: error - ' . $mail->ErrorInfo);
//    $response['error'] = 'error';
//    echo json_encode($response);
//} else {
//    //echo json_encode('Debug: message send OK');
    $response['error'] = 'ok';
    echo json_encode($response);
//}
//}
//} else {
//    echo "POST did not come";
//}