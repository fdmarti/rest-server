const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');


const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0} = req.query;
    const query = {state : true}

    if( isNaN(limite) || isNaN(desde) ){
        throw new Error('El valor debe ser un numero valido')
    }

    const [total , usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
    ])

    res.json({
        msh : 'Toma los usuarios',
        total,
        usuarios
    })
}

const usuariosPost = async (req , res = response) => {

    const { nombre,email, password, role } = req.body;
    const usuario = new Usuario({nombre,email, password, role});

    // Hash password
    const salt = bcryptjs.genSaltSync(10);
    usuario.password = bcryptjs.hashSync(password, salt);

    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req , res = response) => {

    const { id } = req.params;
    const {_id, password,google,email,role, ...resto } = req.body;

    if ( password ){
        const salt = bcryptjs.genSaltSync(10);
        resto.password = bcryptjs.hashSync(password, salt);
    }

    const usuarioDB = await Usuario.findByIdAndUpdate(id, resto, { new : true})

    res.json({
        msg : 'Usuario actualizado',
        usuarioDB
    });
}

const usuariosDelete =  async (req , res = response) => {

    const { id } = req.params;

    //Borrado fisico
    // const usuarioDB = await Usuario.findByIdAndDelete( id );

    const usuarioDB = await Usuario.findByIdAndUpdate( id , {state : false})

    res.json({
        msg : 'Usuario borrado',
        usuarioDB
    });
}


module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}