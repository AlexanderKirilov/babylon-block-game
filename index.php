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
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    
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
                                <i class="material-icons prefix">account_circle</i>
                                <input class='validate' type='text' name='userName' id='userName' />
                                <label for='userName'>Enter your username</label>
                            </div>
                        </div>
                        <div class='row'>
                            <div class='input-field col s12'>
                                <i class="material-icons prefix">vpn_key</i>
                                <input class='validate' type='password' name='password' id='password' />
                                <label for='password'>Enter your password</label>
                            </div>
                            <label style='float: right;'>
                                <a class='pink-text' href='#!'><b>Forgot Password?</b></a>
                            </label>
                        </div>
                        <div style="text-align:center;" class='row'>
                            <button id="btnLogin"type='submit' name='btn_login' class='col s12 btn btn-large waves-effect wave-light indigo'>Login</button>
                        </div>    
                    </form>
                </div>
            </div>
            <a id="newAccount" href="register.php">Create account</a>
            <div class="section"></div>
            <div class="section"></div>
          </main>
    </div>

   
    
    <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>

    
    <script>
    $('document').ready(function(){
        $("#loginForm").on('submit', function(e){
            submitForm(e);
        });

        /* login submit */
        function submitForm(e){
            e.preventDefault();
            var errorSection = $('#error');

            errorSection.empty();

            if($("#loginForm").find('#userName').val() === '' || $("#loginForm").find('#password').val() === ''){
                errorSection.html('<div class="alert alert-danger"> Please enter a user name and password</div>');

                return false;
            }

            var data = $("#loginForm").serialize();

            $.ajax({
                type : 'POST',
                url  : 'loginUser.php',
                data : data,
                beforeSend: function(){ 
                    errorSection.fadeOut();
                    errorSection.empty();
                    $("#btnLogin").html('signing in...');
                    $("#btnLogin").fadeTo(200, 0.7);
                },
                success :  function(response){
                    response = response.trim();
                    $("#btnLogin").html('Sign In');
                    $("#btnLogin").fadeTo(200,1);
                    
                    
                    if(response == "ok"){
                        window.location.href = 'game.php';
                        
                    }else{
                        errorSection.fadeIn(1000, function(){      
                            errorSection.html('<div class="alert alert-danger"> &nbsp; '+response+' !</div>');
                        });

                    }
                }
            });
        return false;
        }
        /* login submit */
    });
    </script>
    <!-- js files for materialize framework -->
    <!--<script src="https://cdnjs.cloudflare.com/ajax/libs/materialize/0.97.7/js/materialize.min.js" type="text/javascript"></script>
    <!-- preload the framework -->

    <script src="js/lib/materialize.js"></script>

    <script src="node_modules/babylonjs/babylon.js" type="text/javascript"></script>
</body>
</html>


