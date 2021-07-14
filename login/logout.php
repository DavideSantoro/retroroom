<?php
    // rimuove l'username dalla sessione e redireziona l'utente
    session_start();
    unset($_SESSION["username"]);
    header("Location: ../index.php");
?>