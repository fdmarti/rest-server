
const { Router } = require('express');
const { check } = require('express-validator');

const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios');

const { esRolValido, emailExiste, existeUsuarioPorID } = require('../helpers/db-validators');

const { 
    validarCampos,
    validarJWT,
    esAdminRol
 } = require('../middlewares')


const router = Router();

router.get('/',usuariosGet);

router.put('/:id',[
    check('id','No es un ID valido!').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos
],usuariosPut);

router.post('/' , [
    check('nombre','El nombre es obligatorio').not().isEmpty(),
    check('password','La contraseña es obligatoria y debe ser mas de 6 letras').isLength({min : 6}),
    check('email','El email es obligatorio').not().isEmpty(),
    check('email','El email no es valido').isEmail(),
    check('email','El email no es valido').custom(emailExiste),
    // check('role','No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
    check('role').custom( esRolValido ), 
    validarCampos
] , usuariosPost);

router.delete('/:id',[
    validarJWT,
    esAdminRol,
    check('id','No es un ID valido!').isMongoId(),
    check('id').custom(existeUsuarioPorID),
    validarCampos


],usuariosDelete);

module.exports = router;