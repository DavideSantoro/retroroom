<?php
	session_start();
	$dbconn = pg_connect("host=localhost port=5432 dbname=retroroom user=postgres password=Santoro$7699")
				or die('Could not connect: ' . pg_last_error());
	// si controlla se il bottone sia stato o meno premuto andando a verificare l'esistenza di loginButton
	if(!(isset($_POST['loginButton']))) {
		header("Location: ./index.php?form=login") ; // se l'utente tenta di accedere a login.php senza aver premuto il pulsante di login viene reindirizzato
	}
	else {
		$username = $_POST['inputUsername']; // array di variabili passate allo script php corrente tramite metodo POST
		$q1 = "SELECT * FROM utente WHERE username=$1";
		$result = pg_query_params($dbconn, $q1, array($username)); // la variabile contenuta nell'array viene associata a $1
		// l'if si attiva se il primo risultato nell'array non esiste
		if(!($line = pg_fetch_array($result, null, PGSQL_ASSOC))) { // null serve per prendere la riga successiva, pgsql_assoc serve per indicare che si usa un array associativo
			$_SESSION["error1"] = "Username inesistente";
			header("Location: ./index.php?form=login");
		}
		else {
			$password = hash('sha256', $_POST['inputPassword']); // appplichiamo sha256 sulla password
			$q2= "SELECT * FROM utente WHERE username=$1 and password=$2";
			$result= pg_query_params($dbconn, $q2, array($username, $password));
			if (!($line=pg_fetch_array($result, null, PGSQL_ASSOC))) {
				$_SESSION["error1"] = "La password è errata";
				header("Location: ./index.php?form=login");
			}
			else {
				$_SESSION["username"] = $username;
				header("Location: ../index.php");
			}
		}
		pg_free_result($result);
	}
	pg_close($dbconn);
?>

