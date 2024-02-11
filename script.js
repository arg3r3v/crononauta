
// Función para redireccionar a la página de historia 1
function redireccionar() {
    window.location.href = "historia1.html";
}

// Función para redireccionar a la página de historia 2
function redireccionarhistoria2() {
    window.location.href = "historia2.html";
}

// Función para redireccionar a la página de historia 3
function redireccionarhistoria3() {
    window.location.href = "historia3.html";
}

// Función para redireccionar a la página de historia 4
function redireccionarhistoria4() {
    window.location.href = "historia4.html";
}

function redireccionarPagina1() {
    window.location.href = "trama.html";
}

function redireccionarPagina2() {
    window.location.href = "equipo.html";
}

function redireccionarAJueguito() {
    window.location.href = "jueguito.html";
}

function redireccionarindex() {
    window.location.href = "index.html";
}
// Muestra el popup antes de la redirección
var popup = document.getElementById("popup");
popup.style.display = "block";

// Funciones adicionales para manipular el texto y el botón "EMPIEZA EL JUEGO!!!"

var textos = [
    'Waimuq encontró un corazón puro y supo que no todo estaba perdido.',    
    'Heroe: "¿Q-que es esto?..."',
    'Waimuq: "Te necesito, estoy muriendo..."',
    'Waimuq: "Usa los portales para cambiar las cosas, el destino del planeta esta en tus patitas..."',
    'Waimuq: "Se fuerte hijo mio, te otorgaré el poder que me queda, solo tienes 1 oportunidad..."'
];

var indexTexto = 0;

document.addEventListener('DOMContentLoaded', function () {
    var popup = document.getElementById("popup");
    popup.style.display = "block";
    actualizarTexto();
});

function cambiarTexto() {
    indexTexto++;
    if (indexTexto >= textos.length) {
        // Si ya no hay más textos, cambia el texto del botón y añade un event listener para redireccionar
        var boton = document.querySelector('.siguiente');
        boton.textContent = "EMPIEZA EL JUEGO!!!";
        boton.addEventListener('click', function() {
            window.location.href = "menujuego.html";
        });
    } else {
        actualizarTexto();
    }
}

function actualizarTexto() {
    var popupText = document.getElementById("popup-text");
    popupText.textContent = textos[indexTexto];
}

let contentContainer = document.getElementById('content-container');

function scrollText(contentContainer) {
    let scrollInterval = setInterval(function() {
        contentContainer.scrollTop += 1; // Ajusta la velocidad de desplazamiento
        if (contentContainer.scrollHeight - contentContainer.clientHeight <= contentContainer.scrollTop) {
            clearInterval(scrollInterval);
        }
    }, 50); // Ajusta la velocidad de desplazamiento
}

window.onload = scrollText();

//Juego abejitas

document.addEventListener('DOMContentLoaded', function() {
    var gatito = document.getElementById('gatito');
    var pisadas = document.getElementById('pisadas'); // Referencia al elemento de las pisadas
    var popup = document.getElementById('popup');
    var popupMessage = document.getElementById('popup-message');
    var inicioButton = document.getElementById('inicio');
    var jugarOtraVezButton = document.getElementById('jugar-otra-vez');
    var abejitas = [];
    var intervaloAbejitas; // Intervalo global para poder detenerlo
    var intervaloGenerarAbejitas; // Intervalo global para generar abejas
    var COLISION_DISTANCIA = 50; // Distancia de colisión entre el gatito y las abejitas

    var pisadaActual = 1; // Variable para la pisada actual
    var juegoGanado = false; // Variable para indicar si se ha ganado el juego
    var tiempoRestante; // Tiempo restante en el contador
    var intervaloContador; // Intervalo para actualizar el contador

    setInterval(function() {
        pisadaActual = (pisadaActual === 1) ? 2 : 1; // Alternar entre 1 y 2
        pisadas.src = 'img/pisada' + pisadaActual + '.png'; // Cambiar la imagen de las pisadas
    }, 500); // Cambiar cada 500 milisegundos

    // Definir imágenes de los frames del gatito
    var gatitoFrames = [
        "img/gatito.png",
        "img/pisada1.png"
    ];

    var frameActual = 0;

    setInterval(function() {
        // Cambiar el atributo src de la imagen del gatito al siguiente frame
        gatito.src = gatitoFrames[frameActual];

        // Alternar entre los frames (0 y 1)
        frameActual = (frameActual === 0) ? 1 : 0;
    }, 500);

    // Función para desactivar el movimiento del mouse cuando se pierde o se gana
    function desactivarMovimientoMouse() {
        document.removeEventListener('mousemove', moverGatito);
    }

    // Función para verificar la colisión entre el gatito y las abejitas
    function verificarColision() {
        var gatitoRect = gatito.getBoundingClientRect();
        for (var i = 0; i < abejitas.length; i++) {
            var abejita = abejitas[i];
            var abejitaRect = abejita.getBoundingClientRect();
        if (Math.abs(gatitoRect.left - abejitaRect.left) < COLISION_DISTANCIA &&
                Math.abs(gatitoRect.top - abejitaRect.top) < COLISION_DISTANCIA) {
                perdido();
                return;
            }
        }
    }

    // Función para indicar que se ha perdido
    function perdido() {
        mostrarPopup('¡Perdiste!');
        clearInterval(intervaloAbejitas);
        clearInterval(intervaloGenerarAbejitas); // Detener la generación de nuevas abejas
        clearInterval(intervaloContador); // Detener el contador
    }

    // Función para indicar que se ha ganado
    function ganado() {
        juegoGanado = true;
        mostrarPopup('¡Ganaste!');
        clearInterval(intervaloAbejitas);
        clearInterval(intervaloGenerarAbejitas); // Detener la generación de nuevas abejas
        clearInterval(intervaloContador); // Detener el contador
    }

    // Mostrar el pop-up
    function mostrarPopup(message) {
        popupMessage.textContent = message;
        popup.style.display = 'block';
        desactivarMovimientoMouse();
        clearInterval(intervaloAbejitas); // Detener la creación de nuevas abejas
    }

    // Redirigir al index
    inicioButton.addEventListener('click', function() {
        window.location.href = "index.html";
    });

    // Cambiar el comportamiento del botón "Jugar otra vez"
    jugarOtraVezButton.addEventListener('click', function() {
        jugarOtraVez();
    });

    // Función para iniciar el juego nuevamente
    function jugarOtraVez() {
        juegoGanado = false; // Restablecer el estado del juego
        popup.style.display = 'none';
        abejitas.forEach(function(abejita) {
            document.body.removeChild(abejita);
        });
        abejitas = [];
        document.addEventListener('mousemove', moverGatito);

        // Detener cualquier intervalo activo
        clearInterval(intervaloAbejitas);
        clearInterval(intervaloGenerarAbejitas);
        clearInterval(intervaloContador);

        // Iniciar movimiento de abejas y generar nuevas abejas
        intervaloAbejitas = setInterval(moverAbejitas, 50);
        intervaloGenerarAbejitas = setInterval(generarAbejitas, 3000);

        // Reiniciar el contador
        iniciarContador();
    }

    // Función para iniciar el contador de cuenta regresiva
    function iniciarContador() {
        tiempoRestante = 60; // Tiempo en segundos

        // Actualizar el contador cada segundo
        intervaloContador = setInterval(function() {
            tiempoRestante--;

            // Actualizar el texto del contador
            document.getElementById('tiempo').textContent = tiempoRestante + 's';

            // Verificar si se ha alcanzado el tiempo límite
            if (tiempoRestante <= 0) {
                clearInterval(intervaloContador); // Detener el contador
                perdido(); // Indicar que se ha perdido el juego
            }
        }, 1000);
    }

    // Función para seguir al cursor del mouse y mover las abejas
    function moverGatito(event) {
        gatito.style.left = event.clientX - gatito.offsetWidth / 2 + 'px';
        gatito.style.top = event.clientY - gatito.offsetHeight / 2 + 'px';
        verificarColision(); // Verificar colisión cada vez que se mueve el gatito
    }

    // Función para mover las abejas
    function moverAbejitas() {
        if (!juegoGanado) { // Verificar si el juego aún no ha sido ganado
            var cursorX = parseInt(gatito.style.left) + gatito.offsetWidth / 2;
            var cursorY = parseInt(gatito.style.top) + gatito.offsetHeight / 2;

            for (var i = 0; i < abejitas.length; i++) {
                var abejita = abejitas[i];
                var abejitaRect = abejita.getBoundingClientRect();
                var distanciaX = cursorX - abejitaRect.left - abejita.offsetWidth / 2;
                var distanciaY = cursorY - abejitaRect.top - abejita.offsetHeight / 2;
                var angulo = Math.atan2(distanciaY, distanciaX);
                var distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);
                var velocidadMaxima = 10;
                if (distancia > velocidadMaxima) {
                    distancia = velocidadMaxima;
                }
                var nuevaX = abejitaRect.left + distancia * Math.cos(angulo);
                var nuevaY = abejitaRect.top + distancia * Math.sin(angulo);
                abejita.style.transform = "scaleX(" + (distanciaX < 0 ? -1 : 1) + ")";
                abejita.style.left = nuevaX + 'px';
                abejita.style.top = nuevaY + 'px';
            }
        }
    }

    // Generar abejitas aleatorias
    function generarAbejitas() {
        if (!juegoGanado) { // Verificar si el juego aún no ha sido ganado
            if (abejitas.length < 20) { // Verificar si no se han generado todas las abejas
                var abejita = document.createElement('div');
                abejita.classList.add('abejita');
                abejita.style.left = Math.random() * window.innerWidth + 'px'; // Posición aleatoria en el eje X
                abejita.style.top = Math.random() * window.innerHeight + 'px'; // Posición aleatoria en el eje Y
                document.body.appendChild(abejita);
                abejitas.push(abejita);
                if (abejitas.length === 20) {
                    ganado(); // Llama a la función ganado cuando se hayan creado todas las abejas sin colisión
                    clearInterval(intervaloGenerarAbejitas); // Detener la generación de nuevas abejas
                }
            }
        }
    }

    // Activar movimiento del mouse al inicio
    document.addEventListener('mousemove', moverGatito);

    // Iniciar el contador de cuenta regresiva después de hacer clic en "Jugar otra vez"
    jugarOtraVezButton.addEventListener('click', function() {
        jugarOtraVez();
    });

    // Muestra el popup antes de la redirección
    popup.style.display = "block"; // Muestra el popup
});