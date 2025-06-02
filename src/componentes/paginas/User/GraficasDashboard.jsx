import React, { useEffect, useState } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, BarChart, Bar
} from 'recharts';

import { obtenerDasboard } from '../../../api/auth';

const COLORS = ['#00C49F', '#FF6384', '#36A2EB', '#FFCE56'];

const CustomTooltip = ({ active, payload, label, text }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        padding: 10,
        maxWidth: 280,
        fontSize: 14,
        borderRadius: 4,
        boxShadow: '0 0 5px rgba(0,0,0,0.3)',
      }}>
        <strong>{label}</strong>
        <p>{text}</p>
      </div>
    );
  }
  return null;
};

const GraficasDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Datos ejemplo para evolución mensual (no vienen del backend)
  const alumnosProfesoresPorMes = [
    { name: '2018', Alumnos: 350, Profesores: 12 },
    { name: '2019', Alumnos: 360, Profesores: 12 },
    { name: '2020', Alumnos: 465, Profesores: 12 },
    { name: '2021', Alumnos: 470, Profesores: 12 },
    { name: '2022', Alumnos: 575, Profesores: 15 },
    { name: '2023', Alumnos: 680, Profesores: 17 },
    { name: '2024', Alumnos: 780, Profesores: 18 },
  ];

 useEffect(() => {   
  cargarDatos();
}, []);

const cargarDatos = async () => {
  try {
    const res = await obtenerDasboard();
    setStats(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false); // aquí se asegura que se quite el loading al terminar
  }
};


  if (loading) return <p>Cargando estadísticas...</p>;
  if (!stats) return <p>Error cargando datos.</p>;

  // Datos para pie charts y barras
  const alumnosActivosInactivos = [
    { name: 'Activos', value: stats.usuarios_activos },
    { name: 'Inactivos', value: stats.usuarios_inactivos },
  ];

  const sexoDistribucion = [
    { name: 'Hombres', value: stats.total_hombres },
    { name: 'Mujeres', value: stats.total_mujeres },
  ];

  const promedioNotaData = [
    { name: 'Nota Promedio', nota: stats.promedio_general_alumnos }
  ];

  const edadesData = [
    { name: '< 18 años', value: stats.usuarios_por_rango_edad['<18'] },
    { name: '18 - 25 años', value: stats.usuarios_por_rango_edad['18-25'] },
    { name: '> 25 años', value: stats.usuarios_por_rango_edad['>25'] },
  ];

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2 style={{ textAlign: 'center', color: '#003a63', marginBottom: 40 }}>
        📊 Panel Estadístico del Colegio
      </h2>

      {/* Gráfica Alumnos y Profesores por Mes */}
      <section>
        <h4>📈 Alumnos y Profesores por Gestión</h4>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={alumnosProfesoresPorMes}>
            <defs>
              <linearGradient id="colorAlumnos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorProfesores" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip content={(props) => <CustomTooltip {...props} text="Evolución anual de alumnos y profesores" />} />
            <Legend />
            <Area type="monotone" dataKey="Alumnos" stroke="#8884d8" fill="url(#colorAlumnos)" />
            <Area type="monotone" dataKey="Profesores" stroke="#82ca9d" fill="url(#colorProfesores)" />
          </AreaChart>
        </ResponsiveContainer>
        <p style={{marginTop:10, color:'#555'}}>
          El colegio ha tenido un crecimiento estable en alumnos y profesores durante las gestiones analizadas.
        </p>
      </section>

      {/* Gráfica Estado de Alumnos */}
      <section>
        <h4>🎯 Estado de Alumnos</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={alumnosActivosInactivos} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
              {alumnosActivosInactivos.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} text="Porcentaje de alumnos activos e inactivos" />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p style={{marginTop:10, color:'#555'}}>
          El 99.5% de los alumnos están activos, mostrando un excelente nivel de retención estudiantil.
        </p>
      </section>

      {/* Gráfica Distribución por Sexo */}
      <section>
        <h4>👩‍🎓👨‍🎓 Distribución por Sexo</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={sexoDistribucion} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
              {sexoDistribucion.map((entry, index) => (
                <Cell key={index} fill={COLORS[(index + 2) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={(props) => <CustomTooltip {...props} text="Distribución de alumnos por sexo" />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p style={{marginTop:10, color:'#555'}}>
          La proporción de estudiantes por sexo está equilibrada, con un leve predominio femenino.
        </p>
      </section>

      {/* Gráfica Nota Promedio */}
      <section>
        <h4>📝 Nota Promedio General</h4>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={promedioNotaData} layout="vertical" margin={{ top: 20, right: 30, left: 50, bottom: 20 }}>
            <XAxis type="number" domain={[0, 100]} />
            <YAxis type="category" dataKey="name" />
            <Tooltip />
            <Bar dataKey="nota" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        <p style={{marginTop: 10, color: '#555'}}>
          La nota promedio general de los alumnos es <strong>{stats.promedio_general_alumnos.toFixed(2)}</strong> sobre un máximo de 100.
        </p>
      </section>

      {/* Gráfica Distribución de Edades */}
      <section>
        <h4>👶 Distribución de Edades</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={edadesData} cx="50%" cy="50%" outerRadius={80} label dataKey="value">
              {edadesData.map((entry, index) => (
                <Cell key={`cell-age-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <p style={{marginTop: 10, color: '#555'}}>
          Distribución de alumnos según rangos de edad, donde la mayoría tiene menos de 18 años.
        </p>
      </section>

      {/* Usuarios por Rol */}
      <section>
        <h4>👥 Usuarios por Rol</h4>
        <ul>
          {stats.usuarios_por_rol.map((rol, i) => (
            <li key={i}>{rol.rol__nombre}: {rol.count} usuarios</li>
          ))}
        </ul>
      </section>

      {/* Alumnos por Curso y Paralelo */}
      <section>
        <h4>📚 Alumnos por Curso y Paralelo</h4>
        <ul>
          {stats.alumnos_por_cursoparalelo.map((item, i) => (
            <li key={i}>
              Curso {item.curso_paralelo__curso__nombre} Paralelo {item.curso_paralelo__paralelo__descripcion}: {item.count} alumnos
            </li>
          ))}
        </ul>
      </section>

      {/* Últimas acciones en Bitácora */}
      <section>
        <h4>📝 Últimas acciones en Bitácora</h4>
        <ul>
          {stats.ultimas_acciones_bitacora.map((accion, i) => (
            <li key={i}>
              {accion.usuario__nombre} - {accion.fecha} {accion.hora} - {accion.accion} (IP: {accion.ip})
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default GraficasDashboard;
