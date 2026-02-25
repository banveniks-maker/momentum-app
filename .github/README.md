# ⚡ MOMENTUM — Habit Tracker

> Global habit tracker with AI coaching. Built with React Native + Expo.
> Target: Google Play + RuStore

---

## 🚀 БЫСТРЫЙ СТАРТ (5 минут)

### 1. Установить инструменты

```bash
# Node.js 18+ должен быть установлен
node --version

# Установить Expo CLI глобально
npm install -g expo-cli eas-cli

# Установить зависимости проекта
cd momentum
npm install
```

### 2. Настроить API ключ

```bash
cp .env.example .env
# Открой .env и вставь твой Anthropic API ключ
# Ключ получи на: https://console.anthropic.com
```

### 3. Запустить на телефоне (САМЫЙ БЫСТРЫЙ СПОСОБ)

```bash
npx expo start
# Сканируй QR код приложением Expo Go (Android/iOS)
# Скачать: https://expo.dev/go
```

### 4. Запустить в эмуляторе Android

```bash
# Нужен Android Studio + эмулятор
npx expo run:android
```

---

## 📱 СБОРКА APK (для тестов)

```bash
# Авторизуйся в Expo
eas login

# Инициализируй проект EAS
eas init

# Собери APK для внутреннего тестирования
eas build --platform android --profile preview

# APK будет доступен по ссылке в консоли через ~10 минут
```

---

## 🏪 ВЫКЛАДКА В GOOGLE PLAY

### Шаг 1: Подготовка аккаунта
1. Зарегистрируй **Google Play Developer Account**: https://play.google.com/console
2. Разовый платёж: **$25**
3. Заполни профиль разработчика (занимает ~1 час)

### Шаг 2: Собери production bundle

```bash
# Production AAB (Android App Bundle — формат для Google Play)
eas build --platform android --profile production

# Файл .aab будет готов через ~15 минут
# Скачай его из Expo dashboard
```

### Шаг 3: Создай приложение в Google Play Console
1. Открой https://play.google.com/console
2. **"Создать приложение"**
3. Название: **MOMENTUM — Habit Tracker & AI Coach**
4. Язык по умолчанию: **English**
5. Приложение: **Бесплатное**
6. Контент: **Для всех возрастов (3+)**

### Шаг 4: Заполни Store Listing

**Краткое описание** (80 символов):
```
Track habits, boost energy & get AI coaching. #1 habit tracker.
```

**Полное описание** (4000 символов):
```
⚡ MOMENTUM — The habit tracker that actually works.

Unlike boring to-do lists, MOMENTUM shows you a real-time ENERGY SCORE (0-100) that changes based on your habits, mood, and consistency. Watch your score rise when you complete your morning workout. See it drop when you skip meditation. This is your life, visualized.

🌍 GLOBAL RANKING
Compete with millions of users worldwide. See how your country ranks against others. Are you helping Japan stay #1, or pulling your country down? The global leaderboard updates daily.

🤖 AI COACH (Powered by Claude)
Your personal AI coach knows YOUR habits, YOUR streaks, and YOUR energy score. Ask it anything:
• "Why do I always fail on Wednesdays?"
• "What's the best time for me to exercise?"
• "How can I build a morning routine?"
Get brutally honest, data-driven advice — not generic tips.

👥 SOCIAL CHALLENGES
Join global challenges with thousands of players:
• Morning Warriors: Wake up before 7am for 7 days
• Hydration Nation: Drink 2L water daily
• 5K Every Day: Walk or run 5000 steps
Share your invite code and compete with friends.

✨ KEY FEATURES:
• Energy Score 0-100 — unique motivation system
• Habit streaks with visual progress
• Weekly energy chart
• Mood tracking (5 levels)
• 6 languages: EN, RU, ZH, ES, FR, HI
• Dark cyberpunk design
• Works offline
• No ads, no subscriptions (base version)
• AI Coach powered by Claude AI

📊 HOW IT WORKS:
1. Add your habits (workout, water, meditation...)
2. Check them off daily to boost your Energy Score
3. Log your mood to see patterns
4. Ask your AI Coach for personalized advice
5. Compete globally on the leaderboard

Built for people who are serious about self-improvement but tired of apps that feel like chores.

Your energy is your most valuable resource. MOMENTUM helps you track it, protect it, and grow it.

Start your streak today. 🔥
```

### Шаг 5: Скриншоты

**Нужные размеры для Google Play:**
- Phone: минимум 2 скриншота, 1080×1920px (16:9 portrait)
- Tablet 7": опционально
- Feature Graphic: **1024×500px** — ОБЯЗАТЕЛЬНО

**Где взять скриншоты:**
1. Запусти приложение в эмуляторе Android (1080×1920)
2. Сделай скриншоты каждого экрана (Today, Global, Social, AI Coach)
3. Или используй генератор: https://screenshots.pro

**Feature Graphic (1024×500px):**
- Тёмный фон #0a0a0f
- Логотип MOMENTUM крупно
- Подпись: "Track habits. Boost energy. Go global."
- Зелёный акцент #00ff88

### Шаг 6: Иконка приложения

Нужна иконка **512×512px PNG** (без прозрачности для Feature Graphic).

Создай в Figma или используй:
- Буква M на тёмном фоне (#0a0a0f)
- Цвет: #00ff88
- Шрифт: Bebas Neue
- Добавь green glow эффект

### Шаг 7: Privacy Policy (ОБЯЗАТЕЛЬНО)

Потому что приложение использует интернет (AI Coach) и возможно уведомления.

Создай страницу на GitHub Pages или Notion:

```
MOMENTUM Privacy Policy

Last updated: [DATE]

1. Data We Collect
MOMENTUM stores your habit data locally on your device using AsyncStorage. 
We do not collect or store personal data on our servers.

2. AI Coach
When you use the AI Coach feature, your habit statistics (not personal info) 
are sent to Anthropic's API to generate coaching responses. 
See Anthropic's privacy policy: https://anthropic.com/privacy

3. Analytics
We may use anonymous crash reporting to improve the app.

4. Contact
[your-email@example.com]
```

### Шаг 8: Загрузи AAB и опубликуй

```bash
# Автоматически через EAS Submit
eas submit --platform android

# Или вручную в Google Play Console:
# Production → Releases → Create release → Upload .aab
```

**Сроки проверки Google Play:**
- Первая публикация: **3–7 рабочих дней**
- Последующие обновления: **несколько часов**

---

## 🏪 ВЫКЛАДКА В RUSTORE

### Шаг 1: Регистрация
1. https://rustore.ru/developers
2. ИП или юрлицо: нужен ИНН
3. Физлица: также возможно
4. Верификация: 1–3 рабочих дня

### Шаг 2: Специфика для RuStore
- Принимает тот же **APK/AAB** что и Google Play
- Нужен русскоязычный Store Listing (уже есть в i18n.ts)
- Политика конфиденциальности на **русском языке** — обязательна
- Рейтинг: **0+** (контент для всех возрастов)

### Шаг 3: Краткое описание для RuStore (80 символов)
```
Трекер привычек с AI-тренером. Глобальный рейтинг стран.
```

### Шаг 4: Полное описание для RuStore
```
⚡ MOMENTUM — трекер привычек, который реально работает.

MOMENTUM показывает твой УРОВЕНЬ ЭНЕРГИИ (0–100) в реальном времени. Он меняется в зависимости от выполненных привычек, настроения и регулярности. Наблюдай, как растёт твой счёт после утренней зарядки.

🌍 ГЛОБАЛЬНЫЙ РЕЙТИНГ
Соревнуйся с миллионами пользователей по всему миру. Помогает ли Россия удерживать позиции в мировом рейтинге или опускается вниз?

🤖 AI ТРЕНЕР (на базе Claude)
Твой персональный AI-тренер знает твои привычки, стрики и уровень энергии. Спроси его:
• «Почему я всегда срываюсь по средам?»
• «Как построить утренний ритуал?»
• «Что мне делать, чтобы не бросать спорт?»

👥 СОЦИАЛЬНЫЕ ЧЕЛЛЕНДЖИ
Присоединяйся к глобальным вызовам с тысячами игроков.

✨ ФУНКЦИИ:
• Уровень энергии 0–100
• Стрики привычек
• График энергии за неделю
• Трекер настроения
• 6 языков интерфейса
• Тёмный дизайн
• Работает офлайн
• Без рекламы

Начни свой стрик сегодня. 🔥
```

---

## 📋 ЧЕКЛИСТ ПЕРЕД ПУБЛИКАЦИЕЙ

- [ ] API ключ Anthropic добавлен в .env
- [ ] Иконка 512×512px создана
- [ ] Скриншоты 1080×1920px (минимум 4 штуки)
- [ ] Feature Graphic 1024×500px
- [ ] Privacy Policy опубликована
- [ ] Production AAB собран через EAS
- [ ] Описание на EN и RU готово
- [ ] app.json заполнен (bundleIdentifier, versionCode)
- [ ] google-services.json добавлен (если используешь FCM для push)

---

## 🔑 КЛЮЧЕВЫЕ ФАЙЛЫ

```
momentum/
├── app/_layout.tsx          # Точка входа, сплэш, онбординг
├── src/
│   ├── store/index.ts       # Весь state (Zustand + AsyncStorage)
│   ├── utils/i18n.ts        # 6 языков
│   ├── utils/design.ts      # Цвета, шрифты, стили
│   ├── screens/
│   │   ├── TodayScreen.tsx  # Главный экран
│   │   ├── GlobalScreen.tsx # Рейтинг стран
│   │   ├── SocialScreen.tsx # Друзья и челленджи
│   │   ├── AICoachScreen.tsx # Claude AI чат
│   │   ├── ProfileScreen.tsx # Профиль + язык
│   │   └── OnboardingScreen.tsx
│   ├── components/
│   │   ├── Toast.tsx
│   │   ├── WeekChart.tsx
│   │   └── AddHabitModal.tsx
│   └── navigation/
│       └── MainNavigator.tsx
├── app.json                 # Expo config
├── eas.json                 # EAS Build config
├── .env.example             # Шаблон переменных
└── package.json
```

---

## 💡 СОВЕТЫ ДЛЯ МИЛЛИАРДА ЗАГРУЗОК

1. **ASO (App Store Optimization)**: первые 3 слова в названии — самые важные для поиска
2. **Первая неделя**: попроси друзей поставить 5★ — влияет на алгоритм
3. **Отзывы**: отвечай на каждый отзыв в первые 24 часа
4. **Обновления**: выпускай хотя бы раз в 2 недели — алгоритм любит активные приложения
5. **Локализация**: приложения с локальным контентом получают +40% установок в регионе
6. **Push-уведомления**: правильно настроенные напоминания = retention x3

---

## 📞 ПОМОЩЬ

При проблемах с EAS Build: https://docs.expo.dev/build/introduction/
Документация Expo Router: https://expo.github.io/router/
Anthropic API: https://docs.anthropic.com
