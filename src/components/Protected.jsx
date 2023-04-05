import React from 'react'
import { Navigate } from 'react-router-dom'


function Protected({ children }) {
  let userData = JSON.parse(localStorage.getItem('user')) || JSON.parse(sessionStorage.getItem('user'))
  return userData ? children : <Navigate to="/"/>
  }

export default Protected
