import { Navigate } from 'react-router-dom'
import Home from '../pages/Home'
import Login from '../pages/Login'

const routes = [
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/login',
    element: <Login/>
  },
  {
    path: '/',
    element: <Navigate to="/home"/>
  }
]

export default routes
