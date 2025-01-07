import './App.css'
import { Routes, Route } from 'react-router-dom';
import AOS from "aos";
import "aos/dist/aos.css";
import Login from './pages/login/login';
import Home from './pages/home/home';
import Project from './pages/project/project';

function App() {
  AOS.init({
    once: true,
    disable: function () {
      var maxWidth = 800;
      return window.innerWidth < maxWidth;
    },
    duration: 300,
    easing: 'ease-out-cubic',
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/project/:project_id" element={<Project />} />
      </Routes>
    </>
  )
}

export default App
