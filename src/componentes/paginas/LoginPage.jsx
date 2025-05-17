import React, { useState } from 'react'
import '../css/LoginPageCss.css'
import { useAuth } from '../../context/AuthContext'

const LoginPage = () => {

    const { signin } = useAuth();

    const [data, setData] = useState({
        ci: '',
        password: '',
    });

    const loguearse = async() =>{
        try {
            await signin(data)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className='contenedorLogin-principal'>
            <div className='contenedorLogin-vista'>
                <div id="login">
                    <form className="formLogin">
                        <h3>Iniciar Sesión</h3>

                        <div className="opciones">
                            <label >Usuario</label>
                            <input
                                type="text"
                                value={data.ci}
                                name='ci'
                                onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                                placeholder="colocarCI"
                                required
                            />
                        </div>

                        <div className="opciones">
                            <label >Contraseña</label>
                            <input
                                type="password"
                                value={data.password}
                                name='password'
                                onChange={(e) => setData({ ...data, [e.target.name]: e.target.value })}
                                id="password"
                                placeholder="********" />
                        </div>

                        <button type="button" onClick={loguearse}>Entrar</button>
                    </form>
                </div>
                <div id='img'>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
