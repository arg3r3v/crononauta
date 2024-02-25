    document.addEventListener('DOMContentLoaded', function () {
        var gameContainer = document.getElementById('game-container');
        var gatito = document.getElementById('gatito');
        var boss = document.createElement('div');
        var score = 0;
        var health = 50;
        var playerHealth = 3;
        var playerLasers = [];
        var bossLasers = [];
        var bossMoving = false;
        var enemyInterval;
        var gameInterval;
        var bossMovementInterval;
        var bossFrameInterval;
        var gatitoFrameInterval;
        var gameEnded = false;

        // Frames
        // Gatito
        var gatitoFrames = [
            "img/gatito.png",
            "img/pisada1.png"
        ];

        var frameActual = 0;

        gatitoFrameInterval = setInterval(function () {
            gatito.src = gatitoFrames[frameActual];

            // Avanzar al siguiente frame y volver al inicio si es necesario
            frameActual = (frameActual + 1) % gatitoFrames.length;
        }, 500); // Cambiar cada 500 milisegundos

        // Enemigos
        var enemigoFrames = [
            "img/enemigof1.png",
            "img/enemigof2.png"
        ];

        var frameEnemigo = 0;

        setInterval(function () {
            frameEnemigo = (frameEnemigo === 0) ? 1 : 0; // Alternar entre 0 y 1
            // Código para cambiar la imagen de los enemigos
            var enemies = document.getElementsByClassName('enemy');
            for (var i = 0; i < enemies.length; i++) {
                enemies[i].style.backgroundImage = "url('" + enemigoFrames[frameEnemigo] + "')";
            }
        }, 500); // Cambiar cada 500 milisegundos

        // Boss
        var bossFrames = [
            "img/jefe1.png",
            "img/jefe2.png"
        ];

        var frameBoss = 0;

        bossFrameInterval = setInterval(function () {
            frameBoss = (frameBoss === 0) ? 1 : 0; // Alternar entre 0 y 1
            // Código para cambiar la imagen del jefe
            boss.style.backgroundImage = "url('" + bossFrames[frameBoss] + "')";
        }, 500); // Cambiar cada 500 milisegundos

        // Mostrar el pop-up del nivel al cargar la página
        var popupNivel3 = document.getElementById('popup-nivel3');
        popupNivel3.style.display = 'block';

        // Contador de puntos
        var scoreElement = document.createElement('div');
        scoreElement.id = 'score';
        scoreElement.textContent = 'Puntos: ' + score;
        gameContainer.appendChild(scoreElement);

        // Contador de vidas
        var healthElement = document.createElement('div');
        healthElement.id = 'health';
        healthElement.textContent = 'Vidas: ' + playerHealth;
        gameContainer.appendChild(healthElement);

            // Agregar el manejador de eventos para el botón "Jugar"
    document.getElementById('jugarButton').addEventListener('click', function () {
        popupNivel3.style.display = 'none';
        gameInterval = setInterval(generarEnemigos, 1000);
        document.addEventListener('mousemove', moverGatito); // Agregar el manejador de eventos del mouse después de presionar "Jugar"
    });

        // Función para manejar el movimiento del mouse
        function moverGatito(event) {
            var x = event.clientX - gameContainer.getBoundingClientRect().left;
            var minX = 80;
            var maxX = gameContainer.offsetWidth - gatito.offsetWidth / 2;
            gatito.style.left = Math.min(maxX, Math.max(minX, x - gatito.offsetWidth / 2)) + 'px';
        }

        // Agregar el manejador de eventos del mouse
        document.addEventListener('mousemove', moverGatito);

        // Función para desactivar el movimiento del mouse cuando se pierde o se gana
        function desactivarMovimientoMouse() {
            document.removeEventListener('mousemove', moverGatito);
        }

        document.addEventListener('keydown', function (event) {
            if (event.code === 'Space') {
                event.preventDefault();
                fireLaser();
            }
        });

        // Función para disparar láseres
        function fireLaser() {
            // Verificar si el juego ha terminado antes de permitir el disparo
            if (!gameEnded) {
                var laser = document.createElement('div');
                laser.className = 'laser';
                var playerRect = gatito.getBoundingClientRect();
                laser.style.left = (playerRect.left + playerRect.width / 2 - 1) + 'px';
                laser.style.top = playerRect.top - 20 + 'px';
                gameContainer.appendChild(laser);

                playerLasers.push(laser);

                var laserInterval = setInterval(function () {
                    laser.style.top = parseInt(laser.style.top) - 4 + 'px';
                    if (parseInt(laser.style.top) <= -20) {
                        clearInterval(laserInterval);
                        gameContainer.removeChild(laser);
                        playerLasers.shift();
                    }

                    var enemies = document.getElementsByClassName('enemy');
                    for (var i = 0; i < enemies.length; i++) {
                        var enemyRect = enemies[i].getBoundingClientRect();
                        if (checkCollision(laser.getBoundingClientRect(), enemyRect)) {
                            gameContainer.removeChild(laser);
                            gameContainer.removeChild(enemies[i]);
                            clearInterval(laserInterval);
                            playerLasers.shift();
                            score += 10;
                            updateScore();
                            break;
                        }
                    }

                    var bossRect = boss.getBoundingClientRect();
                    if (checkCollision(laser.getBoundingClientRect(), bossRect)) {
                        gameContainer.removeChild(laser);
                        health -= 1; // Reducir la vida del jefe
                        boss.setAttribute('data-health', health); // Actualizar el atributo data-health del jefe
                        updateHealth(); // Actualizar la salud
                    }
                }, 10);
            }
        }

// Función para iniciar el juego cuando se presiona el botón "Jugar" del pop-up del nivel
document.getElementById('jugarButton').addEventListener('click', function () {
    popupNivel3.style.display = 'none';
    gameInterval = setInterval(generarEnemigos, 1000);
    document.addEventListener('mousemove', moverGatito); // Agregar el manejador de eventos del mouse después de hacer clic en jugar
});

        // Botón "Final" del pop-up de "Ganaste"
        document.getElementById('finalButton').addEventListener('click', function () {
            window.location.href = "final.html";
        });

        // Botón "Volver" del pop-up de "Perdiste"
        document.getElementById('inicioButtonPerdiste').addEventListener('click', function () {
            window.location.href = "menujuego.html";
        });

        // Botón "Volver" del pop-up de "Perdiste"
        document.getElementById('volverButtonPerdiste').addEventListener('click', function () {
            window.location.href = "menujuego.html";
        });

function ganaste() {
    clearInterval(gameInterval); // Detener el intervalo de juego
    clearInterval(enemyInterval); // Detener el intervalo de generación de enemigos
    clearInterval(bossMovementInterval); // Detener el intervalo de movimiento del jefe
    clearInterval(bossFrameInterval); // Detener el intervalo de animación del jefe
    clearInterval(gatitoFrameInterval); // Detener el intervalo de animación del gatito

    // Eliminar todos los láseres del jefe
    bossLasers.forEach(function (laser) {
        gameContainer.removeChild(laser);
    });
    bossLasers = [];

    // Eliminar el jefe
    gameContainer.removeChild(boss);

    // Mostrar el pop-up de "Ganaste"
    document.getElementById('popup-ganaste').style.display = 'block';

    // Pausar la escena
    pausarEscena();

    // Desactivar movimiento del mouse
    desactivarMovimientoMouse();

    // Establecer gameEnded en true
    gameEnded = true;

    // Volver a habilitar el movimiento del mouse
    document.addEventListener('mousemove', moverGatito);
}

        // Función para detener el juego y mostrar el pop-up de "Perdiste"
        function perdiste() {
            clearInterval(gameInterval); // Detener el intervalo de juego
            clearInterval(enemyInterval); // Detener el intervalo de generación de enemigos
            clearInterval(bossMovementInterval); // Detener el intervalo de movimiento del jefe
            clearInterval(bossFrameInterval); // Detener el intervalo de animación del jefe
            clearInterval(gatitoFrameInterval); // Detener el intervalo de animación del gatito

            // Mostrar el pop-up de "Perdiste"
            document.getElementById('popup-perdiste').style.display = 'block';

            // Pausar la escena
            pausarEscena();

            // Desactivar movimiento del mouse
            desactivarMovimientoMouse();

            // Establecer gameEnded en true
            gameEnded = true;
        }

        // Función para pausar la escena
        function pausarEscena() {
            // Detener la interacción del usuario
            gameContainer.style.pointerEvents = 'none';

            // Detener la animación de todos los elementos de la escena
            var animatingElements = gameContainer.querySelectorAll('.enemy, .laser, .boss-laser');
            animatingElements.forEach(function (element) {
                element.style.animationPlayState = 'paused';
            });

            // Detener el movimiento del jugador (gatito)
            gatitoFrameInterval && clearInterval(gatitoFrameInterval);
        }

        function fireBossLaser() {
            var laser = document.createElement('div');
            laser.className = 'boss-laser';
            var bossRect = boss.getBoundingClientRect();
            laser.style.left = (bossRect.left + bossRect.width / 2 - 1) + 'px';
            laser.style.top = bossRect.bottom + 'px';
            gameContainer.appendChild(laser);

            bossLasers.push(laser);

            function moveLaser() {
                laser.style.top = parseInt(laser.style.top) + 4 + 'px';
                if (parseInt(laser.style.top) >= gameContainer.offsetHeight) {
                    clearInterval(laserInterval);
                    gameContainer.removeChild(laser);
                    bossLasers.shift();
                }
            }

            var laserInterval = setInterval(moveLaser, 10);
        }

        function checkCollision(rect1, rect2) {
            return !(rect1.right < rect2.left ||
                rect1.left > rect2.right ||
                rect1.bottom < rect2.top ||
                rect1.top > rect2.bottom);
        }

        function updateScore() {
            scoreElement.textContent = 'Puntos: ' + score;
            if (score >= 200 && !boss.getAttribute('data-health')) {
                createBoss();
            }
        }

        // Función para actualizar la salud y verificar si se ganó o perdió
        function updateHealth() {
            healthElement.textContent = 'Vidas: ' + playerHealth;

            if (playerHealth <= 0) {
                clearInterval(gameInterval); // Detener el juego
                perdiste(); // Mostrar el pop-up de "Perdiste"
                return;
            }

            var bossHealth = parseInt(boss.getAttribute('data-health'));
            if (bossHealth <= 0) { // Verificar si la salud del jefe es menor o igual a cero
                clearInterval(gameInterval); // Detener el juego
                ganaste(); // Mostrar el pop-up de "Ganaste"
                return;
            }
        }

        function generarEnemigos() {
            var enemy = document.createElement('div');
            enemy.className = 'enemy';
            enemy.style.position = 'absolute';
            enemy.style.width = '165px';
            enemy.style.height = '180px';
            enemy.style.left = Math.floor(Math.random() * (gameContainer.offsetWidth - 40)) + 'px';
            enemy.style.top = '-40px';
            enemy.style.backgroundImage = 'url("img/enemigof1.png")';
            enemy.style.backgroundSize = 'cover';
            gameContainer.appendChild(enemy);

            var enemyInterval = setInterval(function () {
                enemy.style.top = parseInt(enemy.style.top) + 2 + 'px';
                if (parseInt(enemy.style.top) >= gameContainer.offsetHeight) {
                    clearInterval(enemyInterval);
                    gameContainer.removeChild(enemy);
                }
            }, 10);

            checkPlayerCollision();
        }

        function createBoss() {
            if (!bossMoving) {
                boss.setAttribute('data-health', health); // Establecer el atributo data-health del jefe
                boss.style.width = '480px';
                boss.style.height = '270px';
                boss.style.position = 'absolute';
                boss.style.top = '0px';
                boss.style.right = '10px';
                boss.style.backgroundImage = 'url("img/jefe2.png")';
                boss.style.backgroundSize = 'cover';
                gameContainer.appendChild(boss);

                setInterval(fireBossLaser, 500);
                setInterval(moveBoss, 500);
                bossMoving = true;
            }
        }

        function moveBoss() {
            var bossRect = boss.getBoundingClientRect();
            var gameRect = gameContainer.getBoundingClientRect();
            var newPosition = Math.floor(Math.random() * (gameRect.width - bossRect.width)) + gameRect.left;
            boss.style.left = newPosition + 'px';
        }

        function checkPlayerCollision() {
            var playerRect = gatito.getBoundingClientRect();

            var enemies = document.getElementsByClassName('enemy');
            for (var i = 0; i < enemies.length; i++) {
                var enemyRect = enemies[i].getBoundingClientRect();
                if (checkCollision(playerRect, enemyRect)) {
                    gameContainer.removeChild(enemies[i]);
                    playerHealth -= 1;
                    updateHealth();
                    gatito.classList.add('collision'); // Cambiar el color del gatito
                    setTimeout(function () {
                        gatito.classList.remove('collision'); // Restaurar el color del gatito después de un tiempo
                    }, 500);
                    healthElement.textContent = 'Vidas: ' + playerHealth; // Actualizar visualmente las vidas restantes
                    return; // Salir del bucle después de detectar una colisión con un enemigo
                }
            }

            for (var j = 0; j < bossLasers.length; j++) {
                var bossLaserRect = bossLasers[j].getBoundingClientRect();
                if (checkCollision(playerRect, bossLaserRect)) {
                    gameContainer.removeChild(bossLasers[j]);
                    playerHealth -= 1;
                    updateHealth();
                    gatito.classList.add('collision'); // Cambiar el color del gatito
                    setTimeout(function () {
                        gatito.classList.remove('collision'); // Restaurar el color del gatito después de un tiempo
                    }, 500);
                    healthElement.textContent = 'Vidas: ' + playerHealth; // Actualizar visualmente las vidas restantes
                    return; // Salir del bucle después de detectar una colisión con un láser del jefe
                }
            }
        }
    });
