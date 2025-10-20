import {
  createBrowserRouter,
  Outlet,
  RouterProvider
} from 'react-router-dom'

/**Pages */
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NotFound from './pages/NotFound'

/** Components */
import Navbar from './components/Navbar'
import Footer from './components/Footer'
function App() {

  const Layout = () => (
    <div>
      <Navbar />
      <Outlet />
      <Footer />
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
        {path : '/',element : <Home/>}
      ]
    },
    {
      element : <AuthLayout/>,
      children:[
        {path : '/login' , element : <Login/>},
        {path : '/register', element : <SignUp/>}
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
