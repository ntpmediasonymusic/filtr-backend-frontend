import { useEffect } from "react";

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center px-6 md:px-14 py-[50px] md:py-[50px]">
      <div className="bg-white p-5 sm:p-[40px] rounded-[22px] w-full mx-auto flex flex-col gap-2 sm:gap-2 prose max-w-none">
        <h1 className="text-2xl sm:text-4xl font-bold mb-4 text-[#ca249c] text-center">
          Términos y Condiciones
        </h1>

        <h2 className="text-center">
          REGLAS Y CONDICIONES DEL SITIO WEB Y APLICACIÓN MÓVIL DE FILTR
        </h2>
        <p className="text-center">
          <strong>ÚLTIMA ACTUALIZACIÓN: 17 de junio de 2025</strong>
        </p>

        <hr className="border-t-2 border-gray-800 my-8" />

        <p>
          Estos términos y condiciones (los “Términos”) regulan tu acceso y uso
          de los sitios web y aplicaciones móviles de Filtr (el “Sitio”). Al
          acceder o utilizar el Sitio, aceptas estos Términos y celebras un
          contrato vinculante con Filtr. Es importante que los leas y comprendas
          en su totalidad. No accedas ni utilices el Sitio si no estás dispuesto
          o no puedes cumplirlos.
        </p>
        <p>
          Cualquier referencia a “tú” o “tu” se refiere a ti, usuario del Sitio.
          Las referencias a “nosotros”, “nuestro” o “nos” se refieren a Filtr.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          1. CAMBIOS EN LOS TÉRMINOS Y CONDICIONES
        </h2>
        <p>
          Podemos modificar estos Términos en cualquier momento. Cuando hagamos
          cambios, publicaremos la versión revisada en esta misma página e
          indicaremos la fecha de la última modificación. Las modificaciones
          materiales se aplicarán únicamente a partir de su publicación. Te
          recomendamos consultar estos Términos con regularidad, ya que la
          versión vigente te resultará vinculante. Tu uso continuado del Sitio
          tras cualquier actualización constituye tu aceptación de la misma.
        </p>

        <h2 className="text-xl font-semibold mt-6">2. USO DEL SITIO</h2>
        <h3>A. Permiso de uso</h3>
        <p>
          Te concedemos permiso para usar el Sitio sujeto a las restricciones de
          estos Términos. Podemos revocar dicho permiso si consideramos tu
          conducta inapropiada o si incumples estos Términos, incluidas las
          restricciones de la sección 4. El uso del Sitio es bajo tu propia
          responsabilidad y riesgo, incluyendo exposición a contenidos
          ofensivos, indecentes, inexactos o inapropiados.
        </p>
        <h3>B. Disponibilidad</h3>
        <p>
          El Sitio puede modificarse, actualizarse, interrumpirse, suspenderse o
          descontinuarse en cualquier momento, con o sin aviso y sin
          responsabilidad alguna.
        </p>
        <h3>C. Cuentas de usuario</h3>
        <p>
          Para acceder a algunas secciones puede ser necesario registrarse.
          Podemos rechazar o pedir que cambies tu nombre de usuario, contraseña
          u otra información. Tú eres responsable de mantener en secreto tus
          credenciales y de cualquier uso no autorizado. Nos reservamos el
          derecho de cancelar tu cuenta en cualquier momento y de revelar tu
          identidad si lo consideramos necesario para proteger la seguridad o
          por requerimiento legal.
        </p>

        <h2 className="text-xl font-semibold mt-6">3. CONTENIDO</h2>
        <h3>A. Responsabilidad de tu contenido</h3>
        <p>
          Eres el único responsable de los mensajes o publicaciones que envíes.
          Aceptas indemnizar y mantener indemne a Filtr por cualquier
          reclamación derivada de tu contenido. Nos reservamos el derecho de
          eliminarlo en cualquier momento y sin motivo.
        </p>
        <h3>B. Derecho de Filtr sobre tu contenido</h3>
        <p>
          Al enviar mensajes, archivos o datos, otorgas a Filtr una licencia
          mundial, libre de regalías, perpetua, intransferible y no exclusiva
          para usar, copiar, adaptar, transmitir, mostrar públicamente y
          sublicenciar tu contenido, incluso a terceros, para cualquier fin.
        </p>
        <h3>C. Propiedad</h3>
        <p>
          Todos los materiales del Sitio (textos, datos, gráficos, logotipos,
          iconos, imágenes, audio, vídeo, descargables, compilaciones de datos y
          software) son propiedad o están licenciados a Filtr y están protegidos
          por derechos de propiedad intelectual. Solo puedes usarlos para tu uso
          personal y no comercial, sin copiarlos, reproducirlos o distribuirlos
          sin autorización previa por escrito de Filtr.
        </p>

        <h2 className="text-xl font-semibold mt-6">4. RESTRICCIONES</h2>
        <p>
          Estas reglas se aplican a tu uso del Sitio (incluidos foros, chat u
          otros servicios). No revisamos cada mensaje ni garantizamos su
          validez. No nos hacemos responsables por el contenido de las
          publicaciones.
        </p>
        <p>No debes ni ayudarás a otros a:</p>
        <ul>
          <li>
            Publicar material falso, difamatorio, ofensivo, violento, obsceno o
            ilícito;
          </li>
          <li>Violar derechos de propiedad intelectual de terceros;</li>
          <li>Enviar virus, gusanos, troyanos u otro software dañino;</li>
          <li>Realizar actividades comerciales sin consentimiento previo;</li>
          <li>
            Solicitar información personal con fines comerciales o ilícitos;
          </li>
          <li>Enviar comunicaciones masivas (spam);</li>
          <li>Manipular resultados de búsqueda;</li>
          <li>Hacerse pasar por otra persona o entidad;</li>
        </ul>
        <p>Tampoco debes ni ayudarás a otros a:</p>
        <ul>
          <li>Obstruir a otros usuarios;</li>
          <li>Usar robots o herramientas de raspado para extraer datos;</li>
          <li>Eliminar o modificar avisos de derechos de autor o marcas;</li>
          <li>Recolectar información de otros usuarios;</li>
          <li>Enmarcar o reestructurar el Sitio;</li>
          <li>Generar cargas desproporcionadas en la infraestructura;</li>
          <li>Acceder sin autorización a sistemas o redes;</li>
          <li>Interferir con el funcionamiento del Sitio;</li>
          <li>Eludir medidas de seguridad;</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">5. ENVÍOS NO SOLICITADOS</h2>
        <p>
          Filtr y sus empleados no aceptan grabaciones, composiciones u otros
          materiales creativos no solicitados (“Envío”). Si a pesar de esto
          envías material, Filtr no estará obligado a tratarlo como confidencial
          o propietario, y no asumirá responsabilidad alguna.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          6. POLÍTICA DE PRIVACIDAD
        </h2>
        <p>
          El uso del Sitio también se rige por nuestra Política de Privacidad,
          incorporada aquí por referencia.
        </p>

        <h2>7. TERCEROS</h2>
        <p>
          El Sitio puede incluir enlaces a sitios de terceros. Filtr no opera,
          controla ni respalda su contenido. Tu uso de ellos es bajo tu
          responsabilidad.
        </p>

        <h2 className="text-xl font-semibold mt-6">8. INDEMNIZACIÓN</h2>
        <p>
          Aceptas indemnizar y defender a Filtr y sus afiliadas por cualquier
          pérdida, gasto o daño (incluidos honorarios legales) que surja de (i)
          tu uso del Sitio, (ii) tu incumplimiento de estos Términos, (iii)
          productos o servicios adquiridos a través del Sitio, o (iv) infracción
          de derechos de terceros.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          9. EXENCIÓN DE GARANTÍAS Y LIMITACIÓN DE RESPONSABILIDAD
        </h2>
        <p>
          <em>
            LEE ESTA SECCIÓN CON ATENCIÓN, YA QUE LIMITA LA RESPONSABILIDAD DE
            FILTR.
          </em>
        </p>
        <ol type="A" className="list-inside list-[upper-alpha] pl-6 space-y-4">
          <li>
            EL SITIO SE PROPORCIONA “TAL CUAL” Y “CON TODOS SUS DEFECTOS”. TU
            USO ES BAJO TU ENTERA RESPONSABILIDAD. FILTR NO GARANTIZA SU
            CALIDAD, SEGURIDAD O DISPONIBILIDAD.
          </li>
          <li>
            FILTR NIEGA TODAS LAS GARANTÍAS, EXPRESAS O IMPLÍCITAS, INCLUIDAS
            COMERCIABILIDAD, IDONEIDAD PARA UN FIN ESPECIAL Y NO INFRACCIÓN.
          </li>
          <li>
            FILTR NO SERÁ RESPONSABLE DE DAÑOS DIRECTOS, INDIRECTOS,
            INCIDENTALES, CONSECUENTES, ESPECIALES O PUNITIVOS RELACIONADOS CON
            EL SITIO O SITIOS DE TERCEROS.
          </li>
          <li>
            FILTR NO GARANTIZA FUNCIONAMIENTO ININTERRUMPIDO, CORRECCIÓN DE
            ERRORES O AUSENCIA DE VIRUS EN EL SITIO.
          </li>
          <li>
            FILTR NO REALIZA REPRESENTACIONES NI GARANTÍAS SOBRE EL USO O
            RESULTADOS DEL USO DE LOS MATERIALES EN EL SITIO O TERCEROS.
          </li>
        </ol>

        <h2 className="text-xl font-semibold mt-6">
          10. NULO DONDE ESTÉ PROHIBIDO
        </h2>
        <p>
          Aunque el Sitio sea accesible mundialmente, no todos los productos o
          servicios están disponibles en todas las regiones. Cualquier oferta es
          nula donde esté prohibida.
        </p>

        <h2 className="text-xl font-semibold mt-6">11. COMPRAS</h2>
        <p>
          Si deseas adquirir productos o servicios, debes proporcionar
          información de pago válida. Garantizas que eres mayor de 18 años y que
          puedes usar el método de pago. Aceptas pagar precios, gastos de envío
          e impuestos aplicables. Filtr podrá cambiar precios y disponibilidad
          sin aviso. Todas las ventas de contenido digital son definitivas.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          12. REGLAS DE PROMOCIONES
        </h2>
        <p>
          Concursos, sorteos o encuestas pueden regirse por reglas específicas.
          Al participar, aceptas dichas reglas y nuestra Política de Privacidad.
          En caso de conflicto, prevalecen las reglas de la promoción.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          13. LEY APLICABLE Y JURISDICCIÓN
        </h2>
        <p>
          Estos Términos se rigen por las leyes del Estado de Nueva York,
          excluyendo reglas de conflicto de leyes. Ambas partes se someten a los
          tribunales de Manhattan y renuncian a objeciones de foro. Las
          reclamaciones deben presentarse dentro de los 2 años siguientes al
          hecho, de forma individual y no en demandas colectivas. El partido
          ganador podrá reclamar costas y honorarios.
        </p>

        <h2 className="text-xl font-semibold mt-6">
          14. DISPOSICIONES GENERALES
        </h2>
        <ul>
          <li>
            Si alguna cláusula se declara inválida, se limitará al mínimo
            necesario y el resto seguirá en vigor.
          </li>
          <li>
            Estos Términos constituyen el acuerdo completo entre tú y Filtr.
          </li>
          <li>
            Podemos enviarte notificaciones por correo electrónico, correo
            postal o a través del Sitio.
          </li>
          <li>
            El incumplimiento puntual de un derecho no implica renuncia al
            mismo.
          </li>
          <li>
            No puedes ceder tus derechos sin nuestro consentimiento; Filtr puede
            cederlos libremente.
          </li>
          <li>
            Los títulos de sección son solo informativos y carecen de efecto
            contractual.
          </li>
        </ul>

        <h2 className="text-xl font-semibold mt-6">
          15. AGENTE DESIGNADO BAJO LA DMCA
        </h2>
        <p>
          La DMCA prevé un mecanismo para notificar infracciones de derechos de
          autor. Si consideras que tus obras han sido usadas sin autorización,
          dirige tu reclamación al agente designado de Filtr:
        </p>
        <p>
          Wade Leak, Esq.
          <br />
          Departamento Legal y de Negocios
          <br />
          Filtr Entertainment
          <br />
          25 Madison Avenue, New York, NY 10010
          <br />
          Tel: 212-833-8000
          <br />
          Fax: 212-833-5828
          <br />
          Email: copyright.agent@filtr.com
        </p>
        <p>
          Tu notificación deberá cumplir con los requisitos de la DMCA (17
          U.S.C. § 512(c)(3)) para ser efectiva.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
