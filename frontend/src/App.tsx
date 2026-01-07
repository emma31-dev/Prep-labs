import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import './App.css';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<div className='bg-red-400'>Welcome to the Prep Labs App</div>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
