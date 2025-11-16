import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InicioJefe from '../components/inicio_jefe_brigada'

  export const jefe_brigada_dashboard = () => {
    return (
    <>
        <Navbar/>
        <InicioJefe/>
        <Footer/>
    </>
  )
}

export default jefe_brigada_dashboard;