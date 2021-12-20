const Role = require('../models/rol')
const Usuario = require('../models/usuario');

const esRolValido = async (rol = '') => {
    const existeRol = await Role .findOne({ rol });
    if ( !existeRol ) {
        throw new Error(` El rol ${ rol } no esta registrado en la base`);
    }
}

const emailExiste = async (email = '') => {
    const existeEmail = await Usuario.findOne({email})
    if( existeEmail ){
        throw new Error(` El email ${ email } ya esta registrado en la base`);
    }
}

const existeUsuarioPorID = async (id) => {
    const existeUsuario = await Usuario.findById(id)
    if( !existeUsuario ){
        throw new Error(` El ID ${ id } no existe`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID
}