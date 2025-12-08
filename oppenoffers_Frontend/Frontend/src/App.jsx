import {
  createBrowserRouter,
  RouterProvider
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Administrator from './pages/Administrator';
import PrivateRoute from './components/PrivateRoute';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/admin',
      element: <PrivateRoute />,
      children: [
        { path: '', element: <Administrator /> },
      ],
    },
    { path: '*', element: <NotFound /> },
  ]);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
