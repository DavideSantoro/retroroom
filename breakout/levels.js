//file che crea i livelli per il gioco breakout
const BRICK_WIDTH = 80;
const BRICK_HEIGHT = 24;

//in ogni matrice 1 rappresenta la presenza di mattoncino, 0 l'assenza
const level1 = [
    [0, 1, 1, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const level2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

const level3 = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function buildLevel(level) { //istanzia l'array di mattoncini che formano il livello
    let bricks = [];

    level.forEach((row, rowIndex) => {
        row.forEach((brick, brickIndex) => {
            if (brick == 1) {
                //posiziono il centro dei mattoncini calcolando l'offset a partire da sinistra e dall'alto
                let positionX = BRICK_WIDTH/2 + (BRICK_WIDTH * brickIndex);
                let positionY = 60 + BRICK_HEIGHT/2 + (BRICK_HEIGHT * rowIndex);
                bricks.push(new Brick(positionX, positionY, BRICK_WIDTH, BRICK_HEIGHT, "img_brick"));
            }
        });
    });

    return bricks;
}