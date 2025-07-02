import React from 'react';
import { Link } from 'react-router-dom';

const RegisterButton = () => {
  return (
  <Link to="/login">
    <button>Register</button>
  </Link>
  );
};

export default RegisterButton;
