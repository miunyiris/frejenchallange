import React, { useState, FormEvent } from 'react';
import './LoginPage.css'; // Certifique-se de que o caminho está correto

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Função de submit do formulário
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (username === '' || password === '') {
      setError('Por favor, preencha todos os campos!');
      return;
    }

    // Simulação de login bem-sucedido
    if (username === 'admin' && password === 'admin123') {
      alert('Login bem-sucedido!');
      // Redirecionar para a próxima página ou portal
    } else {
      setError('Usuário ou senha incorretos!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Bem-vindo ao Portal</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu usuário"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />
          </div>

          {error && <p className="error-message">{error}</p>}

          <button type="submit" className="login-button">Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;