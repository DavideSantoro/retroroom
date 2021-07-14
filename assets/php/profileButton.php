<?php
    if (isset($_SESSION["username"])) {
        // tasto che punta alla pagina del profilo
        echo "
        <div class='col-md-2 pb-2'>
            <a href='../profile/index.php' class='btn btn-lg'>
                <span class='fas fa-user'></span>
                Profilo
            </a>
        </div>";
    }
    else {
        // tasto che punta alla pagina di login
        echo "
        <div class='col-md-2 pb-2'>
            <a href='../login/index.php' class='btn btn-lg'>
                <span class='fas fa-sign-in-alt'></span>
                Login
            </a>
        </div>";
    }
?>