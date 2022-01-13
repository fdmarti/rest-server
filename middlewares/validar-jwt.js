const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const Usuario = require('../models/usuario')

const validarJWT = async ( req = request,res = response, next ) => {

    const token = req.header('x-token')


    if ( !token ){
        res.status(401).json({
            msg : 'No hay token en la peticion'
        })
    }

    try {

        const { uid } =  jwt.verify( token, process.env.SECRETORPRIVATEKEY );

        const usuario = await Usuario.findById( uid );

        // Verificar usuario

        if ( !usuario ){
            return res.status(401).json({
                msg : 'Token no valido - Usuario no existente en DB'
            })
        }

        // Verificar estado de usuario

        if ( !usuario.state ) {
            return res.status(401).json({
                msg : 'Token no valido - Usuario con state false'
            })
        }

        req.usuario = usuario;

       next();
        
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg : 'Token no valido'
        })
    }
}


module.exports = {
    validarJWT
}