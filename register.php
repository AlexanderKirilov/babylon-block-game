<?php
	session_start();

	if(isset($_SESSION['user_session'])){
	    header("Location: game.php");
	}

?>
<!DOCTYPE html>
<html>
<head>
	<title>Dania</title>
    <!-- materialize - material design framework | http://materializecss.com/ -->
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/css/materialize.min.css"/>
    <link rel="stylesheet" href="assets/stylesheets/index.css">
</head>
<body>
    <div id="splashScreen">
        <div class="section"></div>
        <main>
            <div class="section"></div>

            <h5 class="indigo-text">Please, login into your account</h5>
            <div id="error" class="section"></div>

            <div class="container">
                <div id="formCenterBox" class="z-depth-1 grey lighten-4 row">
                    <form id="loginForm" class="col s12" method="post">
                        <div class='row'>
                          <div class='col s12'>
                          </div>
                        </div>
                        <div class='row'>
                            <div class='input-field col s12'>
                            
                                <input class='validate' type='text' name='userName' id='userName' />
                                <label for='userName'>Enter your username</label>
                            </div>
                        </div>
                        <div class='row'>
                            <div class='input-field col s12'>
                                <input class='validate' type='password' name='password' id='password' />
                                <label for='password'>Enter your password</label>
                            </div>
                            <label style='float: right;'>
                                <a class='pink-text' href='#!'><b>Forgot Password?</b></a>
                            </label>
                        </div>
                        <div style="text-align:center;" class='row'>
                            <button id="btnLogin"type='submit' name='btn_login' class='col s12 btn btn-large waves-effect indigo'>Login</button>
                        </div>    
                    </form>
                </div>
            </div>
            <a id="newAccount" href="register.php">Create account</a>
            <div class="section"></div>
            <div class="section"></div>
          </main>
    </div>
</body>