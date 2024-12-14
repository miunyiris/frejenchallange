import React, { useState } from 'react';
import './LoginPage.css';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    try {
      const response = await fetch('http://localhost:1880/api/authenticate', { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('id', data.id);
        localStorage.setItem('name', data.name);
        localStorage.setItem('id_department', data.id_department);
        localStorage.setItem('department', data.department);
        localStorage.setItem('admin', data.admin);

        navigate(`/mainticket`);
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Erro ao fazer login. Verifique suas credenciais.');
      }
    } catch (error) {
      setErrorMessage('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Bem Vindo!</h1>
        <p className="login-subtitle">Autentique-se para continuar</p>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label htmlFor="username">Email</label>
            <input
              type="email"
              id="username"
              name="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Insira o seu nome de usuario..."
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Palavra Passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Insira a sua palavra passe..."
              required
            />
          </div>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" className="login-button">Autenticar</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
