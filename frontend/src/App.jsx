import React from 'react'
import Registration from './pages/Registration'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import { getToken } from './services/localStorage'
import { useSelector } from 'react-redux'
import Home from './pages/Home'

const App = () => {
  const { access_token } = useSelector((state) => state.auth)

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='registration' element={ !access_token ? <Registration/> : <Navigate to = '/profile'/>} ></Route>
          <Route path='login' element={ !access_token ? <Login/> : <Navigate to = '/profile'/>} ></Route>
          <Route path='profile' element={ access_token ? <Profile/> : <Navigate to = '/login'/>} ></Route>
          <Route path='*' element={<h1>404 Not Found</h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App