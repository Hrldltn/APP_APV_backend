import Veterinario from "../models/Veterinario.js"
import generarJWT from "../helpers/generarJWT.js"
import generarId from "../helpers/generarid.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"

const registrar = async(req,res)=>{
    const{nombre,email,password}=req.body

    //prevenir usuarios duplicados
    const existeUsuario=await Veterinario.findOne({email})
    if(existeUsuario){
        const error=new Error('El usuario ya se encuentra registrado')

        return res.status(400).json({msg: error.message})
    }

    try{
        //guardar Nuevo Veterinario 
        const veterinario=new Veterinario(req.body)
        const veterinarioGuardado=await veterinario.save()

        //Enviar el email
        emailRegistro({email,nombre,token:veterinarioGuardado.token,password})

        res.json(veterinarioGuardado)
    }catch(error){
        console.log(error)
    }
}

const perfil=(req,res)=>{
    const{veterinario}=req
    res.json(veterinario)
}

const confirmar=async(req,res)=>{
    const{token}=req.params

    const usuarioConfirmar=await Veterinario.findOne({token})
    
    if(!usuarioConfirmar){
        const error=new Error('Acción no valida , usuario ya registrado')
        return  res.status(404).json({msg:error.message})
    }

    try{
        usuarioConfirmar.token=null;
        usuarioConfirmar.confirmado=true;
        await usuarioConfirmar.save()

        res.json({msg:"Usuario Confirmado Correctamente"})

    }catch(error){
        console.log(error)
    }

}

const autenticar=async(req,res)=>{
    const{email,password}=req.body
    //comprobar si usuario existeUsuario
    const usuario=await Veterinario.findOne({email})

    if(!usuario){
        const error=new Error('El Usuario no existe')
        return  res.status(404).json({msg:error.message})
    }

    //comprobar si el usuario esta confirmado 
    if(!usuario.confirmado){
        const error=new Error("Tu cuenta no ha sido confirmada")
        return  res.status(403).json({msg:error.message})
    }

    //Autenticar el usuario 
    if(await usuario.comprobarPassword(password)){
        //autenticar el usuario json webtoken
        res.json({_id:usuario._id , nombre: usuario.nombre, email:usuario.email ,web:usuario.email,telefono:usuario.telefono, token:generarJWT(usuario.id)})
    }else{
        const error=new Error("El password es incorrecto")
        return  res.status(403).json({msg:error.message})
    }
}

const olvidePassword=async(req,res)=>{
    const {email}=req.body

    const existeVeterinario=await Veterinario.findOne({email})
    if(!existeVeterinario){
        const error=new Error("El usuario no existe")
        return res.status(400).json({msg: error.message})
    }
    try{
        existeVeterinario.token=generarId()
        await existeVeterinario.save()
        //enviar email con Instrucciones
        emailOlvidePassword({email,
                            nombre:existeVeterinario.nombre,
                            token:existeVeterinario.token})
        res.json({msg:'Hemos Enviado un email con las Instrucciones'})
    } catch(error){
        console.log(error)
    }   
}

const comprobarToken=async (req,res)=>{
    const {token}=req.params
    const tokenValido = await Veterinario.findOne({token})

    if(tokenValido){
        res.json({msg:"token Valido el usuario existe"})
    }else{
        const error = new Error('Token no válido')
        return res.status(400).json({msg:error.message})
    }
}
const nuevoPassword=async(req,res)=>{
    const {token}=req.params
    const {password}=req.body

    const veterinario=await Veterinario.findOne({token})
    if(!veterinario){
        const error = new Error('Hubo un error')
        return res.status(400).json({msg:error.message})
    }
    try{
        veterinario.token=null
        veterinario.password=password
        await veterinario.save()
        res.json({msg:'Password modificado correctamente'})

    }catch(error){
        console.log(error)
    }
}

const actualizarPerfil=async(req,res)=>{
    const veterinario= await Veterinario.findById(req.params.id)
    if(!veterinario){
        const error=new Error('Hubo un error')
        return res.status(400).json({msg:error.message})
    }
    const {email}=req.body
    if (veterinario.email !== req.body.email){
        const existeEmail=await Veterinario.findOne({email})
        if(existeEmail){
            const error=new Error('Hubo un error ese Email ya esta en uso')
            return res.status(400).json({msg:error.message})
        }
    }
    try {
        veterinario.nombre=req.body.nombre || veterinario.nombre
        veterinario.telefono=req.body.telefono || veterinario.telefono
        veterinario.email=req.body.email || veterinario.email
        veterinario.web=req.body.web || veterinario.web

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)
    } catch (error) {
        console.log(error)
    }
}

const actualizarPassword=async(req,res)=>{
        //leer los datos 
        const {id}=req.veterinario
        const {current_password,new_password}=req.body
        //comprobar que el veterinario existe
        const veterinario= await Veterinario.findById(id)
        if(!veterinario){
            const error=new Error('Hubo un error')
            return res.status(400).json({msg:error.message})
        }
        //comprobar su password 
        if(await veterinario.comprobarPassword(current_password)){
            //almacenar el nuevo password
            veterinario.password=new_password
            await veterinario.save()
            res.json({msg:'El password fue almacenado Correctamente'})
        }else{
            const error=new Error('El password actual es incorrecto')
            return res.status(400).json({msg:error.message})
        }
        
}

export {registrar,perfil,confirmar,autenticar,olvidePassword,comprobarToken,nuevoPassword,actualizarPerfil,actualizarPassword} 