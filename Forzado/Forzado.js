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
  valorElastica,
  valorPosicion,
  valorTorque,
  valorAmortiguamiento,
  valorFuerzaExterna;

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
  mTotal = 0,
  Radio = 0.2,
  Phi = 0,
  t = 0,
  D = 0,
  Delta = 0,
  seno = -1,
  coseno = 1;

//Variables para las graficas
let xt = 0,
  vt = 0,
  at = 0;
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
  img = loadImage("../iron.jpg");
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
  valorTorque = document.getElementById("T-slider").value;
  valorAmortiguamiento = document.getElementById("B-slider").value;
  valorFuerzaExterna = document.getElementById("w-slider").value;
}
//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("m-slider").value;
  valorElastica = document.getElementById("k-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorTorque = document.getElementById("T-slider").value;
  valorAmortiguamiento = document.getElementById("B-slider").value;
  valorFuerzaExterna = document.getElementById("w-slider").value;

  document.getElementById("sliderMValue").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderMPoleaValue").innerText = +valorMasaPolea;
  document.getElementById("sliderTValue").innerText = +valorTorque;
  document.getElementById("sliderBValue").innerText = +valorAmortiguamiento;
  document.getElementById("sliderWValue").innerText = +valorFuerzaExterna;
}

function obtenerValores() {
  valorMasa = parseFloat(document.getElementById("m-slider").value);
  valorElastica = parseFloat(document.getElementById("k-slider").value);
  valorMasaPolea = parseFloat(document.getElementById("M-slider").value);
  valorTorque = parseFloat(document.getElementById("T-slider").value);
  valorAmortiguamiento = parseFloat(document.getElementById("B-slider").value);
  valorFuerzaExterna = parseFloat(document.getElementById("w-slider").value);
}

//Funcion para simular el caso correspondiente
function simularCaso() {
  // Dibuja la polea y la cuerda conectada
  polea();

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
    // Calcular la mTotal y la frecuencia natural
    mTotal = valorMasa + valorMasaPolea / 2; // Masa efectiva
    w0 = sqrt(valorElastica / mTotal); // Frecuencia angular natural
    coeficienteDeAmortiguamiento = valorAmortiguamiento / (2 * mTotal); // Coeficiente de amortiguamiento

    let denominador = pow(w0, 2) - pow(valorFuerzaExterna, 2);
    //cos+ sen+ c1
    //Primer cuadrande, queda tal cual.
    if (denominador < 0) {
      //cos- sen+ c2
      Delta = Math.PI - Math.abs(Delta);
    }
    // Condiciones para el movimiento forzado

    if (valorAmortiguamiento === 0) {
      // Sin amortiguamiento
      if (valorFuerzaExterna !== w0) {
        // Movimiento sin resonancia
        if (valorFuerzaExterna > w0) {
          D =
            (valorTorque/(mTotal))/ (pow(valorFuerzaExterna, 2) - pow(w0, 2));
          Delta = Math.PI; // Solo se usa phi
        } else {
          D =
            (valorTorque /(mTotal)) / (pow(w0, 2) - pow(valorFuerzaExterna, 2));
          Delta = 0; // Sin desfase
          console.log("Sin desfase", (pow(w0, 2) - pow(valorFuerzaExterna, 2)));
        }
      } else {
        // Caso de resonancia sin amortiguamiento
        D = valorTorque / (2 * w0 * mTotal);
      }
    } else {
      // Movimiento con amortiguamiento
      // Calcula el numerador y denominador de la tangente para determinar el cuadrante
      let numerador = 2 * coeficienteDeAmortiguamiento * valorFuerzaExterna;
      let denominador = pow(w0, 2) - pow(valorFuerzaExterna, 2);

      // Calcular el valor de Delta inicial
      Delta = Math.atan(numerador / denominador);

      // Ajustar el ángulo Delta según el cuadrante
      if (denominador > 0 && numerador > 0) {
        // Primer cuadrante: cos+ sen+, no es necesario ajuste.
        // Delta queda tal cual.
      } else if (denominador < 0 && numerador > 0) {
        // Segundo cuadrante: cos- sen+
        Delta = Math.PI - Math.abs(Delta);
      } else if (denominador < 0 && numerador < 0) {
        // Tercer cuadrante: cos- sen-
        Delta = Math.PI + Math.abs(Delta);
      } else if (denominador > 0 && numerador < 0) {
        // Cuarto cuadrante: cos+ sen-
        Delta = 2 * Math.PI - Math.abs(Delta);
      }
      D =
        valorTorque /
        (mTotal *
          sqrt(
            pow(2 * coeficienteDeAmortiguamiento * valorFuerzaExterna, 2) +
              pow(pow(w0, 2) - pow(valorFuerzaExterna, 2), 2)
          ));
      console.log("w0", w0);
    }

    // Actualizar bandera
    bandera++;
  }

  // Calcular la posición, velocidad y aceleración de la masa
  if (valorFuerzaExterna != w0 && valorAmortiguamiento === 0) {
    console.log("Entrando a forzado sin amortiguamiento");
    // Caso de resonancia sin amortiguamiento
    xt = D * Math.sin(valorFuerzaExterna * t - Delta);
    vt = D * Math.sin(valorFuerzaExterna * t) - D * t * valorFuerzaExterna * Math.cos(valorFuerzaExterna * t);
    at =
      -D * valorFuerzaExterna * Math.cos(valorFuerzaExterna * t) -
      D * valorFuerzaExterna * Math.cos(valorFuerzaExterna * t) +
      D * t * pow(valorFuerzaExterna, 2) * Math.sin(valorFuerzaExterna * t);

    let resultado = document.getElementById("Ecuacion");
    resultado.innerHTML = `X(t) = ${D.toFixed(2)}  cos(${valorFuerzaExterna.toFixed(
      2
    )} * ${t.toFixed(2)} - ${Delta.toFixed(2)})`;
  } else if (valorFuerzaExterna === w0 && valorAmortiguamiento === 0) {
    // Caso de resonancia sin amortiguamiento
    console.log("Entrando a forzado sin amortiguamiento con resonancia");
    t += 0.5;
    xt = D * t * Math.sin(w0 * t);
    vt = D * Math.sin(w0 * t) + D * w0 * t * Math.cos(w0 * t);
    at = 2 * D * w0 * Math.cos(w0 * t) - D * t * w0 ** 2 * Math.sin(w0 * t);

    let resultado = document.getElementById("Ecuacion");
    resultado.innerHTML = `X(t) = ${D.toFixed(2)} * t * sin(${w0.toFixed(2)} * t)`;
  } else {
    // Movimiento forzado
    xt = D * Math.cos(valorFuerzaExterna * t - Delta);
    console.log("Cos", cos(valorFuerzaExterna * t - Delta));
    vt = -D * valorFuerzaExterna * Math.sin(valorFuerzaExterna * t - Delta);
    at =
      -D *
      pow(valorFuerzaExterna, 2) *
      Math.cos(valorFuerzaExterna * t - Delta);

    // Actualizar ecuación de movimiento en pantalla
    let resultado = document.getElementById("Ecuacion");
    resultado.innerHTML = `X(t) = ${D.toFixed(
      3
    )} * cos(${valorFuerzaExterna.toFixed(2)} * ${t.toFixed(
      2
    )} - ${Delta.toFixed(2)})`;
  }

  // Actualizar posición inicial
  if (!isNaN(xt)) {
    posicionInicial = xt * scaleFactor; // Actualiza la posición inicial
  }

  anguloPolea = -xt / Radio; // Calcular el ángulo de la polea

  // Dibuja el soporte de la polea
  fill(150); // Color gris para el soporte
  rect(0, -160, 15, 70); // Soporte de la polea

  /*----- Polea -----*/
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

  push();
  // Dibuja la cuerda hacia el resorte a la derecha
  let tensionY = -50; // Altura donde la cuerda sale de la polea hacia la derecha
  let tensionX = 53; // Posición x del resorte
  strokeWeight(1.5);
  stroke(120, 60, 20); // Color marrón para simular una cuerda de fibra
  line(53, tensionY, tensionX, 50 - posicionInicial); // Invertir el movimiento
  pop();

  // Comprobar resonancia
  if (w0 === valorFuerzaExterna) {
    let resonancia = document.getElementById("Resonancia");
    resonancia.innerHTML = "-> Existe resonancia";
  }

  // Incrementar el tiempo
  t += 0.01;

  if (paso < 1) {
    graficas();
  }
  paso++;
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
  var Xt = xt; //Cambiarla si es necesario
  return Xt;
}
function getDataVelocity() {
  var Vt = vt; //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = at; //Cambiarla si es necesario
  return At;
}

function graficas() {
  if (!pausar) {
    // Verifica si la simulación está pausada
    var layout = {
      autosize: true,
      xaxis: { title: "Tiempo (s)", range: [0, 20] }, // Ajusta el rango inicial del eje x para un zoom reducido
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

    let plotData = [positionData, velocityData, acelerationData];
    Plotly.newPlot("Movimientos", plotData, layout);

    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.2; // Incremento de tiempo aumentado para velocidad
        tV += 0.2;
        tA += 0.2;

        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [
          2,
        ]);

        // Ajusta el rango del eje x para que se mueva con los datos
        let update = {
          xaxis: { range: [tX, tX + 250] }, // Ajusta el rango del eje x para que comience en tX y termine en tX + 50
        };
        Plotly.relayout("Movimientos", update);
        cnt1 += 0.02;
        if (cnt1 > 200) {
          Plotly.relayout("Movimientos", {
            xaxis: { range: [cnt1 - 200, cnt1] },
          });
        }
      }
    }, 15); // Intervalo reducido para una mayor velocidad de animación
  }
}
