import { render, screen, fireEvent } from '@testing-library/react'
import DashboardPage from './DashboardPage'
import { AuthContext } from '../contexts/AuthContext'

// Mock de datos de perfil
const perfilEmpleado = {
  nombres: 'Juan',
  apellidos: 'Perez',
  telefono: '0999999999',
  direccion: 'Mi Calle 123',
  formacion: 'Licenciado'
}

vi.mock('../api/api', () => ({
  getProductos: () => Promise.resolve([]),
  getMiPerfil: () => Promise.resolve(perfilEmpleado),
  updateMiPerfil: () => Promise.resolve()
}))

function renderEmpleado() {
  return render(
    <AuthContext.Provider value={{ role: 'EMPLEADO', logout: vi.fn() }}>
      <DashboardPage />
    </AuthContext.Provider>
  )
}

describe('DashboardPage', () => {
  it('permite editar el perfil del empleado', async () => {
    renderEmpleado()
    // Espera a que cargue el formulario de perfil
    expect(await screen.findByDisplayValue('Juan')).toBeInTheDocument()
    // El campo inicialmente debe estar solo lectura
    expect(screen.getByLabelText(/nombres/i)).toHaveAttribute('readOnly')
    // Haz click en "Editar"
    fireEvent.click(screen.getByRole('button', { name: /editar/i }))
    // Ahora el campo debe ser editable
    expect(screen.getByLabelText(/nombres/i)).not.toHaveAttribute('readOnly')
  })
})