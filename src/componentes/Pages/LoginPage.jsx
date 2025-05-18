import React from 'react'
import '../css/LoginPageCss.css'

const LoginPage = () => {
    return (
        <div className='contenedorLogin-principal'>
            <div className='contenedorLogin-vista'>
                <div id="login">
                    <form className="formLogin">
                        <h3>Iniciar Sesión</h3>

                        <div className="opciones">
                            <label >Usuario</label>
                            <input type="text" id="correo" placeholder="ejemplo@correo.com" />
                        </div>

                        <div className="opciones">
                            <label >Contraseña</label>
                            <input type="password" id="password" placeholder="********" />
                        </div>

                        <button type="submit">Entrar</button>
                    </form>
                </div>
                <div id='img'>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
