import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Customers from './pages/Customer';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/customers" element={<Customers />} />
        {/* Add other routes later */}
      </Routes>
    </Router>
  );
}

export default App;
