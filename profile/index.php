<!DOCTYPE html>
<html>
    <head>
        <title>RetroRoom - Profilo</title> 
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" type="text/css" href="../assets/bootstrap/css/bootstrap.min.css"/>
        <script type="text/javascript" src="../assets/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
        <script type="text/javascript" src="../assets/javascript/vueTitle.js"></script>
        <script type="text/javascript" src="https://kit.fontawesome.com/f9afe9f463.js" crossorigin="anonymous"></script>
        <link rel="stylesheet" type="text/css" href="../assets/css/baseStyle.css"/>
        <link rel="stylesheet" type="text/css" href="../assets/css/buttons.css"/>
        <link rel="stylesheet" type="text/css" href="profile.css">
    </head>
    <body>
        <!-- titolo che scorre da destra a sinistra -->
        <mytitle id="title-container" v-bind:text="titleText"></mytitle>
        <?php
            include "../assets/php/scoreFunctions.php";
            session_start();
            // funzione che serve per prendere la medaglia associata al gioco
            function getMedal($table, $order) {
                $result = getRows($table, $order, "3");
                $medal = "none";
                $position = 0;
                $count = 1;
                while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                    $user = $line["username"];
                    if ($user === $_SESSION["username"]) {
                        $position = $count;
                        break;
                    }
                    $count++;
                }
                pg_free_result($result);
                switch ($position) {
                case 1:
                    $medal = "gold";
                    break;
        
                case 2:
                    $medal = "silver";
                    break;
        
                case 3:
                    $medal = "bronze";
                    break;
                }
                return $medal;
            }
            if (!isset($_SESSION["username"])) header("Location: ../login/index.php");
            
            $username = $_SESSION["username"];
            $dbconn = pg_connect("host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
                        or die("Could not connect: " . pg_last_error());
            $queryEmail = "SELECT email FROM \"utente\" where username = '$username';";
            $resultEmail = pg_query($queryEmail) or die("Query failed: " . pg_last_error());
            $line = pg_fetch_array($resultEmail, null, PGSQL_ASSOC);
            $email = $line["email"];
            pg_free_result($resultEmail);
            // best scores dell'utente per ogni gioco
            $bestSnake = getScore($username,"Snake");
            $bestTetris = getScore($username,"Tetris");
            $bestPong = getScore($username,"Pong");
            $bestBreakout = getScore($username,"Breakout");
            // medaglie dell'utente per ogni gioco
            $medalSnake = getMedal("Snake","DESC");
            $medalPong = getMedal("Pong","ASC");
            $medalBreakout = getMedal("Breakout","DESC");
            $medalTetris = getMedal("Tetris","DESC");
            // contenuto html della pagina contenente pulsanti, best scores e medagliere
            echo "
            <div class='container'>
                <div class='row pt-3 justify-content-around'>
                    <div class='col-md-2 pb-2'>
                        <a href='../index.php' class='btn btn-lg'>
                        <span class='fas fa-home'></span>
                            Home
                        </a>
                    </div>
                    <div class='col-md-2 pb-2'>
                        <a href='../login/logout.php' class='btn btn-lg'>
                            <span class='fas fa-sign-out-alt'></span>
                            Logout
                        </a>
                    </div>
                </div>
            </div>
            <div class='container mt-5 d-flex justify-content-center'>
                <div class='card p-5'>
                    <h2 class='h2 text'>Profilo utente</h1>
                    <div class='row align-items-center'>
                        <div class='col-lg-4'> 
                            <img src='../assets/images/profile.jpeg' class='rounded img-fluid'> 
                        </div>
                        <div class='col m-1 h-100'>
                            <h3 class='text'>$username</h3> 
                            <span class='text'>Email: $email</span>
                            <div class='pt-2 text'>I tuoi punteggi migliori:</div>
                            <div class='row p-3 mt-2 rounded stats justify-content-around'>
                                <div class='col-2 little-box d-flex flex-column text-center'>
                                    <span class='game'>Tetris</span>
                                    <span class='number'>$bestTetris</span>
                                </div>
                                <div class='col-2 little-box d-flex flex-column text-center'>
                                    <span class='game'>Pong</span> " .
                                    (($bestPong === '-') ? "<span class='number'>$bestPong</span>" :
                                    "<span class='number'>$bestPong s</span>") .
                                "</div>
                                <div class='col-2 little-box d-flex flex-column text-center'>
                                    <span class='game'>Snake</span>
                                    <span class='number'>$bestSnake</span>
                                </div>
                                <div class='col-2 little-box d-flex flex-column text-center'>
                                    <span class='game'>Breakout</span>
                                    <span class='number'>$bestBreakout</span>
                                </div>
                            </div>
                            <div class='pt-2 text'>Medagliere:</div>
                            <div class='row p-3 mt-2 rounded stats justify-content-around'>
                                <div class='col-2 little-box text-center'>
                                    <span class='fas fa-medal fa-3x $medalTetris'></span>" .
                                    (($medalTetris === 'none') ? "" : "<div class='shine'></div>") .
                                "</div>
                                <div class='col-2 little-box text-center'>
                                    <span class='fas fa-medal fa-3x $medalPong'></span>" .
                                    (($medalPong === 'none') ? "" : "<div class='shine'></div>") .
                                "</div>
                                <div class='col-2 little-box text-center'>
                                    <span class='fas fa-medal fa-3x $medalSnake'></span>" .
                                    (($medalSnake === 'none') ? "" : "<div class='shine'></div>") . 
                                "</div>
                                <div class='col-2 little-box text-center'>
                                    <span class='fas fa-medal fa-3x $medalBreakout'></span>" .
                                    (($medalBreakout === 'none') ? "" : "<div class='shine'></div>") .
                                "</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>";
            pg_close($dbconn);
        ?>
    </body>
</html>