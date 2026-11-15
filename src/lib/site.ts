export const SITE = {
  name: 'IFES+Alegre',
  tagline: 'Conectando histórias, pessoas e momentos que vão além das telas',
  institution: 'Instituto Federal do Espírito Santo',
  campus: 'IFES · Campus de Alegre',
  addressLines: ['Rodovia BR-482 (Cachoeiro–Alegre), Km 72', 'Rive, Alegre · ES', 'CEP 29500-000'],
  phone: '(27) 3083-4310',
  phoneHref: 'tel:+552730834310',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=IFES+Campus+de+Alegre',
  socials: {
    instagram: 'https://www.instagram.com/ifesdealegre/',
    facebook: 'https://www.facebook.com/ifesdealegre/',
    youtube: 'https://www.youtube.com/@IfesdeAlegre/featured',
  },
};

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/atividades', label: 'Atividades' },
  { href: '/avisos', label: 'Avisos' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/contatos', label: 'Contatos' },
  { href: '/docente', label: 'Área Docente' },
];

export const FOOTER_LINKS = [
  ...NAV,
  { href: '/sobre', label: 'Sobre o projeto' },
  { href: '/privacidade', label: 'Política de privacidade' },
];
