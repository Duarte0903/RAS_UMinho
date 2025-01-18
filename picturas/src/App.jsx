import './App.css'
import { Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import Login from './pages/login/login';
import Home from './pages/home/home';
import Project from './pages/project/project';
import Profile from './pages/profile/profile';
import Plan from './pages/plan/plan';
import Register from './pages/register/register';
import { useSessionStore } from './stores/session_store';

import { useEffect } from 'react';

function App() {
  useEffect(() => {
    AOS.init({
      once: true,
      disable: () => window.innerWidth < 800,
      duration: 300,
      easing: 'ease-out-cubic',
    });
  }, []); // Empty dependency array ensures it runs only once.

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project/:project_id" element={<Project />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/plan" element={<Plan />} />
      </Routes>
    </>
  );
}
export default App
