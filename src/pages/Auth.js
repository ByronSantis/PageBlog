import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import React, { useState } from 'react'
import {toast} from "react-toastify"
import {auth} from "../frebase"
import {useNavigate} from "react-router-dom"


const initializeApp = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: ""
}

const Auth = ({setActive, setUser}) => {

  const [state, setState] = useState(initializeApp);
  const [signUp, setSignUp] = useState(false);
  const {email, password, name, username, confirmPassword} = state;

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    setState({...state, [e.target.name]: e.target.value});
  }

  const handleAuth = async (e) => {
    e.preventDefault();
    if(!signUp){
      if(email && password){
        const {user} = await signInWithEmailAndPassword(auth, email, password);
        setUser(user);
        setActive("home");
      }else{
        return toast.error("Algunos campos estan vacios. Intenta de nuevo");
      }
    }else{
      if (password !== confirmPassword) {
        return toast.error("Las contraseñas no coinciden")
      }
      if(name && username  && email && password){
        const {user} = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, {displayName: `${username}`})
        setActive("home");
      }else{
        return toast.error("Algunos campos estan vacios. Intenta de nuevo");
      }
    }
    navigate("/");
  }

  return (
    <div className='container-fluid mb-4'>
       <div className='container'>
        <div className='col-12 text-center'>
          <div className='text-center heading py-2'>
              {!signUp ? "Ingresar" : "Registro" }
          </div>
          <div className='row h-100 justify-content-center align-items-center'>
            <div className='col-10 col-md-8 col-lg-6'>
              <form className='row' onSubmit={handleAuth}> 
                {signUp && (
                  <>
                     <div className='col-6 py-3'>
                        <input
                        onPressKey="return nombre(event);" required
                        type='text'  
                        className='form-control input-text-box'
                        placeholder='Nombre'
                        name='name'
                        value={name}
                        onChange={handleSubmit}
                      
                        />
                    </div>
                    <div className='col-6 py-3'>
                        <input
                        type='text'  
                        className='form-control input-text-box'
                        placeholder='Usuario'
                        name='username'
                        value={username}
                        onChange={handleSubmit}
                        />
                    </div>
                  </>
                )}
                  <div className='col-12 py-3'>
                        <input
                        type='email'  
                        className='form-control input-text-box'
                        placeholder='Correo electrónico'
                        name='email'
                        value={email}
                        onChange={handleSubmit}
                        required/>
                    </div>
                <div className='col-12 py-3'>
                  <input
                    type='password'  
                    className='form-control input-text-box'
                    placeholder='Contraseña'
                    name='password'
                    value={password}
                    onChange={handleSubmit}
                    />
                </div>
                    {signUp && (
                          <div className='col-12 py-3'>
                          <input
                              type='password'  
                              className='form-control input-text-box'
                              placeholder='Confirma contraseña'
                              name='confirmPassword'
                              value={confirmPassword}
                              onChange={handleSubmit}
                              />
                          </div>
                    )}

                <div className='col-12 py-3 text-center'>
                  <button className={`btn ${!signUp ? "btn-sign-in" : "btn-sign-up"}`} 
                  type='submit'
                  >
                    {!signUp ? "Ingresar" : "Registrarme" }
                  </button>
                </div>
              </form>
            </div>
            {!signUp ? (
               <>
                  <div className='text-center justify-content-center mt-2 pt-2'>
                    <p className='small fw-bold mt-2 pt-1 mb-0'> 
                     ¿No tienes una cuenta?  &nbsp;
                     <span style={{textDecoration: "none", cursor: "pointer", color: "#1E75CB"}}
                     onClick={() => setSignUp(true)}>  
                         Registrarme
                     </span>
                    </p>
                  </div>
               </>
            ): (
              <>
               <div className='text-center justify-content-center mt-2 pt-2'>
                    <p className='small fw-bold mt-2 pt-1 mb-0'> 
                     ¿Ya tienes una cuenta? &nbsp;
                     <span style={{textDecoration: "none", cursor: "pointer", color: "#1E75CB"}}
                     onClick={() => setSignUp(false) }>
                        Ingresar
                     </span>
                    </p>
                  </div>
              </>
            )}
          </div>
        </div>
       </div>
    </div>
  )
}

export default Auth