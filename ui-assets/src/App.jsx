import React from 'react'
import Navbar from './components/Navbar'
import {  Route, Routes } from 'react-router'
import Users from './pages/Users'
import GenerateScratchCards from './pages/GenerateScratchCards'
import AssignScratchCards from './pages/AssignScratchCards'
import Transactions from './pages/Transactions'
import './App.css'

function App() {

  return (
    <>
      <Navbar />
        <Routes>
          <Route path="/users" element={<Users />} />
          <Route path="/generate-scratchcards" element={<GenerateScratchCards />} />
          <Route path="/assign-scratchcards" element={<AssignScratchCards />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>

    </>
  )
}

export default App

