import React, { useState } from 'react';
import '../../css/LibretaIA.css';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';
import {
  AlertCircle, Brain, Search, Award
} from 'lucide-react';

// Datos simulados más extensos
const datosJSON = [
  {
    nombre_materia: "Matemáticas",
    trimestre: { id: 1, nro: 1 },
    dimensiones: [
      { descripcion: "Saber", promedio: 18 },
      { descripcion: "Hacer", promedio: 16 }
    ]
  },
  {
    nombre_materia: "Lenguaje",
    trimestre: { id: 1, nro: 1 },
    dimensiones: [
      { descripcion: "Saber", promedio: 20 },
      { descripcion: "Hacer", promedio: 18 }
    ]
  },
  {
    nombre_materia: "Ciencias",
    trimestre: { id: 1, nro: 1 },
    dimensiones: [
      { descripcion: "Saber", promedio: 17 },
      { descripcion: "Hacer", promedio: 19 }
    ]
  }
];

// Simular múltiples gestiones con tendencias realistas
const generarDatosHistoricos = (datosBase, numTrimestres = 6) => {
  const datos = [];
  for (let t = 1; t <= numTrimestres; t++) {
    datosBase.forEach(materia => {
      const factorTendencia = 1 + (Math.sin(t * 0.5) * 0.1) + (Math.random() - 0.5) * 0.15;
      const factorMejora = 1 + (t - 1) * 0.02;
      datos.push({
        ...materia,
        trimestre: { id: t, nro: t },
        dimensiones: materia.dimensiones.map(dim => ({
          ...dim,
          promedio: Math.max(5, Math.min(20, dim.promedio * factorTendencia * factorMejora))
        }))
      });
    });
  }
  return datos;
};

const gestionesPorAlumno = {
  "Juan Pérez": generarDatosHistoricos(datosJSON, 6),
  "María López": generarDatosHistoricos(datosJSON.map(d => ({
    ...d,
    dimensiones: d.dimensiones.map(dim => ({
      ...dim,
      promedio: dim.promedio * 1.1
    }))
  })), 5),
  "Carlos Mendoza": generarDatosHistoricos(datosJSON.map(d => ({
    ...d,
    dimensiones: d.dimensiones.map(dim => ({
      ...dim,
      promedio: dim.promedio * 0.85
    }))
  })), 7),
  "Ana Silva": generarDatosHistoricos(datosJSON.map(d => ({
    ...d,
    dimensiones: d.dimensiones.map(dim => ({
      ...dim,
      promedio: dim.promedio * 1.15
    }))
  })), 4)
};

function calcularTotal(dimensiones) {
  const saber = dimensiones.find(d => d.descripcion === 'Saber')?.promedio || 0;
  const hacer = dimensiones.find(d => d.descripcion === 'Hacer')?.promedio || 0;
  return parseFloat((saber + hacer).toFixed(2));
}

function analizarRiesgo(datosAlumno) {
  const materias = [...new Set(datosAlumno.map(d => d.nombre_materia))];
  let riesgoTotal = 0;
  let factores = [];

  materias.forEach(materia => {
    const materiaData = datosAlumno.filter(d => d.nombre_materia === materia);
    const ultimaNota = calcularTotal(materiaData[materiaData.length - 1]?.dimensiones || []);
    if (ultimaNota < 28) {
      riesgoTotal += 3;
      factores.push(`${materia}: Nota actual baja (${ultimaNota})`);
    }
  });

  const nivelRiesgo = riesgoTotal <= 2 ? 'Bajo' :
                     riesgoTotal <= 5 ? 'Medio' : 'Alto';

  return { nivel: nivelRiesgo, puntos: riesgoTotal, factores };
}

function generarRecomendacion(nivelRiesgo) {
  if (nivelRiesgo === 'Bajo') {
    return "¡Buen trabajo! Continúa con el esfuerzo para mantener tu desempeño.";
  } else if (nivelRiesgo === 'Medio') {
    return "Presta atención a las materias con notas bajas. Considera buscar apoyo adicional.";
  } else if (nivelRiesgo === 'Alto') {
    return "Es importante tomar medidas inmediatas. Consulta con tus profesores o busca tutorías.";
  }
  return "";
}

function LibretaIA() {
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [rangoGestiones, setRangoGestiones] = useState(6); // Rango por defecto de 6 gestiones

  const handleBuscar = () => {
    if (gestionesPorAlumno[nombreAlumno]) {
      setAlumnoSeleccionado(gestionesPorAlumno[nombreAlumno]);
    } else {
      alert('Alumno no encontrado. Disponibles: ' + Object.keys(gestionesPorAlumno).join(', '));
    }
  };

  const materias = alumnoSeleccionado ? [...new Set(alumnoSeleccionado.map(d => d.nombre_materia))] : [];
  const riesgoAnalisis = alumnoSeleccionado ? analizarRiesgo(alumnoSeleccionado) : null;

  const renderGrafica = () => {
    if (!alumnoSeleccionado || !materiaSeleccionada) return null;

    const datosMateria = alumnoSeleccionado
      .filter(d => d.nombre_materia === materiaSeleccionada && d.trimestre.nro <= rangoGestiones)
      .map(d => ({
        trimestre: d.trimestre.nro,
        promedio: calcularTotal(d.dimensiones)
      }));

    return (
      <div className="grafica-container">
        <h3>Gráfica de Desempeño: {materiaSeleccionada}</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={datosMateria}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="trimestre" label={{ value: "Trimestre", position: "insideBottomRight", offset: -5 }} />
            <YAxis label={{ value: "Promedio", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="promedio" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderRiesgo = () => {
    if (!riesgoAnalisis) return null;

    return (
      <div className={`tarjeta-riesgo ${riesgoAnalisis.nivel.toLowerCase()}`}>
        <div className="header-riesgo">
          <AlertCircle className="icono-riesgo" />
          <h3>Análisis de Riesgo</h3>
        </div>
        <div className="contenido-riesgo">
          <div>
            <span>Nivel de Riesgo:</span>
            <span>{riesgoAnalisis.nivel}</span>
          </div>
          <div>
            <span>Factores:</span>
            <ul>
              {riesgoAnalisis.factores.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          <div>
            <span>Recomendación:</span>
            <p>{generarRecomendacion(riesgoAnalisis.nivel)}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="libreta-ia">
      <div className="header">
        <h1>
          <Brain className="icono-header" />
          LibretaIA Predictiva
        </h1>
        <p>Sistema Inteligente de Análisis Académico con IA</p>
      </div>
      <div className="buscador">
        <input
          type="text"
          value={nombreAlumno}
          onChange={(e) => setNombreAlumno(e.target.value)}
          placeholder="Ingrese el nombre del estudiante..."
        />
        <button onClick={handleBuscar}>
          <Search />
          Buscar
        </button>
      </div>
      {alumnoSeleccionado && (
        <>
          <div className="materias-gestiones-selector">
            <div className="materias-selector">
              <label htmlFor="materias">Seleccione una materia:</label>
              <select
                id="materias"
                value={materiaSeleccionada}
                onChange={(e) => setMateriaSeleccionada(e.target.value)}
              >
                <option value="">-- Seleccione --</option>
                {materias.map((materia, index) => (
                  <option key={index} value={materia}>
                    {materia}
                  </option>
                ))}
              </select>
            </div>
            <div className="gestiones-selector">
              <label htmlFor="gestiones">Seleccione rango de gestiones:</label>
              <input
                id="gestiones"
                type="number"
                min="1"
                max="10"
                value={rangoGestiones}
                onChange={(e) => setRangoGestiones(Number(e.target.value))}
              />
            </div>
          </div>
          {renderGrafica()}
          {renderRiesgo()}
        </>
      )}
    </div>
  );
}

export default LibretaIA;