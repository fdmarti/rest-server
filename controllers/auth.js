const bcryptjs = require('bcryptjs');
const { response, request } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
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

const googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body;

    try {

        const { nombre , img, email} = await googleVerify( id_token )

        // Verificar email
        let usuario = await Usuario.findOne({email});

        if ( !usuario ){
            //Crear usuario si no existe
            const data = {
                nombre,
                email,
                password : ':V',
                img,
                role: 'USER_ROLE',
                google : true
            };

            usuario = new Usuario(data);
            await usuario.save()
        }

        // Usuario en db 

        if ( !usuario.state ){
            return res.status(401).json({
                msg : 'Usuario bloqueado. Comuniquese con el admin'
            })
        }

        //Generar JWT
        const token = await generarJWT( usuario.id );

        res.status(400).json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            msg:'Error al login de google',
            error
        })
    }

 
}

module.exports = {
    login,
    googleSignIn
}