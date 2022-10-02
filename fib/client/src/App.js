import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import OtherPage from "./OtherPage"
import Fib from "./Fib"

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={ logo } className="App-logo" alt="logo" />
          <p>
            Fibonacci calculator
          </p>
          <Link to="/">Home</Link>
          <Link to="/otherpage">Other Page</Link>
        </header>
        <div>
          <Routes>
            <Route exact path="/" element={ <Fib /> } />
            <Route path="/otherpage" element={ <OtherPage /> } />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
