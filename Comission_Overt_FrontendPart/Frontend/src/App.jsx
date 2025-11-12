import {
  createBrowserRouter,
  Outlet,
  RouterProvider
} from 'react-router-dom'


import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Administrator from './pages/Administrator'


function App() {

  const Layout = () => (
    <div>
      <Outlet />
    </div>
  );
  

  const AuthLayout = ()=>{
    return(
      <div>
        <Outlet/>
      </div>
    )
  }

  const router = createBrowserRouter([
    {
      path : '/',
      element : <Layout/>,
      children : [
        {path : '/',element : <Home/>},
      ]
    },
    {
      path : '/manage/:adminId',
      element : <Administrator/>
    },
    {
      element : <AuthLayout/>,
      children:[
        {path : '/login' , element : <Login/>},
      ]
    },
    { path: '*', element: <NotFound /> },
  ])
  return (
    <>
        <RouterProvider router={router}/>
    </>
  )
}

export default App
