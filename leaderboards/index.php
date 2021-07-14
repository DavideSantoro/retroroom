<!DOCTYPE html>
<html>
<head>
    <title>RetroRoom - Top 5</title>
    <meta charset='utf-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <link rel="stylesheet" type="text/css" href='https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css'>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css">
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js"></script>
    <script type="text/javascript" src="../assets/javascript/vueTitle.js"></script>
    <script type="text/javascript" src="https://kit.fontawesome.com/f9afe9f463.js" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="leaderboards.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/baseStyle.css">
    <link rel="stylesheet" type="text/css" href="../assets/css/buttons.css">
</head>
<body>
    <mytitle id="title-container" v-bind:text="titleText"></mytitle>
    <div class="container">
        <div class="row pb-4 pt-3 justify-content-around">
            <div class="col-md-2 pb-2">
                <a href="../index.php" class="btn btn-lg">
                    <span class="fas fa-home"></span>
                    Home
                </a>
            </div>
            <?php 
                session_start();
                include "../assets/php/profileButton.php";
            ?>
        </div>
    </div>
    <div class="container">
        <?php
            include "../assets/php/scoreFunctions.php";
            function makeLeaderboard($table, $order, $unit) {
                $result = getRows($table, $order, "5");
                
                //intestazione classifiche
                echo "
                <div class='col-md'>
                    <div class='leaderboard'>
                        <h1>
                            <span class='fas fa-crown'></span>
                            $table top 5
                        </h1>
                        <ol>";

                while ($line = pg_fetch_array($result, null, PGSQL_ASSOC)) {
                    $userName=$line["username"];
                    $score=$line["score"];
                    echo "
                    <li>
                        <span class='user'>$userName</span>
                        <span class='score'>$score $unit</span>
                    </li>"; //righe classifiche
                }

                echo "
                </ol>
                </div>
                </div>";
                pg_free_result($result);
            }

            $dbconn = pg_connect("host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
                        or die("Could not connect: " . pg_last_error());
            echo "<div class='row justify-content-center align-self-center'>";
            makeLeaderboard("Snake","DESC", "Pts");
            makeLeaderboard("Tetris","DESC", "Pts");
            echo "</div>";
            echo "<div class='row justify-content-center align-self-center'>";
            makeLeaderboard("Pong","ASC", "s");
            makeLeaderboard("Breakout","DESC", "Pts");
            echo "</div>";
            pg_close($dbconn);
        ?>
    </div>
</body>
</html>