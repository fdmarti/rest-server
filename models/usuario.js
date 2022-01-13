const { Schema, model } = require('mongoose')

const UsuarioSchema = Schema({
    nombre: { type: String, required : [true, 'El nombre es obligatorio']},
    email: { type: String, required : [true, 'El email es obligatorio'],unique: true},
    password: { type: String, required : [true, 'La contraseña es obligatorio']},
    img: String,
    role: { type: String, required : true, enum: ['ADMIN_ROLE','USER_ROLE']},
    state: {type: Boolean, default : true},
    google: {  type: Boolean,default : false},
});

UsuarioSchema.methods.toJSON = function(){
    const { __v, password,_id, ...usuario } = this.toObject();
    usuario.uid = _id
    return usuario
}


module.exports = model( 'User', UsuarioSchema )