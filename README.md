# Juego Tetris

**Integrantes:** Nathaly Camacho, Iván Fernandez, José Riofrío, Ariana Sarango, Carlos Guajala.

**Ciclo:** Segundo "A"

# Diagrama UML 

![UML.jpeg](UML.jpeg)

# GitHub Page

        https://arianasarango.github.io/Tetris/

# Instrucciones De Juego

- Una vez haya ingresado al juego mediante el link debe elegir un nivel (FACIL, NORMAL, DIFICIL) o dejarlo por defecto

- Una vez elegido el nivel debe darle clic en el botón "Iniciar Juego"

- Se creara una pieza de manera aleatoria 

- Al estar seguro la posición en la que quiere que empiece el juego debe presionar la flecha hacia abajo del teclado, en caso contrario debe posicionar la pieza en un lugar del tablero usando las flechas hacia la derecha o izquierda y para cambiar la dirección de la pieza con la tecla hacia arriba, al estar seguro presionar la flecha hacia abajo del teclado y la pieza empezara a caer

- Si no le gusta la pieza con la que sale al comienzo puede dar clic en el botón de "Reiniciar" para que le aparezca una nueva pieza

- Puede presionar los botones de "Pausar" para congelar las piezas en el lugar en donde estén, y "Reanudar" para continuar jugando

- En caso de que quiera terminar el juego puede darle clic en el botón de "Parar Juego"

- Para seguir controlando la posición y dirección de las piezas use las flechas del teclado mientras la pieza esta cayendo

- Colocar las piezas de manera que encajen una con otras para completar una fila de piezas e irlas eliminando

- Por cada fila eliminada ganara 10 puntos y se irán sumando 10 mas a su puntuación según la cantidad de filas eliminadas en total

- El juego terminara cuando las piezas choquen con el borde superior del tablero y no se pueda colocar mas

- Una vez el juego terminado saldrá una alerta en pantalla diciéndole su puntuación que obtuvo

	 Disfruta el juego y trata de obtener la mejor puntuación. ¡Buena Suerte!

# Estructura Proyecto

## Clases Principales

### 1. Jugador

Representa al jugador del juego.

**Métodos:**
        
- realizarMovimientos(): Permite al jugador realizar movimientos en el juego.

### 2. Tetris

Controla la lógica principal del juego Tetris.
    
**Atributos:** 
- Tablero: Referencia al objeto Tablero asociado. 
- piezaActual: La pieza que está actualmente en juego. 
- puntuacion: Puntuación actual del juego.

**Métodos:**
- iniciar(): Inicia el juego. 
- pausar(): Pausa el juego.
- pararJuego(): Detiene el juego.

**Relaciones:**
 - Un Jugador puede tener múltiples instancias de Tetris (juegoList).
 - Composición con Tablero, Puntuacion y una enumeración Dificultad.

### 3. Tablero

Representa el tablero de juego donde las piezas se colocan.
    
**Atributos:**
- ancho: Ancho del tablero.
- alto: Alto del tablero.
- bloque: Representación de los bloques en el tablero.
   
**Métodos:**
- agregarPieza(): Agrega una nueva pieza al tablero.
- eliminarLineas(): Elimina las líneas completas del tablero. 
- finJuego(): Finaliza el juego.
    
**Relaciones:**
- Composición con múltiples instancias de Pieza.

### 4. Pieza

Representa las piezas que caen en el tablero.
    
**Atributos:**
- bloques: Bloques que conforman la pieza.
- posicion: Posición actual de la pieza en el tablero.
- forma: Forma de la pieza.
- color: Color de la pieza.
   
**Métodos:**
- rotar(): Rota la pieza.
- moverIzquierda(): Mueve la pieza a la izquierda.
- moverDerecha(): Mueve la pieza a la derecha.
- moverAbajo(): Mueve la pieza hacia abajo.
    
**Relaciones:**
- Cada Pieza tiene una Posicion.

### 5. Puntuacion

Gestiona la puntuación del juego.
    
**Atributos:**
- puntuacionActual: Puntuación actual durante el juego.
- puntuacionFinal: Puntuación final del juego.
    
**Métodos:**
- reiniciar(): Reinicia la puntuación.
- mostrarPuntajeFinal(): Muestra la puntuación final.

### 6. Posicion

Representa la posición (x, y) de una pieza en el tablero.
    
**Atributos:**
- x: Coordenada x de la posición.
- y: Coordenada y de la posición.
   
**Métodos:**
- establecerPosicion(): Establece la posición de la pieza.

### 7. Enumeraciones
Sonidos:
- SonidoPrincipal 
- LineaBloquesRoto 
- GameOver

### 8. Dificultad

Valores:

- FACIL
- NORMAL 
- DIFICIL
