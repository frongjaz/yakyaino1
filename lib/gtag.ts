declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const AW_ID = process.env.NEXT_PUBLIC_AW_ID;
const AW_LEAD_LABEL = process.env.NEXT_PUBLIC_AW_LEAD_LABEL;

function fire(...args: unknown[]) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag(...args);
}

/** Form submit สำเร็จ — ยิง GA4 generate_lead + Google Ads conversion */
export function trackLeadFormSubmit() {
  fire("event", "generate_lead", {
    event_category: "lead_form",
    event_label: "sell_page",
    currency: "THB",
    value: 1,
  });
  if (AW_ID && AW_LEAD_LABEL) {
    fire("event", "conversion", {
      send_to: `${AW_ID}/${AW_LEAD_LABEL}`,
      value: 1.0,
      currency: "THB",
    });
  }
}

/** คลิกปุ่มโทรศัพท์ */
export function trackPhoneClick(label = "sell_hero") {
  fire("event", "click", {
    event_category: "contact_phone",
    event_label: label,
  });
}

/** คลิกปุ่ม LINE */
export function trackLineClick(label = "sell_hero") {
  fire("event", "click", {
    event_category: "contact_line",
    event_label: label,
  });
}
