import React from 'react'
import { Navigate } from 'react-router-dom'

const PvtRoute = ({children})  =>{
    return localStorage.getItem("valid") ? children : <Navigate to='/' /> 

}

export default PvtRoute