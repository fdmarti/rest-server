const { response } = require("express");
const { ObjectId } = require('mongoose').Types;

const { User, Categoria, Producto } = require('../models')


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
]

const buscarUsuarios = async ( termino = '', res = response ) => {

    const esMongoId = ObjectId.isValid(termino);

    if( esMongoId ){
        const usuario = await User.findById(termino)
        return res.json({
            results: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp( termino, 'i' )

    const usuarios = await User.find({ 
        $or : [
            { nombre : regex },
            { correo : regex },
        ],
        $and : [
            { state : true }
        ]
     });
    res.json({
        results: usuarios
    })

}

const buscarCategoria =  async ( termino = '', res = response ) => {

    const regex = new RegExp(termino , 'i');
    const categorias = await Categoria.find({ nombre : regex, state : true})

    return res.json({
        results : (categorias) ? categorias : []
    })
}

const buscarProducto =  async ( termino = '', res = response ) => {

    const regex = new RegExp(termino , 'i');
    const productos = await Producto.find({ nombre : regex, state : true})
                .populate('categoria','nombre')

    return res.json({
        results : (productos) ? productos : []
    })
}

const buscar = ( req, res = response ) => {

    const { colection , termino } = req.params

    if ( !coleccionesPermitidas.includes(colection) ){
        return res.status(400).json({
            msg: `Las colecciones permitidas son ${coleccionesPermitidas}`
        })
    }

    switch(colection){
        case 'usuarios':
            buscarUsuarios(termino,res)
            break;
        case 'categorias':
            buscarCategoria(termino,res)
            break;
        case 'productos':
            buscarProducto(termino,res)
            break;

        default:
            return res.status(500).json({
                msg : ' Aca me mande yo una cagada'
            })
    }
}

module.exports = {
    buscar
}