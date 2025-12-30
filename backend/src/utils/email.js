const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendVerificationEmail(to, name, token) {
  const frontendUrl = process.env.FRONTEND_BASE_URL;

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
      email: process.env.SENDGRID_FROM_EMAIL,
      name: "Filtr Centroamérica y Caribe",
    },
    subject: "¡Estas a un clic de formar parte de SOMOS FILTR!",
    html: `
      <!-- Wrapper general para centrar y limitar ancho -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:20px 10px;">
            <!-- Contenedor con fondo y max-width -->
            <table width="650" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:650px; width:100%; background:#131517; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="padding:0; text-align:center;">
                  <!-- Cabecera de imagen -->
                  <img
                    src="cid:email-header"
                    alt="Somos Filtr"
                    style="width:100%; height:auto; display:block;"
                  />
                </td>
              </tr>
              <tr><td height="20" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              <tr>
                <td style="font-family:sans-serif; color:#fff; text-align:center; padding: 10px 10px 20px 10px; line-height:1.4;">
                  <h2 style="margin:.5em 0;">¡HOLA ${name.toUpperCase()}!</h2>
                  <h3 style="margin:.5em 0;">BIENVENID@ A SOMOS FILTR</h3>
                  <p style="margin:.5em 0; font-size:14px;">
                    Haz clic en el siguiente botón para completar tu registro en Filtr:
                  </p>
                  <a href="${frontendUrl}verify-email?token=${token}"
                     style="
                       background-color:#ca249c;
                       color:#fff;
                       text-decoration:none;
                       padding:12px 20px;
                       border-radius:6px;
                       display:inline-block;
                       margin:10px auto;
                       font-size:12px;
                       font-weight:800;
                     ">
                    VERIFICAR CORREO
                  </a>
                  <h3 style="margin:1em 0;">PREPÁRATE PARA VIVIR LO MEJOR DE LA MÚSICA.</h3>
                  <hr style="
                    border:none;
                    border-top:1px solid #fff;
                    width:80%;
                    margin:20px auto;
                  "/>
                  <p style="margin:.5em 0; font-size:1em;">
                    Si no te registraste en Filtr, puedes ignorar este correo.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    attachments: [
      {
        content: imageData,
        filename: "somos-filtr-email-header-verification.png",
        type: "image/png",
        disposition: "inline",
        content_id: "email-header",
      },
    ],
  };

  await sgMail.send(msg);
}

async function sendResetPasswordEmail(to, token) {
  const frontendUrl = process.env.FRONTEND_BASE_URL;

  const resetLink = `${frontendUrl}reset-password?token=${token}`;
  const imagePath = path.resolve(
    __dirname,
    "../public/images/email-header-reset-passwor.png"
  );
  const imageData = fs.readFileSync(imagePath).toString("base64");

  const msg = {
    to,
    from: {
      email: process.env.SENDGRID_FROM_EMAIL,
      name: "Filtr Centroamérica y Caribe",
    },
    subject: "Reestablecer contraseña",
    html: `
      <!-- Wrapper general -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
        <tr>
          <td align="center" style="padding:20px 10px;">
            <!-- Contenedor limitado y centrado -->
            <table width="650" cellpadding="0" cellspacing="0" role="presentation"
                   style="max-width:650px; width:100%; background:#131517; border-radius:8px; overflow:hidden;">
              <!-- Cabecera de imagen -->
              <tr>
                <td style="padding:0; text-align:center;">
                  <img
                    src="cid:email-header"
                    alt="Somos Filtr"
                    style="width:100%; height:auto; display:block;"
                  />
                </td>
              </tr>
              <tr><td height="20" style="font-size:0; line-height:0;">&nbsp;</td></tr>
              <!-- Contenido -->
              <tr>
                <td style="font-family:sans-serif; color:#fff; text-align:center; padding: 10px 10px 20px 10px; line-height:1.4;">
                  <h2 style="margin:.5em 0;">Parece que quieres restablecer tu contraseña.</h2>
                  <h3 style="margin:.5em 0;">Para seguir disfrutando de los mejores hits,</h3>
                  <p style="margin:.5em 0; font-size:14px;">
                    da clic en el siguiente botón para ingresar tu nueva contraseña:
                  </p>
                  <a
                    href="${resetLink}"
                    style="
                      background-color:#ca249c;
                      color:#fff;
                      text-decoration:none;
                      padding:12px 20px;
                      border-radius:6px;
                      display:inline-block;
                      margin:10px auto;
                      font-size:12px;
                      font-weight:800;
                    "
                  >
                    RESTABLECER CONTRASEÑA
                  </a>
                  <hr style="
                    border:none;
                    border-top:1px solid #fff;
                    width:80%;
                    margin:20px auto;
                  "/>
                  <p style="margin:.5em 0; font-size:1em;">
                    Si no solicitaste este cambio, ignora este correo y tu contraseña permanecerá igual.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    `,
    attachments: [
      {
        content: imageData,
        filename: "somos-filtr-email-header-reset-passwor.png",
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
