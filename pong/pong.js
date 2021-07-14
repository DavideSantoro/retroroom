const BALL_SIZE = 10; //dimensione palla
const PLAYER_WIDTH = 20; //larghezza piattaforme
const PLAYER_HEIGHT = 100; //altezza piattaforme
const NET_WIDTH = 2; //larghezza rete
const NET_HEIGHT = 10; //altezza rete
const BASE_VEL = 300; //velocita' base pallina
const VEL_LENGTH = 300; //lunghezza vettore velocita' della palla
const COMPUTER_LEVEL = 0.07; //regola il livello del giocatore comandato dal pc
const SCORE_LIMIT = 5; //punteggio a cui bisogna arrivare per terminare la partita

class Pong extends Game {
    constructor(canvas) {
        super(canvas);

        this.ball = new MovingSquare(canvas.width/2, canvas.height/2, BALL_SIZE);
        this.net = new Rect(canvas.width/2, 0, NET_WIDTH, NET_HEIGHT);
        this.players = [new Player(40, canvas.height/2, PLAYER_WIDTH, PLAYER_HEIGHT),
                        new Player(canvas.width-40, canvas.height/2, PLAYER_WIDTH, PLAYER_HEIGHT)];

        this.startTime; //tempo in cui l'utente inizia a giocare, serve per calcolare il punteggio da inserire in classifica alla fine

        this.gameLoop = new StandardGameLoop(this); //istanzia un oggetto che incapsula il game loop e poi lo chiama
        this.gameLoop.startLoop();
    }

    start() {
        if (this.ball.vel.x === 0 && this.ball.vel.y === 0) {
            if (typeof this.startTime === "undefined") this.startTime = new Date();
            this.ball.vel.x = BASE_VEL * (Math.random() > 0.5 ? 1 : -1); //destra o sinistra casuale
            this.ball.vel.y = BASE_VEL * (Math.random() * 2 - 1); //velocita' base * [-1,1]

            this.ball.vel.len = VEL_LENGTH; //normalizzo ad una velocità fissata, per evitare velocità diverse ad ogni start, causate dalla y randomizzata
        }
    }

    reset() {
        this.ball.pos.x = this.gameWidth/2;
        this.ball.pos.y = this.gameHeight/2;

        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }

    checkGameOver(playerId) { //controlla se si è raggiunto il punteggio limite, aggiorna highscore, resetta il gioco
        if (this.players[playerId].score == SCORE_LIMIT) { //qualcuno ha raggiunto il punteggio massimo
            if (playerId == 0) { //se ha vinto il giocatore salvo il nuovo eventuale highscore
                let elapsedTime = (new Date() - this.startTime) / 1000; //il punteggio ai fini delle classifiche e' dato dal tempo impiegato per vincere
                elapsedTime = Math.round(elapsedTime * 10) / 10; //arrotondo alla prima cifra decimale
                let best = computeHighscore(elapsedTime, "Pong", USERNAME);
                setTimeout(function() {
                    alert("You win!\nScore: " + elapsedTime + "s\nBest: " + best + "s");
                    window.location.reload(); // serve a far ricominciare la partita
                }, 200); // setto un delay per permettere al canvas della pagina di aggiornarsi prima, poi comparira' l'alert
            }
            else { //se ha vinto il pc ricarico il gioco
                setTimeout(function() {
                    alert("You lost!\nTry again"); 
                    window.location.reload();
                }, 200);
            }
        }
    }

    collide(player, ball) { //controlla collisione tra giocatore e palla, e rimanda la palla indietro
        if (player.left < ball.right && player.right > ball.left && player.top < ball.bottom && player.bottom > ball.top) {
            let oldLen = ball.vel.len;
            ball.vel.x = -ball.vel.x;
            ball.vel.y += BASE_VEL * (Math.random()/2 - 0.25); //la pallina rimbalza con direzione verticale variabile di al max +-75
            
            //rimetto la pos.x della palla ad una posizione valida, altrimenti avrei bug quando un player colpisce con il lato superiore e inferiore
            ball.pos.x = player.pos.x + (ball.vel.x < 0 ? (-(player.size.x/2) - (ball.size.x/2)) : (player.size.x/2 + ball.size.x/2));
            
            ball.vel.len = oldLen * 1.05; //uso la vecchia length altrimenti non aumenterebbe del 5% ma di piu
        }
    }

    drawRect(rect) { //funzione che disegna i singoli rettangoli
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.left, rect.top, rect.size.x, rect.size.y); //disegna a partire dall'angolo in alto a sinistra
    }

    drawScores(score, x, y) { //funzione che disegna i punteggi
        this.context.fillStyle = "#fff";
        this.context.font = "75px Premier";
        this.context.fillText(this.players[0].score, this.gameWidth/4, this.gameHeight/5);
        this.context.fillText(this.players[1].score, 3*this.gameWidth/4, this.gameHeight/5);
    }

    draw() { //funzione che esegue il rendering
        this.context.fillStyle = "#000";
        this.context.fillRect(0, 0, this.gameWidth, this.gameHeight); //disegno lo sfondo nero

        this.drawScores(); //disegno i punteggi

        for(let i=0; i<=this.gameHeight; i+=20) { //disegno la rete a intervalli regolari
            this.net.pos.y = i;
            this.drawRect(this.net);
        }
    
        this.drawRect(this.ball); //disegno la palla
        this.players.forEach(player => this.drawRect(player)); //disegno i giocatori
    }

    update(dt) { //movimenti, collision detection, aggiornamento punteggi
        this.ball.pos.x += dt * this.ball.vel.x;
        this.ball.pos.y += dt * this.ball.vel.y;

        if (this.ball.left < 0 || this.ball.right > this.gameWidth) {
            let playerId;
            if (this.ball.vel.x < 0) { playerId=1; }
            else { playerId=0; }
            this.players[playerId].score++;
            this.checkGameOver(playerId);
            this.reset();
        }
        if (this.ball.top < 0 || this.ball.bottom > this.gameHeight) this.ball.vel.y = -this.ball.vel.y;

        //muovo computer aggiungendo alla sua y la distanza che lo separa dalla y della palla, moltiplico per un fattore piccolo per renderlo battibile
        this.players[1].pos.y += (this.ball.pos.y - this.players[1].pos.y) * COMPUTER_LEVEL;

        this.players.forEach(player => this.collide(player, this.ball));
    }
}

$(document).ready(() => {
    const canvas = document.getElementById("pong");
    const pong = new Pong(canvas);
    
    $("#pong").click(() => pong.start());

    $("#pong").mousemove(function(event) {
        //poiche' da css espando il gioco in altezza, qui devo scalare la coordinata y del puntatore nel canvas per l'altezza totale del canvas a schermo
        let scale = event.offsetY / event.target.getBoundingClientRect().height;
        //dopodiche' uso tale scaling per determinare l'altezza giusta del puntatore nel canvas
        pong.players[0].pos.y = canvas.height * scale;
    });
});