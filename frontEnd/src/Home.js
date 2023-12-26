import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'


function Home() {
  const [auth, setAuth] = useState(false)
  const [message, setMessage] = useState('')
  const [name, setName] = useState('')
  console.log(1)
  const ws = new WebSocket(process.env.REACT_APP_BACKEND_WS)
  ws.onerror = error => console.log(error)
  ws.onopen = open => {
    ws.send('something');
  }
  useEffect(() => {
    async function getData() {
      const result = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/home`,{headers: {token: localStorage.getItem('token')}})
      console.log("result: ",result)
      if(result.data.success) {
        setAuth(true)
        setName(result.data.result[0])
        return
      }
      setAuth(false)
      setMessage(result.data.succes)
    }
    getData()
} , [])

const logOut = () => {
  setAuth(false)
  localStorage.removeItem('token')
  ws.close()
}
  return (
    <div className='container mt-4'>
      {
        auth ?
        <div>
          <h3>You are authorized - {name}</h3>
          <button className='btn btn-danger' onClick={logOut}>Logout</button>
        </div>
        :
        <div>
          <h3>{message}</h3>
          <h3>Login now</h3>
          <Link to='/' className='btn btn-primary'>Login</Link>
        </div>
      }
    </div>
  )
}

export default Home




// try {
  //     const token = req.cookies.token
  //     const decode = await jwt.verify(token, process.env.JWT)
  //     req.username = decode.username
  //     next()
  //     return res.status(200).json({
  //         success: true,
  //         result: [],
  //         errors: []
  // })
  // } catch (error) {
  //     return res.status(500).json({
  //         success: false,
  //         result: [],
  //         errors: ["Internal server error"]
  //     })
  // }