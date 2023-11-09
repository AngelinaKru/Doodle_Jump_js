// Board
let board;
// Demensions of the backgroung picture 
let boardWidth = 360;
let boardHeight = 576;
let context;

// Player/Doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
//Initial position of the doodler
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

let score = 0;

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
    placePlatforms();

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

    // Platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) { /* If doodler is falling down
                                                            (althoug it is positive direction,
                                                            velocity is negative due to gravity) and 
                                                            if a doodler is above the middle of the board */
            platform.y -= velocityY; // Move platforms down                                                
        }
         if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; // Reset jump velocity
        }
        context.drawImage(platformArray[i].img, platformArray[i].x, platformArray[i].y, platformArray[i].width, platformArray[i].height);
    }

    // Loop , that removes platforms that go off the screen and creates new ones
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // Remove first element from the array
        newPlatform();
    }

    // Score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText("Score: " + score, 10, 20);
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

function placePlatforms() {
    platformArray = [];

    // Starting platform
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    // Randomly place platforms
    for (let i = 0; i < 6; i++){
        let randomX = Math.floor(Math.random() * (boardWidth - platformWidth*3/4)); // (0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150, /* i is going to be 0, 1, 2, 3, 4, 5 and 
                                            it is going to create an additional space
                                            75 pixels between each platform*/
            width : platformWidth,
            height : platformHeight
        }

        platformArray.push(platform);
    }
}

// Create new platform and add it to the array
function newPlatform() {
    let randomX = Math.floor(Math.random() * (boardWidth - platformWidth*3/4)); // (0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : -platformHeight, // 0 is a top of canvas, so we need to start from -platformHeight
            width : platformWidth,
            height : platformHeight
        }

        platformArray.push(platform);
}


// When doodler lands on a platform it should bounce up
function detectCollision(a,b) {
    return a.x < b.x + b.width && //  This line checks if the left edge of object a is to the left of the right edge of object b
           a.x + a.width > b.x && // This line checks if the right edge of object a is to the right of the left edge of object b
           a.y < b.y + b.height && // This line checks if the top edge of object a is above the bottom edge of object b.
           a.y + a.height > b.y; // This line checks if the bottom edge of object a is below the top edge of object b.
}
