import './LoginPage.css';

import AuthForms from '../../components/auth/AuthForms';
import React from 'react';

const LoginPage = ({ initialForm }) => {
  return (
    <div className="login-page">
      <AuthForms initialForm={initialForm} />
    </div>
  );
};

export default LoginPage;