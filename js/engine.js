/* Engine.js
 * This file provides the game loop functionality (update entities and render),
 * draws the initial game board on the screen, and then calls the update and
 * render methods on your player and enemy objects (defined in your app.js).
 *
 * A game engine works by drawing the entire game screen over and over, kind of
 * like a flipbook you may have created as a kid. When your player moves across
 * the screen, it may look like just that image/character is moving or being
 * drawn but that is not the case. What's really happening is the entire "scene"
 * is being drawn over and over, presenting the illusion of animation.
 *
 * This engine makes the canvas' context (ctx) object globally available to make
 * writing app.js a little simpler to work with.
 */

let Engine = (function (global) {
    /* Predefine the variables we'll be using within this scope,
     * create the canvas element, grab the 2D context for that canvas
     * set the canvas elements height/width and add it to the DOM.
     */
    let doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        ctx = canvas.getContext('2d'),
        lastTime,
        idFrame, // Holds the id for the current animationFrame
        firstTimeChoosing = true; // Used to track first time player changes character

    // Modals
    const modal = document.querySelector('.modal-overlay');
    const modal2 = document.querySelector('#modal-selection');
    // Modal values for when a player wins or loses
    let title = document.querySelector('.modal-title');
    let replay = document.querySelector('.modal-replay');
    let content = document.querySelector('.modal-content');

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    /* This function serves as the kickoff point for the game loop itself
     * and handles properly calling the update and render methods.
     */
    function main() {
        /* Get our time delta information which is required if your game
         * requires smooth animation. Because everyone's computer processes
         * instructions at different speeds we need a constant value that
         * would be the same for everyone (regardless of how fast their
         * computer is) - hurray time!
         */
        let now = Date.now(),
            dt = (now - lastTime) / 1000.0;

        /* Call our update/render functions, pass along the time delta to
         * our update function since it may be used for smooth animation.
         */
        update(dt);
        render();

        /* Set our lastTime variable which is used to determine the time delta
         * for the next time this function is called.
         */
        lastTime = now;

        // When player rwaches the water
        // Launch win game modal
        if (player.win === true) {
            playerWin();
        }
        // When player does not have have enough lives.
        // Launch lose game modal
        else if (player.lives === 0) {
            playerLose();
        }
        // Launch modal2
        // Shows list of character to select
        // Player's character changes to selected character
        // When image selected, player position is reset and modal2 is removed
        else if (selector.collided === true) {
            playerSelect();
        }
        /* Use the browser's requestAnimationFrame function to call this
         * function again as soon as the browser is able to draw another frame.
         */
        else {
            idFrame = win.requestAnimationFrame(main);
        }
    }

    /* This function does some initial setup that should only occur once,
     * particularly setting the lastTime variable that is required for the
     * game loop.
     */
    function init() {
        reset();
        lastTime = Date.now();
        main();
    }

    // Cancels animationFrames
    // Reveals modal
    // Displays victory message and points amount
    function playerWin() {
        win.cancelAnimationFrame(idFrame);
        modal.classList.toggle('is-hidden');
        title.innerHTML = `Victory!`;
        content.innerHTML = `Points: ${player.points}`;
    };

    // Cancels animationFrames
    // Reveals modal
    // Displays loss message and try again information
    function playerLose() {
        win.cancelAnimationFrame(idFrame);
        modal.classList.toggle('is-hidden');
        title.innerHTML = `No More Lives`;
        content.innerHTML = `Don't give up. Try Again`;
    };

    // Cancels animationFrames
    // Reveals modal2
    // Displays character images to choose from
    // Replaces current character with the image selected
    function playerSelect() {
        win.cancelAnimationFrame(idFrame);
        selector.collided = false;
        let list = document.querySelector('.modal-list');
        // List of characters
        let imgs = ['images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-princess-girl.png'];
        // List is only create once
        if (firstTimeChoosing === true) {
            // Cycle through each avaible character
            for (let i = 0; i < imgs.length; i++) {
                let img = document.createElement('img');
                img.src = imgs[i];
                img.textContent = imgs[i];
                // Listener for image in the modal list
                img.addEventListener('click', function () {
                    // Change character to selected character image
                    player.sprite = img.textContent;
                    modal2.classList.toggle('is-hidden');
                    win.requestAnimationFrame(main);
                    firstTimeChoosing = false;
                });
                list.appendChild(img);
            };
        }
        modal2.classList.toggle('is-hidden');
        reset();
    };

    /* This function is called by main (our game loop) and itself calls all
     * of the functions which may need to update entity's data. Based on how
     * you implement your collision detection (when two entities occupy the
     * same space, for instance when your character should die), you may find
     * the need to add an additional function call here. For now, we've left
     * it commented out - you may or may not want to implement this
     * functionality this way (you could just implement collision detection
     * on the entities themselves within your app.js file).
     */
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    /* This is called by the update function and loops through all of the
     * objects within your allEnemies array as defined in app.js and calls
     * their update() methods. It will then call the update function for your
     * player object. These update methods should focus purely on updating
     * the data/properties related to the object. Do your drawing in your
     * render methods.
     */
    function updateEntities(dt) {
        allEnemies.forEach(function (enemy) {
            enemy.update(dt);
        });
        player.update();
        reward.update();
        selector.update();
    }

    // Measures x and y coordinates as well as height and width boundary boxes
    // to check if each objects is close enough to be considered a collision.
    function checkCollisions() {
        // Checks collisions between enemies and the player
        allEnemies.forEach(function (enemy) {
            if (enemy.x < player.x + player.width &&
                enemy.x + enemy.width > player.x &&
                enemy.y < player.y + player.height &&
                enemy.y + enemy.height > player.y) {
                console.log('Collided with enemy')
                player.lives--;
                // This calls reset function as long as lives are not equal to 0;
                // If lives equal 0 then the main function will check and provide the modal
                // If check is removed reset function will set back the lives
                // before the main can check
                if (player.lives != 0) {
                    reset();
                }
            }
        });
        // Checks collisions between rewards and the player
        if (reward.x < player.x + player.width &&
            reward.x + reward.width > player.x &&
            reward.y < player.y + player.height &&
            reward.y + reward.height > player.y) {
            checkRewardType(reward.type);
        }
        // Checks collisions between selector and the player
        if (selector.x < player.x + player.width &&
            selector.x + selector.width > player.x &&
            selector.y < player.y + player.height &&
            selector.y + selector.height > player.y) {
            selector.collided = true;
        }
    }

    // Function is called when a collision occurs between player and reward
    // reward.type is passed to function as type
    // Depending on the type points/extra life will be added to the player
    function checkRewardType(type) {
        // These numbers are also added to reward.type to identify during collisions
        // Blue - 1 to 5 High Chance - 5 points
        // Green - 6 to 8 Medium Chance - 10 points
        // Orange - 9 Low Chance - 20 points
        // Heart - 10 Low Chance - Extra Life
        const blue = 5, green = 8, orange = 9, heart = 10;
        switch (type) {
            case blue:
                player.points += 5;
                break;
            case green:
                player.points += 10;
                break;
            case orange:
                player.points += 20;
                break;
            case heart:
                player.lives++;
                break;
            default:
                console.log(`Reward type was not tracked. The type passed was ${type}`);
                break;
        }
        reward.collided = true;
    }

    /* This function initially draws the "game level", it will then call
     * the renderEntities function. Remember, this function is called every
     * game tick (or loop of the game engine) because that's how games work -
     * they are flipbooks creating the illusion of animation but in reality
     * they are just drawing the entire screen over and over.
     */
    function render() {
        /* This array holds the relative URL to the image used
         * for that particular row of the game level.
         */
        let rowImages = [
            'images/water-block.png',   // Top row is water
            'images/stone-block.png',   // Row 1 of 3 of stone
            'images/stone-block.png',   // Row 2 of 3 of stone
            'images/stone-block.png',   // Row 3 of 3 of stone
            'images/grass-block.png',   // Row 1 of 2 of grass
            'images/grass-block.png'    // Row 2 of 2 of grass
        ],
            numRows = 6,
            numCols = 5,
            row, col;

        // Before drawing, clear existing canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        /* Loop through the number of rows and columns we've defined above
         * and, using the rowImages array, draw the correct image for that
         * portion of the "grid"
         */
        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        // Keep refreshed display of player's lives
        renderPlayerLives();
        // Keep refreshed display of player's points
        renderPlayerPoints();

        renderEntities();
    }

    // This function displays the lives of the player
    function renderPlayerLives() {
        ctx.font = "25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Lives: ${player.lives}`, 107, canvas.height - 30);
    }

    // This function displays the points of the player.
    function renderPlayerPoints() {
        ctx.font = "25px Arial";
        ctx.fillStyle = "white";
        ctx.fillText(`Points: ${player.points}`, canvas.width - 200, canvas.height - 30);
    }

    /* This function is called by the render function and is called on each game
     * tick. Its purpose is to then call the render functions you have defined
     * on your enemy and player entities within app.js
     */
    function renderEntities() {
        /* Loop through all of the objects within the allEnemies array and call
         * the render function you have defined.
         */
        allEnemies.forEach(function (enemy) {
            enemy.render();
        });
        player.render();
        reward.render();
        selector.render();
    }

    // This listens for mouse click on replay button
    // Reset the whole game
    // Removes the modal
    // Puts the player and rewards back to initial state
    // Player lives and points are reset
    replay.addEventListener('click', function () {
        modal.classList.toggle('is-hidden');
        reset();
        player.win = false;
        win.requestAnimationFrame(main);
    });

    /* This function does nothing but it could have been a good place to
     * handle game reset states - maybe a new game menu or a game over screen
     * those sorts of things. It's only called once by the init() method.
     */
    function reset() {
        player.reset();
        reward.randomRewardType();
        reward.randomXcoordinate();
        reward.randomYcoordinate();
    }

    /* Go ahead and load all of the images we know we're going to need to
     * draw our game level. Then set init as the callback method, so that when
     * all of these images are properly loaded our game will start.
     */
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png',
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-princess-girl.png',
        'images/Gem-Blue.png',
        'images/Gem-Green.png',
        'images/Gem-Orange.png',
        'images/Heart.png',
        'images/Selector.png'
    ]);
    Resources.onReady(init);

    /* Assign the canvas' context object to the global variable (the window
     * object when run in a browser) so that developers can use it more easily
     * from within their app.js files.
     */
    global.ctx = ctx;
})(this);
