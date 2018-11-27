/***********************************************************************************
 * GameObject Class
 **********************************************************************************/
// Holds properties that are similar for the enemy and player objects
class GameObject {
    constructor() {
        // Result of dividing the columns by the canvas size
        this.moveX = 101;
        // Result of dividing the rows by the canvas size
        this.moveY = 83;
        // Boundary of the x-axis canvas
        this.canvasBoundaryX = this.moveX * 4;
        // Boundary of the y-axis canvas
        this.canvasBoundaryY = this.moveY * 5;
        // Border surrounding each enemy, player and gem
        // Used to check collisions by giving each object distance measurement.
        this.width = 50;
        this.height = 50;
    }
}
/***********************************************************************************
 * Enemy Class
 **********************************************************************************/
// Enemies our player must avoid
class Enemy extends GameObject {
    constructor() {
        super();
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = -this.moveX;
        this.y = this.laneChooser();
        this.speed = Math.floor(Math.random() * 200) + 80;
        this.resetStart = -this.moveX;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // Checks the x-axis of the enemy in relation to
        // measurement set for the canvas of the game located in GameObject.
        // The noveX ensures the enemy moves off-screen before being reset.
        if(this.x <= this.canvasBoundaryX + this.moveX) {
            // Multiplies the random speed by the delta time to keep smooth
            // motion across the canvas for each enemy
            this.x += this.speed * dt;
        }
        else {
            // When enemy is resets give them a new speed
            this.speed = Math.floor(Math.random() * 200) + 80;
            // When enemy reaches end of the lane reset set them to the
            // beginning of the lane before the start of the canvas boarder.
            this.x = this.resetStart;
            // When enemy reaches end of the lane choose random lane for the enemy
            // to travel across
            this.laneChooser();
        }
    }

    // This function randomly chooses a lane for the enemy to travel across
    // max/min lanes decide how many lanes enemy can choose from
    laneChooser() {
        let minLanes = 1, maxLanes = 3, firstLane = 60;
        let lane = Math.floor(Math.random() * maxLanes) + minLanes;
          if(lane === minLanes) {
            this.y = firstLane;
          }
          else {
              lane--;
              let newLane = firstLane + (lane * this.moveY);
              this.y = newLane;
          }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

/***********************************************************************************
 * Player Class
 **********************************************************************************/
// The player must reach the water at the top of the map.
// Collect rewards that appear
// Avoid the enemies
class Player extends GameObject {
    constructor() {
        super();
        this.sprite = 'images/char-boy.png';
        this.x = 0;
        this.y = 0;
        this.changeInX = 0;
        this.changeInY = 0;
        this.lives = 3;
        this.points = 0;
        this.win = false;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update() {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        if (this.changeInX !== 0) {
            this.x += this.changeInX;
            this.changeInX = 0;
        }
        if (this.changeInY !== 0) {
            this.y += this.changeInY;
            this.changeInY = 0;
        }
        // If player reaches y-coordinate reaches within the water tiles
        // the player wins the game.
        if(this.y <= 50) {
            player.win = true;
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Choose the correct direction for the player to move when a key is pressed
    handleInput(keyPressed) {
        switch (keyPressed) {
            case 'left':
                console.log(keyPressed);
                if (this.x + -this.moveX >= 0) {
                    this.changeInX = -this.moveX;
                }
                break;
            case 'right':
                console.log(keyPressed);
                if (this.x + this.moveX <= this.canvasBoundaryX) {
                    this.changeInX = this.moveX;
                }
                break;
            case 'up':
                console.log(keyPressed);
                if (this.y + -this.moveY >= -this.moveY) {
                    this.changeInY = -this.moveY;
                }
                break;
            case 'down':
                console.log(keyPressed);
                if (this.y + this.moveY <= this.canvasBoundaryY) {
                    this.changeInY = this.moveY;
                }
                break;
        }
    }

    // Resets player back to the starting points
    reset() {
            this.x = 202;
            this.y = 395;
    }
};

/***********************************************************************************
 * Rewards Class
 **********************************************************************************/
// Collected by the player
// Depending on the reward type points or lives will be added to the player
// New reward type will respawn in a random point between the lanes
class Rewards extends GameObject {
    constructor() {
        super();
        this.sprite = 'images/Gem-Blue.png';
        // Used to identify the reward when collision occurs
        this.type = 0;
        this.x = 0;
        this.y = 0;
        // Due to scaling of the image in ctx.drawImage
        // Rewards needed a smaller boundary
        this.width = 30;
        this.height = 30;
        this.collided = false;
    }

    // Checks if collision is true
    // Update the location of the reward

    update() {
        if(this.collided === true) {
            this.randomRewardType();
            this.randomXcoordinate();
            this.randomYcoordinate();
            this.collided = false;
        }
    }

    // Randomly selects an X coordinate between the lanes with the enemies crossing
    randomXcoordinate() {
        let minLanes = 1, maxLanes = 5, firstLane = 15;
        let lane = Math.floor(Math.random() * maxLanes) + minLanes;
          if(lane === minLanes) {
            this.x = firstLane;
          }
          else {
              lane--;
              let newLane = firstLane + (lane * this.moveX);
              this.x = newLane;
          }
    }

    // Randomly selects an Y coordinate between the lanes with the enemies crossing
    randomYcoordinate() {
        let minLanes = 1, maxLanes = 3, firstLane = 101;
        let lane = Math.floor(Math.random() * maxLanes) + minLanes;
          if(lane === minLanes) {
            this.y = firstLane;
          }
          else {
              lane--;
              let newLane = firstLane + (lane * this.moveY);
              this.y = newLane;
          }
    }

    // When reward respawns
    // Random reward type is chosen
    randomRewardType() {
        // Randomly select number from 1 to 10
        const min = 1, max = 10;
        const numSelector = Math.floor(Math.random() * max) + min;
        // Use simple propability method to create difficulty of see certain rewards
        // These numbers are also added to reward.type to identify during collisions
        // Blue - 1 to 5 High Chance - 5 points
        const blue = 5;
        // Green - 6 to 8 Medium Chance - 10 points
        const green = 8;
        // Orange - 9 Low Chance - 20 points
        const orange = 9;
        // Heart - 10 Low Chance - Extra Life
        const heart = 10;
        if(numSelector > blue && numSelector <= green) {
            this.sprite = 'images/Gem-Green.png';
            this.type = green;
        }
        else if(numSelector === orange) {
            this.sprite = 'images/Gem-Orange.png';
            this.type = orange;
        }
        else if(numSelector === heart) {
            this.sprite = 'images/Heart.png';
            this.type = heart;
        }
        else {
            this.sprite = 'images/Gem-Blue.png';
            this.type = blue;
        }
    }

    // Draw the rewards on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, 70, 110);
    }
}

/***********************************************************************************
 * Main Code Run
 **********************************************************************************/
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for(let i=0; i<3; i++) {
    enemy = new Enemy();
    allEnemies.push(enemy);
}

let player = new Player();
let reward = new Rewards();

/***********************************************************************************
 * Listeners
 **********************************************************************************/
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    let allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
