import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmpleado } from '../api/api';
import './RegisterPage.css';

function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    password: '',
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    formacion: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerEmpleado(form);
      alert('Empleado registrado con éxito. Ahora puedes iniciar sesión.');
      navigate('/login');
    } catch (err) {
      setError('Error al registrar. ¿Usuario ya existe?');
    }
  };

  return (
    <div className="register-viewport-center">
      <div className="register-container">
        <h2 className="register-title">Registro de Empleado</h2>
        <form onSubmit={handleSubmit}>
          <input className="register-input" name="username" value={form.username} onChange={handleChange} placeholder="Usuario" required />
          <input className="register-input" name="password" type="password" value={form.password} onChange={handleChange} placeholder="Contraseña" required />
          <input className="register-input" name="nombres" value={form.nombres} onChange={handleChange} placeholder="Nombres" required />
          <input className="register-input" name="apellidos" value={form.apellidos} onChange={handleChange} placeholder="Apellidos" required />
          <input className="register-input" name="telefono" value={form.telefono} onChange={handleChange} placeholder="Teléfono" />
          <input className="register-input" name="direccion" value={form.direccion} onChange={handleChange} placeholder="Dirección" />
          <input className="register-input" name="formacion" value={form.formacion} onChange={handleChange} placeholder="Formación" />
          <button className="register-btn" type="submit">Registrar</button>
        </form>
        <button className="register-btn-secondary" onClick={() => navigate('/login')} type="button">
          Volver a login
        </button>
        {error && <p className="register-error">{error}</p>}
      </div>
    </div>
  );
}

export default RegisterPage;