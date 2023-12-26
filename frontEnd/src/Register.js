import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'



function Register() {
    const [values, setValues] = useState({
        username:'',
        password:''
    })

    const handleSubmit = (event) => {
        event.preventDefault()
        // TODO: replace to .env file
        console.log(process.env.REACT_APP_BACKEND_URL)
        axios.post(`${process.env.REACT_APP_BACKEND_URL}`, values)
    }
  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w25'>
            <h2>Sign-up</h2>
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
                <button type='submit' className='btn btn-success w-100 rounded-0'>Sign up</button>
                <p>You are agree to our terms and policies</p>
                <Link to="/login" className='btn btn-default border w-100 bg-ligth rounded-0 text-decoration-none'>Login</Link>
            </form>
        </div>
    </div>
  )
}

export default Register