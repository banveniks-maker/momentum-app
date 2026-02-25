import { Lang } from '../store';

type Translation = {
  // Nav
  today: string;
  global: string;
  social: string;
  ai: string;
  profile: string;

  // Today screen
  energyLabel: string;
  howFeel: string;
  thisWeek: string;
  habitsToday: string;
  addHabit: string;
  dayStreak: (n: number) => string;
  xpPoints: (n: number) => string;

  // Moods
  moods: { label: string; pts: number; emoji: string }[];

  // Status texts
  statuses: string[];

  // Habit modal
  newHabit: string;
  habitPlaceholder: string;
  addHabitBtn: string;

  // Global
  yourRanking: string;
  topCountries: string;
  leaderboard: string;
  youLabel: string;
  players: (n: number) => string;
  top: string;
  ptsWeek: (n: number) => string;

  // Social
  challenges: string;
  friends: string;
  inviteFriend: string;
  tapToCopy: string;
  joined: string;
  joinBtn: string;
  vsYou: (n: number) => string;

  // AI Coach
  statsWeek: string;
  daysDone: string;
  bestStreak: string;
  completion: string;
  aiCoach: string;
  aiInputPlaceholder: string;
  sendBtn: string;
  aiGreeting: string;
  quickPrompts: string[];

  // Toasts
  toastHabitDone: (pts: number) => string;
  toastHabitUndone: string;
  toastAdded: string;
  toastCopied: string;
  toastInstalled: string;
  toastJoined: string;
  toastLeft: string;

  // Onboarding
  onboardTitle: string;
  onboardSub: string;
  onboardBtn: string;
  namePrompt: string;
  namePlaceholder: string;
  letsGo: string;

  // Days
  days: string[];
};

const T: Record<Lang, Translation> = {
  en: {
    today: 'TODAY', global: 'GLOBAL', social: 'SOCIAL', ai: 'AI', profile: 'ME',
    energyLabel: "TODAY'S ENERGY",
    howFeel: 'HOW DO YOU FEEL?',
    thisWeek: 'THIS WEEK',
    habitsToday: "TODAY'S HABITS",
    addHabit: '+ Add habit',
    dayStreak: n => `🔥 ${n} day streak`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: 'ON FIRE', pts: 20, emoji: '⚡️' },
      { label: 'GOOD', pts: 10, emoji: '😊' },
      { label: 'OK', pts: 0, emoji: '😐' },
      { label: 'TIRED', pts: -8, emoji: '😴' },
      { label: 'DEAD', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ MAX POWER', '🔥 On fire', '😊 Feeling good', '😴 Low energy', '💀 Need rest'],
    newHabit: 'NEW HABIT', habitPlaceholder: 'Habit name...', addHabitBtn: 'ADD HABIT',
    yourRanking: 'YOUR RANKING', topCountries: 'TOP COUNTRIES', leaderboard: 'LEADERBOARD',
    youLabel: '← YOU', players: n => `${n.toLocaleString()} players`, top: 'Top',
    ptsWeek: n => `${n} pts this week`,
    challenges: 'ACTIVE CHALLENGES', friends: 'FRIENDS', inviteFriend: 'INVITE A FRIEND',
    tapToCopy: 'TAP TO COPY YOUR CODE', joined: 'JOINED', joinBtn: 'JOIN',
    vsYou: n => n >= 0 ? `+${n} vs you` : `${n} vs you`,
    statsWeek: 'YOUR STATS', daysDone: 'DAYS DONE', bestStreak: 'BEST STREAK', completion: 'DONE',
    aiCoach: 'AI COACH — CLAUDE', aiInputPlaceholder: 'Ask your coach...', sendBtn: 'SEND',
    aiGreeting: "Hi! I'm your habit coach powered by Claude AI. I know your habits and energy — ask me anything! 💪",
    quickPrompts: ['Analyze my habits', 'Why am I failing?', 'Best time to train', 'Motivation boost'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: 'Habit unchecked',
    toastAdded: 'HABIT ADDED! 🎯',
    toastCopied: 'CODE COPIED! 📋',
    toastInstalled: 'APP INSTALLED! 📱',
    toastJoined: 'JOINED CHALLENGE! 🎉',
    toastLeft: 'Left challenge',
    onboardTitle: 'MOMENTUM', onboardSub: 'Build habits. Track energy.\nConquer your goals.',
    onboardBtn: "LET'S GO",
    namePrompt: "What's your name?", namePlaceholder: 'Your name...', letsGo: 'START',
    days: ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'],
  },

  ru: {
    today: 'СЕГОДНЯ', global: 'РЕЙТИНГ', social: 'СОЦИАЛ', ai: 'AI', profile: 'Я',
    energyLabel: 'ЭНЕРГИЯ СЕГОДНЯ',
    howFeel: 'КАК ТЫ СЕЙЧАС?',
    thisWeek: 'НЕДЕЛЯ',
    habitsToday: 'ПРИВЫЧКИ',
    addHabit: '+ Добавить',
    dayStreak: n => `🔥 ${n} дней подряд`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: 'ОГОНЬ', pts: 20, emoji: '⚡️' },
      { label: 'ХОРОШО', pts: 10, emoji: '😊' },
      { label: 'НОРМ', pts: 0, emoji: '😐' },
      { label: 'УСТАЛ', pts: -8, emoji: '😴' },
      { label: 'СЛИВ', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ НА МАКСИМАЛКАХ', '🔥 В ударе', '😊 Нормально', '😴 Тяжеловато', '💀 Нужен отдых'],
    newHabit: 'НОВАЯ ПРИВЫЧКА', habitPlaceholder: 'Название привычки...', addHabitBtn: 'ДОБАВИТЬ',
    yourRanking: 'ТВОЙрейтинг', topCountries: 'ТОП СТРАН', leaderboard: 'ТАБЛИЦА ЛИДЕРОВ',
    youLabel: '← ТЫ', players: n => `${n.toLocaleString()} игроков`, top: 'Топ',
    ptsWeek: n => `${n} очков за неделю`,
    challenges: 'ЧЕЛЛЕНДЖИ', friends: 'ДРУЗЬЯ', inviteFriend: 'ПРИГЛАСИТЬ ДРУГА',
    tapToCopy: 'НАЖМИ — СКОПИРОВАТЬ КОД', joined: 'УЧАСТВУЮ', joinBtn: 'ВСТУПИТЬ',
    vsYou: n => n >= 0 ? `+${n} к тебе` : `${n} к тебе`,
    statsWeek: 'ТВОЯ СТАТИСТИКА', daysDone: 'ДНЕЙ ВЫПОЛНЕНО', bestStreak: 'ЛУЧШИЙ СТРИК', completion: 'ВЫПОЛНЕНО',
    aiCoach: 'AI ТРЕНЕР — CLAUDE', aiInputPlaceholder: 'Спроси тренера...', sendBtn: 'ОТПРАВИТЬ',
    aiGreeting: 'Привет! Я твой AI-тренер на базе Claude. Знаю твои привычки и энергию — спрашивай! 💪',
    quickPrompts: ['Анализ моих привычек', 'Почему я срываюсь?', 'Лучшее время для тренировки', 'Мотивация'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: 'Привычка отменена',
    toastAdded: 'ПРИВЫЧКА ДОБАВЛЕНА! 🎯',
    toastCopied: 'КОД СКОПИРОВАН! 📋',
    toastInstalled: 'ПРИЛОЖЕНИЕ УСТАНОВЛЕНО! 📱',
    toastJoined: 'ПРИСОЕДИНИЛСЯ! 🎉',
    toastLeft: 'Вышел из челленджа',
    onboardTitle: 'MOMENTUM', onboardSub: 'Строй привычки. Следи за энергией.\nДостигай целей.',
    onboardBtn: 'НАЧАТЬ',
    namePrompt: 'Как тебя зовут?', namePlaceholder: 'Твоё имя...', letsGo: 'ПОЕХАЛИ',
    days: ['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'],
  },

  zh: {
    today: '今天', global: '全球', social: '社交', ai: 'AI', profile: '我',
    energyLabel: '今日能量',
    howFeel: '你感觉如何？',
    thisWeek: '本周',
    habitsToday: '今日习惯',
    addHabit: '+ 添加习惯',
    dayStreak: n => `🔥 连续 ${n} 天`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: '满血', pts: 20, emoji: '⚡️' },
      { label: '不错', pts: 10, emoji: '😊' },
      { label: '一般', pts: 0, emoji: '😐' },
      { label: '疲惫', pts: -8, emoji: '😴' },
      { label: '崩溃', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ 满功率', '🔥 状态极佳', '😊 感觉不错', '😴 有点累', '💀 需要休息'],
    newHabit: '新习惯', habitPlaceholder: '习惯名称...', addHabitBtn: '添加',
    yourRanking: '你的排名', topCountries: '顶级国家', leaderboard: '排行榜',
    youLabel: '← 你', players: n => `${n.toLocaleString()} 名玩家`, top: '前',
    ptsWeek: n => `本周 ${n} 分`,
    challenges: '活跃挑战', friends: '朋友', inviteFriend: '邀请朋友',
    tapToCopy: '点击复制你的代码', joined: '已参加', joinBtn: '参加',
    vsYou: n => n >= 0 ? `比你多 +${n}` : `比你少 ${Math.abs(n)}`,
    statsWeek: '本周统计', daysDone: '完成天数', bestStreak: '最佳连续', completion: '完成率',
    aiCoach: 'AI 教练 — CLAUDE', aiInputPlaceholder: '问你的教练...', sendBtn: '发送',
    aiGreeting: '你好！我是由Claude驱动的AI习惯教练，了解你的习惯和能量，随时提问！💪',
    quickPrompts: ['分析我的习惯', '为何总是失败？', '最佳锻炼时间', '激励建议'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: '习惯取消',
    toastAdded: '习惯已添加！🎯',
    toastCopied: '代码已复制！📋',
    toastInstalled: '应用已安装！📱',
    toastJoined: '已参加挑战！🎉',
    toastLeft: '已退出挑战',
    onboardTitle: 'MOMENTUM', onboardSub: '建立习惯。追踪能量。\n实现目标。',
    onboardBtn: '开始',
    namePrompt: '你叫什么名字？', namePlaceholder: '你的名字...', letsGo: '出发',
    days: ['一', '二', '三', '四', '五', '六', '日'],
  },

  es: {
    today: 'HOY', global: 'GLOBAL', social: 'SOCIAL', ai: 'AI', profile: 'YO',
    energyLabel: 'ENERGÍA HOY',
    howFeel: '¿CÓMO TE SIENTES?',
    thisWeek: 'ESTA SEMANA',
    habitsToday: 'HÁBITOS DE HOY',
    addHabit: '+ Agregar hábito',
    dayStreak: n => `🔥 ${n} días seguidos`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: 'BRUTAL', pts: 20, emoji: '⚡️' },
      { label: 'BIEN', pts: 10, emoji: '😊' },
      { label: 'NORMAL', pts: 0, emoji: '😐' },
      { label: 'CANSADO', pts: -8, emoji: '😴' },
      { label: 'MUERTO', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ AL MÁXIMO', '🔥 En llamas', '😊 Bien', '😴 Cansado', '💀 Necesito descansar'],
    newHabit: 'NUEVO HÁBITO', habitPlaceholder: 'Nombre del hábito...', addHabitBtn: 'AGREGAR',
    yourRanking: 'TU RANKING', topCountries: 'TOP PAÍSES', leaderboard: 'CLASIFICACIÓN',
    youLabel: '← TÚ', players: n => `${n.toLocaleString()} jugadores`, top: 'Top',
    ptsWeek: n => `${n} pts esta semana`,
    challenges: 'DESAFÍOS ACTIVOS', friends: 'AMIGOS', inviteFriend: 'INVITAR AMIGO',
    tapToCopy: 'TOCA PARA COPIAR TU CÓDIGO', joined: 'UNIDO', joinBtn: 'UNIRSE',
    vsYou: n => n >= 0 ? `+${n} vs ti` : `${n} vs ti`,
    statsWeek: 'TUS ESTADÍSTICAS', daysDone: 'DÍAS HECHOS', bestStreak: 'MEJOR RACHA', completion: 'COMPLETADO',
    aiCoach: 'AI COACH — CLAUDE', aiInputPlaceholder: 'Pregunta a tu coach...', sendBtn: 'ENVIAR',
    aiGreeting: '¡Hola! Soy tu coach de hábitos impulsado por Claude AI. ¡Pregúntame lo que quieras! 💪',
    quickPrompts: ['Analiza mis hábitos', '¿Por qué fallo?', 'Mejor hora para ejercicio', 'Motivación'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: 'Hábito desmarcado',
    toastAdded: '¡HÁBITO AÑADIDO! 🎯',
    toastCopied: '¡CÓDIGO COPIADO! 📋',
    toastInstalled: '¡APP INSTALADA! 📱',
    toastJoined: '¡DESAFÍO UNIDO! 🎉',
    toastLeft: 'Saliste del desafío',
    onboardTitle: 'MOMENTUM', onboardSub: 'Construye hábitos. Rastrea tu energía.\nConquista tus metas.',
    onboardBtn: '¡VAMOS!',
    namePrompt: '¿Cómo te llamas?', namePlaceholder: 'Tu nombre...', letsGo: 'EMPEZAR',
    days: ['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'],
  },

  fr: {
    today: "AUJOURD'HUI", global: 'GLOBAL', social: 'SOCIAL', ai: 'AI', profile: 'MOI',
    energyLabel: "ÉNERGIE AUJOURD'HUI",
    howFeel: 'COMMENT TE SENS-TU ?',
    thisWeek: 'CETTE SEMAINE',
    habitsToday: 'HABITUDES DU JOUR',
    addHabit: '+ Ajouter habitude',
    dayStreak: n => `🔥 ${n} jours d'affilée`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: 'EN FEU', pts: 20, emoji: '⚡️' },
      { label: 'BIEN', pts: 10, emoji: '😊' },
      { label: 'OK', pts: 0, emoji: '😐' },
      { label: 'FATIGUÉ', pts: -8, emoji: '😴' },
      { label: 'ÉPUISÉ', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ AU MAX', '🔥 En feu', '😊 Bien', '😴 Fatigué', '💀 Besoin de repos'],
    newHabit: 'NOUVELLE HABITUDE', habitPlaceholder: "Nom de l'habitude...", addHabitBtn: 'AJOUTER',
    yourRanking: 'TON CLASSEMENT', topCountries: 'TOP PAYS', leaderboard: 'CLASSEMENT',
    youLabel: '← TOI', players: n => `${n.toLocaleString()} joueurs`, top: 'Top',
    ptsWeek: n => `${n} pts cette semaine`,
    challenges: 'DÉFIS ACTIFS', friends: 'AMIS', inviteFriend: 'INVITER UN AMI',
    tapToCopy: 'APPUIE POUR COPIER TON CODE', joined: 'REJOINT', joinBtn: 'REJOINDRE',
    vsYou: n => n >= 0 ? `+${n} vs toi` : `${n} vs toi`,
    statsWeek: 'TES STATS', daysDone: 'JOURS FAITS', bestStreak: 'MEILLEURE SÉRIE', completion: 'COMPLÉTÉ',
    aiCoach: 'AI COACH — CLAUDE', aiInputPlaceholder: 'Pose une question...', sendBtn: 'ENVOYER',
    aiGreeting: "Bonjour ! Je suis ton coach d'habitudes propulsé par Claude AI. Pose-moi n'importe quelle question ! 💪",
    quickPrompts: ['Analyse mes habitudes', "Pourquoi j'échoue ?", 'Meilleur moment pour sport', 'Motivation'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: 'Habitude décochée',
    toastAdded: 'HABITUDE AJOUTÉE ! 🎯',
    toastCopied: 'CODE COPIÉ ! 📋',
    toastInstalled: 'APP INSTALLÉE ! 📱',
    toastJoined: 'DÉFI REJOINT ! 🎉',
    toastLeft: 'Défi quitté',
    onboardTitle: 'MOMENTUM', onboardSub: 'Construis des habitudes. Suis ton énergie.\nAtteins tes objectifs.',
    onboardBtn: "C'EST PARTI !",
    namePrompt: 'Comment tu t\'appelles ?', namePlaceholder: 'Ton prénom...', letsGo: 'COMMENCER',
    days: ['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'],
  },

  hi: {
    today: 'आज', global: 'ग्लोबल', social: 'सोशल', ai: 'AI', profile: 'मैं',
    energyLabel: 'आज की ऊर्जा',
    howFeel: 'अभी कैसा महसूस हो?',
    thisWeek: 'इस सप्ताह',
    habitsToday: 'आज की आदतें',
    addHabit: '+ आदत जोड़ें',
    dayStreak: n => `🔥 ${n} दिन लगातार`,
    xpPoints: n => `+${n} XP`,
    moods: [
      { label: 'जोश', pts: 20, emoji: '⚡️' },
      { label: 'अच्छा', pts: 10, emoji: '😊' },
      { label: 'ठीक', pts: 0, emoji: '😐' },
      { label: 'थका', pts: -8, emoji: '😴' },
      { label: 'बेदम', pts: -15, emoji: '💀' },
    ],
    statuses: ['⚡ पूरी शक्ति', '🔥 जोश में हूँ', '😊 अच्छा', '😴 थका', '💀 आराम चाहिए'],
    newHabit: 'नई आदत', habitPlaceholder: 'आदत का नाम...', addHabitBtn: 'जोड़ें',
    yourRanking: 'तुम्हारी रैंकिंग', topCountries: 'शीर्ष देश', leaderboard: 'लीडरबोर्ड',
    youLabel: '← तुम', players: n => `${n.toLocaleString()} खिलाड़ी`, top: 'शीर्ष',
    ptsWeek: n => `इस सप्ताह ${n} अंक`,
    challenges: 'चैलेंज', friends: 'दोस्त', inviteFriend: 'दोस्त को आमंत्रित करें',
    tapToCopy: 'अपना कोड कॉपी करने के लिए टैप करें', joined: 'जुड़े', joinBtn: 'जुड़ें',
    vsYou: n => n >= 0 ? `तुमसे +${n} आगे` : `तुमसे ${Math.abs(n)} पीछे`,
    statsWeek: 'तुम्हारे आंकड़े', daysDone: 'दिन पूरे', bestStreak: 'सर्वश्रेष्ठ स्ट्रीक', completion: 'पूरा',
    aiCoach: 'AI कोच — CLAUDE', aiInputPlaceholder: 'कोच से पूछें...', sendBtn: 'भेजें',
    aiGreeting: 'नमस्ते! मैं Claude AI द्वारा संचालित आपका आदत कोच हूँ। कुछ भी पूछें! 💪',
    quickPrompts: ['मेरी आदतें विश्लेषण', 'क्यों विफल हो रहा हूँ?', 'व्यायाम का सही समय', 'प्रेरणा'],
    toastHabitDone: pts => `+${pts} XP 🎯`,
    toastHabitUndone: 'आदत हटाई',
    toastAdded: 'आदत जोड़ी गई! 🎯',
    toastCopied: 'कोड कॉपी हो गया! 📋',
    toastInstalled: 'ऐप इंस्टॉल हो गया! 📱',
    toastJoined: 'चैलेंज में जुड़े! 🎉',
    toastLeft: 'चैलेंज छोड़ा',
    onboardTitle: 'MOMENTUM', onboardSub: 'आदतें बनाओ। ऊर्जा ट्रैक करो।\nलक्ष्य हासिल करो।',
    onboardBtn: 'शुरू करें',
    namePrompt: 'तुम्हारा नाम क्या है?', namePlaceholder: 'तुम्हारा नाम...', letsGo: 'चलो',
    days: ['सो', 'मं', 'बु', 'गु', 'शु', 'श', 'र'],
  },
};

export function t(lang: Lang): Translation {
  return T[lang];
}

export { T };
