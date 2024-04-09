import React from 'react'
import {Link} from "react-router-dom" 
import transitions from "bootstrap";

const Header = ({active, setActive, user, logOut}) => {
  const userId = user?.uid;
  return (
    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className='container-fluid bg-faded padding-media'>
            <div className='container padding-media'>
                <nav className='navbar navbar-toggleable-md navbar-light'>
                        <button
                    className="navbar-toggler mt-3"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    data-bs-parent="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="true"
                    aria-label="Toggle Navigation"
                    >
                        <span className='fa fa-bars'></span>
                    </button>
                    <div  className="collapse navbar-collapse"
                             id="navbarSupportedContent">
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                        <Link to="/" style={{textDecoration: "none"}} >
                            <li className={`nav-item nav-link ${active === "home" ? "active" : "" }`} onClick={() => setActive("home")}>
                                Inicio
                            </li>
                        </Link>

                        <Link to="/blogs" style={{textDecoration: "none"}} >
                            <li className={`nav-item nav-link ${active === "blogs" ? "active" : "" }`} onClick={() => setActive("blogs")}>
                                Publicaciones
                            </li>
                        </Link>
                         
                        <Link to="/create" style={{textDecoration: "none"}} >
                            <li className={`nav-item nav-link ${active === "create" ? "active" : "" }`} onClick={() => setActive("create")}>
                                Crear publicacion
                            </li>
                        </Link>

                        </ul>
                        <div className='row g-3'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            {userId ? (
                                <>
                                    <div className='profile-logo'>
                                        <img src='https://st2.depositphotos.com/47577860/46935/v/450/depositphotos_469356042-stock-illustration-contact-people-profile-icon-solid.jpg' alt="logo"
                                         style={{
                                            width: "30px",
                                            height: "30px",
                                            borderRadius: "50%",
                                            marginTop: "12px",
                                         }}
                                         />
                                    </div>
                                    <p style={{marginTop: "12px", marginLeft: "5px"}}>{user?.displayName}</p>
                                    <li className='nav-item nav-link' onClick={logOut} >Cerrar sesion</li>
                                </>
                            ): (
                                <Link to="/auth" style={{textDecoration: "none"}} >
                                <li className={`nav-item nav-link ${active === "login" ? "active" : "" }`} onClick={() => setActive("login")}>
                                    Ingresar
                                </li>
                            </Link>
                            )}
                        </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
    </nav>
  )
}

export default Header