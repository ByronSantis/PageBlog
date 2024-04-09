import React from 'react'
import {Link} from 'react-router-dom'

const NotFound = () => {
  return (
    <div className='error-page'>  
    <div className='content'>
      <h1>404</h1>
      <br />
      <br />
      <center><h4 >¡opps! Pagina no encontrada</h4></center>
      <br/>
      <p>Lo siento, no hemos podido localizar la página que buscas. Pero tranquilo, puedes volver al inicio y dejar esto en el olvido.</p>
      <div className='btns'>  
      <Link to="/">Volver al inicio</Link>
      </div>
    </div> 
  </div>
  )
}

export default NotFound



