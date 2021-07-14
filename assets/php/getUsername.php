<?php
    session_start();
    if (isset($_SESSION["username"])) {
        $username = $_SESSION["username"]; // recupera l'username dall'array session
        echo "
        <script type='text/javascript'>
            const USERNAME = '$username';
        </script>";
    }
    else header("Location: ../login/index.php"); // se l'username non è settato l'utente viene redirezionato alla pagina di login
?>