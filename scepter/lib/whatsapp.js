export const FALLBACK_WHATSAPP_NUMBER = '265889545477';

export function buildWhatsAppMessage(productName) {
  if (productName) {
    return `Hello Scepter, I am interested in the ${productName}. I would like to know more about the product, available options and pricing.`;
  }
  return `Hello Scepter, I would like to know more about your furniture.`;
}

export function buildWhatsAppLink(number, productName) {
  const targetNumber = number || FALLBACK_WHATSAPP_NUMBER;
  return `https://wa.me/${targetNumber}?text=${encodeURIComponent(buildWhatsAppMessage(productName))}`;
}
