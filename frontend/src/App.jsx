import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Navbar from './layouts/Navbar';
import Footer from './layouts/Footer';
import Home from './pages/Home';
 

function App() {

  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col bg-[#0f111a]">
      <Navbar />
    <main className="flex-grow">
    <Routes>

      <Route path="/" element={<Home />} />
      <Route path="/login" element={<h1 className="text-white p-10">Login Page</h1>} />

    </Routes>
    </main>
    <Footer />
    </div>
  );

}

 

export default App