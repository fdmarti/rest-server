
const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, categoriasGet, categoriaPut, categoriaDelete, categoriaById } = require('../controllers/categorias');
const { validateCategoriaInDB } = require('../helpers/db-validators');

const { validarCampos, validarJWT} = require('../middlewares')

const router = Router();

// Get Categorias

router.get('/', categoriasGet);

// Get Categorias by id

router.get('/:id', [
    check('id','No es un ID valido!').isMongoId(),
    check('id','La categoria no se encuentra en nuestros registros').custom(validateCategoriaInDB),
] ,categoriaById);

// Crear categoria

router.post('/', [ 
    validarJWT,
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre','El nombre debe poseer mas de 3 caracteres').isLength({min : 3}),
    validarCampos
] , crearCategoria);

// Editar categoria

router.put('/:id', [ 
    validarJWT,
    check('id','No es un ID valido!').isMongoId(),
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('nombre','El nombre debe poseer mas de 3 caracteres').isLength({min : 3}),
    check('id','La categoria no se encuentra en nuestros registros').custom(validateCategoriaInDB),
    validarCampos
 ] , categoriaPut);

// DELETE categoria

router.delete('/:id',[
    validarJWT,
    check('id','No es un ID valido!').isMongoId(),
    check('id','La categoria no se encuentra en nuestros registros').custom(validateCategoriaInDB),
    validarCampos
] , categoriaDelete);




module.exports = router;