const connectButton = document.getElementById("connectButton");

const resetButton = document.getElementById("resetButton");

const exportButton = document.getElementById("exportButton");

const distanciaInput = document.getElementById("distanciaInput");

const eventosOutput = document.getElementById("eventos");

const tablaBody = document.getElementById("tablaBody");

const selectorGrafica = document.getElementById("selectorGrafica");

const tituloGrafica = document.getElementById("tituloGrafica");

const ctx = document.getElementById("graficaPrincipal");

const graficaVelocidad = new Chart(ctx, {

  type: "line",
  data: {

    labels: [],
    datasets: [{

      label: "Velocidad (m/s)",
      data: [],
      tension: 0.1

    }]
  },

  options: {

    responsive: true,
    animation: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
});

function actualizarGrafica() {

  const tipo =
    selectorGrafica.value;


  // ==========================
  // LIMPIAR GRAFICA
  // ==========================
  graficaVelocidad.data.labels = [];

  graficaVelocidad.data.datasets[0].data = [];


  // ==========================
  // VELOCIDAD VS MEDICION
  // ==========================
  if (tipo === "medicion") {

    tituloGrafica.textContent =
      "Velocidad vs Medición";

    mediciones.forEach((medicion) => {

      graficaVelocidad.data.labels.push(
        medicion.numero
      );

      graficaVelocidad.data.datasets[0].data.push(
        medicion.velocidad
      );

    });
  }


  // ==========================
  // VELOCIDAD VS TIEMPO
  // ==========================
  else if (tipo === "tiempo") {

    tituloGrafica.textContent =
      "Velocidad vs Tiempo";

    mediciones.forEach((medicion) => {

      graficaVelocidad.data.labels.push(
        medicion.tiempo.toFixed(2)
      );

      graficaVelocidad.data.datasets[0].data.push(
        medicion.velocidad
      );

    });
  }


  // ==========================
  // REDIBUJAR
  // ==========================
  graficaVelocidad.update();
}


const mediciones = [];

let tiempoInicio = null;

let distancia = 0.2; // metros

let numeroMedicion = 1;

let port;

connectButton.addEventListener("click", async () => {

  try {
    // Pedir puerto serial
    port = await navigator.serial.requestPort();

    // Abrir puerto
    await port.open({ baudRate: 9600 });

    eventosOutput.textContent += "Puerto conectado\n";

    // Leer datos
    readSerial();

  } catch (error) {

    console.error(error);

    output.textContent += "Error al conectar\n";
  }
});

async function readSerial() {

  const decoder = new TextDecoderStream();
  port.readable.pipeTo(decoder.writable);
  const reader = decoder.readable.getReader();
  let buffer = "";

  while (true) {

    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    // Agregar texto recibido al buffer
    buffer += value;
    // Separar por saltos de línea
    let lines = buffer.split("\n");
    // Guardar última línea incompleta
    buffer = lines.pop();

    // Procesar líneas completas
    for (let line of lines) {

      line = line.trim();

      if (line.length === 0) {
        continue;
      }

      try {

  // Convertir texto JSON → objeto JS
        const data = JSON.parse(line);

        //console.log("LINEA RAW:");
        //console.log(line);

        //console.log("OBJETO PARSEADO:");
        //console.log(data);


        // VALIDAR JSON
        if (
          data.sensor === undefined ||
          data.timestamp_us === undefined
        ) {

          eventosOutput.textContent +=
            `JSON incompleto: ${line}\n`;

          continue;
        }

        // MOSTRAR EVENTO
        eventosOutput.textContent +=
          `Sensor: ${data.sensor} | ` + `Timestamp: ${data.timestamp_us}\n`;

        // SENSOR 1
        if (data.sensor === 1) {

          tiempoInicio = data.timestamp_us;

          eventosOutput.textContent +=
            `Inicio guardado\n`;
        }


        // SENSOR 2
        else if (data.sensor === 2) {

          if (tiempoInicio !== null) {

            const delta_us = data.timestamp_us - tiempoInicio;
            const delta_s = delta_us / 1000000;
            distancia = parseFloat(distanciaInput.value);
            const velocidad = distancia / delta_s;

            const medicion = {

              numero: numeroMedicion,
              tiempo: data.timestamp_us / 1000000,
              delta_t: delta_s,
              velocidad: velocidad

            };

            mediciones.push(medicion);
            console.log(mediciones);

            actualizarGrafica();

            console.log(mediciones);
            numeroMedicion++;

            const fila = document.createElement("tr");

            fila.innerHTML = `
              <td>${medicion.numero}</td>
              <td>${medicion.delta_t.toFixed(6)}</td>
              <td>${medicion.velocidad.toFixed(3)}</td>
            `;

            tablaBody.appendChild(fila);
            const tablaContainer = document.getElementById("tablaContainer");
            tablaContainer.scrollTop = tablaContainer.scrollHeight;

            // Reiniciar
            tiempoInicio = null;
          }
        }

      }
catch(error) {

  console.error("ERROR REAL:");
  console.error(error);

}
    }
  }
}

resetButton.addEventListener("click", () => {

  // Limpiar array
  mediciones.length = 0;

  // Reiniciar contador
  numeroMedicion = 1;

  // Limpiar tabla
  tablaBody.innerHTML = "";

  // Limpiar gráfica
  graficaVelocidad.data.labels = [];
  graficaVelocidad.data.datasets[0].data = [];
  graficaVelocidad.update();

  // Limpiar eventos
  eventosOutput.textContent = "";

  console.log("Experimento reiniciado");
});

exportButton.addEventListener("click", () => {


  // CABECERA CSV
  let csv =
    "Numero,Delta_t_s,Velocidad_m_s\n";


  // AGREGAR MEDICIONES
  mediciones.forEach((medicion) => {

    csv +=
      `${medicion.numero},` +
      `${medicion.delta_t},` +
      `${medicion.velocidad}\n`;

  });


  // CREAR ARCHIVO
  const blob =
    new Blob([csv], { type: "text/csv" });


  // CREAR LINK TEMPORAL
  const url =
    window.URL.createObjectURL(blob);

  const a =
    document.createElement("a");

  a.href = url;

  a.download = "mediciones_mruv.csv";

  // ==========================
  // DESCARGAR
  // ==========================
  a.click();

  // ==========================
  // LIMPIAR URL
  // ==========================
  window.URL.revokeObjectURL(url);

});

selectorGrafica.addEventListener(
  "change",
  actualizarGrafica
);