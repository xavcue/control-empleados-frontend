import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../api/api';
import './LoginPage.css';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: doLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await login(username, password);
      doLogin(res.token, res.rol);
      navigate('/');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="login-viewport-center">
      <div className="login-container">
        <h2 className="login-title">Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            className="login-input"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Usuario"
            required
          />
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button className="login-btn" type="submit">
            Iniciar sesión
          </button>
        </form>
        <button
          className="login-btn-secondary"
          onClick={() => navigate('/register')}
          type="button"
        >
          Registrarse como empleado
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;