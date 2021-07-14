<!DOCTYPE html>
<html>
    <head>
        <title>RetroRoom - Tetris</title>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
        <?php include "../assets/php/getUsername.php"; ?>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script> <!-- import jquery -->
        <script type="text/javascript" src="../assets/javascript/geometries.js"></script>
        <script type="text/javascript" src="../assets/javascript/gameFramework.js"></script>
        <script type="text/javascript" src="tetris.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script> <!-- import vue -->
        <script type="text/javascript" src="../assets/javascript/vueGameButtons.js"></script>
        <script type="text/javascript" src="../assets/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="https://kit.fontawesome.com/f9afe9f463.js" crossorigin="anonymous"></script> <!-- import per le icone -->
        <link rel="stylesheet" type="text/css" href="../assets/bootstrap/css/bootstrap.min.css"/> <!-- import bootstrap -->
        <link rel="stylesheet" type="text/css" href="../assets/css/games.css"/>
        <link rel="stylesheet" type="text/css" href="tetris.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/buttons.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/baseStyle.css"/>
    </head>
    <body>
        <div class="container">
            <!-- tasti per accedere alla home e alla top-5 -->
            <buttonsheader id="buttons-container" v-bind:button1="text1" v-bind:button2="text2"></buttonsheader>
            <div class="row justify-content-center">
                <div class="col pb-2 text-center">
                    <div class="display-6" id="score"></div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-xl-10 text-center">
                    <!-- canvas per il gioco tetris -->
                    <canvas id="tetris" width="240" height="400"></canvas> <!-- matrice di pixel -->
                </div>
            </div>
        </div>
    </body>
</html>