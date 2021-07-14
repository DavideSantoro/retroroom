const BASE_VEL = 220; //velocita' base palla
const BALL_SIZE = 13; //dimensione palla
const BALL_INIT_X = 14; //posizione x iniziale palla
const BALL_INIT_Y = 220; //posizione y iniziale palla
const PADDLE_WIDTH = 120; //larghezza paddle
const PADDLE_HEIGHT = 20; //altezza paddle
const PADDLE_DISTANCE_FROM_BOTTOM = 15; //distanza paddle dal fondo del canvas

const GAMESTATE = {
    RUNNING: 0,
    MENU: 1,
    GAMEOVER: 2,
    NEWLEVEL: 3,
    COMPLETED: 4
};

class Breakout extends Game {
    constructor(canvas) {
        super(canvas);

        this.gamestate = GAMESTATE.MENU;
        this.ball = new BallWithImg(BALL_SIZE, "img_ball");
        this.paddle = new Paddle(this.gameWidth/2,
                                 this.gameHeight - PADDLE_DISTANCE_FROM_BOTTOM - PADDLE_HEIGHT/2,
                                 PADDLE_WIDTH,
                                 PADDLE_HEIGHT);

        this.lives = 3;
        this.bricks = [];

        this.levels = [level1, level2, level3];
        this.currentLevel = 0;

        this.gameLoop = new StandardGameLoop(this); //istanzia un oggetto che incapsula il game loop e poi lo chiama
        this.gameLoop.startLoop();
    }

    resetPositions() {
        this.ball.pos = new Vec(BALL_INIT_X, BALL_INIT_Y); //posizione iniziale palla
        //aggiungo randomicita' alla velocita' della palla, altrimenti farebbe sempre lo stesso percorso
        this.ball.vel = new Vec(BASE_VEL + (130 * Math.random()), BASE_VEL + (130 * Math.random()));
        this.paddle.pos = new Vec(this.gameWidth/2, this.gameHeight - PADDLE_DISTANCE_FROM_BOTTOM - PADDLE_HEIGHT/2);
    }

    startLevel() { //costruisce il livello e setta lo stato del gioco
        if (this.gamestate == GAMESTATE.RUNNING || this.gamestate == GAMESTATE.COMPLETED) return;
        
        if (this.gamestate == GAMESTATE.GAMEOVER) { //se ero in stato gameover allora devo resettare le vite, il livello e il punteggio
            this.lives = 3;
            this.paddle.score = 0;
            this.currentLevel = 0;
        }

        this.bricks = buildLevel(this.levels[this.currentLevel]); //costruisci i mattoncini che compongono quel livello
        this.resetPositions(); //riporta gli oggetti alle posizioni iniziali

        this.gamestate = GAMESTATE.RUNNING;
    }

    collide(ball, gameObject) { //controlla collisioni tra palla e oggetto di gioco
        if (ball.pos.y > gameObject.top && ball.pos.y <= gameObject.bottom &&
            ball.pos.x > gameObject.left && ball.pos.x <= gameObject.right) return true;
        else return false;
    }

    //funzione ausiliaria che disegna lo schermo nero in caso di gameover, menu e gioco completato
    drawGameStopped(string) {
        this.context.rect(0, 0, this.gameWidth, this.gameHeight); //crea un rettangolo nel contesto ma non lo renderizza
        this.context.fillStyle = "black";
        this.context.fill(); //renderizza il rettangolo a schermo

        this.context.font = "30px Arial"; //specifico stile da usare per disegnare testo
        this.context.fillStyle = "white";
        this.context.textAlign = "center"; //specifico allineamento da usare per disegnare testo
        this.context.fillText(string, this.gameWidth/2, this.gameHeight/2);
    }

    //funzione ausiliaria che disegna punteggio e vite rimaste
    drawLivesAndScore() {
        this.context.fillStyle = "white";
        this.context.font = "20px Arial"; //specifico stile da usare per disegnare testo
        this.context.textAlign = "start"; //specifico allineamento da usare per disegnare testo
        this.context.fillText("Lives: "+this.lives, this.gameWidth-80, 20); //scrive numero di vite in alto a dx
        this.context.fillText("Score: "+this.paddle.score, 10, 20); //scrive punteggio in alto a sx
    }

    drawImage(object) { //funzione ausiliaria che disegna un'immagine
        this.context.drawImage(object.image, object.left, object.top, object.size.x, object.size.y);
    }

    draw() { //disegna tutti gli oggetti a schermo
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.gameWidth, this.gameHeight); //disegno lo sfondo bianco sopra tutto ciò che c'era prima

        this.context.fillStyle = "#0ff";
        this.context.fillRect(this.paddle.left, this.paddle.top, this.paddle.size.x, this.paddle.size.y); //disegna il paddle

        this.drawImage(this.ball); //disegna la palla
        this.bricks.forEach(brick => this.drawImage(brick)); //disegna i mattoncini
        
        this.drawLivesAndScore(); //disegna vite e punteggo

        switch (this.gamestate) { //disegna schermata pre/post partita
            case GAMESTATE.MENU:
                this.drawGameStopped("Press SPACEBAR to start.");
                break;

            case GAMESTATE.GAMEOVER:
                this.drawGameStopped("GAME OVER. Press SPACEBAR to restart.");
                break;
            
            case GAMESTATE.COMPLETED:
                this.drawGameStopped("Good job! Game completed.");
                break;
        }
    }
    
    updateBall(dt) { //sposta la posizione della palla e controlla se ci sono collisioni con i muri e con il paddle
        this.ball.pos.x += dt * this.ball.vel.x;
        this.ball.pos.y += dt * this.ball.vel.y;

        //muro a destra o sinistra
        if (this.ball.right > this.gameWidth || this.ball.left < 0) this.ball.vel.x = -this.ball.vel.x;
        //muro sopra
        if (this.ball.top < 0) this.ball.vel.y = -this.ball.vel.y;
        //muro sotto
        if (this.ball.bottom > this.gameHeight) {
            this.lives--;
            this.resetPositions();
        }

        //collisione con paddle
        if (this.collide(this.ball, this.paddle)) {
            this.ball.vel.y = -this.ball.vel.y;
            this.ball.pos.y = this.paddle.top - this.ball.size.y/2;
        }
    }

    updatePaddle(dt) { //muove il paddle e controlla la collisione con i bordi del canvas
        this.paddle.pos.x += dt * this.paddle.vel.x;

        if (this.paddle.left < 0) this.paddle.pos.x = this.paddle.size.x/2;
        if (this.paddle.right > this.gameWidth) this.paddle.pos.x = this.gameWidth - this.paddle.size.x/2;
    }

    updateBrick(brick) { //controlla se il mattoncino è stato colpito, in tal caso lo rimuove e respinge la palla
        if (this.collide(this.ball, brick)) {
            this.ball.vel.y = -this.ball.vel.y;
            if (this.ball.vel.y < 0) this.ball.pos.y = brick.top - this.ball.size.y/2;
            else this.ball.pos.y = brick.bottom + this.ball.size.y/2;
            brick.markedForDeletion = true;
            this.paddle.score += 50;
        }
    }

    update(deltaTime) { //aggiorna stato del gioco e chiama update di tutti gli oggetti
        if (this.gamestate == GAMESTATE.MENU || 
            this.gamestate == GAMESTATE.GAMEOVER ||
            this.gamestate == GAMESTATE.COMPLETED) return;
        
        if (this.lives == 0) { /* significa che ho appena perso */
            this.gamestate = GAMESTATE.GAMEOVER;
            let best = computeHighscore(this.paddle.score, "Breakout", USERNAME);
            alert("Game Over!\nScore: " + this.paddle.score + "\nBest: " + best);
            return;
        }

        if (this.bricks.length == 0) { //se ho completato il livello eliminando tutti i mattoncini
            this.currentLevel++;
            if (this.currentLevel >= this.levels.length) { //se era l'ultimo livello allora ho finito il gioco
                this.gamestate = GAMESTATE.COMPLETED;
            }
            else this.gamestate = GAMESTATE.NEWLEVEL;
            this.startLevel();
        }

        this.updateBall(deltaTime); //update della palla
        this.updatePaddle(deltaTime); //update del paddle
        this.bricks.forEach(brick => this.updateBrick(brick)); //update dei mattoncini

        this.bricks = this.bricks.filter(brick => !brick.markedForDeletion); //tolgo i mattoni eliminati
    }
}

$(document).ready(() => {
    var canvas = document.getElementById("breakout");

    //inizializza il gioco
    var breakout = new Breakout(canvas);

    //gestiamo la pressione delle frecce sx/dx
    $(document).keydown(function(e) {
        switch(e.key) {
            case "ArrowLeft":
                breakout.paddle.moveLeft();
                break;

            case "ArrowRight":
                breakout.paddle.moveRight();
                break;

            case " ":
                breakout.startLevel();
                break;
        }
    });

    //gestiamo il rilascio delle frecce sx/dx
    $(document).keyup(function(e) {
        switch(e.key) {
            case "ArrowLeft":
                //per prevenire un piccolo bug quando tengo premute entrambe le frecce
                //mi fermo solo se sollevo la freccia relativa alla direzione in cui mi sto muovendo
                if (breakout.paddle.vel.x < 0) breakout.paddle.stop();
                break;

            case "ArrowRight":
                if (breakout.paddle.vel.x > 0) breakout.paddle.stop();
                break;
        }
    });
});