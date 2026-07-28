const { Pool } = require('pg')


const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "",
    password: "",
    port: "5432"

})


pool.connect(err => {
    if (err) {
        console.error('error de conexion', err.stack)
    }
    else {
        console.log('conectado')
    }
})

