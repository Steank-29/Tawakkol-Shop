import React from 'react'
import Navbar from "../Components/Pages/Navbar"
import Footer from '../Components/Pages/Footer'

export default function Layout(props) {
  return (
    <>
        <Navbar/>
        {props.children}
        <Footer/>
    </>
  )
}