import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom';
import { Navbar } from "./Navbar"
import { ProtectedRoute} from "./ProtectedRoute"
import { SignIn} from "./SignIn"
import { SignUp} from "./SignUp"
import { Livemap } from "./Livemap"
import { HeroSection } from './HeroSection';


export default function HomePage() {
    const [user, setUser] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };
  return (
    <div>
      <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<HeroSection />}/>
          <Route path="/livemap" element={<ProtectedRoute><Livemap /></ProtectedRoute>} />
          <Route path="/signin" element={<SignIn setUser={setUser} />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
    </div>
  )
}
