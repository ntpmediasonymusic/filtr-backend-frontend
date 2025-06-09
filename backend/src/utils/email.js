const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(to, token) {
  const from = process.env.SENDGRID_FROM_EMAIL;
  const frontendUrl = process.env.FRONTEND_BASE_URL;

  const verifyLink = `${frontendUrl}/verify-email?token=${token}`;

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
        <p style="margin-top: 20px; font-size: 0.9em; color: #666;">
          Si el botón no funciona, copia y pega este enlace en tu navegador:<br/>
          <span style="word-break: break-all;">${verifyLink}</span>
        </p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
        <p style="font-size: 0.8em; color: #999;">
          Si no te registraste en Filtr, puedes ignorar este correo.
        </p>
      </div>
    `,
  };

  await sgMail.send(msg);
}

module.exports = { sendVerificationEmail };
