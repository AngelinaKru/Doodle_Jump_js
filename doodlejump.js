// Board
let board;
// Demensions of the backgroung picture 
let boardWidth = 360;
let boardHeight = 576;
let context;

// Player/Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
//position of the doodler
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img: null,
    x: doodlerX,
    y: doodlerY,
    width: doodlerWidth,
    height: doodlerHeight
}

// Physics
let velocityX = 0;
let velocityY = 0; // Doodler jump velocity
let initialVelocityY = -8; // Initial jump velocity
let gravity = 0.3;


// Platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

// Load the game
window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d"); // Used for drawing on the board

    // Load doodler images
    doodlerRightImg = new Image();
    doodlerRightImg.src = "doodler-right.png";
    doodler.img = doodlerRightImg;
    //To run a JavaScript function when an image is loaded
    doodlerRightImg.onload = function () {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
        
    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "doodler-left.png";

    // Load platform image
    platformImg = new Image();
    platformImg.src = "platform.png";

    velocityY = initialVelocityY; // Set initial jump velocity

    // Create platforms
    PlacePlatforms();

    //Game needs a loop to run continuously to update the game state
    requestAnimationFrame(Update);
    document.addEventListener("keydown", moveDoodler);
    }
}

function Update() {
    requestAnimationFrame(Update);
    // Clear the board
    context.clearRect(0, 0, board.width, board.height);

    // We are going to draw and draw doodler over and over again
    doodler.x += velocityX;  // Move player
    if (doodler.x > boardWidth) { // If player goes off the right side of the board
        doodler.x = 0; // Move player to the left side of the board
    } else if (doodler.x + doodler.width < 0) { // If player goes off the left side of the board
        doodler.x = boardWidth; // Move player to the right side of the board
    }

    velocityY += gravity; // Apply gravity
    doodler.y += velocityY; // Move player
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
}

function PlacePlatforms() {

}

// When doodler lands on a platform it should bounce up
function detectCollision(a,b) {
    return a.x < b.x + b.width && //  This line checks if the left edge of object a is to the left of the right edge of object b
           a.x + a.width > b.x && // This line checks if the right edge of object a is to the right of the left edge of object b
           a.y < b.y + b.height && // This line checks if the top edge of object a is above the bottom edge of object b.
           a.y + a.height > b.y; // This line checks if the bottom edge of object a is below the top edge of object b.
}