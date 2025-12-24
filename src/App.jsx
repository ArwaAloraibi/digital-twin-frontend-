// src/App.jsx

import { Routes, Route } from 'react-router';// Import React Router
import NavBar from './components/NavBar/NavBar';
// Import the SignUpForm component
import SignUpForm from './components/SignUpForm/SignUpForm';
import SignInForm from './components/SignInForm/SignInForm';
import Landing from './components/Landing/Landing';
import Dashboard from './components/Dashboard/Dashboard';
import MachineDetails from './components/MachineDetails/MachineDetails';
import { useContext } from 'react';
import { UserContext } from './contexts/UserContext';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
import './App.css';

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <>
      <NavBar />

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="colored"
        transition={Bounce}
      />
      
      <Routes>
        {
          user ?
          <>
            <Route path='/' element={<Dashboard/>}/>
            <Route path="/machines/:machine_id" element={<MachineDetails />} />
            <Route path='/profile' element={<h1>{user.username}</h1>}/>

          </>
            :
            <Route path='/' element={<Landing/>}/>
        }
     
        <Route path='/sign-up' element={<SignUpForm />} />
        <Route path='/sign-in' element={<SignInForm />} />
      </Routes>
    </>
  );
};

export default App;

