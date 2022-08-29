import mongoose from 'mongoose';

const pacientesSchema = mongoose.Schema({
    nombre:{
        type:String,
        requiered:true,
    },
    propietario:{
        type:String,
        requiered:true,
    },
    email:{
        type:String,
        requiered:true,
    },
    fecha_alta:{
        type:Date,
        requiered:true,
        default:Date.now()
    },
    sintomas:{
        type:String,
        requiered:true,
    },
    veterinario:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Veterinario"
    },
},{
   timestamps:true,
})
   
const Pacientes=mongoose.model('Paciente',pacientesSchema)
 
export default Pacientes;