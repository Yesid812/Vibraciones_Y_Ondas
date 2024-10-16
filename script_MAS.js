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
let valorMasaPolea, valorMasa, valorElastica, valorPosicion, valorVelocidad;

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
  Radio = 0.2,
  Phi = 0,
  t = 0,
  anguloPolea = 0,
  posEquilibrio = 255,
  thetaPrima = 0,
  seno = -1,
  coseno = 1;

//Variables de tiempo para graficas
let tX = 0,
  tV = 0,
  tA = 0;
var cnt1 = 0,
  cnt2 = 0,
  cnt3 = 0;

//Variable para simular la gravedad
let gravity = 9.8;
let scaleFactor = 10;

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
  valorElastica = document.getElementById("k-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorVelociad = document.getElementById("V-slider").value;
  valorPosicion = document.getElementById("P-slider").value;
}
//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("m-slider").value;
  valorElastica = document.getElementById("k-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorVelocidad = document.getElementById("V-slider").value;
  valorPosicion = document.getElementById("P-slider").value;

  document.getElementById("sliderMValue").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderMPoleaValue").innerText = +valorMasaPolea;
  document.getElementById("sliderPValue").innerText = +valorPosicion;
  document.getElementById("sliderVValue").innerText = +valorVelocidad;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById("m-slider").value);
  valorElastica = parseFloat(document.getElementById("k-slider").value);
  valorMasaPolea = parseFloat(document.getElementById("M-slider").value);
  valorVelocidad = parseFloat(document.getElementById("V-slider").value);
  valorPosicion = parseFloat(document.getElementById("P-slider").value);
}

//Funcion para simular el caso correspondiente
function simularCaso() {

  
  push();
  // Dibuja la polea y la cuerda conectada
  polea();
  pop();
  // Dibuja el resorte conectado a la polea y al soporte del suelo
  resorte();

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
    // Calcular la nueva posición de la masa en función del tiempo
    Inercia = (valorMasaPolea * Math.pow(Radio, 2)) / 2; // Inercia de la polea
    w0 = Math.sqrt(valorElastica / (valorMasa + valorMasaPolea / 2)); // Frecuencia angular

    // Verificar si la posición inicial es 0 para ajustar la fase según la velocidad
    if (valorPosicion === 0) {
      if (valorVelocidad > 0) {
        // Velocidad positiva: Primer cuadrante, Phi = π/2
        Phi = Math.PI / 2;
      } else if (valorVelocidad < 0) {
        // Velocidad negativa: Tercer cuadrante, Phi = 3π/2
        Phi = 3 * Math.PI / 2;
      }
      Amplitud = valorVelocidad / (w0 * Math.sin(Phi)); // Calcular amplitud
    } else {
      // Si posición inicial no es 0, calcular Phi en función de posición y velocidad inicial
      Phi = Math.abs(Math.atan(valorVelocidad / (valorPosicion * w0))); // Fase inicial sin corrección
      if (coseno * valorPosicion <= 0 && seno * valorVelocidad > 0) {
        // cos- sen+ c2: Segundo cuadrante
        Phi = Math.PI - Phi;
      }
      if (coseno * valorPosicion <= 0 && seno * valorVelocidad < 0) {
        // cos- sen- c3: Tercer cuadrante
        Phi = Math.PI + Phi;
      }
      if (coseno * valorPosicion >= 0 && seno * valorVelocidad < 0) {
        // cos+ sen- c4: Cuarto cuadrante
        Phi = 2 * Math.PI - Phi;
      }
      Amplitud = Math.abs(valorPosicion) / Math.cos(Phi); // Calcular amplitud con la posición
    }

    console.log("Fase:", Phi);
    console.log("Amplitud:", Amplitud);
    PhiPrima = parseFloat(Phi.toFixed(3));
  }

  bandera++;

  // Posición de la masa
  let xt = Amplitud * Math.cos(w0 * t + Phi);
  if (!isNaN(xt)) {
    posicionInicial = xt * scaleFactor; // Actualiza la posición inicial
  }

  anguloPolea = (-xt / Radio);

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
  line(-37, -50, -37, 50 + posicionInicial); // Cuerda vertical hacia la masa
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
  resultado.innerHTML =
    "X(t)= " +
    Amplitud.toFixed(2) +
    " * cos(" +
    w0.toFixed(2) +
    " * " +
    t.toFixed(2) +
    " + " +
    PhiPrima.toFixed(2) +
    ")";
}


// Funcion que simula un resorte
function resorte() {
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

/* Sección de graficas */

//Funciones para simular el movimiento de X (Posicion), V (Velocidad), A (Aceleracion)
function getDataPosition() {
  var Xt = Amplitud * Math.cos(w0 * tX + Phi); //Cambiarla si es necesario
  return Xt;
}
function getDataVelocity() {
  var Vt = -Amplitud * w0 * Math.sin(w0 * tV + Phi); //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = -Amplitud * pow(w0, 2) * Math.cos(w0 * tV + Phi); //Cambiarla si es necesario
  return At;
}

function graficas() {
  if (!pausar) {
    // Verifica si la simulación está pausada
    var layout = {
      autosize: true,
      xaxis: { title: "Tiempo (s)", range: [0, 50] }, // Ajusta el rango inicial del eje x para un zoom reducido
      yaxis: { title: "Amplitud (rads)" },
      legend: { x: 0, y: 1.2, orientation: "h" }, // Ajusta la posición de la leyenda
      margin: { t: 50, b: 40, l: 50, r: 50 }, // Ajusta los márgenes del gráfico
    };

    // Asegura que la posición inicial sea 0
    tX = 0;

    let positionData = {
      y: [getDataPosition()],
      type: "line",
      name: "Posición",
    };
    let velocityData = {
      y: [getDataVelocity()],
      type: "line",
      name: "Velocidad",
    };
    let acelerationData = {
      y: [getDataAceleration()],
      type: "line",
      name: "Aceleración",
    };

    Plotly.newPlot(
      "Movimientos",
      [positionData, velocityData, acelerationData],
      layout
    );

    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.1; // Incremento de tiempo aumentado para velocidad
        tV += 0.1;
        tA += 0.1;

        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [
          2,
        ]);

        // Ajusta el rango del eje x para que se mueva con los datos
        let update = {
          xaxis: { range: [tX, tX + 50] }, // Ajusta el rango del eje x para que comience en tX y termine en tX + 50
        };
        Plotly.relayout("Movimientos", update);
      }
    }, 20); // Intervalo reducido para una mayor velocidad de animación
  }
}
