const GET_HIGHSCORE_PATH = "/assets/php/getHighscore.php";
const SAVE_HIGHSCORE_PATH = "/assets/php/saveHighscore.php";

//piccola classe di base che incapsula gli elementi comuni a tutti i giochi
class Game {
    constructor(canvas) {
        this.context = canvas.getContext("2d");

        this.gameWidth = canvas.width; //larghezza canvas di gioco
        this.gameHeight = canvas.height; //altezza canvas di gioco
    }
}

//classe che incapsula un game loop tipico, utile per riuso del codice
class StandardGameLoop {
    constructor(game) {        
        this.callback = (millis) => { //requestAnimationFrame chiama la callback passandogli il tempo attuale in millisecondi
            if (this.lastTime) { //lastTime undefined all'inizio, quindi l'if valuta a false
                game.update((millis-this.lastTime)/1000);
                game.draw();
            }
            this.lastTime = millis;
            requestAnimationFrame(this.callback);
        }
    }

    startLoop() { this.callback(); } //millis undefined alla prima chiamata
}

// serve a recuperare l'highscore e salvare l'eventuale nuovo highscore, Pong vuole lo score minore anziche' il maggiore
function computeHighscore(score, tableName, username) {
    var saved;
    $.ajax({ /* chiamata ajax sincrona */
        async: false,
        type: "POST",
        data: {table: tableName, user: username},
        url: GET_HIGHSCORE_PATH,
        success: function(data) {
            if ($.isEmptyObject(data)) {
                if (tableName === "Pong") saved = Number.MAX_SAFE_INTEGER;
                else saved = 0;
            }
            else {
                if (tableName === "Pong") saved = parseFloat(data);
                else saved = parseInt(data);
            }
        }
    });
    if (tableName === "Pong") {
        if (score < saved) { // nuovo record dell'utente
            saved = score;
            $.post(SAVE_HIGHSCORE_PATH, {table: tableName, user: username, score: saved}); /* chiamata ajax asincrona */
        }
    }
    else {
        if (score > saved) { // nuovo record dell'utente
            saved = score;
            $.post(SAVE_HIGHSCORE_PATH, {table: tableName, user: username, score: saved});
        }
    }
    return saved;
}