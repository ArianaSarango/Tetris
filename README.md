# Juego Tetris

**Integrantes:** Nathaly Camacho, Iván Fernandez, José Riofrío, Ariana Sarango, Carlos Guajala.

**Ciclo:** Segundo "A"

# Diagrama UML 
![image](https://github.com/user-attachments/assets/03c8e425-3fdd-43cd-846d-67968008176c)

# GitHub Page

        https://arianasarango.github.io/Tetris/

# Instrucciones De Juego

- Una vez haya ingresado al juego mediante el link debe elegir un nivel (FACIL, NORMAL, DIFICIL) o dejarlo por defecto.

- Una vez elegido el nivel, debe hacer clic en el botón "Iniciar Juego".

- Se creará una pieza de manera aleatoria. 

- Al estar seguro la posición en la que quiere que empiece el juego debe presionar la flecha hacia abajo del teclado, en caso contrario debe posicionar la pieza en un lugar del tablero usando las flechas hacia la derecha o izquierda y para cambiar la dirección de la pieza use la tecla hacia arriba, cuando esté seguro, presione la flecha hacia abajo y la pieza comenzará a caer.

- Si no le gusta la pieza con la que sale al comienzo puede dar clic en el botón de "Reiniciar" para que le aparezca una nueva pieza.

- Puede presionar los botones de "Pausar" para congelar las piezas en el lugar en donde estén, y "Reanudar" para continuar jugando.

- En caso de que quiera terminar el juego puede darle clic en el botón de "Parar Juego".

- Para seguir controlando la posición y dirección de las piezas use las flechas del teclado mientras la pieza esta cayendo.

- Colocar las piezas de manera que encajen una con otras para completar una fila de piezas e irlas eliminando.

- Por cada fila eliminada ganara 10 puntos y se irán sumando 10 más a su puntuación según la cantidad de filas eliminadas en total.

- El juego terminará cuando las piezas choquen con el borde superior del tablero y no se pueda colocar más.

- Una vez el juego terminado saldrá una alerta en pantalla diciéndole la puntuación que obtuvo.

	 Disfrute el juego y trate de obtener la mejor puntuación. ¡Buena Suerte!


# Estructura Proyecto

## 1. Juego

Es la clase principal que controla el flujo del juego, maneja la puntuación, el nivel de dificultad, el tablero, las piezas, los sonidos y los controles.

**Atributos:**

puntuacion: Controla los puntos acumulados durante el juego.
dificultad: Define el nivel de dificultad actual.
tablero: Representa la matriz de juego donde caen las piezas.
pieza: Representa la pieza actual en el juego.
sonidos: Controla los efectos de sonido del juego.
controles: Maneja la entrada del usuario.

**Métodos:**

iniciar(): Inicia el juego.
pausar(): Pausa el juego.
parar(): Detiene el juego.
resetear(): Reinicia el juego.
mover(): Mueve la pieza actual en el tablero.
gameOver(): Maneja el final del juego.
	
 
## 2. Dificultad

Esta clase representa los diferentes niveles de dificultad del juego, define la velocidad a la que caen las piezas y el nivel de dificultad actual.

**Atributos:**

nivel: Indica el nivel de dificultad (por ejemplo:"FÁCIL", "NORMAL", "DIFÍCIL").
velocidad: Representa la velocidad en la que caen las piezas.

**Métodos:**

establecerDificultad(): Configura el nivel de dificultad y la velocidad correspondiente.
	

## 3. Controles

Esta clase se encarga de controlar la interacción del jugador con el juego mediante las teclas.

**Atributos:**

juego: Para acceder al estado del juego.

**Métodos:**

pulsarTeclas(): Detecta y maneja las teclas presionadas por el jugador para mover y rotar las piezas.

 
## 4. Tablero

Representa la matriz de juego donde caen las piezas, controla la creación de la matriz, el dibujo de piezas y la eliminación de filas completas.

**Atributos:**

matriz: Una cadena que representa la disposición actual de las piezas en el tablero.

**Métodos:**

crearMatriz(): Crea y devuelve una matriz vacía.
dibujarPieza(pieza: Pieza): Dibuja la pieza actual en la matriz.
limpiarTablero(): Limpia la matriz del tablero.
unirPiezas(pieza: Pieza): Une la pieza actual con las piezas ya colocadas en el tablero.
eliminarFilas(): Elimina las filas completas de la matriz y ajusta la puntuación.


## 5. Pieza

Representa las piezas del juego que caen en el tablero, controla la creación, el movimiento y la rotación de las piezas.

**Atributos:**

posicion: Indica la posición actual de la pieza en el tablero.

**Métodos:**

crearPieza(): Genera y devuelve una nueva pieza.
mover(): Mueve la pieza en el tablero.
rotar(): Rota la pieza.


## 6. Sonidos

Controla los efectos de sonido del juego.

**Atributos:**

principal: Representa el sonido de fondo principal.
lineaBloqueRoto: Representa el sonido al eliminar una fila de bloques.
gameOver: Representa el sonido cuando el juego termina.

**Métodos:**

cargar(): Carga los archivos de sonido.
reproducir(): Reproduce un sonido.
pausar(): Pausa el sonido.
detener(): Detiene el sonido.


## 7. Puntuacion

Controla la puntuación del jugador, calcula y actualiza los puntos basados en las filas eliminadas.

**Atributos:**

puntos: Representa los puntos acumulados por el jugador.

**Métodos:**

incrementar(): Incrementa la puntuación según las filas eliminadas.
resetear(): Restablece la puntuación a cero.
actualizar(): Actualiza la puntuación actual.


## 8. Posicion

Representa la posición de una pieza en el tablero, con coordenadas x e y.

**Atributos:**

x: Coordenada x de la posición.
y: Coordenada y de la posición.

**Métodos:**

actualizarPosicion(): Actualiza la posición de la pieza en el tablero.
