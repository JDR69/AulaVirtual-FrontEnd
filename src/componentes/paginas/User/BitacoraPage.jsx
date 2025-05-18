import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const bitacoraData = [
    { id: 1, usuario: 'Juan', fecha: '2025-05-01', hora: '10:00', ip: '192.168.0.1', accion: 'Login' },
];

function BitacoraPage() {
    const [usuarioFiltro, setUsuarioFiltro] = useState('');
    const [fechaFiltro, setFechaFiltro] = useState('');

    const datosFiltrados = bitacoraData.filter(item =>
        item.usuario.toLowerCase().includes(usuarioFiltro.toLowerCase()) &&
        item.fecha.includes(fechaFiltro)
    );

    const exportarExcel = () => {
        const ws = XLSX.utils.json_to_sheet(datosFiltrados);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Bitácora');
        XLSX.writeFile(wb, 'bitacora.xlsx');
    };

    const exportarHTML = () => {
        const htmlContent = `
            <table border="1">
                <tr><th>ID</th><th>Usuario</th><th>Fecha</th><th>Hora</th><th>IP</th><th>Acción</th></tr>
                ${datosFiltrados.map(row => `
                    <tr>
                        <td>${row.id}</td>
                        <td>${row.usuario}</td>
                        <td>${row.fecha}</td>
                        <td>${row.hora}</td>
                        <td>${row.ip}</td>
                        <td>${row.accion}</td>
                    </tr>
                `).join('')}
            </table>
        `;
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'bitacora.html';
        link.click();
    };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Bitácora', 14, 15);
    autoTable(doc, {
        startY: 20,
        head: [['ID', 'Usuario', 'Fecha', 'Hora', 'IP', 'Acción']],
        body: datosFiltrados.map(row => [
            row.id,
            row.usuario,
            row.fecha,
            row.hora,
            row.ip,
            row.accion
        ]),
        theme: 'striped',
        headStyles: { fillColor: [22, 160, 133] }
    });
    doc.save('bitacora.pdf');
};

    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className='contenedor-usuario'>
                    <div id='titulo'>
                        <h1>Bitacora</h1>
                    </div>
                    <div className='filterReporte'>
                        <div id='buscadores'>
                            <input
                                type="text"
                                placeholder='Buscar por Usuario'
                                value={usuarioFiltro}
                                onChange={e => setUsuarioFiltro(e.target.value)}
                            />
                            <input
                                type="date"
                                value={fechaFiltro}
                                onChange={e => setFechaFiltro(e.target.value)}
                            />
                        </div>
                        <div className="contenedor-reportes" id='reportes'>
                            <div className="grupo-botones">
                                <button className="btn-reporte" onClick={exportarPDF}>Reporte PDF</button>
                                <button className="btn-reporte" onClick={exportarExcel}>Reporte EXCEL</button>
                                <button className="btn-reporte" onClick={exportarHTML}>Reporte HTML</button>
                            </div>
                        </div>
                    </div>
                    <div className='dimensionTable'>
                        <table className='table-striped'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Fecha</th>
                                    <th>Hora</th>
                                    <th>IP</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {datosFiltrados.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.id}</td>
                                        <td>{row.usuario}</td>
                                        <td>{row.fecha}</td>
                                        <td>{row.hora}</td>
                                        <td>{row.ip}</td>
                                        <td>{row.accion}</td>
                                    </tr>
                                ))}
                                {datosFiltrados.length === 0 && (
                                    <tr>
                                        <td colSpan="6">No se encontraron resultados</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BitacoraPage;
