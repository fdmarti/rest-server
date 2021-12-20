const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.usuariosPath = '/api/usuarios';

        // Conection to the database
        this.conectarDB();

        // Middlewares
        this.middlewares();
        
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        // CORS

        this.app.use(cors());

        // Parse y lect del body

        this.app.use(express.json());

        //Directorio publico
        this.app.use( express.static('public') );


    }

    routes(){
        
        this.app.use(this.usuariosPath, require('../routes/user'));
    }

    listen(){
        this.app.listen(this.port,()=> {
            console.log('Servidor corriendo en',this.port)
        });
    }
}


module.exports = Server