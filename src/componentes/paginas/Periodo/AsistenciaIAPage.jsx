import React, { useEffect, useState } from 'react';
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    Legend
} from 'recharts';
import '../../css/StudentAttendancePredictor.css'
import {
    obtenerUsuarioRequest,
    obtenerAsistenciPorAlumnoRequest,
} from '../../../api/auth';


const StudentAttendancePredictor = () => {
    const [busquedaAlumno, setBusquedaAlumno] = useState('');
    const [sugerencias, setSugerencias] = useState([]);
    const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
    const [alumnos, setAlumnos] = useState([]);
    const [data, setData] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [inputYear, setInputYear] = useState('');
    const [historicalData, setHistoricalData] = useState([]);
    const [regressionParams, setRegressionParams] = useState({ slope: 0, intercept: 0, r2: 0 });


    const fetchData = async () => {
        try {
            const [usuariosRes] = await Promise.all([
                obtenerUsuarioRequest(),
            ]);
            const alumnosFiltrados = usuariosRes.data.filter(u => u.rol_nombre === 'Alumno');
            setAlumnos(alumnosFiltrados);
        } catch (error) {
            console.error('Error al obtener datos:', error);
        }
    };

    const cargarDatos = async () => {

        try {
            const id = parseInt(alumnoSeleccionado.id);
            console.log(id)
            const [res] = await Promise.all([
                obtenerAsistenciPorAlumnoRequest(id)
            ])
            console.log(res.data)
            setHistoricalData(res.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => { fetchData(); }, []);

    const handleBusquedaChange = (e) => {
        const valor = e.target.value;
        setBusquedaAlumno(valor);
        setSugerencias(valor.trim().length >= 3
            ? alumnos.filter(a => a.nombre.toLowerCase().includes(valor.toLowerCase()))
            : []);
    };

    const seleccionarAlumno = (alumno) => {
        setBusquedaAlumno(alumno.nombre);
        setAlumnoSeleccionado(alumno);
        setSugerencias([]);
    };

    useEffect(() => {
        if (alumnoSeleccionado) {
            cargarDatos();
        }
    }, [alumnoSeleccionado]);




    useEffect(() => {
        if (historicalData.length === 0) return;

        const params = calculateLinearRegression(historicalData);
        const regressionLine = generateRegressionLine(params);
        setRegressionParams(params);
        setData({ historical: historicalData, regression: regressionLine });
    }, [historicalData]);

    const calculateLinearRegression = (data) => {
        const n = data.length;
        const sumX = data.reduce((sum, point) => sum + point.year, 0);
        const sumY = data.reduce((sum, point) => sum + point.asistencia, 0);
        const sumXY = data.reduce((sum, point) => sum + point.year * point.asistencia, 0);
        const sumX2 = data.reduce((sum, point) => sum + point.year * point.year, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        const yMean = sumY / n;
        const ssTotal = data.reduce((sum, point) => sum + Math.pow(point.asistencia - yMean, 2), 0);
        const ssResidual = data.reduce((sum, point) => {
            const predicted = slope * point.year + intercept;
            return sum + Math.pow(point.asistencia - predicted, 2);
        }, 0);
        const r2 = 1 - (ssResidual / ssTotal);

        return { slope, intercept, r2 };
    };

    const generateRegressionLine = (params) => {
        const minYear = Math.min(...historicalData.map(d => d.year));
        const maxYear = Math.max(...historicalData.map(d => d.year));
        const regressionLine = [];

        for (let year = minYear; year <= maxYear + 5; year++) {
            regressionLine.push({
                year: year,
                gestion: year.toString(),
                prediccion: params.slope * year + params.intercept
            });
        }
        return regressionLine;
    };

    useEffect(() => {
        const params = calculateLinearRegression(historicalData);
        setRegressionParams(params);
        const regressionLine = generateRegressionLine(params);
        setData({ historical: historicalData, regression: regressionLine });
    }, []);

    const handlePredict = () => {
        const targetYear = parseInt(inputYear);
        if (targetYear >= 2025 && targetYear <= 2035) {
            const predictedAttendance = regressionParams.slope * targetYear + regressionParams.intercept;
            const finalAttendance = Math.max(0, Math.min(100, predictedAttendance));
            setPrediction({
                year: targetYear,
                gestion: targetYear.toString(),
                asistencia: Math.round(finalAttendance * 100) / 100
            });
        }
    };

    const addNewData = () => {
        if (prediction) {
            const updatedHistorical = [...data.historical, {
                year: prediction.year,
                gestion: `${prediction.year} (Pred)`,
                asistencia: prediction.asistencia
            }];
            const newParams = calculateLinearRegression(updatedHistorical);
            setRegressionParams(newParams);
            const newRegressionLine = generateRegressionLine(newParams);
            setData({
                historical: updatedHistorical,
                regression: newRegressionLine
            });
        }
    };

    const getTrendAnalysis = () => {
        if (regressionParams.slope > 0.5) {
            return { text: "Tendencia Creciente", color: "sap-green" };
        } else if (regressionParams.slope < -0.5) {
            return { text: "Tendencia Decreciente", color: "sap-red" };
        } else {
            return { text: "Tendencia Estable", color: "sap-orange" };
        }
    };

    const trend = getTrendAnalysis();

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className="sap-container">
                    <div className="sap-card">
                        <h1 className="sap-heading">Predictor de Asistencia Estudiantil por Gestión</h1>
                        <div className="acomodar">
                            <h3>Buscar Alumno</h3>
                            <input
                                type="text"
                                className="form-control"
                                value={busquedaAlumno}
                                onChange={handleBusquedaChange}
                                placeholder="Ej: Juan Pérez"
                                autoComplete="off"
                            />
                            {busquedaAlumno.trim().length >= 3 && sugerencias.length > 0 && (
                                <ul className="sugerencias">
                                    {sugerencias.map((alumno) => (
                                        <li key={alumno.id} onClick={() => seleccionarAlumno(alumno)} className="sugerencia-item">
                                            {alumno.nombre}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="sap-grid">
                            <div className="sap-box sap-blue">
                                <h3>Tendencia Anual</h3>
                                <p>{regressionParams.slope > 0 ? '+' : ''}{regressionParams.slope.toFixed(2)}%</p>
                                <span>Por año</span>
                            </div>
                            <div className="sap-box sap-purple">
                                <h3>Asistencia Base</h3>
                                <p>{regressionParams.intercept.toFixed(1)}%</p>
                                <span>En año 0</span>
                            </div>
                            <div className="sap-box sap-orange">
                                <h3>Precisión (R²)</h3>
                                <p>{(regressionParams.r2 * 100).toFixed(1)}%</p>
                                <span>Confiabilidad</span>
                            </div>
                            <div className={`sap-box ${trend.color}`}>
                                <h3>Análisis</h3>
                                <p>{trend.text}</p>
                                <span>General</span>
                            </div>
                        </div>

                        <div className="sap-chart-box">
                            <h2>Evolución Histórica y Proyección de Asistencia</h2>
                            <ResponsiveContainer width="100%" height={400}>
                                <LineChart>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="year" type="number" domain={[2020, 202]} />
                                    <YAxis domain={[0, 100]} />
                                    <Tooltip />
                                    <Legend />
                                    <Line
                                        dataKey="asistencia"
                                        data={data.historical || []}
                                        stroke="#2563eb"
                                        strokeWidth={3}
                                        dot={{ fill: '#2563eb', r: 6 }}
                                        name="Datos Históricos"
                                    />
                                    <Line
                                        dataKey="prediccion"
                                        data={data.regression || []}
                                        stroke="#dc2626"
                                        strokeWidth={2}
                                        strokeDasharray="5 5"
                                        dot={false}
                                        name="Línea de Tendencia"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="sap-predict-box">
                            <h2>Predicción para Gestión Futura</h2>
                            <input
                                type="number"
                                min="2025"
                                max="2035"
                                value={inputYear}
                                onChange={(e) => setInputYear(e.target.value)}
                                placeholder="Ej: 2026"
                            />
                            <button onClick={handlePredict}>Predecir Asistencia</button>

                            {prediction && (
                                <div className="sap-prediction-result">
                                    <h3>Gestión {prediction.year}</h3>
                                    <p>Asistencia proyectada: <strong>{prediction.asistencia}%</strong></p>
                                    <p>Fórmula: Asistencia = {regressionParams.slope.toFixed(4)} × Año + ({regressionParams.intercept.toFixed(2)})</p>
                                    <button onClick={addNewData}>Agregar a modelo</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendancePredictor;

