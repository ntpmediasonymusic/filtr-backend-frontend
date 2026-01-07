const axios = require("axios");

/**
 * Normaliza strings (quita acentos, lower-case, trim)
 */
function normalizeStr(str = "") {
  return str
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

const COUNTRY_TO_ISO2 = {
  "costa rica": "CR",
  "republica dominicana": "DO",
  panama: "PA",
  "el salvador": "SV",
  guatemala: "GT",
  honduras: "HN",
  nicaragua: "NI",
  belice: "BZ",
  mexico: "MX",
  colombia: "CO",
};

/**
 * Ladas por país para E.164 (ISO2 -> country calling code sin "+")
 */
const ISO2_TO_CALLING_CODE = {
  CR: "506",
  DO: "1",
  PA: "507",
  SV: "503",
  GT: "502",
  HN: "504",
  NI: "505",
  BZ: "501",
  MX: "52",
  CO: "57",
};

function resolveIso2(countryName) {
  const key = normalizeStr(countryName);
  return COUNTRY_TO_ISO2[key] || null;
}

function digitsOnly(str = "") {
  return str.toString().replace(/\D+/g, "");
}

function toE164Phone(phoneRaw, iso2) {
  const phone = digitsOnly(phoneRaw);
  const callingCode = ISO2_TO_CALLING_CODE[iso2];
  if (!callingCode || !phone) return null;
  return `+${callingCode}${phone}`;
}

/**
 *(x-www-form-urlencoded).
 * @param {object} input
 */
function buildSmfParams(input) {
  const submitUrl =
    process.env.SMF_SUBMIT_URL || "https://subs.sonymusicfans.com/submit";

  const aeApiKey = process.env.SMF_AE_API_KEY;
  const aeBrandId = process.env.SMF_AE_BRAND_ID;
  const aeSegmentId = process.env.SMF_AE_SEGMENT_ID;
  const formId = process.env.SMF_FORM_ID;
  const aeActivitiesJson = process.env.SMF_AE_ACTIVITIES_JSON;

  const sonyListId = process.env.SMF_LIST_ID_SONY;
  const filtrListId = process.env.SMF_LIST_ID_FILTR;

  if (!aeApiKey || !aeBrandId || !aeSegmentId || !formId || !aeActivitiesJson) {
    throw new Error(
      "Faltan variables SMF_* en el .env (AE key / brand / segment / form / activities)."
    );
  }

  const iso2 = resolveIso2(input.country);
  if (!iso2) {
    throw new Error(
      `País no soportado o inválido para SMF: "${input.country}"`
    );
  }

  const e164 = toE164Phone(input.phone, iso2);
  if (!e164) {
    throw new Error(
      `No se pudo formatear el teléfono a E.164. phone="${input.phone}", iso2="${iso2}"`
    );
  }
  const params = new URLSearchParams();

  params.append("js_url", submitUrl);
  params.append("ae_segment_id", String(aeSegmentId));
  params.append("ae_brand_id", String(aeBrandId));
  params.append("ae_activities", aeActivitiesJson); 
  params.append("ae", aeApiKey);
  params.append("form", String(formId));

  // Campos del usuario
  params.append("field_email_address", input.email);
  params.append("field_first_name", input.firstName);
  params.append("field_last_name", input.lastName);
  params.append("field_country_region", iso2);
  params.append("field_dob", input.dateOfBirth); // YYYY-MM-DD
  params.append("field_mobile_phone", e164);
  params.append("custom_field[Custom_Field_1]", input.favoriteMethod);

  // Mailing lists (opt-ins)
  if (input.optInSony && sonyListId) {
    params.append("mailing-list-id[0]", sonyListId);
  }
  if (input.optInFiltr && filtrListId) {
    params.append("mailing-list-id[1]", filtrListId);
  }

  // Triggered sends
  params.append("triggered_sends[]", "");
  if (input.optInSony) params.append("triggered_sends[]", "");
  if (input.optInFiltr) params.append("triggered_sends[]", "");

  return { submitUrl, params, iso2, e164 };
}

async function submitSignupToSmf(input, { failSilently = true } = {}) {
  try {
    const { submitUrl, params } = buildSmfParams(input);

    const resp = await axios.post(submitUrl, params.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      timeout: 10000,
      withCredentials: false,
      validateStatus: () => true,
    });

    if (resp.status < 200 || resp.status >= 300) {
      const msg = `SMF submit falló: status=${resp.status}`;
      if (!failSilently) throw new Error(msg);
      console.error(msg);
      return { ok: false, status: resp.status };
    }

    return { ok: true, status: resp.status };
  } catch (err) {
    if (!failSilently) throw err;
    console.error("Error en submitSignupToSmf:", err.message);
    return { ok: false, error: err.message };
  }
}

module.exports = {
  submitSignupToSmf,
  buildSmfParams, 
};
