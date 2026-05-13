/**
 * A/B Testing + Analytics utility
 * Variants are stored in localStorage and attached to every event.
 * Integrates with Google Analytics (gtag) and Segment if present.
 */

const AB_STORAGE_KEY = "mawthiq_ab_variants";

/** Pick (or recall) a variant for a given test key */
export function getVariant(testKey, variants) {
  try {
    const stored = JSON.parse(localStorage.getItem(AB_STORAGE_KEY) || "{}");
    if (stored[testKey]) return stored[testKey];
    const selected = variants[Math.floor(Math.random() * variants.length)];
    localStorage.setItem(
      AB_STORAGE_KEY,
      JSON.stringify({ ...stored, [testKey]: selected })
    );
    return selected;
  } catch {
    return variants[0];
  }
}

/** Return all stored A/B variants (to attach to events) */
export function getStoredVariants() {
  try {
    return JSON.parse(localStorage.getItem(AB_STORAGE_KEY) || "{}");
  } catch {
    return {};
  }
}

/**
 * Fire an analytics event.
 * Supported events:
 *   page_view, cta_click, signup_submit, testimonial_view
 */
export function trackEvent(name, payload = {}) {
  const abVariants = getStoredVariants();
  const data = { ...payload, ...abVariants, timestamp: Date.now() };

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", name, { ...payload, ...abVariants });
  }

  // Segment
  if (typeof window.analytics?.track === "function") {
    window.analytics.track(name, data);
  }

  if (process.env.NODE_ENV === "development") {
    // eslint-disable-next-line no-console
    console.debug("[analytics]", name, data);
  }
}
