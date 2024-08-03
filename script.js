
//Integrantes: Nathaly Camacho, Iván Fernandez, José Riofrío, Ariana Sarango, Carlos Guajala.
 

        //---------------CLASE JUEGO---------------//
        
class Juego {
    constructor(canvasId) {
        this.puntuacion = new Puntuacion();
        this.dificultad = new Dificultad();
        this.tablero = new Tablero(canvasId);
        this.piezaActual = null;
        this.sonidos = new Sonidos();
        this.controles = new Controles(this);

        this.colors = [
            null, "#9331FA ", //Morado //Pieza T
                  "#FFFF00", //Amarillo  //Pieza O
                  "#FFB600", //Naranja  //Pieza L
                  "#0800FF", //Azul  //Pieza J
                  "#00BFFF", //Cyan //Pieza I
                  "#15F312 ", //Verde  //Pieza S
                  "#FF0000", //Rojo  //Pieza Z
        ];

        this.backgroundImage = new Image();
        this.backgroundImage.src = './img/fondoTetris.jpg';
        this.backgroundImage.onload = () => {
            this.tablero.backgroundImage = this.backgroundImage;
            this.tablero.dibujar(this.piezaActual, this.colors);
        };
    }

    iniciar() {
        if (!this.isGameRunning) {
            this.resetear();
            this.puntuacion.actualizar();
            this.update();
            document.getElementById("pauseButton").disabled = false;
            document.getElementById("startButton").innerText = "Reiniciar";
            this.isGameRunning = true;
        } else {
            this.puntuacion.reset();        
        }
        this.resetear();
        this.puntuacion.actualizar();
        this.tablero.limpiarTablero();
        this.tablero.matriz.forEach(row => row.fill(0));
        this.dropInterval = this.dificultad.velocidad;
        this.sonidos.reproducir('principal');
    }

    pausar() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            cancelAnimationFrame(this.animationId);
            document.getElementById("pauseButton").innerText = "Reanudar";
            this.sonidos.pausar('principal');
        } else {
            this.update();
            document.getElementById("pauseButton").innerText = "Pausar";
            this.sonidos.reproducir('principal');
        }
    }

    terminar() {
        this.tablero.limpiarTablero();
        this.tablero.matriz.forEach(row => row.fill(0));
        this.resetear();
        this.puntuacion.reset();
        this.puntuacion.actualizar();
        document.getElementById("pauseButton").disabled = true;
        this.isGameRunning = false;
        document.getElementById("startButton").innerHTML = "Iniciar Juego";
        document.getElementById("pauseButton").innerHTML = "Pausar";
        document.getElementById("pauseButton").disabled = true;
        this.isPaused = false;
        cancelAnimationFrame(this.animationId);
        this.sonidos.detener('principal');
    }

    resetear() {
        const pieces = "TJLOSZI";
        this.piezaActual = new Pieza(pieces[(pieces.length * Math.random()) | 0]);
        this.piezaActual.posicion.actualizarPosicion(
            ((this.tablero.matriz[0].length / 2) | 0) - ((this.piezaActual.forma[0].length / 2) | 0),
            0
        );
        if (this.collide()) {
            this.tablero.matriz.forEach(row => row.fill(0));
            this.gameOver();
        }
    }

    collide() {
        return this.tablero.colision(this.piezaActual);
    }

    update(time = 0) {
        if (!this.isPaused) {
            const deltaTime = time - this.lastTime;
            this.dropCounter += deltaTime;
            if (this.dropCounter > this.dropInterval) {
                this.playerDrop();
            }
            this.lastTime = time;
            this.tablero.dibujar(this.piezaActual, this.colors);
        }
        this.animationId = requestAnimationFrame(this.update.bind(this));
    }

    mover(offset) {
        this.piezaActual.mover(offset > 0 ? 'derecha' : 'izquierda');
        if (this.collide()) {
            this.piezaActual.mover(offset > 0 ? 'izquierda' : 'derecha');
        }
    }

    playerDrop() {
        this.piezaActual.mover('abajo');
        if (this.collide()) {
            this.piezaActual.mover('arriba');
            this.tablero.unirPieza(this.piezaActual);
            this.resetear();
            const lineasEliminadas = this.tablero.eliminarFilas();
            if (lineasEliminadas > 0) {
                this.sonidos.reproducir('lineaBloques');
                this.puntuacion.incrementar(lineasEliminadas * 10);
            }
            this.puntuacion.actualizar();
        }
        this.dropCounter = 0;
    }

    playerRotate(dir) {
        const pos = this.piezaActual.posicion.x;
        let offset = 1;
        this.piezaActual.rotar(dir);
        while (this.collide()) {
            this.piezaActual.posicion.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.piezaActual.forma[0].length) {
                this.piezaActual.rotar(-dir);
                this.piezaActual.posicion.x = pos;
                return;
            }
        }
    }

    gameOver() {
        this.sonidos.detener('principal');
        this.sonidos.reproducir('gameOver');
        
        this.sonidos.sonidoGameOver.onended = () => {
            alert('Juego Terminado! Tu puntuación fue: ' + this.puntuacion.puntos);
            this.terminar();
        };
    }
}


                //---------------CLASE PUNTUACION---------------//

class Puntuacion {
    constructor() {
        this.puntos = 0;
    }

    incrementar(puntos) {
        this.puntos += puntos;
    }

    reset() {
        this.puntos = 0;
    }

    actualizar() {
        document.getElementById("score").innerText = "Puntuación: " + this.puntos;
    }
}


                //---------------CLASE DIFICULTAD---------------//

class Dificultad {
    constructor() {
        this.nivel = 'normal';
        this.velocidad = 200;
    }

    establecerDificultad(nivel) {
        this.nivel = nivel;
        switch (nivel) {
            case 'easy': this.velocidad = 400; break;
            case 'normal': this.velocidad = 200; break;
            case 'hard': this.velocidad = 100; break;
        }
    }
}


                //---------------CLASE PIEZA---------------//

class Pieza {
    constructor(tipo) {
        this.forma = this.crearPieza(tipo);
        this.posicion = new Posicion(0, 0);
    }

    crearPieza(type) {
        const pieces = {
            'T': [[0, 0, 0],
                  [1, 1, 1],
                  [0, 1, 0]],

            'O': [[2, 2],
                  [2, 2]],

            'L': [[0, 3, 0],
                  [0, 3, 0],
                  [0, 3, 3]],

            'J': [[0, 4, 0],
                  [0, 4, 0],
                  [4, 4, 0]],

            'I': [[0, 5, 0, 0],
                  [0, 5, 0, 0],
                  [0, 5, 0, 0],
                  [0, 5, 0, 0]],

            'S': [[0, 6, 6],
                  [6, 6, 0],
                  [0, 0, 0]],

            'Z': [[7, 7, 0],
                  [0, 7, 7],
                  [0, 0, 0]]
        };

        return pieces[type];
    }

    mover(direccion) {
        switch (direccion) {
            case 'izquierda': this.posicion.x--; break;
            case 'derecha': this.posicion.x++; break;
            case 'abajo': this.posicion.y++; break;
            case 'arriba': this.posicion.y--; break;
        }
    }

    rotar(dir) {
        for (let y = 0; y < this.forma.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [this.forma[x][y], this.forma[y][x]] = [this.forma[y][x], this.forma[x][y]];
            }
        }
        if (dir > 0) this.forma.forEach(row => row.reverse());
        else this.forma.reverse();
    }
}


                //---------------CLASE POSICION---------------//

class Posicion {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    actualizarPosicion(x, y) {
        this.x = x;
        this.y = y;
    }
}


                //---------------CLASE TABLERO---------------//

class Tablero {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.context.scale(20, 20);
        this.matriz = this.crearMatriz(12, 20);
        this.backgroundImage = null;
    }

    crearMatriz(w, h) {
        const matrix = [];
        while (h--) matrix.push(new Array(w).fill(0));
        return matrix;
    }

    dibujar(pieza, colors) {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.dibujarFondo();
        this.drawMatrix(this.matriz, {x: 0, y: 0}, colors);
        if (pieza) {
            this.drawMatrix(pieza.forma, pieza.posicion, colors);
        }
    }

    dibujarFondo() {
        if (this.backgroundImage) {
            this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
    }

    drawMatrix(matrix, offset, colors) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = colors[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = 0.1;
                    this.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    limpiarTablero() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    unirPieza(pieza) {
        pieza.forma.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.matriz[y + pieza.posicion.y][x + pieza.posicion.x] = value;
                }
            });
        });
    }

    colision(pieza) {
        const m = pieza.forma;
        const o = pieza.posicion;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                   (this.matriz[y + o.y] &&
                    this.matriz[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    eliminarFilas() {
        let lineasEliminadas = 0;
        outer: for (let y = this.matriz.length - 1; y >0; --y) {
            for (let x = 0; x < this.matriz[y].length; ++x) {
                if (this.matriz[y][x] === 0) {
                    continue outer;
                }
            }
            const row = this.matriz.splice(y, 1)[0].fill(0);
            this.matriz.unshift(row);
            ++y;
            lineasEliminadas++;
        }
        return lineasEliminadas;
    }
}


                //---------------CLASE CONTROLES---------------//

class Controles {
    constructor(juego) {
        this.juego = juego;
        this.pulsarTeclas();
    }

    pulsarTeclas() {
        document.addEventListener('keydown', event => {
            if (!this.juego.isPaused && this.juego.isGameRunning) {
                switch (event.keyCode) {
                    case 37: this.juego.mover(-1); break;
                    case 39: this.juego.mover(1); break;
                    case 40: this.juego.playerDrop(); break;
                    case 38: this.juego.playerRotate(1); break;
                }
            }
        });

        document.getElementById("startButton").addEventListener("click", () => this.juego.iniciar());
        document.getElementById("pauseButton").addEventListener("click", () => this.juego.pausar());
        document.getElementById("stopButton").addEventListener("click", () => this.juego.terminar());
        document.getElementById("level").addEventListener("change", (e) => {
            this.juego.dificultad.establecerDificultad(e.target.value);
            if (this.juego.isGameRunning) {
                this.juego.dropInterval = this.juego.dificultad.velocidad;
            }
        });
    }
}


                //---------------CLASE SONIDOS---------------//

class Sonidos {
    constructor() {
        this.sonidoPrincipal = new Audio('./sounds/TetrisSound.wav');
        this.sonidoLineaBloquesRotos = new Audio('./sounds/LineaBloques.mp3');
        this.sonidoGameOver = new Audio('./sounds/GameOver.wav');
        
        this.sonidoPrincipal.loop = true;
        this.cargarSonidos();
    }

    cargarSonidos() {
        this.sonidoPrincipal.load();
        this.sonidoLineaBloquesRotos.load();
        this.sonidoGameOver.load();
    }

    reproducir(sonido) {
        switch(sonido) {
            case 'principal': this.sonidoPrincipal.play(); break;
            case 'lineaBloques': this.sonidoLineaBloquesRotos.play(); break;
            case 'gameOver': this.sonidoGameOver.play(); break;
        }
    }

    pausar(sonido) {
        if (sonido === 'principal') this.sonidoPrincipal.pause();
    }

    detener(sonido) {
        if (sonido === 'principal') {
            this.sonidoPrincipal.pause();
            this.sonidoPrincipal.currentTime = 0;
        }
    }
}

// Inicializar el juego
const tetris = new Juego("tetris");
