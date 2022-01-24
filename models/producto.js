const { Schema, model }  = require('mongoose')

const ProductoSchema = Schema({
    nombre: { type : String, require:[true,'El nombre es obligatorio'], unique: true},
    state : { type: Boolean, default : true, require:true },
    usuario : { type : Schema.Types.ObjectId, ref: 'User' , require: true},
    precio : { type: Number, default : 0},
    categoria : { type: Schema.Types.ObjectId, ref : 'Categoria',require: true },
    description : { type: String },
    disponible : { type: Boolean, default: true }
});

ProductoSchema.methods.toJSON = function(){
    const { __v, state, ...data } = this.toObject();
    return data
}


module.exports = model('Producto',ProductoSchema);