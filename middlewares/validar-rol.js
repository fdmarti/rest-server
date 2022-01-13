const { request, response } = require("express")

const esAdminRol = (req = request, res = response, next) => {

    if ( !req.usuario ){
        return res.status(500).json({
            msg : 'Verificar el rol sin el token'
        })
    }

    const { role } = req.usuario;
    
    if ( role !== 'ADMIN_ROLE' ){
        return res.status(401).json({
            msg : 'No posee los permisos necesarios'
        })
    }

    next();
}



module.exports = {
    esAdminRol
}