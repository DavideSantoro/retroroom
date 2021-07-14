<?php
    session_start();
    $dbconn = pg_connect( "host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
            or die('Could not connect' . pg_last_error()) ;
    // redireziona l'utente se accede senza aver premuto il pulsante di registrazione
    if (!(isset($_POST ['registrationButton']))) {
        header("Location: ./index.php?form=registration") ;
    }
    else {
        $username = $_POST['inputUsername'] ;
        $email = $_POST['inputEmail'];
        $q1 = "SELECT * FROM utente WHERE username = $1";
        $q2 = "SELECT * FROM utente WHERE email = $1";
        $result1 = pg_query_params($dbconn, $q1, array($username));
        $result2 = pg_query_params($dbconn, $q2, array($email));
        // controlla che non esista già un utente con lo stesso nome
        if ($line = pg_fetch_array($result1, null, PGSQL_ASSOC)) {
            $_SESSION["error2"] = "Esiste già un utente con questo nome";
            header("Location: ./index.php?form=registration");
        }
        // controlla che non esista già un utente con la stessa email
        else if ($line = pg_fetch_array($result2, null, PGSQL_ASSOC)) {
            $_SESSION["error3"] = "Email già utilizzata";
            header("Location: ./index.php?form=registration");
        }
        else {
            $username = $_POST['inputUsername'] ;
            $email = $_POST['inputEmail'];
            $password = hash('sha256', $_POST['inputPassword']); // hash della password tramite la funzione sha256
            $q3 = "insert into utente values($1, $2, $3)";
            $data = pg_query_params($dbconn, $q3, array($username, $email, $password)) ;
            if($data) {
                $_SESSION["success"] = "Registrazione effettuata con successo.<br/>Ora puoi loggarti.";
                header("Location: ./index.php?form=login");
            }
            else {
                $_SESSION["error4"] = "Registrazione fallita";
                header("Location: ./index.php?form=registration");
            }
        }
        pg_free_result($result);
    }
    pg_close($dbconn);
?>
