
import { supabase } from '../lib/supabase'

async function createAdminUser() {
  console.log('👤 Creando usuario administrador...')

  try {
    // Sign up the admin user
    const { data, error } = await supabase.auth.signUp({
      email: 'joseortegahac@gmail.com',
      password: 'admin123456', // Change this password!
      options: {
        data: {
          role: 'admin',
          name: 'Administrador Pastelería Mairim'
        }
      }
    })

    if (error) {
      console.error('Error creando usuario admin:', error)
      throw error
    }

    console.log('✅ Usuario administrador creado exitosamente!')
    console.log('📧 Email:', 'joseortegahac@gmail.com')
    console.log('🔑 Contraseña temporal: admin123456')
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login')

  } catch (error) {
    console.error('❌ Error creando usuario admin:', error)
    process.exit(1)
  }
}

createAdminUser()
