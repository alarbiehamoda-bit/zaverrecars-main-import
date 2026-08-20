/** ZAVERRE — The Atelier Ledger design system: central, discreet contact configuration. */
export const contact = {
  whatsappDisplay: '01114872030',
  whatsappInternational: '201114872030',
  email: 'zaverrecars@gmail.com',
  instagram: 'https://www.instagram.com/zaverrecar?igsh=bWZ3a3lxbjh0cmtw',
  facebook: 'https://www.facebook.com/share/189Z7jfHZD/',
};

export function whatsappUrl(message: string) {
  return `https://wa.me/${contact.whatsappInternational}?text=${encodeURIComponent(message)}`;
}
