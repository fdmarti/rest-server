const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario')

const login = async (req,res = response) => {
    
    const { email,password } = req.body;

    try {

        // Verificar si el email existe

        const usuario = await Usuario.findOne({email})

        if ( !usuario ){
            return res.status(400).json({
                msg: 'Datos incorrectos'
            })
        }
        // verificar si el usuario esta activo

        if ( !usuario.state ){
            return res.status(400).json({
                "msg": 'Usuario desactivado',
                "state" : usuario.state
            })
        }

        //verificar la password
        const validPass = bcryptjs.compareSync( password, usuario.password );
        if ( !validPass ){
            return res.status(400).json({
                "msg": 'Usuario / password no son correctos',
            })
        }

        //Generar el JWT

        const token = await generarJWT( usuario.id );


        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message : 'Algo salio mal'
        })
    }
}

module.exports = {
    login
}