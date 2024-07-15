import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Agendas from './pages/Agendas'
import { UserProvider } from './providers/UserProvider'

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Routes >
          <Route index element={<Home />} />
          <Route path="pautas" element={<Agendas />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
