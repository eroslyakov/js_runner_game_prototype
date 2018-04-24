 window.addEventListener('load', () => {
    'use strict';

    const WIDTH = 800;
    const HEIGHT = 400;
    var counter = 0;
    var looseAlert = "YOU LOOSE";
    var winAlert = "YOU WIN!";
    var score = document.getElementById('score');
    var status = document.getElementById('status');
    var gameOver = document.getElementById('game-over');
    var playerCanvas = document.getElementById('player-canvas');
    var playerContext = playerCanvas.getContext('2d');
    var playerImg = document.getElementById('character-sprite');

    playerCanvas.width = WIDTH;
    playerCanvas.height = HEIGHT;

    var characterSprite = createSprite({
        spritesheet: playerImg,
        context: playerContext,
        width: playerImg.width / 8,
        height: playerImg.height*1.4,
        numberOfFrames: 8,
        loopTicksPerFrame: 5
    });

    var characterBody = createPhysicalBody({
        defaultAcceleration: { x: 5, y: 15 },
        coordinates: { x: 0, y: (HEIGHT - characterSprite.height) },
        speed: { x: 0, y: 0 },
        height: characterSprite.height,
        width: characterSprite.width
    });

    function applyGravityVertical(physicalBody, gravity) {
        if (physicalBody.coordinates.y === HEIGHT - physicalBody.height) {
            return;
        }
        if (physicalBody.coordinates.y >= HEIGHT - physicalBody.height) {
            physicalBody.coordinates.y = HEIGHT - physicalBody.height;
            physicalBody.speed.y = 0;
            return;
        }
        physicalBody.speed.y += gravity;
    }

    function dontEscapeTheMap(physicalBody) {
        if (physicalBody.coordinates.x === WIDTH - physicalBody.width) {
            return;
        }
        if (physicalBody.coordinates.x > WIDTH - physicalBody.width) {
            physicalBody.coordinates.x = WIDTH - physicalBody.width - 1;
            return;
        }
        if (physicalBody.coordinates.x === 0 + physicalBody.width) {
            return;
        }
        if (physicalBody.coordinates.x <= 0) {
            physicalBody.coordinates.x = 1;
            return;
        }
    }

    window.addEventListener('keydown', (e) => {
        switch (e.keyCode) {
            case 65:
            case 37:
                if (characterBody.speed.x < 0) {
                    return;
                }
                characterBody.accelerate('x', -1);
                break;
            case 87:
            case 38:
                if (characterBody.coordinates.y < (HEIGHT - characterBody.height)) {
                    return;
                }
                characterBody.accelerate('y', -1);
                break;
            case 68:
            case 39:
                if (characterBody.speed.x > 0) {
                    return;
                }
                characterBody.accelerate('x', 1);
                break;
            default:
                break;
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.keyCode !== 37 && e.keyCode !== 39 &&
            e.keyCode !== 68 && e.keyCode !== 65) {
            return;
        }
        characterBody.speed.x = 0;
    });

    var enemyCanvas = document.getElementById('enemy-canvas');
    var enemyContext = enemyCanvas.getContext('2d');
    var enemyImg = document.getElementById('enemy');

    enemyCanvas.width = WIDTH;
    enemyCanvas.height = HEIGHT;

    function createEnemy(offsetX) {
        var enemySprite = createSprite({
            spritesheet: enemyImg,
            context: enemyContext,
            width: enemyImg.width / 8,
            height: enemyImg.height*1.4,
            numberOfFrames: 8,
            loopTicksPerFrame: 5
        });

        var enemyBody = createPhysicalBody({
            coordinates: { x: offsetX, y: (HEIGHT - enemySprite.height) },
            speed: { x: -7, y: 0 },
            width: enemySprite.width,
            height: enemySprite.height
        });

        return {
            sprite: enemySprite,
            body: enemyBody
        };
    }

    var enemies = [];

    function spawnEnemy() {
        var spawnOffsetX = 150;
        var spawnChance = 0.015;

        if (Math.random() < spawnChance) {
            if (enemies.length) {
                var lastEnemy = enemies[enemies.length - 1];
                var starting = Math.max(lastEnemy.body.coordinates.x +
                    lastEnemy.body.width + spawnOffsetX, WIDTH);
                var newEnemy = createEnemy(starting);
                enemies.push(newEnemy);
            } else {
                enemies.push(createEnemy(WIDTH));
            }
        }     
        if(enemies.length > 10) enemies.length = 0;
    }

    var background = createBackground({
        width: WIDTH,
        height: HEIGHT,
        speedX: 5
    });

    function gameLoop() {
        applyGravityVertical(characterBody, 0.6);
        dontEscapeTheMap(characterBody);

        var lastCharacterCoordinates = characterBody.move();
        characterSprite.render(characterBody.coordinates, lastCharacterCoordinates);
        characterSprite.update();

        for (let i = 0; i < enemies.length; i += 1) {
            var enemy = enemies[i];

            if (counter >= 25) {
                background.speedX = 4;
            }
            if (counter >= 35) {
                background.speedX = 3;
            }
            if (counter >= 50) {
                background.speedX = 2;
            }
            if (counter >= 65) {
                background.speedX = 1;
            }
            if (counter >= 85) {
                background.speedX = -1;
            }
            if (counter >= 100) {
                background.speedX = -2;
            }
            if (counter >= 125) {
                background.speedX = -3;
            }
            if (counter >= 140) {
                background.speedX = -5;
            }

            if (enemy.body.coordinates.x < -enemy.body.width) {
                enemies.splice(i, 1);
                i -= 1;
                counter += 1;
                score.innerText = 'Score: ' + counter;
            }
            
            var lastEnemyCoordinates = enemy.body.move();
            enemy.sprite.render(enemy.body.coordinates, lastEnemyCoordinates);
            enemy.sprite.update();

            if (characterBody.collidesWith(enemy.body)) {
                setTimeout(() => {
                    gameOver.style.position = 'absolute';
                    gameOver.style.display = 'block';
                    score.style.zIndex = 25;
                    status.innerHTML = looseAlert;
                }, 100);

                return;
            }
        }

        spawnEnemy();
        background.render();
        background.update();
        if (background.endGame(background.coordinates.x)) {
            window.requestAnimationFrame(gameLoop);
        } else {
            setTimeout(() => {
                background.speedX = 0;
                gameOver.style.position = 'absolute';
                gameOver.style.display = 'block';
                score.style.zIndex = 25;
                status.innerHTML = winAlert;
            }, 100);
        }
    }

    gameLoop();
});
