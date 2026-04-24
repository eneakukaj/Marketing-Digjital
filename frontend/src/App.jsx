import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Navbar from './layouts/Navbar';

 

function App() {

  const { user } = useContext(AuthContext);

 

  return (
    <div className="min-h-screen bg-[#0f111a]">
      <Navbar />
    <main>
    <Routes>

      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

     

      <Route path="/login" element={

        <div className="flex items-center justify-center h-screen bg-gray-100">

          <h1 className="text-2xl font-bold"></h1>

        </div>

      } />

 

      <Route path="/dashboard" element={

        <div className="p-10">

          <h1 className="text-3xl font-bold text-blue-600">Dashboard!</h1>

        </div>

      } />

    </Routes>
    </main>
    </div>
  );

}

 

export default App