
// // INICIALIZACION DE VARIABLES
// let tarjetasDestapadas = 0;
// let tarjeta1 = null;
// let tarjeta2 = null;
// let primerResultado = null;
// let segundoResultado = null;
// let movimientos = 0;
// let aciertos = 0;
// let temporizador = false;
// let timer = 60;
// let timerIncial = 60;
// let tiempoRegresivoId = null;

// let nivelActual = 1; // Nivel inicial
// let nivelesPasados = 0; // Nivel pasado acumulado

// // AUDIO
// let winAudio = new Audio('./sounds/win.mp3');
// let loseAudio = new Audio('./sounds/lose.mp3');
// let clickAudio = new Audio('./sounds/click.mp3');
// let rightAudio = new Audio('./sounds/right.mp3');
// let wrongAudio = new Audio('./sounds/wrong.mp3');

// // APUNTANDO A DOCUMENTO HTML
// let mostrarMovimientos = document.getElementById('movimientos');
// let mostrarAciertos = document.getElementById('aciertos');
// let mostrarTiempo = document.getElementById('t-restante');

// let mostrarNiveles = document.getElementById('niveles-pasados').querySelector('h2');
// let listaNiveles = document.getElementById('lista-niveles'); // Para acumular los niveles en la lista

// // GENERACION DE NUMEROS ALEATORIOS
// let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
// numeros = numeros.sort(() => {return Math.random()-0.5});
// console.log(numeros);

// function contarTiempo() {
//   tiempoRegresivoId = setInterval(() => {
//     if (timer > 0) {  // Solo disminuir si el tiempo es mayor a 0
//       timer--;
//       mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
//     } else {
//       clearInterval(tiempoRegresivoId);  // Detener el temporizador
//       bloquearTarjetas(); // Llamar a la función para bloquear las tarjetas cuando el tiempo llegue a 0
//       loseAudio.play();
//       mostrarTiempo.innerHTML = "¡Tiempo agotado!";  // Mostrar un mensaje cuando el tiempo se acabe
//       setTimeout(reiniciarJuego, 3000);  // Espera 3 segundos antes de reiniciar
//     }
//   }, 1000);
// }

// function bloquearTarjetas() {
//   for (let i = 0; i <= 15; i++) {
//     let tarjetaBloquiada = document.getElementById(i);
//     tarjetaBloquiada.innerHTML = `<img src="./img/${numeros[i]}.jpg" alt= "">`;
//     tarjetaBloquiada.disabled = true;
//   }
// }

// function reiniciarJuego() {
//     clearInterval(tiempoRegresivoId);

//     // Configurar el tiempo inicial según el nivel actual
//     if (nivelActual === 1) {
//         timer = 60;
//     } else if (nivelActual === 2) {
//         timer = 50;
//     } else if (nivelActual === 3) {
//         timer = 40;
//     } else if (nivelActual === 4) {
//         timer = 30;
//     } else if (nivelActual === 5) {
//         timer = 20;
//     }

//     movimientos = 0;
//     aciertos = 0;
//     temporizador = false;
//     tarjetasDestapadas = 0;

//     // Actualizar estadísticas y mostrar nivel
//     mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;
//     mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
//     mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
//     mostrarNiveles.innerHTML = `Niveles Pasados: ${nivelesPasados}`;

//     // Generar nuevos números y restablecer las tarjetas
//     numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
//     numeros = numeros.sort(() => Math.random() - 0.5);
//     for (let i = 0; i <= 15; i++) {
//         let tarjeta = document.getElementById(i);
//         tarjeta.disabled = false;
//         tarjeta.innerHTML = ' ';
//     }
// }






// // FUNCION PRINCIPAL
// function destapar(id) {
//   if (temporizador == false) {
//     contarTiempo();
//     temporizador = true;
//   }

//   tarjetasDestapadas++;
//   console.log(tarjetasDestapadas);

//   if (tarjetasDestapadas == 1){
//     // MOSTRAR PRIMER IMG
//     tarjeta1 = document.getElementById(id);
//     primerResultado = numeros[id];
//     tarjeta1.innerHTML = `<img src="./img/${primerResultado}.jpg" alt= "">`;
//     clickAudio.play();

//     // DESHABILITAR PRIMER BOTON
//     tarjeta1.disabled = true;
//     }else if(tarjetasDestapadas == 2) {
//       // MOSTRAR SEGUNDO NUMERO
//       tarjeta2 = document.getElementById(id);
//       segundoResultado = numeros[id];
//       tarjeta2.innerHTML = `<img src="./img/${segundoResultado}.jpg" alt= "">`;

//       // DESHABILITAR SEGUNDO BOTON
//       tarjeta2.disabled = true;
  
//       // INCREMENTAR MOVIMIENTOS
//       movimientos++;
//       mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;


//   if (primerResultado == segundoResultado) {
//     // ENCERRAR CONTADOR TARJETAS DESTAPADAS
//     tarjetasDestapadas = 0;

//     // AUMENTAR ACIERTOS
//     aciertos++;
//     mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
//     rightAudio.play();
  
//     if (aciertos == 8) {
//       winAudio.play();
//       clearInterval(tiempoRegresivoId)
//       mostrarAciertos.innerHTML = `Aciertos: ${aciertos} 🥳️`;
//       mostrarTiempo.innerHTML = `Fantástico sólo demorastes ${timerIncial - timer} segundos`;
//       mostrarMovimientos.innerHTML = `Movimientos: ${movimientos} 🤭😎`;
      
//       nivelActual++; // Incrementa el nivel
//       nivelesPasados++; // Acumula niveles pasados
//       mostrarNiveles.innerHTML = `Niveles Pasados: ${nivelesPasados}`;

//       // Añadir el nivel pasado a la lista
//       const li = document.createElement('li');
//       li.textContent = `Nivel ${nivelActual}`;
//       listaNiveles.appendChild(li);

//       if (nivelActual > 5) {
//         alert("¡Felicidades! Has llegado al nivel 5 y ganaste tu premio!");
//         // Aquí podrías redirigir a una página de premio o mostrar un modal con el premio.
//         return;
//         }
      
//       // Llamar a reiniciar el juego automáticamente después de ganar
//       setTimeout(reiniciarJuego, 15000);  // Espera 5 segundos antes de reiniciar
//       }
//     } else {
//         wrongAudio.play();
//         // MOSTRAR MOMENTANIMENTE VALORES Y VALORES A TAPA
//         setTimeout(() => {
//         tarjeta1.innerHTML = ' ';
//         tarjeta2.innerHTML = ' ';
//         tarjeta1.disabled = false;
//         tarjeta2.disabled = false;
//         tarjetasDestapadas = 0;
//       },800);
//     }
//   }
// }



// INICIALIZACION DE VARIABLES
let tarjetasDestapadas = 0;
let tarjeta1 = null;
let tarjeta2 = null;
let primerResultado = null;
let segundoResultado = null;
let movimientos = 0;
let aciertos = 0;
let temporizador = false;
let timer = 60;
let timerIncial = 60;
let tiempoRegresivoId = null;

let nivelActual = 1; // Nivel inicial
let nivelesPasados = 0; // Niveles pasados acumulados

// AUDIO
const winAudio = new Audio('../sounds/win.mp3');
const loseAudio = new Audio('../sounds/lose.mp3');
const clickAudio = new Audio('../sounds/click.mp3');
const rightAudio = new Audio('../sounds/right.mp3');
const wrongAudio = new Audio('../sounds/wrong.mp3');

// APUNTANDO A DOCUMENTO HTML
const mostrarMovimientos = document.getElementById('movimientos');
const mostrarAciertos = document.getElementById('aciertos');
const mostrarTiempo = document.getElementById('t-restante');
const mostrarNiveles = document.getElementById('niveles-pasados').querySelector('h2');
const listaNiveles = document.getElementById('lista-niveles');

// CONFIGURACION DE NIVELES
const tiempoPorNivel = {
  1: 60,
  2: 50,
  3: 40,
  4: 30,
  5: 20
};

// GENERACION DE NUMEROS ALEATORIOS
let numeros = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8];
numeros = shuffleArray(numeros); // Orden aleatorio de números
console.log(numeros);

// Función para mezclar el array
function shuffleArray(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

// Función para contar el tiempo
function contarTiempo() {
  tiempoRegresivoId = setInterval(() => {
    if (timer > 0) {
      timer--;
      mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
    } else {
      clearInterval(tiempoRegresivoId);
      bloquearTarjetas();
      loseAudio.play();
      mostrarTiempo.innerHTML = "¡Tiempo agotado!";
      setTimeout(reiniciarJuego, 3000);
    }
  }, 1000);
}

// Función para bloquear todas las tarjetas
function bloquearTarjetas() {
  for (let i = 0; i <= 15; i++) {
    let tarjetaBloquiada = document.getElementById(i);
    tarjetaBloquiada.innerHTML = `<img src="${rutaImagenes}${numeros[i]}.jpg" alt= "">`;
    tarjetaBloquiada.disabled = true;
  }
}

// Función para reiniciar el juego
function reiniciarJuego() {
  clearInterval(tiempoRegresivoId);

  // Configurar el tiempo inicial según el nivel actual
  timer = tiempoPorNivel[nivelActual];

  // Restablecer las variables del juego
  movimientos = 0;
  aciertos = 0;
  tarjetasDestapadas = 0;
  temporizador = false;

  // Actualizar estadísticas y mostrar nivel
  mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;
  mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
  mostrarTiempo.innerHTML = `Tiempo: ${timer} segundos`;
  mostrarNiveles.innerHTML = `Niveles Pasados: ${nivelesPasados}`;

  // Generar nuevos números y restablecer las tarjetas
  numeros = shuffleArray([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]);

  // Reiniciar todas las tarjetas a su estado inicial
  for (let i = 0; i <= 15; i++) {
    let tarjeta = document.getElementById(i);
    tarjeta.disabled = false;
    tarjeta.innerHTML = ' ';
  }
}

// Función para incrementar el nivel
function incrementarNivel() {
  if (nivelActual < 5) {
    nivelActual++;
    nivelesPasados++;
    mostrarNiveles.innerHTML = `Niveles Pasados: ${nivelesPasados}`;

    // Añadir el nivel a la lista
    const li = document.createElement('li');
    li.textContent = `Nivel ${nivelActual}`;
    listaNiveles.appendChild(li);

    // Configuración de tiempo para el siguiente nivel
    timer = tiempoPorNivel[nivelActual];
    setTimeout(reiniciarJuego, 15000);  // Espera 15 segundos antes de iniciar el siguiente nivel
  } else {
    alert("¡Felicidades! Has llegado al nivel 5 y ganaste tu premio!");
  }
}

// Función principal para destapar las tarjetas
function destapar(id) {
  if (!temporizador) {
    contarTiempo();
    temporizador = true;
  }

  tarjetasDestapadas++;
  console.log(tarjetasDestapadas);

  if (tarjetasDestapadas === 1) {
    // Mostrar primer imagen
    tarjeta1 = document.getElementById(id);
    primerResultado = numeros[id];
    tarjeta1.innerHTML = `<img src="${rutaImagenes}${primerResultado}.jpg" alt= "">`;
    clickAudio.play();
    tarjeta1.disabled = true;
  } else if (tarjetasDestapadas === 2) {
    // Mostrar segundo número
    tarjeta2 = document.getElementById(id);
    segundoResultado = numeros[id];
    tarjeta2.innerHTML = `<img src="${rutaImagenes}${segundoResultado}.jpg" alt= "">`;
    tarjeta2.disabled = true;

    // Incrementar movimientos
    movimientos++;
    mostrarMovimientos.innerHTML = `Movimientos: ${movimientos}`;

    // Comprobar si las tarjetas coinciden
    if (primerResultado === segundoResultado) {
      tarjetasDestapadas = 0;
      aciertos++;
      mostrarAciertos.innerHTML = `Aciertos: ${aciertos}`;
      rightAudio.play();

      if (aciertos === 8) {
        winAudio.play();
        clearInterval(tiempoRegresivoId);
        mostrarAciertos.innerHTML = `Aciertos: ${aciertos} 🥳️`;
        mostrarTiempo.innerHTML = `Fantástico, solo demoraste ${timerIncial - timer} segundos`;
        mostrarMovimientos.innerHTML = `Movimientos: ${movimientos} 🤭😎`;

        // Incrementar nivel y actualizar
        incrementarNivel();
      }
    } else {
      wrongAudio.play();
      setTimeout(() => {
        tarjeta1.innerHTML = ' ';
        tarjeta2.innerHTML = ' ';
        tarjeta1.disabled = false;
        tarjeta2.disabled = false;
        tarjetasDestapadas = 0;
      }, 800);
    }
  }
}
