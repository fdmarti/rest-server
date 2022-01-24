const { User, Role, Categoria, Producto } = require('../models')

const esRolValido = async (rol = '') => {
    const existeRol = await Role .findOne({ rol });
    if ( !existeRol ) {
        throw new Error(` El rol ${ rol } no esta registrado en la base`);
    }
}

const emailExiste = async (email = '') => {
    const existeEmail = await User.findOne({email})
    if( existeEmail ){
        throw new Error(` El email ${ email } ya esta registrado en la base`);
    }
}

const existeUsuarioPorID = async (id) => {
    const existeUsuario = await User.findById(id)
    if( !existeUsuario ){
        throw new Error(` El ID ${ id } no existe`);
    }
}

const validateCategoriaInDB = async ( id ) => {
    const existeCategoria = await Categoria.findById(id)
    if ( !existeCategoria ){
        throw new Error(` El ID ${ id } no existe`);
    }
}

const validarProductoEnDB = async ( nombre ) => {
    const existeProducto = await Producto.findOne({nombre: nombre.toUpperCase()})
    if ( existeProducto ){
        throw new Error(` El producto ${ name } existe en la base de datos`);
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeUsuarioPorID,
    validateCategoriaInDB,
    validarProductoEnDB,
}