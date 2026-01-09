import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import Pricing from './pages/Pricing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Quiz from './pages/Quiz';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/quiz/:id" element={<Quiz />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
