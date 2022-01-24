const { response } = require("express");
const { subirArchivo } = require("../helpers");

const cargarArchivo = async (req, res = response) => {

    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        res.status(400).json({
            msg : 'No hay archivos que subir'
        });
        return;
    }

    try {
        const pathArchivo = await subirArchivo(req.files, undefined,'img');

        res.json({
            nombre : pathArchivo
        })
    } catch (error) {
        res.status(400).json({error})
    }

}


module.exports = {
    cargarArchivo
}