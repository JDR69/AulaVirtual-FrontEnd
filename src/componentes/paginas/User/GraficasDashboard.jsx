import React from 'react';
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid
} from 'recharts';

const COLORS = ['#00C49F', '#FF6384', '#36A2EB', '#FFCE56'];

const alumnosProfesoresPorMes = [
  { name: 'Ene', Alumnos: 120, Profesores: 20 },
  { name: 'Feb', Alumnos: 130, Profesores: 21 },
  { name: 'Mar', Alumnos: 140, Profesores: 22 },
  { name: 'Abr', Alumnos: 150, Profesores: 23 },
  { name: 'May', Alumnos: 160, Profesores: 24 },
  { name: 'Jun', Alumnos: 155, Profesores: 24 },
  { name: 'Jul', Alumnos: 165, Profesores: 25 },
];

const alumnosActivosInactivos = [
  { name: 'Activos', value: 320 },
  { name: 'Inactivos', value: 80 },
];

const sexoDistribucion = [
  { name: 'Hombres', value: 180 },
  { name: 'Mujeres', value: 220 },
];

const GraficasDashboard = () => {
  return (
    <div style={{ display: 'grid', gap: '60px', padding: '30px' }}>
      <h2 style={{ textAlign: 'center', color: '#003a63' }}>
        📊 Panel Estadístico del Colegio
      </h2>

      {/* AREA CHART */}
      <div>
        <h4 style={{ textAlign: 'center' }}>📈 Alumnos y Profesores por Mes</h4>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={alumnosProfesoresPorMes}>
            <defs>
              <linearGradient id="colorAlumnos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorProfesores" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="Alumnos"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorAlumnos)"
            />
            <Area
              type="monotone"
              dataKey="Profesores"
              stroke="#82ca9d"
              fillOpacity={1}
              fill="url(#colorProfesores)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART - ESTADO DE ALUMNOS */}
      <div>
        <h4 style={{ textAlign: 'center' }}>🎯 Estado de Alumnos</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={alumnosActivosInactivos}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {alumnosActivosInactivos.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* PIE CHART - DISTRIBUCIÓN POR SEXO */}
      <div>
        <h4 style={{ textAlign: 'center' }}>👩‍🎓👨‍🎓 Distribución por Sexo</h4>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sexoDistribucion}
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
              dataKey="value"
            >
              {sexoDistribucion.map((entry, index) => (
                <Cell key={`sexo-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficasDashboard;
