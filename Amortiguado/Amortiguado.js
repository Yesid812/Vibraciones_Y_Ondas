//Variables para botones
let button,
simular = false;
pausar = false;

// Variables para el canvas
let containerWidth = document.getElementById("simulator-container").offsetWidth;
let containerHeight = document.getElementById("simulator-container").offsetHeight;

//Variables de constantes para el sistema
let bandera = 0,
  paso = 0,
  Periodo,
  Frecuencia;

//Variables para los sliders
let sliderMasaPolea, sliderMasa, sliderK, sliderPosicion, sliderVelocidad;

//Variables de cambio (sliders)
let valorMasaPolea, valorMasa, valorElastica, valorPosicion, valorVelocidad,valorAmortiguamiento;

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
  Radio = 0.20,
  coeficienteDeAmortiguamiento = 0,
  Phi = 0,
  cPhi = 0,
  w = 0,
  gamma = 0,
  t = 0,
  seno = -1,
  anguloPolea = 0,
  coseno = 1;
  cnt1 = 0;

  let C1, C2;
  let r1;
  let r2;
  let Amplitud1;
  let Amplitud2;
  let posXt;
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
  img = loadImage('../iron.jpg');
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
 

  valorMasa = document.getElementById("m-slider").value;;
  valorElastica = document.getElementById("k-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorVelociad = document.getElementById("V-slider").value;
  valorPosicion = document.getElementById("P-slider").value;
  valorAmortiguamiento = document.getElementById("B-slider").value;
}
//Muestra la informacion necesaria para los datos a utilizar
function informacion() {
  valorMasa = document.getElementById("m-slider").value;;
  valorElastica = document.getElementById("k-slider").value;
  valorMasaPolea = document.getElementById("M-slider").value;
  valorVelocidad = document.getElementById("V-slider").value;
  valorPosicion = document.getElementById("P-slider").value;
  valorAmortiguamiento = document.getElementById("B-slider").value;

  document.getElementById("sliderMValue").innerText = +valorMasa;
  document.getElementById("sliderKValue").innerText = +valorElastica;
  document.getElementById("sliderMPoleaValue").innerText = +valorMasaPolea;
  document.getElementById("sliderPValue").innerText = +valorPosicion;
  document.getElementById("sliderVValue").innerText = +valorVelocidad;
  document.getElementById("sliderBValue").innerText = +valorAmortiguamiento;
}

function obtenerValores() {
    valorMasa = parseFloat(document.getElementById("m-slider").value);
    valorElastica = parseFloat(document.getElementById("k-slider").value);
    valorMasaPolea = parseFloat(document.getElementById("M-slider").value);
    valorVelocidad = parseFloat(document.getElementById("V-slider").value);
    valorPosicion = parseFloat(document.getElementById("P-slider").value);
    valorAmortiguamiento = parseFloat(document.getElementById("B-slider").value);
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
    
    let tipoAmortiguamiento = "";  // Variable para almacenar el tipo de amortiguamiento

    if (bandera < 1) {
      Inercia = (valorMasaPolea * Math.pow(Radio, 2)) / 2;
      w0 = Math.sqrt(valorElastica / (valorMasa + (valorMasaPolea / 2)));
      console.log("Frecuencia Natural:", w0);
      coeficienteDeAmortiguamiento = valorAmortiguamiento / (2 * (valorMasa + (valorMasaPolea / 2)));
      console.log("Coeficiente de Amortiguamiento:", coeficienteDeAmortiguamiento);
  
      // Determina el tipo de amortiguamiento
      if (coeficienteDeAmortiguamiento > w0) {
        tipoAmortiguamiento = "Sobreamortiguado";
        r1 = -coeficienteDeAmortiguamiento + Math.sqrt(Math.pow(coeficienteDeAmortiguamiento, 2) - Math.pow(w0, 2));
        r2 = -coeficienteDeAmortiguamiento - Math.sqrt(Math.pow(coeficienteDeAmortiguamiento, 2) - Math.pow(w0, 2));
        Amplitud2 = (valorVelocidad + ( -1 *( r1 * valorPosicion))) / ((-1*r1) + r2);
        Amplitud1 = valorPosicion - Amplitud2;
        console.log("Sobreamortiguado - Amplitudes:", Amplitud1, Amplitud2);
      } else if (coeficienteDeAmortiguamiento === w0) {
        tipoAmortiguamiento = "Amortiguamiento Crítico";
        Amplitud = valorPosicion;
        VelocidadInicial = valorVelocidad;
        console.log("Amortiguamiento Crítico - Amplitud:", Amplitud);
      } else {
        tipoAmortiguamiento = "Subamortiguado";
        w = Math.sqrt(Math.pow(w0, 2) - Math.pow(coeficienteDeAmortiguamiento, 2));
        console.log("Subamortiguado - Phi1:", Phi);
        if (valorPosicion > 0 && (-valorVelocidad - coeficienteDeAmortiguamiento * valorPosicion) < 0) {  
          Phi =  2*Math.PI - Math.abs(Math.atan(coeficienteDeAmortiguamiento  + (valorVelocidad / valorPosicion)/ (-w)));
        } else if (valorPosicion > 0 && (-valorVelocidad - coeficienteDeAmortiguamiento * valorPosicion) > 0) {
          Phi = Math.abs(Math.atan(coeficienteDeAmortiguamiento  + (valorVelocidad / valorPosicion)/ (-w)));
        } else if (valorPosicion < 0 && (-valorVelocidad - coeficienteDeAmortiguamiento * valorPosicion) > 0) {
          Phi =  Math.PI - Math.abs(Math.atan(coeficienteDeAmortiguamiento  + (valorVelocidad / valorPosicion)/ (-w)));
        } else if (valorPosicion < 0 && (-valorVelocidad - coeficienteDeAmortiguamiento * valorPosicion) < 0) {
          Phi = Math.PI +  Math.abs(Math.atan(coeficienteDeAmortiguamiento  + (valorVelocidad / valorPosicion)/ (-w)));
        }
        console.log("Subamortiguado - Phi:", Phi);
        Amplitud = valorPosicion / Math.cos(Phi);
        console.log("Valor pos, Subamortiguado - Amplitud y Phi:", valorPosicion, Amplitud, Phi);
      }
    }
  
    bandera++;
  
    if (coeficienteDeAmortiguamiento > w0) {
        console.log("r1:", r1, "r2:", r2, "Amplitud1:", Amplitud1, "Amplitud2:", Amplitud2);
      xt = Amplitud1 * Math.exp(r1 * t) + Amplitud2 * Math.exp(r2 * t);
      vt = r1 * Amplitud1 * pow(2.71, r1 * t) + r2 * Amplitud2 * pow(2.71, r2 * t);
      at =
        pow(r1, 2) * Amplitud1 * pow(2.71, r1 * t) +
        pow(r2, 2) * Amplitud2 * pow(2.71, r2 * t);
      
      console.log("vt:", vt, "at:", at);
    } else if (coeficienteDeAmortiguamiento === w0) {
      C1 = Amplitud;
      C2 = (Amplitud * coeficienteDeAmortiguamiento) + VelocidadInicial;
      xt = (C1 + C2  * t) * Math.exp(-coeficienteDeAmortiguamiento * t);
      vt =
        -coeficienteDeAmortiguamiento * C1 * pow(2.71, -coeficienteDeAmortiguamiento * t) +
        C2 * pow(2.71, -coeficienteDeAmortiguamiento * t) +
        coeficienteDeAmortiguamiento * C2 * t * pow(2.71, -coeficienteDeAmortiguamiento * t);
      at =
        pow(coeficienteDeAmortiguamiento, 2) * C1 * pow(2.71, -coeficienteDeAmortiguamiento * t) +
        pow(coeficienteDeAmortiguamiento, 2) * C2 * t * pow(2.71, -coeficienteDeAmortiguamiento * t);
      
    } else {
      xt = Amplitud * Math.exp(-coeficienteDeAmortiguamiento * t) * Math.cos(w0 * t + Phi);

      vt = -coeficienteDeAmortiguamiento * Amplitud * pow(2.7182818284, -coeficienteDeAmortiguamiento * t) * cos(w * t + Phi) -
      w * Amplitud * pow(2.7182818284, -coeficienteDeAmortiguamiento * t) * sin(w * t + Phi);
      at = -pow(coeficienteDeAmortiguamiento, 2) * Amplitud * pow(2.7182818284, -coeficienteDeAmortiguamiento * t) * cos(w * t + Phi) +
      2 * w * coeficienteDeAmortiguamiento * Amplitud * pow(2.7182818284, -coeficienteDeAmortiguamiento * t) * sin(w * t + Phi) -
      pow(w, 2) * Amplitud * pow(2.7182818284, -coeficienteDeAmortiguamiento * t) * cos(w * t + Phi);
      
    }
    posXt =  xt * scaleFactor;
    anguloPolea = (- xt / Radio);
    if (!isNaN(xt)) {
      posicionInicial = posXt;
    }




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
  line(-37 , -50, -37, 50 + posicionInicial); // Cuerda vertical hacia la masa // Dibuja una trenza entre dos líneas
  pop();

  push();
  strokeWeight(1.5);
  fill(0, 100, 255, 100); 
  rect(-70,10, 70, 90);
  pop();
  push();
  // Dibuja "agua" con ondas
  fill(0, 100, 255, 100);  // Color azul con transparencia
  noStroke();
  
  for (let x = -70; x < 2; x +=1) {
    let offsetY= sin(frameCount * 0.1 + x * 0.5) ; // Ondas en el agua
    circle(x, offsetY +11, 5, 5);
  }
  pop();

  // Dibuja la masa
  push();
  pointLight(255, 255, 255, 30, -20, 40);
  specularColor("gray");
  specularMaterial(250, 100, 55);
   // Efectos visuales
  

  fill(200, 0, 0, 150); // Color de la masa
  rect(-56, 50+ posicionInicial, 40, 40); // Masa de 40x40
  pop();

  push();
  // Dibuja la cuerda hacia el resorte a la derecha
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
   if (tipoAmortiguamiento === "Sobreamortiguado") {
     resultado.innerHTML = `${tipoAmortiguamiento}: X(t) = ${Amplitud1.toFixed(3)} * e^(${r1.toFixed(3)} * ${t}) + ${Amplitud2.toFixed(3)} * e^(${r2.toFixed(3)} * ${t})`;
   } else if (tipoAmortiguamiento === "Amortiguamiento Crítico") {
     resultado.innerHTML = `${tipoAmortiguamiento}: X(t) = (${C1.toFixed(3)} + ${C2.toFixed(3)} *${t}) * e^(-${coeficienteDeAmortiguamiento.toFixed(3)} *${t})`;
   } else if (tipoAmortiguamiento === "Subamortiguado") {
     resultado.innerHTML = `${tipoAmortiguamiento}: X(t) = ${Amplitud.toFixed(3)} * e^(-${coeficienteDeAmortiguamiento.toFixed(3)} *${t}) * cos(${w.toFixed(2)} * ${t} + ${Phi.toFixed(2)})`;
   }

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
  var Xt = xt;
  //((Amplitud * Math.exp(-coeficienteDeAmortiguamiento * t))) * cos(w * t + cPhi); //Cambiarla si es necesario
  return Xt;
}
function getDataVelocity() {
  var Vt = vt; //Cambiarla si es necesario
  return Vt;
}
function getDataAceleration() {
  var At = at;//Cambiarla si es necesario
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
    Plotly.newPlot(
      "Movimientos",
      plotData,
      layout
    );

    setInterval(function () {
      if (!pausar) {
        // Verifica si la simulación está pausada
        tX += 0.2; // Incremento de tiempo aumentado para velocidad
        tV += 0.2;
        tA += 0.2;

        // Agrega nuevos datos a los conjuntos de datos
        Plotly.extendTraces("Movimientos", { y: [[getDataPosition()]] }, [0]);
        Plotly.extendTraces("Movimientos", { y: [[getDataVelocity()]] }, [1]);
        Plotly.extendTraces("Movimientos", { y: [[getDataAceleration()]] }, [2]);

        // Ajusta el rango del eje x para que se mueva con los datos
        let update = {
          xaxis: { range: [tX, tX + 250] }, // Ajusta el rango del eje x para que comience en tX y termine en tX + 50
        };
        Plotly.relayout("Movimientos", update);
        cnt1 += 0.02;
        if (cnt1 > 200) {
          Plotly.relayout("Movimientos", { xaxis: { range: [cnt1 - 200, cnt1] } });
        }

      }
    }, 15); // Intervalo reducido para una mayor velocidad de animación
  }
}