import React, { useState } from 'react';
import './login.css';
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [values,setValues] =useState({
    email:'',
    password:''
  });
  const [error,seterror] =useState();
  const navigate = useNavigate();

  axios.defaults.withCredentials= true; //this will add tokens in cookies
  
  const handleSubmit = (event)=>{
    event.preventDefault()
    axios.post('https://employee-management-system-backend-rz80.onrender.com/auth/adminlogin',values)
    .then(result => {
      if(result.data.loginStatus){
        localStorage.setItem("valid",true)
        navigate('/dashboard')
      }else{
        seterror(result.data.Error)
      }
    })
    .catch(err => console.log(err))
  }
  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginpage">
      <div className="glass-card p-4 rounded-4 text-white shadow">
        <div className="text-warning">
          {error && error}
        </div>
        <h2 className="text-center mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              className="form-control rounded-3"
              onChange={(e) => setValues({...values,email: e.target.value})}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password"><strong>Password:</strong></label>
            <input
              type="password"
              name="password"
              autoComplete="off"
              placeholder="Enter Password"
              className="form-control rounded-3"
              onChange={(e) => setValues({...values,password: e.target.value})}
            />
          </div>
          <button type="submit" className="btn btn-primary w-30 rounded-3 mb-2">Log in</button>
          <div className="mb-1">
            <input type="checkbox" name="tick" id="tick" className="me-2" />
            <label htmlFor="password">You Agree with terms & condition</label>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
