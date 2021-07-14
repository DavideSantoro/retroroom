<?php
    if (!isset($_POST["table"])) header("Location: ../../index.php"); // reindirizziamo se l'utente sta accedendo alla pagina tramite url
    if (!isset($_POST["user"])) header("Location: ../../index.php");
    if (!isset($_POST["score"])) header("Location: ../../index.php");
    $table = $_POST["table"];
    $user = $_POST["user"];
    $score = $_POST["score"];
    $dbconn = pg_connect("host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
                or die("Could not connect: " . pg_last_error());
    // inserisce nella tabella il punteggio dell'utente o lo aggiorna nel caso in cui esisteva già
    $query = "INSERT INTO \"$table\"(username, score) 
                VALUES ('$user', $score)
                ON CONFLICT (username) DO UPDATE 
                    SET score = $score;"; //upsert, update or insert
    pg_query($query) or die("Query failed: " . pg_last_error());
    pg_close($dbconn);
?>