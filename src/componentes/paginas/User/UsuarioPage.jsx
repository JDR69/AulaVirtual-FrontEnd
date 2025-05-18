import React from 'react'
import '../../css/Usuario.css'

const UsuarioPage = () => {
    return (
        <div className='contenedor-principal'>
            <div className='contenedor-secundario'>
                <div className='contenedor-usuario'>
                    <div id='titulo'>
                        <h1>Detalle de los Usuarios</h1>
                    </div>
                    <div className='filterReporte'>
                        <div id='buscadores'>
                            <input type="text" placeholder='buscar por el nombre/ci' />
                            <input type="text" placeholder='buscar por el estado/genero' />
                            <input type="text" placeholder='buscar por el loque sea' />
                        </div>
                        <div class="contenedor-reportes">
                            <div class="grupo-botones">
                                <button class="btn-reporte">Reporte 1</button>
                                <button class="btn-reporte">Reporte 2</button>
                                <button class="btn-reporte">Reporte 3</button>
                            </div>
                            <div class="grupo-botones">
                                <button class="btn-nuevo"><i className="bi bi-person-fill-add"></i>  Nuevo</button>
                            </div>
                        </div>

                    </div>
                    <div className='dimensionTable'>
                        <table className='table-striped'>
                            <thead>
                                <tr>
                                    <th>id</th>
                                    <th>ci</th>
                                    <th>rol</th>
                                    <th>nombre</th>
                                    <th>estado</th>
                                    <th>genero</th>
                                    <th>fecha nacimiento</th>
                                    <th>accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                    <td>hola</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UsuarioPage
