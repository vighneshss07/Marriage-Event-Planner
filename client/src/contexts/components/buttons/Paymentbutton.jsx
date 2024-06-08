import React from 'react';
import { Link } from 'react-router-dom';


const LoginButton = () => {
  return(
    <Link to="/register"> <button>Login</button>
  </Link>
  );
};

export default LoginButton;
