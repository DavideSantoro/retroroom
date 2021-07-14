<!DOCTYPE html>
<html>
    <head>
        <title>RetroRoom - Breakout</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <?php include "../assets/php/getUsername.php"; ?>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript" src="../assets/javascript/geometries.js"></script>
        <script type="text/javascript" src="../assets/javascript/gameFramework.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
        <script type="text/javascript" src="../assets/javascript/vueGameButtons.js"></script>
        <script type="text/javascript" src="levels.js"></script>
        <script type="text/javascript" src="breakout.js"></script>
        <script type="text/javascript" src="../assets/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="https://kit.fontawesome.com/f9afe9f463.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="../assets/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/games.css"/>
        <link rel="stylesheet" type="text/css" href="breakout.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/buttons.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/baseStyle.css"/>
    </head>
    <body>
        <div class="container">
            <buttonsheader id="buttons-container" v-bind:button1="text1" v-bind:button2="text2"></buttonsheader>
            <div class="row justify-content-center">
                <div class="col-xl-10 text-center">
                    <img id="img_ball" src="../assets/images/ball.png"/>  <!-- immagini che verrano nascoste da css e disegnate dentro il canvas da js -->
                    <img id="img_brick" src="../assets/images/brick.png"/>
                    <canvas id="breakout" width="800" height="600"></canvas>
                </div>
            </div>
        </div>
    </body>
</html>