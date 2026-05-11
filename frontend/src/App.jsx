import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard"; 
import ProtectedRoute from "./components/ProtectedRoute"; 
 

function App() {

  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f111a]">
      <Navbar />
    <main className="flex-grow">
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN']} />}>
      <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/unauthorized" element={<div className="text-white text-center mt-20">Access denied!</div>} />

    </Routes>
    </main>
    <Footer />
    </div>
  );

}

 

export default App