import nodemailer from 'nodemailer'

const emailOlvidePassword=async(datos)=>{
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user:process.env.EMAIL_USER ,
            pass:process.env.EMAIL_PASS,
        }
    });
    const {email,nombre,token}=datos

    //enviar email 
    const info=await transporter.sendMail({
        from:"APV-Administrador de Pacientes de Veterinaria",
        to:email,
        subject:'Restablece tu password',
        text:'Restablece tu password',
        html:`<p>Hola: ${nombre}, has solicitado reestablecer tu password en APV </p>
                <p>sigue al siguiente enlace para reestablecer tu password:
                    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>

                <p>Si tu no creaste esta cuenta, puedes ignorar este mensaje</p>
            `
    })
    console.log("mensaje enviado: %s",info.messageId)
}

export default emailOlvidePassword