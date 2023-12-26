import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import {Link, useNavigate} from 'react-router-dom'

function Login() {
    const [values, setValues] = useState({
        username:'',
        password:''
    })

    const navigate = useNavigate()
    const handleSubmit = async (event) => {
        event.preventDefault()
        const res = await axios.post(process.env.REACT_APP_BACKEND_URL, values)
        console.log('res: ', res)
        // if (res.status !== 200) {
        //     alert("Error")
        //     return
        // }  
        localStorage.setItem('token', JSON.stringify(res.data.result[0]))
        //todo: save token to localstorage, after passed token to headers 
        navigate('/home')  //security page  
    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w25'>
            <h2>Sign-in</h2>
            <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                    <label htmlFor="username"><strong>UserName</strong></label>
                    <input type="text" placeholder="Enter UserName" name="username"
                    onChange={e => setValues({...values, username: e.target.value})}
                    className='form-control rounded-0'/>
                </div>
                <div className='mb-3'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder="Enter Password" name="password"
                    onChange={e => setValues({...values, password: e.target.value})}
                    className='form-control rounded-0'/>
                </div>
                <button type='submit' className='btn btn-success w-100 rounded-0'>Sign in</button>
                <p>You are agree to our terms and policies</p>
                <Link to="/register" className='btn btn-default border w-100 bg-ligth rounded-0 text-decoration-none'>Create Account</Link>
            </form>
        </div>
    </div>
  )
}

export default Login