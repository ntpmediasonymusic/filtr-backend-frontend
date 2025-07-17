const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.DESMAN_USER_SENDGRID_API_KEY);

async function sendVerificationEmail(to, name, token) {
  const frontendUrl = process.env.DESMAN_USER_FRONTEND_BASE_URL;

  const verifyLink = `${frontendUrl}verify-email?token=${token}`;
  const upperName = name.toUpperCase();

  const imagePath = path.resolve(
    __dirname,
    "../public/images/email-header-verification.png"
  );
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const msg = {
    to,
    from: {
      email: process.env.DESMAN_USER_SENDGRID_FROM_EMAIL,
      name: "Filtr Centroamérica y Caribe",
    },
    subject: "¡Estas a un clic de formar parte de SOMOS FILTR!",
    html: `
      <div style="width:100%; text-align:center; margin:0; padding:0;">
        <img
          src="cid:email-header"
          alt="Somos Filtr"
          style="width:100%; max-width:650px; height:auto; display:block; margin:0 auto;"
        />
      </div>
      <div style="font-family: sans-serif; line-height: 1.4;">
        <h2 style="color: #000000;">¡HOLA ${upperName}!</h2>
        <h3 style="color: #000000;">BIENVENID@ A SOMOS FILTR</h3>
        <p style="color: #000000; font-size: 14px;">Haz clic en el siguiente botón para completar tu registro en Filtr:</p>
        <a
          href="${verifyLink}"
          style="
            background-color: #ca249c;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 10px;
            font-size: 12px; 
            font-weight: 800;
          "
        >
          VERIFICAR CORREO
        </a>
        <br/>
        <h3 style="color: #000000;">PREPÁRATE PARA VIVIR LO MEJOR DE LA MÚSICA.</h3>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 1em; color: #2b2b2b;">
          Si no te registraste en Filtr, puedes ignorar este correo.
        </p>
      </div>
    `,
    attachments: [
      {
        content: imageData,
        filename: "email-header-verification.png",
        type: "image/png",
        disposition: "inline",
        content_id: "email-header",
      },
    ],
  };

  await sgMail.send(msg);
}

async function sendResetPasswordEmail(to, token) {
  const frontendUrl = process.env.DESMAN_USER_FRONTEND_BASE_URL;

  const resetLink = `${frontendUrl}reset-password?token=${token}`;
  const imagePath = path.resolve(
    __dirname,
    "../public/images/email-header-reset-passwor.png"
  );
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const msg = {
    to,
    from: {
      email: process.env.DESMAN_USER_SENDGRID_FROM_EMAIL,
      name: "Filtr Centroamérica y Caribe",
    },
    subject: "Reestablecer contraseña",
    html: `
       <div style="width:100%; text-align:center; margin:0; padding:0;">
        <img
          src="cid:email-header"
          alt="Somos Filtr"
          style="width:100%; max-width:650px; height:auto; display:block; margin:0 auto;"
        />
      </div>
      <div style="font-family: sans-serif; line-height: 1.4;">
        <h2 style="color: #000000;">Parece que quieres restablecer tu contraseña.</h2>
        <h3 style="color: #000000;">Para seguir disfrutando de los mejores hits,</h3>
        <p style="color: #000000; font-size: 14px;">da clic en el siguiente botón para ingresar tu nueva contraseña:</p>
        <a
          href="${resetLink}"
          style="
            background-color: #ca249c;
            color: white;
            text-decoration: none;
            padding: 12px 20px;
            border-radius: 6px;
            display: inline-block;
            margin-top: 10px;
            font-size: 12px; 
            font-weight: 800;
          "
        >
          RESTABLECER CONTRASEÑA
        </a>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 1em; color: #2b2b2b;">
          Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.
        </p>
      </div>
    `,
    attachments: [
      {
        content: imageData,
        filename: "email-header-reset-passwor.png",
        type: "image/png",
        disposition: "inline",
        content_id: "email-header",
      },
    ],
  };

  await sgMail.send(msg);
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
