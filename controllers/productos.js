const { response } = require('express');
const { Producto } = require('../models');

const getProductos = async (req, res = response) => {

    try {
        const query = { state:true }
        const productosDB = await Producto
            .find(query)
            .populate('usuario','nombre')
            .populate('categoria','nombre')
    
        return res.status(200).json({
            productos : productosDB
        })
    } catch (error) {
        return res.status(500).json({
            error
        })
    }
}

const addProducto = async ( req, res = response ) => {

    const { state, usuario, ...body } = req.body

    const nombre = req.body.nombre.toUpperCase();
    const precio = req.body.precio;

    if ( precio < 0){
        return res.status(400).json({
            msg : "El precio debe ser mayor a 0",
            precio
        })
    }

    const data = {
        ...body,
        nombre,
        usuario : req.usuario._id,

    }

    const productoDB = new Producto(data)
    productoDB.save()

    return res.status(200).json({
        productoDB
    })

}

const getProductoById = async (req, res = response) => {

    const { id } = req.params

    const existeProducto = await Producto.findById(id)
        .populate('usuario','nombre')
        .populate('categoria','nombre')

    if ( !existeProducto ){
        return res.status(404).json({
            msg : 'No se encontro un producto con ese codigo'
        })
    }

    return res.status(200).json({
        producto : existeProducto
    })



}

const editProducto = async ( req, res = response ) => {

    const { id } = req.params
    const nombre = req.body.nombre.toUpperCase();
    const precio = req.body.precio;

    if ( precio < 0){
        return res.status(400).json({
            msg : "El precio debe ser mayor a 0",
            precio
        })
    }
    const productoDB = await Producto.findByIdAndUpdate(id, 
        {
            nombre,
            categoria:req.body.categoria,
            precio : req.body.precio,
            disponible : req.body.disponible
        }, {new :true})

    return res.status(200).json({
        msg : 'Producto modificado',
        productoDB
    })

}

const deleteProducto = async ( req, res = response ) => {

    const { id } = req.params;

    const productoDB = await Producto.findByIdAndUpdate(id,{state:false})

    return res.status(200).json({
        msg : 'Producto eliminado',
        producto: productoDB.id,
    })

}

module.exports = {
    getProductos,
    getProductoById,
    addProducto,
    editProducto,
    deleteProducto
}


