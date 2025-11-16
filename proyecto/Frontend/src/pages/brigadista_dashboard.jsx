import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import  InicioBrigadista from '../components/inicio_brigadista'

export const brigadista_dashboard = () => {
  return (
    <>
        <Navbar/>
        <InicioBrigadista/>
        <Footer/>
    </>
  )
}

export default brigadista_dashboard;