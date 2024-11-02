//Variables para botones
let button,
  simular = false;
pausar = false;

// Variables para el canvas
let containerWidth = document.getElementById("simulator-container").offsetWidth;
let containerHeight = document.getElementById(
  "simulator-container"
).offsetHeight;

//Variables de constantes para el sistema
let bandera = 0,
  paso = 0,
  Periodo,
  Frecuencia;

//Variables para los sliders
let sliderMasaPolea, sliderMasa, sliderK, sliderPosicion, sliderVelocidad;

//Variables de cambio (sliders)
let valorMasaPolea,
  valorMasa,
  valorElastica1,
  valorElastica2,
  valorPosicionBloque,
  valorPosicionPolea,
  valorVelocidad;

//Variables para indicar la posición de los datos
let widthX = screen.width,
  widthY = screen.height,
  positionSliderX = 1000,
  positionTextX = positionSliderX - 200;

//Variables para: polea y resorte

let posicionInicial,
  velocidadInicial,
  anchor,
  resorteLength = 100;
//Variables utilizadas en los calculos
let w0 = 0,
  Amplitud = 0,
  Inercia = 0,
  Radio = 1,
  Phi = 0,
  t = 0,
  anguloPolea = 0,
  posEquilibrio = 255,
  thetaPrima = 0,
  seno = -1,
  Relacion1A = 0,
  Relacion1B = 0,
  Relacion2A = 0,
  Relacion2B = 0,
  coseno = 1;
 (A1 = 0), (A2 = 0), (B1 = 0), (B2 = 0);

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0;
var cnt1 = 0,
  cnt2 = 0,
  cnt3 = 0;

//Variable para simular la gravedad
let gravity = 9.8;
let scaleFactor = 5;

let img;

// Load the image and create a p5.Image object.
function preload() {
  img = loadImage("./iron.jpg");
}
//Funcion propia de P5 para poder dibujar constantemente lo que se necesita
function draw() {
  //informacion();
  if (simular && !pausar) {
    clear(); // Verifica si la simulación está pausada
    obtenerValores();
    simularCaso();
  }
}

//Funcion para predefinir la configuración del sistema
function setup() {
  //Se crea el canvas
  let canvas = createCanvas(containerWidth, containerHeight, WEBGL);
  canvas.parent("simulator-container");
  initControles(); //Botones
  angleMode(RADIANS); //Cambia el valor del angulo a grados
  anchor = createVector(255, 291);

  valorMasa = document.getElementById("m-slider").value;
  valorElastica1 = document.getElementById("k1-slider").value;
  valorElastica1 = document.getElementById("k2-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorPosicionBloque = document.getElementById("PB-slider").value;
  valorPosicionPolea = document.getElementById("PP-slider").value;
}
//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("m-slider").value;
  valorElastica1 = document.getElementById("k1-slider").value;
  valorElastica2 = document.getElementById("k2-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorPosicionBloque = document.getElementById("PB-slider").value;
  valorPosicionPolea = document.getElementById("PP-slider").value;

  document.getElementById("sliderMValue").innerText = +valorMasa;
  document.getElementById("sliderK1Value").innerText = +valorElastica1;
  document.getElementById("sliderK2Value").innerText = +valorElastica2;
  document.getElementById("sliderMPoleaValue").innerText = +valorMasaPolea;
  document.getElementById("sliderPBValue").innerText = +valorPosicionBloque;
  document.getElementById("sliderPPValue").innerText = +valorPosicionPolea;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById("m-slider").value);
  valorElastica1 = parseFloat(document.getElementById("k1-slider").value);
  valorElastica2 = parseFloat(document.getElementById("k2-slider").value);
  valorMasaPolea = parseFloat(document.getElementById("M-slider").value);
  valorPosicionBloque = document.getElementById("PB-slider").value;
  valorPosicionPolea = document.getElementById("PP-slider").value;
}

//Funcion para simular el caso correspondiente
function simularCaso() {
  push();
  // Dibuja la polea y la cuerda conectada
  polea();
  pop();
  // Dibuja el resorte conectado a la polea y al soporte del suelo
  resorte1();

  // Dibuja el rectángulo de anclaje del resorte al suelo
  rect(25, 150, 50, 5);
}

function updateSliderValue(sliderId, displayId) {
  let slider = document.getElementById(sliderId);
  let display = document.getElementById(displayId);

  if (slider && display) {
    display.textContent = slider.value;
  }
}

//Funcion para mostrar los botones de simulación y reinicio
function initControles() {
  // Obtener los botones del DOM
  const simularButton = document.getElementById("simularButton");
  const reiniciarButton = document.getElementById("reiniciarButton");

  // Asignar funciones a los botones
  simularButton.addEventListener("click", () => {
    simular = true;
    pausar = false;
  });

  reiniciarButton.addEventListener("click", () => {
    if (!pausar) {
      // Verifica si la simulación está pausada
      pausar = true; // Cambia el estado de pausa
    }
  });
}

//Funcion para simular un pendulo y sus calculos
function polea() {
  if (bandera < 1) {
    Phi = 0;
    // Calcular la nueva posición de la masa en función del tiempo
    Inercia = (valorMasaPolea * Math.pow(Radio, 2)) / 2; // Inercia de la polea
    W1 =
      (((3 * valorElastica1 + 2 * valorElastica2) / valorMasaPolea) -
      Math.sqrt(
        pow((3 * valorElastica1 + 2 * valorElastica2) / valorMasaPolea, 2) -
          (8 * valorElastica1 * valorElastica2) / (valorMasaPolea * valorMasa)
      ))/ 2;
    
    W2 =
      ((3 * valorElastica1 + 2 * valorElastica2) / valorMasaPolea +
      Math.sqrt(
        pow((3 * valorElastica1 + 2 * valorElastica2) / valorMasaPolea, 2) -
          (8 * valorElastica1 * valorElastica2) / (valorMasaPolea * valorMasa)
      ))/2;
    
    
    // Relación entre amplitudes según las condiciones iniciales y frecuencias naturales
    Relacion1A = ((valorElastica2 * Radio) / (valorElastica2 - valorMasa * W1));
    Relacion2A = ((valorElastica2 * Radio) / (valorElastica2 - valorMasa * W2));
    
    console.log(Relacion1A);
    console.log(Relacion2A);

    B2 = (valorPosicionBloque - (Relacion1A * valorPosicionPolea))/ -Relacion1A + Relacion2A;
    console.log( "B2: " + B2);
   
    if (valorPosicionBloque > 0 && valorPosicionPolea > 0) {
      // 1er modo de vibración A1/A2 = +
      B1 = valorPosicionPolea - B2;
      A1 = Relacion1A * B1;
      B2 = 0;
      A2 = 0;
    } else if (valorPosicionBloque < 0 && valorPosicionPolea > 0) {
      // 2do modo de vibración A1/A2 = -
      B1 = 0;
      A1 = 0;
      B2 = B2;
      A2 = Relacion2A * B2;
      
      
    } else if (valorPosicionBloque > 0 && valorPosicionPolea < 0) {
      A1 = 0;
      B1 = 0;
      B2 = B2;
      A2 = Relacion2A * B2;
    } else if (valorPosicionBloque == 0 && valorPosicionPolea > 0) {
      // 3er modo de vibración combinación de los modos de vibración.

      B1 = (valorPosicionPolea - B2) /2;
      A1 = (Relacion1A * B1) / 2;
      B2 = -B1;
      A2 = -A1;
    } else if (valorPosicionBloque > 0 && valorPosicionPolea == 0) {
      // 3er modo de vibración combinación de los modos de vibración.

      B1 = (valorPosicionPolea - B2) /2;
      A1 = (Relacion1A * B1) / 2;
      B2 = B1;
      A2 = A1;
    } else if (valorPosicionBloque < 0 && valorPosicionPolea == 0) {
      // 3er modo de vibración combinación de los modos de vibración.

      B1 = -(valorPosicionPolea - B2) /2;
      A1 = -(Relacion1A * B1) / 2;
      B2 = B1;
      A2 = A1;
    } else if (valorPosicionBloque == 0 && valorPosicionPolea < 0) {
      // 3er modo de vibración combinación de los modos de vibración.

      B1 = -(valorPosicionPolea - B2) /2;
      A1 = -(Relacion1A * B1) / 2;
      B2 = B1;
      A2 = A1;
    } else {
      // (valorPosicionBloque < 0 && valorPosicionPolea < 0)
      // 1er modo de vibración A1/A2 = +
      B1 = valorPosicionPolea - B2;
      A1 = Relacion1A * B1;
      B2 = 0;
      A2 = 0;
    }



    A1 = Number(A1);
    A2 = Number(A2);
    B1 = Number(B1);
    B2 = Number(B2);

  }

  bandera++;

  // Posición de la masa
  let xt =
    A1.toFixed(2) * cos(Math.sqrt(W1.toFixed(3)) * t.toFixed(3)) -
    A2.toFixed(3) * cos(Math.sqrt(W2.toFixed(3)) * t.toFixed(3));
  let xtB =
    B1.toFixed(3) * cos(Math.sqrt(W1.toFixed(3)) * t.toFixed(3)) +
    B2.toFixed(3)* cos(Math.sqrt(W2.toFixed(3)) * t.toFixed(3));

  if (!isNaN(xt)) {
    posicionInicial = xt * scaleFactor; // Actualiza la posición inicial
  }
  console.log("Xtb: " + xtB);
  anguloPolea = (xtB / Radio);
  console.log("anguloPolea: " + anguloPolea);

  // Dibuja el soporte de la polea
  fill(150); // Color gris para el soporte
  rect(0, -160, 15, 70); // Soporte de la polea

  /*-----Polea-----*/
  push();
  pointLight(255, 255, 255, 30, -20, 40);
  specularColor("gray");
  specularMaterial(250, 100, 55);

  // Dibuja la polea
  translate(8, -50);
  rotate(anguloPolea);
  fill(233, 233, 233); // Color de la polea
  strokeWeight(1.8);
  stroke(0, 150);
  ellipse(0, 0, 90, 90); // Coordenadas (x, y) y diámetro (90)
  line(0, 0, 45, 0);

  pop();

  // Dibuja la cuerda hacia la masa a la izquierda
  push();
  strokeWeight(1.5);
  stroke(120, 60, 20); // Color marrón para simular una cuerda de fibra
  line(-37, -50, -37, -20); // Cuerda vertical hacia la masa
  resorte2();

  pop();

  // Dibuja la masa
  push();
  pointLight(255, 255, 255, 30, -20, 40);
  specularColor("gray");
  specularMaterial(250, 100, 55);
  fill(43, 122, 33); // Color de la masa
  rect(-56, 50 + posicionInicial, 40, 40); // Masa de 40x40
  pop();

  // Dibuja la cuerda hacia el resorte a la derecha
  push();
  let tensionY = -50; // Altura donde la cuerda sale de la polea hacia la derecha
  let tensionX = 53; // Posición x del resorte
  strokeWeight(1.5);
  stroke(120, 60, 20); // Color marrón para simular una cuerda de fibra
  line(53, tensionY, tensionX, 50 - posicionInicial); // Invertir el movimiento
  pop();

  if (paso < 1) {
    graficas();
  }
  paso++;

  // Incrementar el tiempo
  t += 0.01;

  // Actualizar la ecuación de movimiento en pantalla
  let resultado = document.getElementById("Ecuacion");
  let resultado2 = document.getElementById("Ecuacion2");
  resultado.innerHTML =
    "y(t)= " +
    A1.toFixed(3) +
    " * cos(" +
    Math.sqrt(W1).toFixed(2) +
    " * " +
    t.toFixed(2) +
    ") + " +
    A2.toFixed(3) +
    " * cos(" +
    Math.sqrt(W2).toFixed(2) +
    " * " +
    t.toFixed(2) +
    ")";

  resultado2.innerHTML =
    "Θ(t)= " +
    B1.toFixed(3) +
    " * cos(" +
    Math.sqrt(W1).toFixed(2) +
    " * " +
    t.toFixed(2) +
    ") + " +
    B2.toFixed(3) +
    " * cos(" +
    Math.sqrt(W2).toFixed(2) +
    " * " +
    t.toFixed(2) +
    ")";
}

// Funcion que simula un resorte
function resorte1() {
  push();
  noFill();
  strokeWeight(2); // Aumentar el grosor de la línea

  let numSegments = 200; // Número de segmentos del resorte

  // Coordenadas del extremo inferior de la cuerda
  let cuerdaX = 53;
  let cuerdaY = 50 - posicionInicial; // Invertir la posición para la cuerda

  // Actualiza la posición del ancla del resorte
  anchor.x = cuerdaX;
  anchor.y = cuerdaY;

  // Coordenadas del extremo fijo inferior del resorte
  let fixedX = 50;
  let fixedY = 150;

  beginShape();
  for (let i = 0; i < numSegments; i++) {
    let t = map(i, 0, numSegments, 0, TWO_PI * 5); // Ajusta el rango de la función sinusoidal
    let xOffset = 10 * sin(t); // Amplitud de la espiral

    // El extremo inferior del resorte está fijo, por lo que usamos fixedX y fixedY
    let endX = lerp(anchor.x, fixedX, i / numSegments); // Interpolación entre el extremo superior y el extremo fijo
    let endY = lerp(anchor.y, fixedY, i / numSegments); // Interpolación entre el extremo superior y el extremo fijo

    vertex(endX + xOffset, endY); // Dibujar cada punto del resorte
  }
  endShape();
  pop();
}
function resorte2() {
  push();
  noFill();
  strokeWeight(2); // Aumentar el grosor de la línea

  let numSegments = 200; // Número de segmentos del resorte

  // Coordenadas del extremo inferior de la cuerda
  let cuerdaX = -37;
  let cuerdaY = -20; // Invertir la posición para la cuerda

  // Actualiza la posición del ancla del resorte
  anchor.x = cuerdaX;
  anchor.y = cuerdaY;

  // Coordenadas del extremo fijo inferior del resorte
  let fixedX = -32;
  let fixedY = 50 + posicionInicial;

  beginShape();
  for (let i = 0; i < numSegments; i++) {
    let t = map(i, 0, numSegments, 0, TWO_PI * 5); // Ajusta el rango de la función sinusoidal
    let xOffset = 10 * sin(t); // Amplitud de la espiral

    // El extremo inferior del resorte está fijo, por lo que usamos fixedX y fixedY
    let endX = lerp(anchor.x, fixedX, i / numSegments); // Interpolación entre el extremo superior y el extremo fijo
    let endY = lerp(anchor.y, fixedY, i / numSegments); // Interpolación entre el extremo superior y el extremo fijo

    vertex(endX + xOffset, endY); // Dibujar cada punto del resorte
  }
  endShape();
  pop();
}

/* Sección de graficas */

//Funciones para simular el movimiento de X (Posicion), V (Velocidad), A (Aceleracion)
function getDataPositionA() {
  var XtA =
  A1.toFixed(2) * cos(Math.sqrt(W1.toFixed(3)) * t.toFixed(3)) +
  A2.toFixed(3) * cos(Math.sqrt(W2.toFixed(3)) * t.toFixed(3));
  return XtA;
}
function getDataPositionB() {
  var XtB =
  B1.toFixed(3) * cos(Math.sqrt(W1.toFixed(3)) * t.toFixed(3)) +
  B2.toFixed(3) * cos(Math.sqrt(W2.toFixed(3)) * t.toFixed(3));
  return XtB;
}

function graficas() {
  if (!pausar) {
    // Verifica si la simulación está pausada
    var layout = {
      title: "Movimientos",
      autosize: true,
      height: 300,
      xaxis: { title: "Tiempo (s)", range: [0, 300] },
      yaxis: { title: "Amplitud (rad)" },
      legend: {
        x: 0,
        y: -1,
      },
    };

    let positionDataA = {
      y: [getDataPositionA()],
      type: "line",
      name: "Posición y(t)",
      line: { color: "red" }
    };
    let positionDataB = {
      y: [getDataPositionB()],
      type: "line",
      name: "Posición Θ(t)",
      line: { color: "gold", width: 2.5, dash: "dashdot" }
    };

    Plotly.newPlot("Movimientos", [positionDataA, positionDataB], layout);
    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.01;
        tV += 0.01;
        //tA += 0.01;
        Plotly.extendTraces("Movimientos", { y: [[getDataPositionA()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataPositionB()]] }, [1]);
        /*Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [
          2,
        ]);*/
      }
    }, 5);
  }
}
