import React from 'react'
import Registration from './pages/Registration'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/profile/Profile'
import { getToken } from './services/localStorage'
import { useSelector } from 'react-redux'
import Home from './pages/home/Home'
import Navbar from './components/navbar/Navbar'
import AnimeHome from './pages/animehome/AnimeHome'
import AnimeProfile from './pages/animeprofile/AnimeProfile'
import OtherProfiles from './pages/profile/OtherProfiles'



const App = () => {
  const { access_token } = useSelector((state) => state.auth)

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/animehome" element={<AnimeHome />} />
          <Route path='registration' element={!access_token ? <Registration /> : <Navigate to='/profile' />} ></Route>
          <Route path='login' element={!access_token ? <Login /> : <Navigate to='/profile' />} ></Route>
          <Route path='profile' element={access_token ? <Profile /> : <Navigate to='/login' />} ></Route>
          <Route path='OtherProfiles' element={<OtherProfiles />} ></Route>
          <Route path="/animeprofile/*" element={<AnimeProfile />} />
          <Route
            path='*'
            element={
              <div className="flex items-center justify-center min-h-screen">
                <h1 className="text-4xl font-bold">404 Not Found</h1>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App