<?php
    include "./scoreFunctions.php";
    if (!isset($_POST["table"])) header("Location: ../../index.php"); // reindirizziamo se l'utente sta accedendo alla pagina tramite url
    if (!isset($_POST["user"])) header("Location: ../../index.php");
    $table = $_POST["table"];
    $user = $_POST["user"];
    $dbconn = pg_connect("host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
                or die("Could not connect: " . pg_last_error());
    $score = getScore($user,$table); // get dello score dell'utente per la tabella corrispondente al gioco
    if ($score === "-") echo ""; // serve per gestire lo score inesistente dell'utente per una tabella
    else echo "$score";
    pg_close($dbconn);
?>