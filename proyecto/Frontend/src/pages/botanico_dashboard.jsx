import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import InicioBotanico from '../components/inicio_botanico'

export const botanico_dashboard = () => {
  return (
    <>
        <Navbar/>
        <InicioBotanico/>
        <Footer/>
    </>
  )
}

export default botanico_dashboard;