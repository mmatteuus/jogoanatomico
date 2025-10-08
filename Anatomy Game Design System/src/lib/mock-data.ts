// Mock data for the anatomy game

export interface Question {
  id: string;
  type: 'mcq' | 'hotspot' | 'labeling';
  stem: string;
  system: 'skeletal' | 'muscular' | 'nervous' | 'vascular' | 'lymphatic';
  region: string;
  difficulty: number;
  imageUrl?: string;
  options?: string[];
  correctAnswer: number | string;
  explanation: {
    function: string;
    innervation?: string;
    vascularization?: string;
  };
  hotspots?: { x: number; y: number; radius: number; label: string }[];
}

export interface UserProgress {
  xp: number;
  level: number;
  rank: string;
  streak: number;
  energy: number;
  systemProgress: {
    skeletal: number;
    muscular: number;
    nervous: number;
    vascular: number;
    lymphatic: number;
  };
}

export const mockUser: UserProgress = {
  xp: 2450,
  level: 12,
  rank: 'Bronze II',
  streak: 7,
  energy: 4,
  systemProgress: {
    skeletal: 75,
    muscular: 60,
    nervous: 45,
    vascular: 30,
    lymphatic: 20,
  },
};

export const mockQuestions: Question[] = [
  {
    id: 'q1',
    type: 'mcq',
    stem: 'Qual estrutura óssea articula-se com o fêmur para formar a articulação do joelho?',
    system: 'skeletal',
    region: 'lower-limb',
    difficulty: 1,
    options: [
      'Tíbia e Fíbula',
      'Tíbia e Patela',
      'Fíbula e Patela',
      'Tíbia, Fíbula e Patela',
    ],
    correctAnswer: 1,
    explanation: {
      function: 'A articulação do joelho é formada pela articulação tibiofemoral (fêmur e tíbia) e pela articulação patelofemoral (fêmur e patela).',
      vascularization: 'Rede anastomótica genicular, ramos das artérias femoral e poplítea.',
    },
  },
  {
    id: 'q2',
    type: 'mcq',
    stem: 'O nervo mediano passa por qual estrutura anatômica no punho?',
    system: 'nervous',
    region: 'upper-limb',
    difficulty: 2,
    options: [
      'Canal de Guyon',
      'Túnel do Carpo',
      'Tabaqueira Anatômica',
      'Espaço de Parona',
    ],
    correctAnswer: 1,
    explanation: {
      function: 'O túnel do carpo é um canal osteofibroso localizado no punho, delimitado pelos ossos do carpo e pelo retináculo dos flexores.',
      innervation: 'O nervo mediano inerva a maioria dos músculos flexores do antebraço e alguns músculos intrínsecos da mão (tenar).',
    },
  },
  {
    id: 'q3',
    type: 'mcq',
    stem: 'Qual músculo é o principal responsável pela flexão do cotovelo?',
    system: 'muscular',
    region: 'upper-limb',
    difficulty: 1,
    options: ['Tríceps Braquial', 'Bíceps Braquial', 'Braquial', 'Braquiorradial'],
    correctAnswer: 2,
    explanation: {
      function: 'O músculo braquial é o principal flexor do cotovelo, atuando em todas as posições do antebraço.',
      innervation: 'Nervo musculocutâneo (C5-C6)',
      vascularization: 'Artérias braquial e braquial profunda',
    },
  },
];

export const mockLeaderboard = [
  { rank: 1, name: 'Ana Silva', xp: 8540, tier: 'Gold I', avatar: '👩‍⚕️' },
  { rank: 2, name: 'Carlos Med', xp: 7890, tier: 'Gold II', avatar: '👨‍⚕️' },
  { rank: 3, name: 'Julia Santos', xp: 7230, tier: 'Gold III', avatar: '👩‍⚕️' },
  { rank: 4, name: 'Pedro Costa', xp: 6540, tier: 'Silver I', avatar: '👨‍⚕️' },
  { rank: 5, name: 'Maria Luz', xp: 5890, tier: 'Silver I', avatar: '👩‍⚕️' },
  { rank: 6, name: 'Rafael Tech', xp: 4320, tier: 'Silver II', avatar: '👨‍⚕️' },
  { rank: 7, name: 'Sofia Med', xp: 3890, tier: 'Silver III', avatar: '👩‍⚕️' },
  { rank: 8, name: 'Lucas Bio', xp: 2670, tier: 'Bronze I', avatar: '👨‍⚕️' },
  { rank: 9, name: 'Beatriz K', xp: 2450, tier: 'Bronze II', avatar: '👩‍⚕️' },
  { rank: 10, name: 'Thiago M', xp: 1980, tier: 'Bronze II', avatar: '👨‍⚕️' },
];

export const mockCampaigns = [
  {
    id: 'osteology',
    title: 'Osteologia',
    system: 'skeletal',
    progress: 75,
    totalLessons: 24,
    completedLessons: 18,
    unlocked: true,
  },
  {
    id: 'joints',
    title: 'Articulações',
    system: 'skeletal',
    progress: 60,
    totalLessons: 18,
    completedLessons: 11,
    unlocked: true,
  },
  {
    id: 'muscles',
    title: 'Sistema Muscular',
    system: 'muscular',
    progress: 45,
    totalLessons: 32,
    completedLessons: 14,
    unlocked: true,
  },
  {
    id: 'nervous',
    title: 'Sistema Nervoso',
    system: 'nervous',
    progress: 30,
    totalLessons: 28,
    completedLessons: 8,
    unlocked: true,
  },
  {
    id: 'vascular',
    title: 'Sistema Vascular',
    system: 'vascular',
    progress: 0,
    totalLessons: 26,
    completedLessons: 0,
    unlocked: false,
  },
];

export const mockBadges = [
  { id: 'first-steps', name: 'Primeiros Passos', description: 'Complete o tutorial', earned: true },
  { id: 'week-warrior', name: 'Guerreiro Semanal', description: '7 dias de sequência', earned: true },
  { id: 'bone-master', name: 'Mestre dos Ossos', description: 'Complete Osteologia', earned: false },
  { id: 'perfect-10', name: 'Perfeição', description: '10 respostas corretas seguidas', earned: true },
];

export const mockDailyMissions = [
  { id: 'm1', title: 'Complete 5 questões no Sprint', progress: 3, total: 5, xp: 50 },
  { id: 'm2', title: 'Acerte 3 questões de Neuroanatomia', progress: 1, total: 3, xp: 75 },
  { id: 'm3', title: 'Estude por 15 minutos', progress: 8, total: 15, xp: 100 },
];
