import './LoginPage.css';

import AuthForms from '../../components/auth/AuthForms';
import React from 'react';

const LoginPage = () => {
  return (
    <div className="login-page">
      <AuthForms />
    </div>
  );
};

export default LoginPage;