const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.DESMAN_USER_SENDGRID_API_KEY);

async function sendVerificationEmail(to, token) {
  const from = process.env.DESMAN_USER_SENDGRID_FROM_EMAIL;
  const frontendUrl = process.env.DESMAN_USER_FRONTEND_BASE_URL;

  const verifyLink = `${frontendUrl}verify-email?token=${token}`;

  const msg = {
    to,
    from,
    subject: "Verifica tu correo en Filtr",
    html: `
      <div style="font-family: sans-serif; line-height: 1.4; color: #333;">
        <h2>¡Bienvenido a Filtr!</h2>
        <p>Para completar tu registro y activar tu cuenta, por favor haz clic en el botón:</p>
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
          "
        >
          Verificar correo
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.8em; color: #999;">
          Si no te registraste en Filtr, puedes ignorar este correo.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

async function sendResetPasswordEmail(to, token) {
  const from = process.env.DESMAN_USER_SENDGRID_FROM_EMAIL;
  const frontendUrl = process.env.DESMAN_USER_FRONTEND_BASE_URL;

  const resetLink = `${frontendUrl}reset-password?token=${token}`;

  const msg = {
    to,
    from,
    subject: "Restablece tu contraseña en Filtr",
    html: `
      <div style="font-family: sans-serif; line-height: 1.4; color: #333;">
        <h2>Restablece tu contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña en Filtr.</p>
        <p>Para elegir una nueva contraseña, haz clic en el siguiente botón:</p>
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
          "
        >
          Restablecer contraseña
        </a>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.8em; color: #999;">
          Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

module.exports = {
  sendVerificationEmail,
  sendResetPasswordEmail,
};
