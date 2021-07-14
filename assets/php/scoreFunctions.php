<?php
    function getScore($username, $table) { // funzione che preleva dalla tabella "table" il punteggio di "username"
        $query = "SELECT score FROM \"$table\" WHERE username = '$username';";
        $result = pg_query($query) or die("Query failed: " . pg_last_error());
        $line = pg_fetch_array($result, null, PGSQL_ASSOC);
        pg_free_result($result);
        return $line["score"] ?? "-"; // gestiamo caso in cui il risultato sia false a causa dell'assenza dell'utente nella tabella
    }
    
    // serve per prendere i migliori punteggi nei giochi
    function getRows($table, $order, $limit) {
        $query = "SELECT * FROM \"$table\" ORDER BY score $order LIMIT $limit";
        $result = pg_query($query) or die("Query failed: " . pg_last_error());
        return $result;
    }
?>