const VELOCITY = 1; //rappresenta il numero di quadrati logici che il serpente percorre ad ogni aggiornamento della sua posizione
const UPDATE_SPEED = 7; // rappresenta quante volte al secondo aggiorniamo la posizione del serpente, piu e' alta piu il serpente andra' veloce
const INITIAL_TAIL_LENGTH = 2;
const NUMBER_OF_TILES = 20; // numero di celle logiche su ogni riga e colonna del canvas, serve per allineare sempre serpente e frutti
const INITIAL_X_APPLE = 5;
const INITIAL_Y_APPLE = 5;
const INITIAL_X_SNAKE = 10;
const INITIAL_Y_SNAKE = 10;

//nello snake il canvas e' visto come una griglia di quadrati logici mappati ai sottostanti pixel,
//per fare in modo che serpente e frutti siano sempre allineati. Si assume che il canvas sia quadrato.
class Snake extends Game {
    constructor(canvas) {
        super(canvas);
        this.snakeParts = []; // array che contiene le parti della coda del serpente
        this.tailLength = INITIAL_TAIL_LENGTH; // lunghezza della coda

        this.score = 0; // punteggio
        this.updateSpeed = UPDATE_SPEED; 
        this.tileCount = NUMBER_OF_TILES;
        
        let tileSize = this.gameWidth / this.tileCount - 2; // dimensione degli oggetti disegnati sul canvas
        this.apple = new Rect(INITIAL_X_APPLE, INITIAL_Y_APPLE, tileSize, tileSize); // mela che il serpente deve mangiare

        this.head = new MovingSquare(INITIAL_X_SNAKE, INITIAL_Y_SNAKE, tileSize) //testa del serpente

        this.gameLoop();
    }

    up() { // muove serpente su
        this.head.vel.y = -VELOCITY;
        this.head.vel.x = 0; 
    }

    down() { // muove serpente in basso
        this.head.vel.y = VELOCITY;
        this.head.vel.x = 0;
    }

    left() { // muove serpente verso sinistra
        this.head.vel.y = 0;
        this.head.vel.x = -VELOCITY;
    }

    right() { // muove serpente verso destra
        this.head.vel.y = 0;
        this.head.vel.x = VELOCITY;
    }

    // serve per verificare la collisione tra il serpente e la mela
    checkAppleCollision() {
        if (this.apple.pos.x === this.head.pos.x && this.apple.pos.y === this.head.pos.y) {
            this.apple.pos.x = Math.floor(Math.random() * this.tileCount);
            this.apple.pos.y = Math.floor(Math.random() * this.tileCount); // si sceglie randomicamente la prossima coordinata y della mela
            this.tailLength++; // si aumenta la lunghezza della coda
            this.score++; // si aumenta lo score
            this.updateSpeed += VELOCITY/5; // si aumenta la velocità del serpente di un quinto di quella iniziale
        }
    }

    // cambia la posizione del serpente
    changeSnakePosition() {
        this.head.pos.x += this.head.vel.x;
        this.head.pos.y += this.head.vel.y;
    }

    gameLoop() { //collision detection, aggiornamento posizioni e rendering
        this.changeSnakePosition();
        let result = this.isGameOver();
        // se la partita termina, viene visualizzato un alert con il proprio punteggio e con quello migliore
        if (result) {
            let best = computeHighscore(this.score, "Snake", USERNAME);
            alert("Game Over!\nScore: " + this.score + "\nBest: " + best);
            window.location.reload(); // serve a far ricominciare la partita
        }

        this.checkAppleCollision(); //controlla collisioni con eventuale mela

        this.context.fillStyle = 'black'; //copre il canvas
        this.context.fillRect(0, 0, this.gameWidth, this.gameHeight);

        this.drawApple();
        this.drawSnake();
        this.drawScore();
        setTimeout(() => this.gameLoop(), 1000/this.updateSpeed); // chiama la funzione draw dopo 1000/updateSpeed millisecondi
    }

    drawApple() {
        this.context.fillStyle = 'red'; // si sceglie il colore rosso
        this.context.fillRect(this.apple.pos.x * this.tileCount,
                            this.apple.pos.y * this.tileCount, 
                            this.apple.size.x, this.apple.size.y); // si disegna la mela
    }

    drawScore() {
        this.context.fillStyle = 'white';
        this.context.font = "15px arial";
        this.context.fillText("score " + this.score, this.gameWidth - 60, 15); // disegna lo score
    }

    drawSnake() {
        this.context.fillStyle = 'green';
        for(let i = 0; i < this.snakeParts.length; i++) { // disegniamo la coda del serpente
            let part = this.snakeParts[i];
            this.context.fillRect(part.pos.x * this.tileCount,
                                part.pos.y * this.tileCount,
                                part.size.x, part.size.y);
        }

        // aggiungo l'attuale testa, alla prossima chiamata della funzione verrà disegnata nella coda la testa dell'istante precedente
        this.snakeParts.push(new Rect(this.head.pos.x, this.head.pos.y, this.head.size.x, this.head.size.y));
        while (this.snakeParts.length > this.tailLength) this.snakeParts.shift(); // elimina le parti piu vecchie del serpente
        
        // la testa viene disegnata alla fine per fare in modo che venga visualizzata all'inizio del serpente
        this.context.fillStyle = 'orange';
        this.context.fillRect(this.head.pos.x * this.tileCount,
                            this.head.pos.y * this.tileCount,
                            this.head.size.x, this.head.size.y); // disegniamo la testa del serpente
    }

    isGameOver() { //controlla se il serpente si e' morso la coda o e' uscito dai bordi
        let gameOver = false;
        if (this.head.vel.x == 0 && this.head.vel.y == 0) return false; // significa che il gioco non è ancora iniziato
        if (this.head.pos.x < 0 || this.head.pos.x > this.tileCount-1 ||
            this.head.pos.y < 0 || this.head.pos.y > this.tileCount-1) {
            gameOver = true; // il serpente ha colpito il bordo
        }
        for (let i = 0; i < this.snakeParts.length; i++) {
            if (this.snakeParts[i].pos.x == this.head.pos.x && this.snakeParts[i].pos.y == this.head.pos.y) {
                gameOver = true; // il serpente ha colpito sé stesso
                break;
            }
        }
        return gameOver;
    }    

}

// per rendere possibile l'inserimento dello script nell'intestazione
$(document).ready(() => {
    var canvas = document.getElementById("snake"); // riferimento al canvas
    var snake = new Snake(canvas);
    
    // associa i pulsanti della tastiera ai movimenti del serpente
    $(document).keydown(function(event) {
        switch (event.key) {
            case 'ArrowUp':
                if (snake.head.vel.y > 0) return; // permettiamo il movimento in su solo se il serpente non si sta muovend0 in giu'
                snake.up();
                break;

            case 'ArrowDown':
                if (snake.head.vel.y < 0) return; // permettiamo il movimento in giù solo se il serpente non si sta muovendo in su
                snake.down();
                break;

            case 'ArrowRight':
                if (snake.head.vel.x < 0) return; // permettiamo il movimento a destra solo se il serpente non si sta muovendo verso sinistra
                snake.right();
                break;

            case 'ArrowLeft':
                if (snake.head.vel.x > 0) return; // permettiamo il movimento a sinistra solo se il serpente non si sta muovendo verso destra
                snake.left();
                break;
        }
    });
});



