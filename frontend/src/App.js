import {
  BrowserRouter, 
  Routes, 
  Route
} from 'react-router-dom';

import Opportunities from './components/pages/opportunities';

function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Opportunities />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
