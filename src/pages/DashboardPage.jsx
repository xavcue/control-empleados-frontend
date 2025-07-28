import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getEmpleados,
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
  getMiPerfil,
  updateMiPerfil,
  registerEmpleado,
  updateEmpleado,
  deleteEmpleado
} from '../api/api';
import './DashboardPage.css';

function DashboardPage() {
  const { role, logout } = useAuth();
  const [empleados, setEmpleados] = useState([]);
  const [empleadoEdit, setEmpleadoEdit] = useState(null);
  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    direccion: '',
    formacion: '',
    username: '',
    password: ''
  });
  const [productos, setProductos] = useState([]);
  const [miPerfil, setMiPerfil] = useState(null);
  const [miPerfilEdit, setMiPerfilEdit] = useState(null);
  const [editPerfil, setEditPerfil] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', descripcion: '', cantidad: 1 });
  const [loadingProducto, setLoadingProducto] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        if (role === 'ADMIN') {
          const empleadosData = await getEmpleados();
          setEmpleados(empleadosData);
        } else {
          const perfil = await getMiPerfil();
          setMiPerfil(perfil);
          setMiPerfilEdit(perfil);
        }
        const productosData = await getProductos();
        setProductos(productosData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    })();
  }, [role]);

  // --- CRUD Productos ---
  const handleAddProducto = async (e) => {
    e.preventDefault();
    try {
      setLoadingProducto(true);
      await createProducto(nuevoProducto);
      const productosData = await getProductos();
      setProductos(productosData);
      setNuevoProducto({ nombre: '', descripcion: '', cantidad: 1 });
    } catch (error) {
      alert('Error al agregar producto');
      console.error(error);
    } finally {
      setLoadingProducto(false);
    }
  };

  const handleUpdateProducto = async (id, field, value) => {
    try {
      setLoadingProducto(true);
      const producto = productos.find((p) => p.id === id);
      if (!producto) return;
      const actualizado = { ...producto, [field]: field === 'cantidad' ? Number(value) : value };
      await updateProducto(id, actualizado);
      const productosData = await getProductos();
      setProductos(productosData);
    } catch (error) {
      alert('Error al actualizar producto');
      console.error(error);
    } finally {
      setLoadingProducto(false);
    }
  };

  const handleDeleteProducto = async (id) => {
    try {
      setLoadingProducto(true);
      await deleteProducto(id);
      const productosData = await getProductos();
      setProductos(productosData);
    } catch (error) {
      alert('Error al eliminar producto');
      console.error(error);
    } finally {
      setLoadingProducto(false);
    }
  };

  // --- CRUD Empleados (ADMIN) ---
  const startEditEmpleado = (emp) => setEmpleadoEdit({ ...emp });
  const cancelEditEmpleado = () => setEmpleadoEdit(null);

  const handleUpdateEmpleado = async (e) => {
    e.preventDefault();
    try {
      await updateEmpleado(empleadoEdit.id, {
        nombres: empleadoEdit.nombres,
        apellidos: empleadoEdit.apellidos,
        telefono: empleadoEdit.telefono,
        direccion: empleadoEdit.direccion,
        formacion: empleadoEdit.formacion,
      });
      const empleadosData = await getEmpleados();
      setEmpleados(empleadosData);
      setEmpleadoEdit(null);
      alert('Empleado actualizado');
    } catch (error) {
      alert('Error al actualizar empleado');
      console.error(error);
    }
  };

  const handleChangeEditEmpleado = (e) => {
    const { name, value } = e.target;
    setEmpleadoEdit(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteEmpleado = async (id) => {
    if (!window.confirm('¿Seguro que quieres eliminar este empleado?')) return;
    try {
      await deleteEmpleado(id);
      setEmpleados(await getEmpleados());
      alert('Empleado eliminado');
    } catch (error) {
      alert('Error al eliminar empleado');
      console.error(error);
    }
  };

  const handleChangeNuevoEmpleado = (e) => {
    const { name, value } = e.target;
    setNuevoEmpleado(prev => ({ ...prev, [name]: value }));
  };

  const handleRegisterEmpleado = async (e) => {
    e.preventDefault();
    try {
      await registerEmpleado(nuevoEmpleado);
      setEmpleados(await getEmpleados());
      setNuevoEmpleado({
        nombres: '',
        apellidos: '',
        telefono: '',
        direccion: '',
        formacion: '',
        username: '',
        password: ''
      });
      alert('Empleado registrado');
    } catch (error) {
      alert('Error al registrar empleado');
      console.error(error);
    }
  };

  // --- Edición de perfil (empleado) ---
  const handleEditPerfil = () => {
    setMiPerfilEdit({ ...miPerfil });
    setEditPerfil(true);
  };

  const handleCancelPerfil = () => {
    setMiPerfilEdit({ ...miPerfil });
    setEditPerfil(false);
  };

  const handleChangePerfil = (e) => {
    const { name, value } = e.target;
    setMiPerfilEdit((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePerfil = async (e) => {
    e.preventDefault();
    try {
      await updateMiPerfil({
        nombres: miPerfilEdit.nombres,
        apellidos: miPerfilEdit.apellidos,
        telefono: miPerfilEdit.telefono,
        direccion: miPerfilEdit.direccion,
        formacion: miPerfilEdit.formacion,
      });
      setMiPerfil({ ...miPerfilEdit });
      setEditPerfil(false);
      alert('Perfil actualizado');
    } catch (error) {
      alert('Error actualizando perfil');
      console.error(error);
    }
  };

  if (!miPerfil && role !== 'ADMIN') {
    return (
      <div className="dashboard-outer">
        <div className="dashboard-loading">Cargando perfil...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-outer">
      <div className="dashboard-container">
        <h1 className="dashboard-title">Dashboard ({role})</h1>
        <button onClick={logout} className="dashboard-logout">Cerrar sesión</button>

        <h2 className="dashboard-section-title">Productos de Oficina</h2>
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              {role === 'ADMIN' && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod.id}>
                <td>
                  {role === 'ADMIN' ? (
                    <input
                      className="dashboard-input"
                      value={prod.nombre}
                      onChange={(e) =>
                        handleUpdateProducto(prod.id, 'nombre', e.target.value)
                      }
                      disabled={loadingProducto}
                    />
                  ) : (
                    prod.nombre
                  )}
                </td>
                <td>
                  {role === 'ADMIN' ? (
                    <input
                      className="dashboard-input"
                      value={prod.descripcion}
                      onChange={(e) =>
                        handleUpdateProducto(prod.id, 'descripcion', e.target.value)
                      }
                      disabled={loadingProducto}
                    />
                  ) : (
                    prod.descripcion
                  )}
                </td>
                <td>
                  {role === 'ADMIN' ? (
                    <input
                      className="dashboard-input"
                      type="number"
                      value={prod.cantidad}
                      onChange={(e) =>
                        handleUpdateProducto(prod.id, 'cantidad', e.target.value)
                      }
                      disabled={loadingProducto}
                      min={1}
                    />
                  ) : (
                    prod.cantidad
                  )}
                </td>
                {role === 'ADMIN' && (
                  <td>
                    <button
                      className="dashboard-btn dashboard-btn-delete"
                      onClick={() => handleDeleteProducto(prod.id)}
                      disabled={loadingProducto}
                    >
                      Eliminar
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {role === 'ADMIN' && (
          <form onSubmit={handleAddProducto} className="dashboard-form">
            <input
              className="dashboard-input"
              placeholder="Nombre"
              value={nuevoProducto.nombre}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
              }
              required
              disabled={loadingProducto}
            />
            <input
              className="dashboard-input"
              placeholder="Descripción"
              value={nuevoProducto.descripcion}
              onChange={(e) =>
                setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
              }
              disabled={loadingProducto}
            />
            <input
              className="dashboard-input"
              type="number"
              placeholder="Cantidad"
              value={nuevoProducto.cantidad}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  cantidad: Number(e.target.value),
                })
              }
              min={1}
              required
              disabled={loadingProducto}
            />
            <button type="submit" className="dashboard-btn">
              Agregar Producto
            </button>
          </form>
        )}

        <hr className="dashboard-divider" />

        <h2 className="dashboard-section-title">Empleados</h2>
        {role === 'ADMIN' ? (
          <>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nombres</th>
                  <th>Apellidos</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Formación</th>
                  <th>Usuario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {empleados.map((emp) => (
                  empleadoEdit && empleadoEdit.id === emp.id ? (
                    <tr key={emp.id} className="dashboard-edit-row">
                      <td><input className="dashboard-input" name="nombres" value={empleadoEdit.nombres} onChange={handleChangeEditEmpleado} required /></td>
                      <td><input className="dashboard-input" name="apellidos" value={empleadoEdit.apellidos} onChange={handleChangeEditEmpleado} required /></td>
                      <td><input className="dashboard-input" name="telefono" value={empleadoEdit.telefono || ''} onChange={handleChangeEditEmpleado} /></td>
                      <td><input className="dashboard-input" name="direccion" value={empleadoEdit.direccion || ''} onChange={handleChangeEditEmpleado} /></td>
                      <td><input className="dashboard-input" name="formacion" value={empleadoEdit.formacion || ''} onChange={handleChangeEditEmpleado} /></td>
                      <td>{emp.usuario.username}</td>
                      <td>
                        <button className="dashboard-btn" onClick={handleUpdateEmpleado}>Guardar</button>
                        <button type="button" className="dashboard-btn dashboard-btn-cancel" onClick={cancelEditEmpleado}>Cancelar</button>
                      </td>
                    </tr>
                  ) : (
                    <tr key={emp.id}>
                      <td>{emp.nombres}</td>
                      <td>{emp.apellidos}</td>
                      <td>{emp.telefono}</td>
                      <td>{emp.direccion}</td>
                      <td>{emp.formacion}</td>
                      <td>{emp.usuario.username}</td>
                      <td>
                        <button className="dashboard-btn" onClick={() => startEditEmpleado(emp)}>Editar</button>
                        <button className="dashboard-btn dashboard-btn-delete" onClick={() => handleDeleteEmpleado(emp.id)}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  )
                ))}
              </tbody>
            </table>

            <form onSubmit={handleRegisterEmpleado} className="dashboard-form dashboard-form-empleado">
              <h3>Registrar Nuevo Empleado</h3>
              <input className="dashboard-input" name="nombres" placeholder="Nombres" value={nuevoEmpleado.nombres} onChange={handleChangeNuevoEmpleado} required />
              <input className="dashboard-input" name="apellidos" placeholder="Apellidos" value={nuevoEmpleado.apellidos} onChange={handleChangeNuevoEmpleado} required />
              <input className="dashboard-input" name="telefono" placeholder="Teléfono" value={nuevoEmpleado.telefono} onChange={handleChangeNuevoEmpleado} />
              <input className="dashboard-input" name="direccion" placeholder="Dirección" value={nuevoEmpleado.direccion} onChange={handleChangeNuevoEmpleado} />
              <input className="dashboard-input" name="formacion" placeholder="Formación" value={nuevoEmpleado.formacion} onChange={handleChangeNuevoEmpleado} />
              <input className="dashboard-input" name="username" placeholder="Usuario" value={nuevoEmpleado.username} onChange={handleChangeNuevoEmpleado} required />
              <input className="dashboard-input" name="password" placeholder="Contraseña" value={nuevoEmpleado.password} onChange={handleChangeNuevoEmpleado} required type="password" />
              <button className="dashboard-btn" type="submit">Registrar</button>
            </form>
          </>
        ) : (
          <>
            <h3>Mi Perfil</h3>
            {miPerfil && (
              <form
                onSubmit={handleUpdatePerfil}
                className="dashboard-form"
                autoComplete="off"
              >
                <div className="dashboard-form-group">
                  <label htmlFor="nombres">Nombres:</label>
                  <input
                    id="nombres"
                    className="dashboard-input"
                    type="text"
                    name="nombres"
                    value={miPerfilEdit?.nombres || ''}
                    onChange={handleChangePerfil}
                    readOnly={!editPerfil}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="apellidos">Apellidos:</label>
                  <input
                    id="apellidos"
                    className="dashboard-input"
                    type="text"
                    name="apellidos"
                    value={miPerfilEdit?.apellidos || ''}
                    onChange={handleChangePerfil}
                    readOnly={!editPerfil}
                    required
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="telefono">Teléfono:</label>
                  <input
                    id="telefono"
                    className="dashboard-input"
                    type="text"
                    name="telefono"
                    value={miPerfilEdit?.telefono || ''}
                    onChange={handleChangePerfil}
                    readOnly={!editPerfil}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="direccion">Dirección:</label>
                  <input
                    id="direccion"
                    className="dashboard-input"
                    type="text"
                    name="direccion"
                    value={miPerfilEdit?.direccion || ''}
                    onChange={handleChangePerfil}
                    readOnly={!editPerfil}
                  />
                </div>
                <div className="dashboard-form-group">
                  <label htmlFor="formacion">Formación:</label>
                  <input
                    id="formacion"
                    className="dashboard-input"
                    type="text"
                    name="formacion"
                    value={miPerfilEdit?.formacion || ''}
                    onChange={handleChangePerfil}
                    readOnly={!editPerfil}
                  />
                </div>
                {editPerfil ? (
                  <>
                    <button className="dashboard-btn" type="submit">Guardar</button>
                    <button
                      className="dashboard-btn dashboard-btn-cancel"
                      type="button"
                      onClick={handleCancelPerfil}
                    >
                      Cancelar
                    </button>
                  </>
                ) : (
                  <button className="dashboard-btn" type="button" onClick={handleEditPerfil}>
                    Editar
                  </button>
                )}
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;