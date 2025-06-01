import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, BarChart, Bar, RadarChart, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, Radar, AreaChart, Area
} from 'recharts';
import {
  TrendingUp, TrendingDown, AlertCircle, CheckCircle,
  Target, Brain, BookOpen, Activity, Search, Award,
  Users, Calendar, BarChart3, PieChart, Lightbulb
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
      // Simular variaciones realistas en el rendimiento
      const factorTendencia = 1 + (Math.sin(t * 0.5) * 0.1) + (Math.random() - 0.5) * 0.15;
      const factorMejora = 1 + (t - 1) * 0.02; // Ligera mejora progresiva
      
      datos.push({
        ...materia,
        trimestre: { id: t, nro: t },
        dimensiones: materia.dimensiones.map(dim => ({
          ...dim,
          promedio: Math.max(5, Math.min(20, 
            dim.promedio * factorTendencia * factorMejora
          ))
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

// Regresión lineal mejorada con métricas de calidad
function regresionLinealAvanzada(puntos) {
  const n = puntos.length;
  if (n < 2) return null;
  
  const sumX = puntos.reduce((a, p) => a + p.x, 0);
  const sumY = puntos.reduce((a, p) => a + p.y, 0);
  const sumXY = puntos.reduce((a, p) => a + p.x * p.y, 0);
  const sumX2 = puntos.reduce((a, p) => a + p.x * p.x, 0);
  const sumY2 = puntos.reduce((a, p) => a + p.y * p.y, 0);

  const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const b = (sumY - m * sumX) / n;
  
  // Calcular R² (coeficiente de determinación)
  const yMean = sumY / n;
  const ssRes = puntos.reduce((a, p) => a + Math.pow(p.y - (m * p.x + b), 2), 0);
  const ssTot = puntos.reduce((a, p) => a + Math.pow(p.y - yMean, 2), 0);
  const r2 = 1 - (ssRes / ssTot);
  
  return { m, b, r2: Math.max(0, r2) };
}

// Predicción avanzada con múltiples algoritmos
function predecirNotasAvanzado(datosMateria) {
  const puntos = datosMateria.map(d => ({
    x: d.trimestre.nro,
    y: calcularTotal(d.dimensiones)
  }));
  
  if (puntos.length < 2) return null;

  const regresion = regresionLinealAvanzada(puntos);
  if (!regresion) return null;
  
  const siguienteTrimestre = Math.max(...puntos.map(p => p.x)) + 1;
  const prediccionLineal = regresion.m * siguienteTrimestre + regresion.b;
  
  // Promedio móvil simple para suavizar
  const ultimos3 = puntos.slice(-3);
  const promedioMovil = ultimos3.reduce((a, p) => a + p.y, 0) / ultimos3.length;
  
  // Predicción combinada (70% regresión, 30% promedio móvil)
  const prediccionCombinada = (prediccionLineal * 0.7) + (promedioMovil * 0.3);
  
  // Calcular tendencia
  const tendencia = regresion.m > 0.5 ? 'ascendente' : 
                   regresion.m < -0.5 ? 'descendente' : 'estable';
  
  // Calcular volatilidad
  const varianza = puntos.reduce((a, p, i) => {
    if (i === 0) return 0;
    return a + Math.pow(p.y - puntos[i-1].y, 2);
  }, 0) / (puntos.length - 1);
  
  const volatilidad = Math.sqrt(varianza);
  
  return {
    prediccion: Math.max(0, Math.min(40, prediccionCombinada)),
    confianza: regresion.r2,
    tendencia,
    volatilidad,
    puntos: puntos.length
  };
}

// Análisis de riesgo académico
function analizarRiesgo(datosAlumno) {
  const materias = [...new Set(datosAlumno.map(d => d.nombre_materia))];
  let riesgoTotal = 0;
  let factores = [];
  
  materias.forEach(materia => {
    const materiaData = datosAlumno.filter(d => d.nombre_materia === materia);
    const ultimaNota = calcularTotal(materiaData[materiaData.length - 1]?.dimensiones || []);
    const prediccion = predecirNotasAvanzado(materiaData);
    
    if (ultimaNota < 28) {
      riesgoTotal += 3;
      factores.push(`${materia}: Nota actual baja (${ultimaNota})`);
    }
    
    if (prediccion && prediccion.tendencia === 'descendente') {
      riesgoTotal += 2;
      factores.push(`${materia}: Tendencia descendente`);
    }
    
    if (prediccion && prediccion.volatilidad > 3) {
      riesgoTotal += 1;
      factores.push(`${materia}: Alto nivel de variabilidad`);
    }
  });
  
  const nivelRiesgo = riesgoTotal <= 2 ? 'Bajo' : 
                     riesgoTotal <= 5 ? 'Medio' : 'Alto';
  
  return { nivel: nivelRiesgo, puntos: riesgoTotal, factores };
}

function LibretaIA() {
  const [nombreAlumno, setNombreAlumno] = useState('');
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [materiaSeleccionada, setMateriaSeleccionada] = useState('');
  const [vistaActual, setVistaActual] = useState('resumen');

  const handleBuscar = () => {
    if (gestionesPorAlumno[nombreAlumno]) {
      setAlumnoSeleccionado(gestionesPorAlumno[nombreAlumno]);
      setVistaActual('resumen');
    } else {
      alert('Alumno no encontrado. Disponibles: ' + Object.keys(gestionesPorAlumno).join(', '));
    }
  };

  const materias = alumnoSeleccionado ? [...new Set(alumnoSeleccionado.map(d => d.nombre_materia))] : [];
  const riesgoAnalisis = alumnoSeleccionado ? analizarRiesgo(alumnoSeleccionado) : null;

  const renderResumenGeneral = () => {
    if (!alumnoSeleccionado) return null;
    
    const promedioGeneral = materias.reduce((acc, materia) => {
      const materiaData = alumnoSeleccionado.filter(d => d.nombre_materia === materia);
      const ultimaNota = calcularTotal(materiaData[materiaData.length - 1]?.dimensiones || []);
      return acc + ultimaNota;
    }, 0) / materias.length;

    const prediccionesGenerales = materias.map(materia => {
      const materiaData = alumnoSeleccionado.filter(d => d.nombre_materia === materia);
      const prediccion = predecirNotasAvanzado(materiaData);
      return { materia, ...prediccion };
    });

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Tarjeta de Resumen */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl shadow-lg">
          <div className="flex items-center mb-4">
            <Award className="w-8 h-8 text-indigo-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Resumen Académico</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Promedio General:</span>
              <span className="font-bold text-2xl text-indigo-600">{promedioGeneral.toFixed(1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Materias:</span>
              <span className="font-semibold">{materias.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Trimestres registrados:</span>
              <span className="font-semibold">{Math.max(...alumnoSeleccionado.map(d => d.trimestre.nro))}</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Riesgo */}
        <div className={`p-6 rounded-xl shadow-lg ${
          riesgoAnalisis.nivel === 'Bajo' ? 'bg-gradient-to-br from-green-50 to-emerald-100' :
          riesgoAnalisis.nivel === 'Medio' ? 'bg-gradient-to-br from-yellow-50 to-amber-100' :
          'bg-gradient-to-br from-red-50 to-rose-100'
        }`}>
          <div className="flex items-center mb-4">
            <AlertCircle className={`w-8 h-8 mr-3 ${
              riesgoAnalisis.nivel === 'Bajo' ? 'text-green-600' :
              riesgoAnalisis.nivel === 'Medio' ? 'text-yellow-600' : 'text-red-600'
            }`} />
            <h3 className="text-xl font-bold text-gray-800">Análisis de Riesgo</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Nivel de Riesgo:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                riesgoAnalisis.nivel === 'Bajo' ? 'bg-green-200 text-green-800' :
                riesgoAnalisis.nivel === 'Medio' ? 'bg-yellow-200 text-yellow-800' :
                'bg-red-200 text-red-800'
              }`}>
                {riesgoAnalisis.nivel}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Factores identificados:</strong>
              <ul className="mt-2 space-y-1">
                {riesgoAnalisis.factores.slice(0, 3).map((factor, i) => (
                  <li key={i} className="text-xs">• {factor}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAnalisisDetallado = () => {
    if (!materiaSeleccionada) return null;
    
    const materiaData = alumnoSeleccionado.filter(d => d.nombre_materia === materiaSeleccionada);
    const prediccion = predecirNotasAvanzado(materiaData);
    
    const datosGrafico = materiaData.map(d => ({
      trimestre: `T${d.trimestre.nro}`,
      nota: calcularTotal(d.dimensiones),
      saber: d.dimensiones.find(dim => dim.descripcion === 'Saber')?.promedio || 0,
      hacer: d.dimensiones.find(dim => dim.descripcion === 'Hacer')?.promedio || 0
    }));

    // Agregar predicción al gráfico
    if (prediccion) {
      const siguienteTrimestre = Math.max(...materiaData.map(d => d.trimestre.nro)) + 1;
      datosGrafico.push({
        trimestre: `T${siguienteTrimestre} (Pred.)`,
        nota: prediccion.prediccion,
        prediccion: true
      });
    }

    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{materiaSeleccionada}</h3>
          
          {/* Métricas de Predicción */}
          {prediccion && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{prediccion.prediccion.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Predicción</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{(prediccion.confianza * 100).toFixed(0)}%</div>
                <div className="text-sm text-gray-600">Confianza</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <div className="text-lg font-bold text-purple-600 capitalize">{prediccion.tendencia}</div>
                <div className="text-sm text-gray-600">Tendencia</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg text-center">
                <div className="text-2xl font-bold text-orange-600">{prediccion.volatilidad.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Volatilidad</div>
              </div>
            </div>
          )}

          {/* Gráfico Principal */}
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={datosGrafico}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trimestre" />
              <YAxis domain={[0, 40]} />
              <Tooltip 
                formatter={(value, name) => [
                  typeof value === 'number' ? value.toFixed(1) : value, 
                  name
                ]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="nota" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 6 }}
                name="Nota Total"
              />
              <Line 
                type="monotone" 
                dataKey="saber" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Saber"
              />
              <Line 
                type="monotone" 
                dataKey="hacer" 
                stroke="#F59E0B" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Hacer"
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Interpretación */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-gray-800 mb-2 flex items-center">
              <Lightbulb className="w-5 h-5 mr-2 text-yellow-500" />
              Interpretación Inteligente
            </h4>
            <div className="text-sm text-gray-700 space-y-2">
              {prediccion && (
                <>
                  <p>
                    <strong>Rendimiento proyectado:</strong> 
                    {prediccion.prediccion >= 35 ? ' Excelente. El estudiante mantiene un alto nivel académico.' :
                     prediccion.prediccion >= 28 ? ' Satisfactorio. El progreso es adecuado pero puede mejorar.' :
                     ' Requiere atención. Posible riesgo de bajo rendimiento.'}
                  </p>
                  <p>
                    <strong>Tendencia:</strong> La materia muestra una tendencia {prediccion.tendencia}.
                    {prediccion.tendencia === 'ascendente' && ' ¡Felicitaciones por la mejora continua!'}
                    {prediccion.tendencia === 'descendente' && ' Se recomienda implementar estrategias de refuerzo.'}
                  </p>
                  <p>
                    <strong>Estabilidad:</strong> 
                    {prediccion.volatilidad < 2 ? ' Rendimiento muy estable y predecible.' :
                     prediccion.volatilidad < 4 ? ' Rendimiento moderadamente variable.' :
                     ' Alto nivel de variabilidad. Revisar factores externos.'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <Brain className="w-10 h-10 mr-3 text-blue-600" />
            LibretaIA Predictiva
          </h1>
          <p className="text-gray-600">Sistema Inteligente de Análisis Académico con IA</p>
        </div>

        {/* Buscador */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Estudiante
              </label>
              <input
                type="text"
                value={nombreAlumno}
                onChange={(e) => setNombreAlumno(e.target.value)}
                placeholder="Ingrese el nombre del estudiante..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
              />
              <div className="text-xs text-gray-500 mt-1">
                Disponibles: {Object.keys(gestionesPorAlumno).join(', ')}
              </div>
            </div>
            <button
              onClick={handleBuscar}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
            >
              <Search className="w-5 h-5 mr-2" />
              Buscar
            </button>
          </div>
        </div>

        {alumnoSeleccionado && (
          <>
            {/* Navegación */}
            <div className="bg-white p-4 rounded-xl shadow-lg mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setVistaActual('resumen')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    vistaActual === 'resumen' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 inline mr-2" />
                  Resumen
                </button>
                {materias.map(materia => (
                  <button
                    key={materia}
                    onClick={() => {
                      setMateriaSeleccionada(materia);
                      setVistaActual('detalle');
                    }}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      vistaActual === 'detalle' && materiaSeleccionada === materia
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <BookOpen className="w-4 h-4 inline mr-2" />
                    {materia}
                  </button>
                ))}
              </div>
            </div>

            {/* Contenido Principal */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Análisis para: <span className="text-blue-600">{nombreAlumno}</span>
              </h2>
              
              {vistaActual === 'resumen' && renderResumenGeneral()}
              {vistaActual === 'detalle' && renderAnalisisDetallado()}
            </div>
          </>
        )}

        {!alumnoSeleccionado && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Busque un estudiante para comenzar el análisis
            </h3>
            <p className="text-gray-500">
              Ingrese el nombre de un estudiante en el campo de búsqueda para ver su análisis predictivo completo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LibretaIA;