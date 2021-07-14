const DROP_INTERVAL = 1000 // determina ogni quanti ms il tetramino scende automaticamente di una casella
const SCALING_FACTOR = 20; // rendiamo ogni pixel fisico 20 volte piu' grande a livello logico
const POINTS_PER_ROW = 10; // punti assegnati per ogni riga riempita dai tetramini
const COLORS = [ // array in cui ogni colore è associato ad un tetramino diverso
    null,
    '#FF0D72',
    '#0DC2FF',
    '#0DFF72',
    '#F538FF',
    '#FF8E0D',
    '#FFE138',
    '#3877FF',
];
const TETROMINOS = { // ogni matrice rappresenta un tetramino diverso
                    // ogni numero i dentro le matrici indica il colore corrispondente in COLORS[i]
    I: [[0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0],
        [0, 5, 0, 0]],

    L: [[0, 3, 0],
        [0, 3, 0],
        [0, 3, 3]],
    
    J: [[0, 4, 0],
        [0, 4, 0],
        [4, 4, 0]],

    O: [[2, 2],
        [2, 2]],

    T: [[0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]],

    S: [[0, 6, 6],
        [6, 6, 0],
        [0, 0, 0]],

    Z: [[7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]],
}

class Tetris extends Game {
    constructor(canvas) {
        super(canvas);

        this.arena = this.createMatrix(this.gameWidth/SCALING_FACTOR, this.gameHeight/SCALING_FACTOR); // matrice che rappresenta il campo da gioco
        this.context.scale(SCALING_FACTOR, SCALING_FACTOR); // scaliamo ogni pixel sul canvas
        
        // oggetto che incapsula offset e matrice corrispondente al tetramino
        this.player = new TetrisPlayer(0, 0);
        this.playerReset();
        this.updateScore();

        let dropInterval = DROP_INTERVAL; // valore soglia
        let dropCounter = 0; // contatore di millisecondi
        let lastTime = 0;
        const callback = (millis = 0) => { // requestAnimationFrame chiama la callback passandogli il tempo attuale in millisecondi
            dropCounter += millis - lastTime;
            lastTime = millis;
            if (dropCounter > dropInterval) {
                this.playerDrop(); // se il contatore supera la soglia
                dropCounter = 0; // si resetta il contatore
            }
            this.draw();
            requestAnimationFrame(callback);
        }
        callback();
    }        
    

    // gestisce il riempimento di una riga facendo scalare di 1 tutto verso il basso
    arenaSweep() {
        let rowCount = 1;
        outer: for (let y = this.arena.length - 1; y > 0; --y) {
            for (let x = 0; x < this.arena[y].length; x++) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            // questa parte di codice viene raggiunta solo se c'è una riga con tutti 1
            // y indica l'indice a partire dal quale si vuole iniziare a cambiare l'array, 1 indica il numero di elementi da rimuovere
            const row = this.arena.splice(y, 1)[0].fill(0);
            this.arena.unshift(row); // inserisce una riga di zeri all'inizio dell'array
            y++; // essendo scalato tutto di 1 in basso devo incrementare la y per considerare la riga giusta
            this.player.score += rowCount * POINTS_PER_ROW; // aumentiamo lo score
            rowCount *= 2; // raddoppiamo il contatore
        }
    }

    collide(arena, player) {
        const [m, o] = [player.matrix, player.pos]; // unpacking dell'oggetto player
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                        (arena[y + o.y] && 
                         arena[y + o.y][x + o.x]) !== 0) { // controlliamo che la riga esista e che la cella sia diversa da 0. undefined && 0 oppure 1 vale sempre undefined
                    // non basta solo il secondo controllo perché undefined[qualcosa] dà errore
                    return true;
                }
            }
        }
        return false; // non ci sono state collisioni
    }

    // crea una matrice di 0 con w colonne e h righe
    createMatrix(w, h) {
        const matrix = [];
        while (h--) matrix.push(new Array(w).fill(0));
        return matrix;
    }

    // crea un tetramino di tipo type
    createPiece(type) {
        switch(type) {
            case 'I':
                return TETROMINOS.I;

            case 'L':
                return TETROMINOS.L;
            
            case 'J':
                return TETROMINOS.J;
            
            case 'O':
                return TETROMINOS.O;

            case 'T':
                return TETROMINOS.T;
            
            case 'S':
                return TETROMINOS.S;
            
            case 'Z':
                return TETROMINOS.Z;
        }
    }

    draw() {
        this.context.fillStyle = '#000'; // impostiamo il colore nero come sfondo
        this.context.fillRect(0, 0, this.gameWidth, this.gameHeight); // disegniamo un rettangolo che parte da (0,0), largo canvas.width e alto canvas.height
        
        this.drawMatrix(this.arena, {x: 0, y: 0}); // disegniamo i tetramini che corrispondono alle posizioni occupate nell'arena
        this.drawMatrix(this.player.matrix, this.player.pos); // disegniamo il tetramino corrente
    }

    // scorre le matrici e disegna tetramini nelle posizioni corrispondenti agli 1
    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = COLORS[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    // effettua il merge tra il contenuto della matrice corrispondente al tetramino e quello dell'arena
    merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    playerDrop() { // sposta in basso il tetramino e controlla collisioni
        this.player.pos.y++;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.y--; // per non andare fuori dall'arena
            this.merge(this.arena, this.player);
            this.playerReset();
            this.arenaSweep();
            this.updateScore();
        }
    }

    // gestise il movimento del tetramino
    playerMove(dir) {
        this.player.pos.x += dir;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.x -= dir; // se c'è una collisione si diminuisce l'offset
        }
    }

    // sceglie casualmente il tipo del tetramino
    playerReset() {
        const pieces = 'ILJOTSZ'; // ogni carattere un tipo di tetramino
        this.player.matrix = this.createPiece(pieces[pieces.length * Math.random() | 0]); // | 0 arrotonda all'intero più vicino
        this.player.pos.y = 0; // resetta l'offset a 0
        this.player.pos.x = (this.arena[0].length / 2 | 0) - (this.player.matrix[0].length / 2 | 0); // per posizionare al centro il prossimo pezzo
        // ricomincia da capo se la partita è finita
        if (this.collide(this.arena, this.player)) {
            var best = computeHighscore(this.player.score, "Tetris", USERNAME); 
            alert("Game Over!\nScore: " + this.player.score + "\nBest: " + best);
            this.arena.forEach(row => row.fill(0));
            this.player.score = 0;
            this.updateScore();
        }
    }

    playerRotate(dir) { // forza la posizione del tetramino se ruotando esce dall'arena
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        // se facendo una rotazione si verifica una collisione allora si entra nel while
        while (this.collide(this.arena, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1)); // serve a spostarsi a destra e a sinistra incrementalmente fino a quando non c'è spazio per effettuare la rotazione
            if (offset > this.player.matrix[0].length) { // se l'offset ha superato il numero di colonne significa che non c'è spazio per la rotazione
                this.rotate(this.player.matrix, -dir); // quindi si ruota al contrario per far rimanere il mattoncino nella stessa posizione
                this.player.pos.x = pos; // e si imposta l'offset di partenza
                return; 
            }
        }
    }

    // effettua la vera rotazione di una matrice
    rotate(matrix, dir) {
            for (let y = 0; y < matrix.length; ++y)
                for (let x = 0; x < y; ++x) {
                    [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]]; // matrice trasposta
                }
            if (dir > 0) matrix.forEach(row => row.reverse()); // inverte le colonne se dir è positiva
            else matrix.reverse(); // altrimenti inverte le righe
    }

    updateScore() { $("#score").text(this.player.score); }
}


$(document).ready(() => {
    canvas = document.getElementById("tetris"); // riferimento al canvas
    var tetris = new Tetris(canvas);
    
    // associa i pulsanti della tastiera ai movimenti dei tetramini
    $(document).keydown(function(event) {
        switch(event.key) {
            case 'ArrowLeft':
                tetris.playerMove(-1);
                break;
            
            case 'ArrowRight':
                tetris.playerMove(1);
                break;
            
            case 'ArrowDown':
                tetris.playerDrop();
                break;
            
            case 'q':
                tetris.playerRotate(-1);
                break;
            
            case 'w':
                tetris.playerRotate(1);
                break;
        }
    });
});
