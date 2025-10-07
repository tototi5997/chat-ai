import { Routes, Route } from 'react-router-dom'
import routes from './router/index.tsx'

function App() {
  return <Routes>
    {
      routes.map(e => (
        <Route path={e.path} element={e.element} />
      ))
    }
  </Routes>;
}

export default App;
