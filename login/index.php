<?php
    session_start();
?>

<!DOCTYPE html>
    <head>
    <title>RetroRoom - Login</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
        <script type="text/javascript" src="../assets/javascript/vueTitle.js"></script>
        <script type="text/javascript" src="loginAnimations.js"></script>
        <script type="text/javascript" src="https://kit.fontawesome.com/f9afe9f463.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="../assets/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/baseStyle.css"/>
        <link rel="stylesheet" type="text/css" href="style.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/buttons.css">
    </head>
    <body>
        <mytitle id="title-container" v-bind:text="titleText"></mytitle>
        <div class="container">
            <!-- pulsante per tornare alla home -->
            <div class="row pb-1 pt-1 justify-content-center">
                <div class="col-md-2 pb-2">
                    <a href="../index.php" class="btn btn-lg">
                        <span class="fas fa-home"></span>
                        Home
                    </a>
                </div>
            </div>
        </div>
        <div class="container py-4">
            <div class="row gx-0 myRow">
                <div class="col-lg-4">
                    <img src="../assets/images/mega.jpg" class="img-fluid img-shake img-left">
                </div>
                <div class="col-lg-4 px-5 pt-5">       
                    <?php
                        // messaggi di errore
                        $error1 = "";
                        $error2 = "";
                        $error3 = "";
                        $error4 = "";
                        $success = "";
                        $form = 'login';
                        if(isset($_GET["form"])) $form = $_GET["form"];
                        if(isset($_SESSION["error1"])) $error1 = $_SESSION["error1"];
                        if(isset($_SESSION["error2"])) $error2 = $_SESSION["error2"];
                        if(isset($_SESSION["error3"])) $error3 = $_SESSION["error3"];
                        if(isset($_SESSION["error4"])) $error4 = $_SESSION["error4"];
                        if(isset($_SESSION["success"])) $success = $_SESSION["success"];
                        // contenuto html del form di login
                        $formBodyLogin = "
                            <h2 class='h2'>Effettua il login</h2>
                            <div class='form-row'>
                                <div class='col-lg'>
                                    <input type='text' name='inputUsername' placeholder='Username' class='form-control my-3 p-3' required>
                                </div>
                            </div>
                            <div class='form-row'>
                                <div class='col-lg'>
                                    <input type='password' name='inputPassword' placeholder='Password' class='form-control my-3 p-3' required>
                                </div>
                            </div>
                            <div class='form-row'>
                                <div class='col-lg'>
                                    <button type='submit' name='loginButton' class='btn1 mt-3 mb-3'>Login</button>
                                </div>
                            </div>
                            <div class='phpMessage error mb-1'>$error1</div>
                            <div class='phpMessage success mb-1'>$success</div>
                            <p class='message'>Non sei ancora registrato?
                                <a href='#' class='link'>Clicca qui</a>
                            </p>";
                        // contenuto html del form di registrazione
                        $formBodyRegistration = "
                            <div class='form-row'>
                            <h2 class='h2'>Effettua la registrazione</h2>
                            <div class='col-lg'>
                                <input type='text' name='inputUsername' placeholder='Username' class='form-control my-3 p-3' required>
                            </div>
                            <div class='col-lg'>
                                <input type='email' name='inputEmail' placeholder='Email' class='form-control my-3 p-3' required>
                            </div>
                            </div>
                            <div class='form-row'>
                                <div class='col-lg'>
                                    <input type='password' name='inputPassword' placeholder='Password' class='form-control my-3 p-3' required>
                                </div>
                            </div>
                            <div class='form-row'>
                                <div class='col-lg'>
                                    <button type='submit' name='registrationButton' class='btn1 mt-3 mb-3'>Registrazione</button>
                                </div>
                            </div>
                            <div class='phpMessage error mb-1'>$error2</div>
                            <div class='phpMessage error mb-1'>$error3</div>
                            <div class='phpMessage error mb-1'>$error4</div>
                            <p class='message'>Sei già registrato?
                                <a href='#' class='link'>Clicca qui</a>
                            </p>";
                        if ($form === 'login')
                            echo "
                                <form action='login.php' method='POST'>
                                    $formBodyLogin
                                </form>
                                <form action='registration.php' method='POST' class='hidden-form'>
                                    $formBodyRegistration
                                </form>";
                        if ($form === 'registration')
                            echo "
                                <form action='registration.php' method='POST'>
                                    $formBodyRegistration
                                </form>
                                <form action='login.php' method='POST' class='hidden-form'>
                                    $formBodyLogin
                                </form>"; 
                    ?>
                </div>
                <div class="col-lg-4">
                    <img src="../assets/images/raggio.jpg" class="img-fluid img-shake img-right">
                </div>
            </div>
        </div>
    </body>
</html>

<?php
    // rimozione dei messaggi di errore
    unset($_SESSION["error1"]);
    unset($_SESSION["error2"]);
    unset($_SESSION["error3"]);
    unset($_SESSION["error4"]);
    unset($_SESSION["success"]);
?>
