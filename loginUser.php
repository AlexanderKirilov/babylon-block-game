 <?php
session_start();
require_once 'dbconfig.php';

$userName = trim($_POST['userName']);
$user_password = trim($_POST['password']);

try{ 

    $stmt = $db_con->prepare("SELECT * FROM tbl_users WHERE user_name=:name");
    $stmt->execute(array(":name"=>$userName));
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    $count = $stmt->rowCount();

    if($row['user_password']==$user_password){

        echo "ok"; // log in
        $_SESSION['user_session'] = $row['user_id'];
    }
    else{
        echo "email or password does not exist."; // wrong details 
    }

}catch(PDOException $e){
    echo $e->getMessage();
}
?>