"use strict";

class Tetris {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.context = this.canvas.getContext("2d");
        this.context.scale(20, 20);
        this.isGameRunning = false;
        this.isPaused = false;
        this.dropInterval = this.level();
        this.lastTime = 0;
        this.dropCounter = 0;
        this.animationId = null;

        this.colors = [
            null,
            "#ff0d72",
            "#0dc2ff",
            "#0dff72",
            "#f538ff",
            "#ff8e0d",
            "#ffe138",
            "#3877ff",
            "#ffffff", // Color para líneas resaltadas
        ];

        this.arena = this.createMatrix(12, 20);
        this.player = {
            pos: { x: 0, y: 0 },
            matrix: null,
            score: 0,
        };

        this.backgroundImage = new Image();
        this.backgroundImage.src = './img/fondoTetris.jpg';
        this.backgroundImage.onload = () => this.drawBackgroundImage();

        // Añadir propiedades para los sonidos
        this.mainTheme = new Audio('./sounds/TetrisSound.wav');
        this.lineBreakSound = new Audio('./sounds/LineaBloques.mp3');
        this.gameOverSound = new Audio('./sounds/GameOver.wav');

        // Configurar la canción principal para que se repita
        this.mainTheme.loop = true;

        this.initControls();
        this.initSounds();
    }

    level() {
        const selectElement = document.getElementById('level');
        const selectedValue = selectElement.value;
        if (selectedValue === 'hard') {
            return 60;
        } else if (selectedValue === 'normal') {
            return 120;
        } else if (selectedValue === 'easy') {
            return 250;
        } else {
            return 0;
        }
    }

    createMatrix(w, h) {
        const matrix = [];
        while (h--) {
            matrix.push(new Array(w).fill(0));
        }
        return matrix;
    }

    createPiece(type) {
        const pieces = {
            'I': [[0, 1, 0, 0],
                  [0, 1, 0, 0],
                  [0, 1, 0, 0],
                  [0, 1, 0, 0]],

            'L': [[0, 2, 0],
                  [0, 2, 0],
                  [0, 2, 2]],

            'J': [[0, 3, 0],
                  [0, 3, 0],
                  [3, 3, 0]],

            'O': [[4, 4],
                  [4, 4]],

            'Z': [[5, 5, 0],
                  [0, 5, 5],
                  [0, 0, 0]],

            'S': [[0, 6, 6],
                  [6, 6, 0],
                  [0, 0, 0]],

            'T': [[0, 7, 0],
                  [7, 7, 7],
                  [0, 0, 0]]
        };
        return pieces[type];
    }

    drawMatrix(matrix, offset) {
        matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    this.context.fillStyle = this.colors[value];
                    this.context.fillRect(x + offset.x, y + offset.y, 1, 1);
                    this.context.lineJoin = "round";
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = 0.1;
                    this.context.strokeRect(x + offset.x, y + offset.y, 1, 1);
                }
            });
        });
    }

    merge(arena, player) {
        player.matrix.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== 0) {
                    arena[y + player.pos.y][x + player.pos.x] = value;
                }
            });
        });
    }

    rotate(matrix, dir) {
        for (let y = 0; y < matrix.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [matrix[x][y], matrix[y][x]] = [matrix[y][x], matrix[x][y]];
            }
        }
        if (dir > 0) {
            matrix.forEach((row) => row.reverse());
        } else {
            matrix.reverse();
        }
    }

    collide(arena, player) {
        const m = player.matrix;
        const o = player.pos;
        for (let y = 0; y < m.length; ++y) {
            for (let x = 0; x < m[y].length; ++x) {
                if (m[y][x] !== 0 &&
                    (arena[y + o.y] && arena[y + o.y][x + o.x]) !== 0) {
                    return true;
                }
            }
        }
        return false;
    }

    drawBackgroundImage() {
        this.context.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
    }

    initSounds() {
        // Precargar los sonidos
        this.mainTheme.load();
        this.lineBreakSound.load();
        this.gameOverSound.load();
    }

    playMainTheme() {
        this.mainTheme.play();
    }

    stopMainTheme() {
        this.mainTheme.pause();
        this.mainTheme.currentTime = 0;
    }

    playLineBreakSound() {
        this.lineBreakSound.play();
    }

    playGameOverSound() {
        this.gameOverSound.play();
    }

    startGame() {
        if (!this.isGameRunning) {
            this.playerReset();
            this.updateScore();
            this.update();
            document.getElementById("pauseButton").disabled = false;
            document.getElementById("startButton").innerText = "Reiniciar";
            this.isGameRunning = true;
        } else {
            this.player.score = 0;
        }
        this.playerReset();
        this.updateScore();
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena.forEach((row) => row.fill(0));
        this.dropInterval = this.level();
        this.playMainTheme();
    }

    pauseGame() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            cancelAnimationFrame(this.animationId);
            document.getElementById("pauseButton").innerText = "Reanudar";
            this.mainTheme.pause();
        } else {
            this.update();
            document.getElementById("pauseButton").innerText = "Pausar";
            this.mainTheme.play();
        }
    }

    stopGame() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.arena.forEach((row) => row.fill(0));
        this.playerReset();
        this.player.score = 0;
        this.updateScore();
        document.getElementById("pauseButton").disabled = true;
        this.isGameRunning = false;
        document.getElementById("startButton").innerHTML = "Iniciar Juego";
        document.getElementById("pauseButton").innerHTML = "Pausar";
        document.getElementById("pauseButton").disabled = true;
        this.isPaused = false;
        cancelAnimationFrame(this.animationId);
        this.stopMainTheme();
    }

    playerReset() {
        const pieces = "TJLOSZI";
        this.player.matrix = this.createPiece(pieces[(pieces.length * Math.random()) | 0]);
        this.player.pos.y = 0;
        this.player.pos.x = ((this.arena[0].length / 2) | 0) - ((this.player.matrix[0].length / 2) | 0);
        if (this.collide(this.arena, this.player)) {
            this.arena.forEach((row) => row.fill(0));
        }
    }

    updateScore() {
        document.getElementById("score").innerText = "Puntuación: " + this.player.score;
    }

    update(time = 0) {
        if (!this.isPaused) {
            const deltaTime = time - this.lastTime;
            this.dropCounter += deltaTime;
            if (this.dropCounter > this.dropInterval) {
                this.playerDrop();
            }
            this.lastTime = time;
            this.draw();
        }
        this.animationId = requestAnimationFrame(this.update.bind(this));
    }

    playerMove(offset) {
        this.player.pos.x += offset;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.x -= offset;
        }
    }

    playerDrop() {
        this.player.pos.y++;
        if (this.collide(this.arena, this.player)) {
            this.player.pos.y--;
            this.merge(this.arena, this.player);
            if (this.player.pos.y <= 1) {
                this.gameOver();
                return;
            }
            this.playerReset();
            this.arenaSweep();
            this.updateScore();
        }
        this.dropCounter = 0;
    }

    gameOver() {
        this.stopMainTheme();
        this.playGameOverSound();
        
        // Esperar a que el sonido de game over termine antes de mostrar la alerta
        this.gameOverSound.onended = () => {
            alert('Juego Terminado! Tu puntuación fue: ' + this.player.score);
            this.stopGame();
        };
    }

    playerRotate(dir) {
        const pos = this.player.pos.x;
        let offset = 1;
        this.rotate(this.player.matrix, dir);
        while (this.collide(this.arena, this.player)) {
            this.player.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > this.player.matrix[0].length) {
                this.rotate(this.player.matrix, -dir);
                this.player.pos.x = pos;
                return;
            }
        }
    }

    async arenaSweep() {
        let rowCount = 0;
        let linesToRemove = [];
        
        outer: for (let y = this.arena.length - 1; y > 0; --y) {
            for (let x = 0; x < this.arena[y].length; ++x) {
                if (this.arena[y][x] === 0) {
                    continue outer;
                }
            }
            linesToRemove.push(y);
            rowCount++;
        }
        
        if (rowCount > 0) {
            // Reproducir el sonido
            this.playLineBreakSound();
            
            // Resaltar las líneas que se van a eliminar con efecto de parpadeo
            await this.highlightLines(linesToRemove);
            
            // Eliminar las líneas
            linesToRemove.forEach(y => {
                this.arena.splice(y, 1);
                this.arena.unshift(new Array(this.arena[0].length).fill(0));
            });
            
            // Actualizar la puntuación
            this.player.score += this.calculateScore(rowCount);
            this.updateScore();
        }
    }

    async highlightLines(lines) {
        const originalColors = lines.map(y => [...this.arena[y]]);
        const flashCount = 3;
        const flashDuration = 100; // milisegundos

        for (let i = 0; i < flashCount; i++) {
            // Cambiar a color brillante
            lines.forEach(y => {
                for (let x = 0; x < this.arena[y].length; ++x) {
                    this.arena[y][x] = 8; // Color brillante
                }
            });
            this.draw();
            await new Promise(resolve => setTimeout(resolve, flashDuration));

            // Volver al color original
            lines.forEach((y, index) => {
                this.arena[y] = [...originalColors[index]];
            });
            this.draw();
            await new Promise(resolve => setTimeout(resolve, flashDuration));
        }
    }

    calculateScore(rowCount) {
        // Cada línea vale 10 puntos
        return rowCount * 10;
    }

    draw() {
        this.drawBackgroundImage();
        this.drawMatrix(this.arena, { x: 0, y: 0 });
        this.drawMatrix(this.player.matrix, this.player.pos);
    }

    initControls() {
        document.addEventListener("keydown", (event) => {
            if (event.keyCode === 37) {
                this.playerMove(-1);
            } else if (event.keyCode === 39) {
                this.playerMove(1);
            } else if (event.keyCode === 40) {
                this.playerDrop();
            } else if (event.keyCode === 38) {
                this.playerRotate(1);
            } else if (event.keyCode === 81) {
                this.playerRo1tate(-1);
            }
        });

        document.getElementById("startButton").addEventListener("click", () => this.startGame());
        document.getElementById("pauseButton").addEventListener("click", () => this.pauseGame());
        document.getElementById("stopButton").addEventListener("click", () => this.stopGame());
    }
}

// Inicializar el juego
const tetris = new Tetris("tetris");
