import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from './LoginPage'
import { MemoryRouter } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

// Mock del contexto de autenticación para pruebas
const mockLogin = vi.fn((username, password) => {
  if (username === 'admin' && password === '12345') {
    return Promise.resolve({ token: 'jwt', rol: 'ADMIN' })
  } else {
    throw new Error('Credenciales incorrectas')
  }
})

function renderWithContext() {
  return render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )
}

describe('LoginPage', () => {
  it('muestra error si las credenciales son inválidas', async () => {
    renderWithContext()
    fireEvent.change(screen.getByPlaceholderText(/usuario/i), { target: { value: 'malo' } })
    fireEvent.change(screen.getByPlaceholderText(/contraseña/i), { target: { value: 'incorrecto' } })
    fireEvent.click(screen.getByRole('button', { name: /iniciar sesión/i }))

    // Espera a que aparezca el mensaje de error
    await waitFor(() => {
      expect(screen.getByText(/credenciales incorrectas/i)).toBeInTheDocument()
    })
  })
})