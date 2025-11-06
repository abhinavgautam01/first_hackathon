import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HomePage } from "./components/HomePage";
function App() {
  
  return (
    <Router>
      <HomePage />
    </Router>
  );
}

export default App;
