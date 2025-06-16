import { useEffect } from "react";

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 md:px-14 py-[50px] md:py-[50px]">
      <div
        className="bg-white
                   p-5 sm:p-[40px] rounded-[22px] w-full
                   mx-auto flex flex-col gap-2 sm:gap-2"
      >
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-[#ca249c] text-center">
          Política de Privacidad
        </h1>

        <p className="text-center">
          <strong>ÚLTIMA ACTUALIZACIÓN: 17 de junio de 2025</strong>
        </p>

        <hr className="border-t-2 border-gray-800 my-8" />

        <p>
          Esta Política de Privacidad describe nuestras normas en cuanto a la
          recopilación, el uso y la divulgación de información relacionada con
          la utilización de nuestros sitios web, correo electrónico y
          aplicaciones móviles (el “Sitio”). Filtr es la empresa responsable de
          la recopilación y el tratamiento de sus datos. La información
          recopilada en este Sitio puede ser utilizada, tal como se describe a
          continuación, por Filtr, nuestras marcas, agentes, filiales y socios
          de confianza (conjuntamente, “Filtr”). Los términos “nosotros” y
          “nuestros” se refieren en este documento a Filtr. Cuando en esta
          Política se utiliza el término “información personal” se refiere a
          aquella que identifica a una persona en particular, como nombre
          completo, dirección, número de teléfono o correo electrónico.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Recopilación y uso de la información personal
        </h2>
        <p>Podemos recopilar la siguiente información personal sobre usted:</p>
        <ul className="list-disc list-inside pl-4">
          <li>
            Información de contacto: nombre, correo electrónico, dirección y
            teléfono.
          </li>
          <li>
            Información de facturación: número de tarjeta y dirección de
            facturación.
          </li>
          <li>
            Información demográfica: edad, género, intereses, país y código
            postal.
          </li>
          <li>Identificadores únicos: nombre de usuario y contraseña.</li>
          <li>
            Preferencias: productos de interés, historial de pedidos y
            preferencias de marketing.
          </li>
          <li>Información de ubicación: ubicación aproximada o precisa.</li>
        </ul>

        <p className="mt-4">
          Nosotros o uno de nuestros socios de confianza podemos usar esta
          información para:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>Enviar boletines y actualizaciones que haya solicitado.</li>
          <li>Cumplir con sus pedidos y enviar confirmaciones.</li>
          <li>
            Responder a consultas de servicio al cliente y administrar su
            cuenta.
          </li>
          <li>Procesar solicitudes de empleo.</li>
          <li>
            Enviar comunicaciones de marketing y gestionar promociones y
            sorteos.
          </li>
          <li>
            Mejorar nuestras estrategias de marketing, realizar análisis e
            investigación.
          </li>
          <li>Mostrar contenido basado en su ubicación o intereses.</li>
          <li>Proteger contra fraudes y uso indebido del Sitio.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          Redes sociales y comunidades en línea
        </h2>
        <p>
          Puede crear un perfil en nuestros blogs o foros para compartir
          mensajes, fotos y videos. Filtr no controla las acciones de terceros
          en esas plataformas. También puede publicar contenido de nuestro Sitio
          en Facebook, Twitter u otros proveedores de OpenID; la privacidad de
          esa información estará regida por la política del proveedor externo.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Operaciones y compras en línea
        </h2>
        <p>
          Para comprar productos o música en nuestros Sitios, esta Política se
          aplica a los datos que proporcione. En algunos casos se le redirigirá
          a un sitio externo con su propia política de privacidad; le
          recomendamos leerla antes de continuar.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Intercambio de información
        </h2>
        <p>Podemos compartir su información personal con:</p>
        <ul className="list-disc list-inside pl-4">
          <li>
            Proveedores de servicios (procesamiento de pagos, envíos, soporte).
          </li>
          <li>Filiales y marcas de Filtr.</li>
          <li>Socios comerciales con su consentimiento previo.</li>
          <li>Autoridades legales cuando sea requerido.</li>
          <li>En caso de fusión, adquisición o venta de activos.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">Opción de exclusión</h2>
        <p>
          Puede darse de baja de nuestros boletines siguiendo el enlace
          “cancelar suscripción” en cualquier correo electrónico que reciba.
          Para dejar de recibir SMS, responda “STOP” o contacte a su operador
          móvil.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Tecnologías de seguimiento
        </h2>
        <p>
          Usamos cookies y tecnologías similares para analizar tráfico web y
          personalizar anuncios. Puede controlar o eliminar cookies desde la
          configuración de su navegador. Para más detalles sobre cookies en
          publicidad en línea,{" "}
          <a href="#" className="text-blue-600 underline">
            haga clic aquí
          </a>
          .
        </p>

        <h2 className="text-xl font-semibold mt-6">Seguridad</h2>
        <p>
          La información de facturación se transmite cifrada mediante SSL.
          Aunque seguimos estándares de la industria, ningún método es 100%
          seguro.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Actualización de su información
        </h2>
        <p>
          Para actualizar sus datos personales o de facturación, acceda a su
          perfil en el Sitio o contacte a nuestro servicio de atención al
          cliente.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Consentimiento al procesamiento
        </h2>
        <p>
          Al usar nuestros Sitios usted acepta que sus datos puedan ser
          transferidos y procesados en Estados Unidos, donde las leyes de
          protección pueden diferir de su país.
        </p>

        <h2 className="text-xl font-semibold mt-6">Información adicional</h2>
        <p>
          Widgets de terceros y enlaces a otros Sitios pueden aplicar sus
          propias políticas de privacidad. No recopilamos datos de menores de 13
          años; si cree que lo hicimos, contáctenos para eliminarlos.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Modificaciones a esta Política
        </h2>
        <p>
          Si hacemos cambios sustanciales, notificaremos por correo o en el
          Sitio. Su uso continuado tras la actualización implicará su aceptación
          de los nuevos términos.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          Su derecho a la privacidad
        </h2>
        <p>
          Sus datos se procesan conforme a la legislación local de protección de
          datos. Usted tiene derecho a:
        </p>
        <ul className="list-disc list-inside pl-4">
          <li>
            Solicitar acceso, copia, corrección o eliminación de sus datos.
          </li>
          <li>Restricción de procesamiento u oponerse al mismo.</li>
          <li>Retirar su consentimiento en cualquier momento.</li>
          <li>Solicitar la portabilidad de sus datos.</li>
          <li>
            Presentar una denuncia ante la autoridad de protección de datos.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          Preguntas sobre esta Política de Privacidad
        </h2>
        <p>Si tiene consultas, escríbanos a:</p>
        <address className="not-italic">
          Filtr Centroamérica y Caribe
          <br />
          Calle Falsa 123, San José, Costa Rica
          <br />
          <a
            href="mailto:privacidad@filtr.com"
            className="text-blue-600 underline"
          >
            privacidad@filtr.com
          </a>
        </address>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
