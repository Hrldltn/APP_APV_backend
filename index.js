import express from "express"
import dotenv from 'dotenv'
import cors from 'cors'
import conectarDB from'./config/db.js'
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacientesRoutes from './routes/pacienteRoutes.js'

const app=express()
app.use(express.json())

dotenv.config()

conectarDB()

const dominiosPermitidos=[process.env.FRONTEND_URL]

const corsOptions={
    origin:function(origin,callback){
        if(dominiosPermitidos.indexOf(origin)!==-1){
            //El origen del request esta permitido
            callback(null,true)
        }else{
            callback(new Error('No esta permitido por CORS POLICY'))
        }
    }
}
app.use(cors(corsOptions))
app.use("/api/veterinarios",veterinarioRoutes)
app.use("/api/pacientes",pacientesRoutes)

const PORT = process.env.PORT || 4000
// servidor funcionando en el puerto 4000 porque el 3000 es para react del frontend
app.listen(PORT,()=>{
    console.log(`Servidor funcionando en el puerto ${PORT}`)
})