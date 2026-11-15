export type Day = 'Seg' | 'Ter' | 'Qua' | 'Qui' | 'Sex' | 'Sáb';

export type Category = 'Esporte' | 'Cultura e arte' | 'Estudos' | 'Jogos' | 'Bem-estar' | 'Outra';

export type ActivityStatus = 'Inscrições abertas' | 'Inscrições encerradas' | 'Ativa' | 'Inativa';

export type Activity = {
  id: number;
  slug: string;
  name: string;
  category: Category;
  description: string;
  days: Day[];
  start: string; // "16:00"
  end: string; // "" quando não há horário de término
  place: string;
  responsible: string;
  email: string;
  spots: string; // vazio quando não há inscrição
  audience: string;
  status: ActivityStatus;
  signup: 'sim' | 'nao';
  photos: string[]; // nomes de arquivo hoje; URLs quando houver upload real. A primeira é a capa.
  tone: string; // cor de fundo do cartão enquanto não há foto
};

export type Monitoria = {
  id: number;
  title: string;
  year: '1' | '2' | '3';
  exclusive: string; // "" quando é para todas as turmas
  days: Day[];
  start: string;
  end: string;
  place: string;
  monitor: string;
};

export type AvisoTipo = 'Geral' | 'Atividade' | 'Evento' | 'Urgente';

export type Aviso = {
  id: number;
  title: string;
  body: string;
  category: AvisoTipo;
  target: string;
  date: string; // AAAA-MM-DD
  until: string; // AAAA-MM-DD ou "" (sem validade)
  published: boolean;
};

export type PhotoStatus = 'pending' | 'approved' | 'rejected';

export type GalleryPhoto = {
  id: number;
  code: string;
  date: string; // AAAA-MM-DD
  status: PhotoStatus;
  tone: string;
};

export type Inscricao = {
  id: number;
  name: string;
  matricula: string;
  email: string;
  phone: string;
  activity: string;
  date: string; // AAAA-MM-DD
};

export type Docente = { name: string; emailUser: string };
