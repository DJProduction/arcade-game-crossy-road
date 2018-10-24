// Enemies our player must avoid
class Enemy {
    constructor() {
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = 0;
        this.y = 0;
        this.speed = Math.floor(Math.random() * 11);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        this.x = this.speed * dt;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
};

// Enemies our player must avoid
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 203;
        this.y = 290;
        this.changeInX = 0;
        this.changeInY = 0;
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update() {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
        if (this.changeInX !== 0 || this.changeInY !== 0) {
            this.x += this.changeInX;
            this.y += this.changeInY;
            this.changeInX = 0;
            this.changeInY = 0;
        }
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // Choose the correct direction for the player to move when a key is pressed
    handleInput(keyPressed) {
        switch(keyPressed) {
            case 'left':
            console.log(keyPressed);
            this.changeInX = -100;
            break;
            case 'right':
            console.log(keyPressed);
            this.changeInX = 100;
            break;
            case 'up':
            console.log(keyPressed);
            this.changeInY = -80;
            break;
            case 'down':
            console.log(keyPressed);
            this.changeInY = 80;
            break;
        }
    }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
for(let i=0; i<3; i++) {
    enemy = new Enemy();
    allEnemies.push(enemy);
}

let player = new Player();

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
