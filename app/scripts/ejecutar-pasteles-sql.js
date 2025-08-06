const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Configurar Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas')
  console.log('Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function ejecutarSQL() {
  try {
    console.log('🚀 Iniciando creación del sistema de pasteles personalizados...')
    
    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'create-pasteles-system.sql')
    const sqlContent = fs.readFileSync(sqlPath, 'utf8')
    
    console.log('📄 Contenido del SQL cargado')
    
    // Dividir el SQL en comandos individuales
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0)
    
    console.log(`📋 Ejecutando ${commands.length} comandos SQL...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i]
      
      try {
        console.log(`\n🔄 Ejecutando comando ${i + 1}/${commands.length}...`)
        
        const { data, error } = await supabase.rpc('exec_sql', { sql: command })
        
        if (error) {
          console.error(`❌ Error en comando ${i + 1}:`, error.message)
          errorCount++
        } else {
          console.log(`✅ Comando ${i + 1} ejecutado exitosamente`)
          successCount++
        }
      } catch (err) {
        console.error(`❌ Error ejecutando comando ${i + 1}:`, err.message)
        errorCount++
      }
    }
    
    console.log('\n📊 Resumen de ejecución:')
    console.log(`✅ Comandos exitosos: ${successCount}`)
    console.log(`❌ Comandos con error: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log('\n🎉 ¡Sistema de pasteles personalizados creado exitosamente!')
      console.log('\n📋 Tablas creadas:')
      console.log('- tamanos_pastel')
      console.log('- sabores_pastel')
      console.log('- rellenos_pastel')
      console.log('- decoraciones_pastel')
      console.log('- pasteles_personalizados')
      console.log('\n🔧 Funciones creadas:')
      console.log('- calcular_precio_pastel()')
      console.log('- actualizar_precio_pastel()')
      console.log('\n📊 Datos de ejemplo insertados:')
      console.log('- 5 tamaños de pasteles')
      console.log('- 8 sabores diferentes')
      console.log('- 7 tipos de rellenos')
      console.log('- 6 opciones de decoración')
    } else {
      console.log('\n⚠️ Algunos comandos fallaron. Revisa los errores arriba.')
    }
    
  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Función alternativa usando SQL directo
async function crearTablasManual() {
  try {
    console.log('🚀 Creando tablas manualmente...')
    
    // Crear tabla de tamaños
    const { error: errorTamanos } = await supabase
      .from('tamanos_pastel')
      .select('*')
      .limit(1)
    
    if (errorTamanos && errorTamanos.code === '42P01') {
      console.log('📋 Tabla tamanos_pastel no existe, creándola...')
      // Aquí podrías crear la tabla manualmente
    }
    
    console.log('✅ Verificación completada')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

// Ejecutar
if (process.argv.includes('--manual')) {
  crearTablasManual()
} else {
  ejecutarSQL()
} 