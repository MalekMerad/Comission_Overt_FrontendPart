import React from 'react'
import { useNavigate } from 'react-router-dom'
function Login() {

   const navigate = useNavigate()

  return (
    <div>
        <button onClick={()=>navigate('/')}>Navigate To home</button>
    </div>
  )
}

export default Login