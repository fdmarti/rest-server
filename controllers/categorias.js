const { response } = require("express");
const { Categoria } = require('../models');

const crearCategoria = async (req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({nombre});

    if ( categoriaDB ){
        return res.status(400).json({
            msg : `La categoria ${nombre} ya existe`
        });
    }

    const data = { 
        nombre,
        usuario : req.usuario._id
    }

    const categoria = new Categoria(data);
    await categoria.save();


    res.json(categoria).status(200)
}

const categoriasGet = async ( req, res = response ) => {

    const { limite = 5, desde = 0} = req.query;
    const query = { state : true}

    if( isNaN(limite) || isNaN(desde) ){
        throw new Error('El valor debe ser un numero valido')
    }

    const [total , categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number( desde ))
            .limit(Number( limite ))
            .populate('usuario','nombre')
    ])

    res.status(200).json({
        total,
        categorias
    })
}

const categoriaPut = async (req, res = response) => {

    const { id } = req.params;
    const nombre = req.body.nombre.toUpperCase();

    const catExist = await Categoria.findOne({nombre})

    if ( catExist ){
        return res.status(400).json({
            msg : `La categoria ${nombre} ya se encuentra registrada`,
        })
    }

    const categoriaDB = await Categoria.findByIdAndUpdate(id,{nombre},{new :true})

    if ( categoriaDB ){
        return res.status(200).json({
            msg : 'Categoria modificada',
            categoriaDB
        })
    }
}

const categoriaDelete = async ( req,res = response) => {

    const { id } = req.params

    const categoriaDB = await Categoria.findByIdAndDelete(id)
    // const categoriaDB = await Categoria.findByIdAndUpdate( id , {state : false})

    if ( categoriaDB ){
        return res.status(200).json({
            msg : 'Categoria eliminada'
        })
    }
}

const categoriaById = async ( req, res = response ) => {

    const { id } = req.params

    const categoriaDB = await Categoria.findById(id)
    .populate('usuario','nombre')


    if ( categoriaDB ){
        return res.status(200).json({
            categoria : categoriaDB
        })
    }
}


module.exports = {
    crearCategoria,
    categoriasGet,
    categoriaPut,
    categoriaDelete,
    categoriaById
}