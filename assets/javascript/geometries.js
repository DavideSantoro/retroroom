class Vec {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    get len() { //teorema di pitagora per ottenere la lunghezza del vettore
        return Math.sqrt(this.x*this.x + this.y*this.y);
    }

    set len(value) { //setto la lunghezza del vettore in modo da stabilire una relazione tra x e y
        let factor = value/this.len;
        this.x *= factor;
        this.y *= factor;
    }
}

class Rect {
    constructor(x, y, width, height) {
        this.pos = new Vec(x, y); //posizione del centro del rettangolo
        this.size = new Vec(width, height);
    }

    get left() { //estremo sinistro
        return this.pos.x - this.size.x/2;
    }

    get right() { //estremo destro
        return this.pos.x + this.size.x/2;
    }
    
    get top() { //estremo superiore
        return this.pos.y - this.size.y/2;
    }
    
    get bottom() { //estremo inferiore
        return this.pos.y + this.size.y/2;
    }
}

//un quadrato con una velocita'
class MovingSquare extends Rect {
    constructor(x, y, size) {
        super(x, y, size, size);
        this.vel = new Vec();
    }
}

class BallWithImg extends MovingSquare {
    constructor(size, id_img) {
        super(0, 0, size);
        this.image = document.getElementById(id_img);
    }
}

class Brick extends Rect {
    constructor(x, y, width, height, id_img) {
        super(x, y, width, height);
        this.image = document.getElementById(id_img);

        this.markedForDeletion = false;
    }
}

class Player extends Rect {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.score = 0;
    }
}

class TetrisPlayer extends Player {
    constructor(x, y) {
        super(x, y, 0, 0);
        this.matrix = null; // rappresenta il tetramino che sta scendendo attualmente
    }
}

class Paddle extends Player {
    static MAX_VELOCITY = 290;

    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.vel = new Vec();
    }

    moveLeft() {
        this.vel.x = -Paddle.MAX_VELOCITY;
    }

    moveRight() {
        this.vel.x = Paddle.MAX_VELOCITY;
    }

    stop() {
        this.vel = new Vec();
    }
}

