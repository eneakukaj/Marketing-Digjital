import { Routes, Route, Navigate } from 'react-router-dom'

import { useContext } from 'react'

import { AuthContext } from './context/AuthContext'

 

function App() {

  const { user } = useContext(AuthContext);

 

  return (

    <Routes>

      {/* Faqja kryesore - nëse s'je i loguar të dërgon te Login */}

      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

     

      <Route path="/login" element={

        <div className="flex items-center justify-center h-screen bg-gray-100">

          <h1 className="text-2xl font-bold">Këtu do të jetë Faqja e Login-it</h1>

        </div>

      } />

 

      <Route path="/dashboard" element={

        <div className="p-10">

          <h1 className="text-3xl font-bold text-blue-600">Mirësevini në Dashboard!</h1>

        </div>

      } />

    </Routes>

  )

}

 

export default App