const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload')

const { dbConnection } = require('../database/config');

class Server {

    constructor(){
        this.app = express();
        this.port = process.env.PORT;

        this.paths = {
            auth : '/api/auth',
            usuarios : '/api/usuarios',
            categorias : '/api/categorias',
            productos : '/api/productos',
            buscar : '/api/buscar',
            uploads : '/api/uploads'
        }

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

        //carga de archivos
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/',
            createParentPath : true
        }));


    }

    routes(){
        this.app.use(this.paths.auth, require('../routes/auth'));
        this.app.use(this.paths.usuarios, require('../routes/user'));
        this.app.use(this.paths.categorias, require('../routes/categorias'));
        this.app.use(this.paths.productos, require('../routes/productos'));
        this.app.use(this.paths.buscar, require('../routes/buscar'));
        this.app.use(this.paths.uploads, require('../routes/uploads'));

    }

    listen(){
        this.app.listen(this.port,()=> {
            console.log('Servidor corriendo en',this.port)
        });
    }
}


module.exports = Server