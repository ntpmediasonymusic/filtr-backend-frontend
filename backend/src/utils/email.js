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
    "../public/images/filtr_logo_blanco.png"
  );
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const msg = {
    to,
    from: {
      email: process.env.DESMAN_USER_SENDGRID_FROM_EMAIL,
      name: "Filtr Centroamérica y Caribe",
    },
    subject: "¡Estas a un clic de formar parte de SOMOS FILTRCA!",
    html: `
      <div style="width:100%; background:#3145c7; text-align:left; padding:20px 0; border-radius: 10px;">
        <img
          src="cid:filtr-logo"
          alt="Somos Filtr"
          style="height:35px; margin-left:20px;"
        />
      </div>
      <div style="font-family: sans-serif; line-height: 1.4;">
        <h2 style="color: #000000;">¡HOLA ${upperName}!</h2>
        <h3 style="color: #000000;">BIENVENID@ A SOMOS FILTRCA</h3>
        <p style="color: #000000; font-size: 14px;">Haz clic en el siguiente botón para completar tu registro en FiltrCA:</p>
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
        filename: "filtr_logo_magenta.png",
        type: "image/png",
        disposition: "inline",
        content_id: "filtr-logo",
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
    "../public/images/filtr_logo_blanco.png"
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
      <div style="width:100%; background:#3145c7; text-align:left; padding:20px 0; border-radius: 10px;">
        <img
          src="cid:filtr-logo"
          alt="Somos Filtr"
          style="height:35px; margin-left:20px;"
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
        filename: "filtr_logo_magenta.png",
        type: "image/png",
        disposition: "inline",
        content_id: "filtr-logo",
      },
    ],
  };

  await sgMail.send(msg);
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
