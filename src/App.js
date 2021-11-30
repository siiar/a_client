import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'

// Pages
import LoginPage from './pages/login/Login'
import HomePage from './pages/home/Home'
// Style
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={<LoginPage />} 
        />
        <Route
          path="/home"
          element={<HomePage />}
        />
        <Route
          path="*"
          element={<Navigate to="/home" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
