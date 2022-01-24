
const { Router } = require('express');
const { check } = require('express-validator');

const { getProductos, addProducto, getProductoById, editProducto, deleteProducto } = require('../controllers/productos');

const { validarProductoEnDB, validateCategoriaInDB } = require('../helpers/db-validators');
const { validarCampos, validarJWT} = require('../middlewares');

const router = Router();

// Get Productos

router.get('/', getProductos);

// Get Productos by id

router.get('/:id',[
    check('id','El id del producto debe ser valido').isMongoId(),
    validarCampos
],getProductoById);

// Crear producto

router.post('/', [
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre','Ya existe un producto con ese nombre').custom(validarProductoEnDB),
    check('categoria','Debe seleccionar una categoria valida').not().isEmpty(),
    check('categoria','Debe seleccionar una categoria valida').isMongoId(),
    check('categoria','La categoria seleccionada no existe').custom(validateCategoriaInDB),
    validarCampos
] ,addProducto);

// Editar producto

router.put('/:id', [
    validarJWT,
    check('id','El id del producto es invalido').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre','Ya existe un producto con ese nombre').custom(validarProductoEnDB),
    check('categoria','Debe seleccionar una categoria valida').not().isEmpty(),
    check('categoria','Debe seleccionar una categoria valida').isMongoId(),
    check('categoria','La categoria seleccionada no existe').custom(validateCategoriaInDB),
    validarCampos
] ,editProducto);

// DELETE producto

router.delete('/:id', [
    validarJWT,
    check('id','El id del producto es invalido').isMongoId(),
    validarCampos
] ,deleteProducto);




module.exports = router;