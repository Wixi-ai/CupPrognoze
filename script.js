/**
 * ============================================================
 *  CupPrognoze - Основной скрипт
 *  Содержит все данные и логику для всех вкладок
 * ============================================================
 */

// ============================================================
//  НАСТРОЙКА API
// ============================================================
const API_URL = 'https://cupprognoze.onrender.com/api';
// Для локальной разработки:
// const API_URL = 'http://localhost:3000/api';

// ============================================================
//  ПЕРЕМЕННЫЕ ДЛЯ ФИЛЬТРА ПРОГНОЗОВ
// ============================================================
let currentForecastFilter = 'all';
let allForecastsData = [];

// ============================================================
//  1. ТЕЛЕГРАМ-КАНАЛЫ (ВСЕ ВЕДУТ В ОДИН КАНАЛ)
// ============================================================
const channels = [
  {
    id: 1,
    name: 'CupBet Pro',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Ежедневные прогнозы на топ-матчи. Высокая проходимость, статистика за 3 месяца — 78%.',
    sport: 'football',
    rating: 4.8,
    subscribers: '12.5K'
  },
  {
    id: 2,
    name: 'Tennis Ace Insider',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Аналитика и прогнозы на ATP и WTA. Точные ставки на тоталы и форы.',
    sport: 'tennis',
    rating: 4.6,
    subscribers: '8.2K'
  },
  {
    id: 3,
    name: 'Cyber Strike',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Прогнозы на CS2, Dota 2, Valorant. Экспресс-ставки и лайв-советы.',
    sport: 'cybersport',
    rating: 4.9,
    subscribers: '23.7K'
  },
  {
    id: 4,
    name: 'Table Tennis Daily',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Настольный теннис: прогнозы на все турниры ITTF. Высокая точность.',
    sport: 'tabletennis',
    rating: 4.3,
    subscribers: '5.1K'
  },
  {
    id: 5,
    name: 'Basketball Master',
    link: 'https://t.me/cup_prognoze_all',
    description: 'НБА, Евролига, Китай. Ставки на тоталы и форы с детальной статистикой.',
    sport: 'basketball',
    rating: 4.7,
    subscribers: '9.8K'
  },
  {
    id: 6,
    name: 'Hockey Pucks',
    link: 'https://t.me/cup_prognoze_all',
    description: 'КХЛ, НХЛ. Прогнозы на матчи дня, анализ вратарей и спецбригад.',
    sport: 'hockey',
    rating: 4.4,
    subscribers: '6.3K'
  },
  {
    id: 7,
    name: 'Volley Pro',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Волейбольные прогнозы: мужские и женские лиги, плей-офф.',
    sport: 'volleyball',
    rating: 4.2,
    subscribers: '3.9K'
  },
  {
    id: 8,
    name: 'Footy Analytics',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Углубленный анализ футбольных матчей. Эксклюзивные инсайды.',
    sport: 'football',
    rating: 4.9,
    subscribers: '18.3K'
  },
  {
    id: 9,
    name: 'Tennis Betting Edge',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Профессиональные прогнозы на теннис. Стратегии на геймы и сеты.',
    sport: 'tennis',
    rating: 4.5,
    subscribers: '7.4K'
  },
  {
    id: 10,
    name: 'Cyber Odds',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Киберспорт: аналитика коэффициентов, прогнозы на андердогов.',
    sport: 'cybersport',
    rating: 4.1,
    subscribers: '4.2K'
  }
];

// ============================================================
//  2. БУКМЕКЕРЫ (РЕЙТИНГ)
// ============================================================
const bookmakers = [
  {
    id: 1,
    name: 'PARI',
    description: 'Один из лидеров беттинговой индустрии в России. Инвестирует в спорт, партнерства с клубами и лигами.',
    rating: 4.8,
    bonus: 'Бонус до 10 000 ₽',
    features: ['⚡ Быстрая регистрация', '📊 Аналитика', '🔒 Надёжность'],
    link: 'https://trk.ppdu.ru/click?uid=194885&oid=1447&erid=*&siteId=23676',
    logo: 'images/bookmakers/pari-logo.png',
    logoBg: 'pari-bg'
  },
  {
    id: 2,
    name: 'Winline',
    description: 'Отечественный букмекер с приятными бонусами, кэшбэком и отличной поддержкой.',
    rating: 4.5,
    bonus: 'Фрибет до 10 000 ₽',
    features: ['🇷🇺 Русский язык', '💳 Быстрый вывод', '🎁 Акции'],
    link: 'https://trk.ppdu.ru/click?uid=194885&oid=2779&erid=2SDnjdDRjvV&siteId=23676',
    logo: 'images/bookmakers/winline-logo.png',
    logoBg: 'winline-bg'
  },

];

// ============================================================
//  3. КАППЕРЫ
// ============================================================
const cappers = [
  {
    id: 1,
    name: 'Александр "ProBettor"',
    sport: 'Футбол, Теннис',
    avatar: '⚡',
    wins: 847,
    loses: 213,
    roi: '+42.3%',
    rating: 4.9,
    link: 'https://t.me/probettor',
    description: 'Профессиональный каппер с 7-летним стажем. Специализация — топ-матчи и лайв.'
  },
  {
    id: 2,
    name: 'Елена "TennisQueen"',
    sport: 'Теннис',
    avatar: '🎾',
    wins: 523,
    loses: 167,
    roi: '+38.7%',
    rating: 4.8,
    link: 'https://t.me/tennisqueen',
    description: 'Эксперт по теннису. Анализирует каждый матч до мелочей. Высокая проходимость.'
  },
  {
    id: 3,
    name: 'Дмитрий "CyberLord"',
    sport: 'Киберспорт',
    avatar: '🎮',
    wins: 712,
    loses: 245,
    roi: '+35.2%',
    rating: 4.7,
    link: 'https://t.me/cyberlord',
    description: 'Гуру киберспорта. Ставки на CS2, Dota 2, Valorant. Дает эксклюзивные инсайды.'
  },
  {
    id: 4,
    name: 'Иван "HockeyPro"',
    sport: 'Хоккей',
    avatar: '🏒',
    wins: 389,
    loses: 142,
    roi: '+31.8%',
    rating: 4.6,
    link: 'https://t.me/hockeypro',
    description: 'Хоккейный аналитик. КХЛ и НХЛ — его стихия. Точные прогнозы на матчи.'
  },
  {
    id: 5,
    name: 'Мария "BasketQueen"',
    sport: 'Баскетбол',
    avatar: '🏀',
    wins: 456,
    loses: 189,
    roi: '+33.5%',
    rating: 4.6,
    link: 'https://t.me/basketqueen',
    description: 'Эксперт по баскетболу. НБА, Евролига — всегда в топе.'
  },
  {
    id: 6,
    name: 'Сергей "VolleyMaster"',
    sport: 'Волейбол',
    avatar: '🏐',
    wins: 312,
    loses: 98,
    roi: '+29.4%',
    rating: 4.5,
    link: 'https://t.me/volleymaster',
    description: 'Волейбольный аналитик. Все топ-лиги мира в его прогнозах.'
  }
];

// ============================================================
//  4. СТАТЬИ — ПОЛНЫЕ ГАЙДЫ ПО ОТЫГРЫШУ БОНУСОВ
// ============================================================
const articles = [
  {
    id: 1,
    title: 'Стратегия №1: Низкорисковый ординар на фаворита',
    excerpt: 'Самая простая и безопасная стратегия для отыгрыша бонусов. Идеально подходит для новичков.',
    image: 'images/articles/football-guide.jpg',
    icon: '🛡️',
    date: '21 июня 2026',
    readTime: '8 мин',
    link: '#',
    content: `
      <p><strong>Отыгрыш бонуса</strong> — это всегда баланс между минимизацией риска и выполнением условий букмекера.</p>

      <p><strong>Стратегия №1: Низкорисковый ординар на крупного фаворита</strong></p>
      <p>Это самая простая и наименее рискованная стратегия, идеально подходящая для новичков.</p>

      <p><strong>Суть:</strong> Вы делаете одну ставку-ординар на самого очевидного фаворита с минимальным коэффициентом.</p>

      <p><strong>Как это работает:</strong></p>
      <ul>
        <li>У вас бонус 1000 руб. с вейджером x5. Вам нужно сделать оборот 5000 руб.</li>
        <li>Вы находите событие с фаворитом, чья победа почти не вызывает сомнений.</li>
        <li>Ставите всю сумму бонуса (1000 руб.) на этого фаворита с коэффициентом, например, 1.15.</li>
      </ul>

      <p><strong>Результат:</strong></p>
      <ul>
        <li>В случае выигрыша: вы получаете 1150 руб. Ваш отыгранный оборот = 1000 руб. (ваша ставка) + 150 руб. (чистый выигрыш).</li>
        <li>В случае проигрыша: вы теряете бонусные деньги. Свои депозитные средства при этом не страдают.</li>
      </ul>

      <p><strong>Плюсы:</strong> Минимальный риск, простота.</p>
      <p><strong>Минусы:</strong> Очень медленный процесс, так как коэффициенты низкие. Всегда есть мизерный шанс сенсации.</p>
    `
  },
  {
    id: 2,
    title: 'Стратегия №2: Ставки на тоталы в статистических видах спорта',
    excerpt: 'Надежная стратегия, основанная на статистике. Меньше зависит от случайного результата матча.',
    image: 'images/articles/tennis-strategy.jpg',
    icon: '📊',
    date: '21 июня 2026',
    readTime: '10 мин',
    link: '#',
    content: `
      <p><strong>Стратегия №2: Ставки на тоталы в статистических видах спорта</strong></p>
      <p>Более надежная стратегия, чем ставки на победу, так как она меньше зависит от случайного результата.</p>

      <p><strong>Суть:</strong> Вы делаете ставки на то, что в матче будет забито/выиграно больше или меньше определенного количества голов/очков/геймов. Лучше всего подходят виды спорта со стабильной статистикой: волейбол, теннис, баскетбол.</p>

      <p><strong>Как это работает:</strong></p>
      <ul>
        <li>Бонус 1000 руб. с вейджером x5.</li>
        <li>Вы выбираете матч, где ожидается упорная борьба. Например, в теннисе два игрока примерно равны по силе.</li>
        <li>Ставите на ТБ (21.5) в сете. Даже если один игрок проиграет 6:7, 7:6, 6:7, ваш тотал все равно сыграет.</li>
      </ul>

      <p><strong>Плюсы:</strong> Высокая проходимость ставок, меньшая зависимость от результата.</p>
      <p><strong>Минусы:</strong> Требует анализа и понимания вида спорта.</p>
    `
  },
  {
    id: 3,
    title: 'Стратегия №3 «Догон» на противоположные исходы',
    excerpt: 'Более рискованная, но быстрая стратегия. Требует осторожности и четкого плана.',
    image: 'images/articles/cybersport-guide.jpg',
    icon: '🎯',
    date: '21 июня 2026',
    readTime: '12 мин',
    link: '#',
    content: `
      <p><strong>Стратегия №3 «Догон» на противоположные исходы (для двух и более событий)</strong></p>
      <p>Внимание! Эта стратегия требует осторожности и четкого плана. Она более рискованная, но позволяет отыграть бонус быстрее.</p>

      <p><strong>Суть:</strong> Вы находите два события с примерно равными коэффициентами (желательно около 2.00) и ставите на противоположные исходы в разных купонах.</p>

      <p><strong>Как это работает:</strong></p>
      <ul>
        <li>Бонус 1000 руб., вейджер x5. Оборот = 5000 руб.</li>
        <li>Событие 1: Матч Лиги Чемпионов. Исходы: П1 (коэф. 2.10) / П2 (коэф. 1.80).</li>
        <li>Событие 2: Матч НБА. Исходы: П1 (коэф. 1.90) / П2 (коэф. 1.90).</li>
        <li>Купон 1: Ставим 600 руб. на П1 (Событие 1) и П2 (Событие 2). Суммарный коэффициент ~ 4.00.</li>
        <li>Купон 2: Ставим 600 руб. на П2 (Событие 1) и П1 (Событие 2). Суммарный коэффициент ~ 3.50.</li>
      </ul>

      <p><strong>Результат:</strong> При любом исходе обоих матчей один из ваших купонов сыграет. Вы получите выигрыш (например, 600 * 3.50 = 2100 руб.).</p>

      <p><strong>Плюсы:</strong> Быстрое выполнение части обязательного оборота.</p>
      <p><strong>Минусы:</strong> Высокий риск, так как для покрытия двух ставок нужно вложить больше денег.</p>
    `
  },
  {
    id: 4,
    title: 'Критически важные правила для отыгрыша бонусов',
    excerpt: '90% успеха — внимательное чтение условий. Собрали самое важное.',
    image: 'images/articles/betting-psychology.jpg',
    icon: '📋',
    date: '21 июня 2026',
    readTime: '6 мин',
    link: '#',
    content: `
      <p><strong>Критически важные правила для любой стратегии</strong></p>
      <p>ВНИМАТЕЛЬНО ЧИТАЙТЕ УСЛОВИЯ! Это 90% успеха. Обратите внимание на:</p>

      <ul>
        <li><strong>Срок отыгрыша.</strong> Часто он очень короткий (3-7 дней).</li>
        <li><strong>Максимальный коэффициент для ставок по бонусу.</strong> Часто это 3.00 или ниже. Ставка с более высоким коэффициентом не засчитается в оборот.</li>
        <li><strong>Виды спорта и рынки.</strong> Некоторые БК не разрешают отыгрывать бонус на киберспорт или определенные турниры.</li>
        <li><strong>Используйте для ставок только бонусные средства.</strong> Никогда не подключайте к отыгрышу бонуса свои депозитные деньги.</li>
      </ul>

      <p><strong>Рассчитайте минимальный коэффициент.</strong> Чтобы просто отыграть бонус без потерь, вам нужен коэффициент не меньше, чем 1 / (1 - (1 / Вейджер)).</p>

      <p><strong>Дисциплина — ваш главный козырь.</strong> Не поддавайтесь искушению поставить на высокий коэффициент в надежде быстро все отыграть. Это верный путь к потере и бонуса, и депозита.</p>
    `
  },
  {
    id: 5,
    title: 'Как рассчитать минимальный коэффициент для отыгрыша',
    excerpt: 'Формула и примеры расчета, чтобы отыграть бонус без потерь.',
    image: 'images/articles/hockey-tournaments.jpg',
    icon: '🧮',
    date: '21 июня 2026',
    readTime: '5 мин',
    link: '#',
    content: `
      <p><strong>Как рассчитать минимальный коэффициент для отыгрыша</strong></p>

      <p><strong>Формула:</strong></p>
      <p style="background: rgba(139, 92, 246, 0.05); padding: 16px; border-radius: 8px; font-size: 18px; text-align: center;">
        K = 1 / (1 - (1 / Вейджер))
      </p>

      <p><strong>Пример для вейджера x5:</strong></p>
      <p style="background: rgba(139, 92, 246, 0.05); padding: 16px; border-radius: 8px; font-size: 18px; text-align: center;">
        K = 1 / (1 - (1/5)) = 1 / 0.8 = 1.25
      </p>

      <p>Это значит, что при среднем коэффициенте 1.25 и выше вы теоретически сможете отыграть бонус без убытка.</p>

      <p><strong>Примеры для разных вейджеров:</strong></p>
      <ul>
        <li>Вейджер x3 → Минимальный коэффициент: 1.50</li>
        <li>Вейджер x5 → Минимальный коэффициент: 1.25</li>
        <li>Вейджер x10 → Минимальный коэффициент: 1.11</li>
        <li>Вейджер x20 → Минимальный коэффициент: 1.05</li>
      </ul>

      <p><strong>Вывод:</strong> Чем выше вейджер, тем ниже минимальный коэффициент, но тем больше ставок нужно сделать.</p>
    `
  },
  {
    id: 6,
    title: 'Почему дисциплина — главный козырь в отыгрыше',
    excerpt: 'Как не поддаться эмоциям и сохранить деньги. Советы от профессионалов.',
    image: 'images/articles/bookmaker-rating.jpg',
    icon: '🧠',
    date: '21 июня 2026',
    readTime: '7 мин',
    link: '#',
    content: `
      <p><strong>Почему дисциплина — главный козырь в отыгрыше</strong></p>

      <p><strong>Главное правило:</strong> Не поддавайтесь искушению поставить на высокий коэффициент в надежде быстро все отыграть.</p>

      <p>Это верный путь к потере: И бонуса, и депозита.</p>

      <p><strong>Советы от профессионалов:</strong></p>
      <ul>
        <li><strong>Планируйте заранее.</strong> Определите, сколько ставок вы сделаете и на какие суммы.</li>
        <li><strong>Не гонитесь за быстрым результатом.</strong> Лучше сделать 10 ставок по 1.20, чем одну на 5.00.</li>
        <li><strong>Контролируйте эмоции.</strong> Если проиграли несколько ставок подряд — сделайте паузу.</li>
        <li><strong>Ведите учет.</strong> Записывайте все свои ставки и анализируйте результаты.</li>
      </ul>

      <p><strong>Итог:</strong> Самый безопасный путь — это Стратегия №1 (ординары на фаворитов) или Стратегия №2 (тоталы). Они требуют терпения, но сводят риск к минимуму.</p>

      <p>Помните, что бонус — это инструмент букмекера, чтобы вы больше ставили. Ваша задача — использовать этот инструмент с умом.</p>
    `
  }
];

// ============================================================
//  5. СКЛАДЧИНЫ
// ============================================================
const shares = [
  {
    id: 1,
    title: 'VIP прогнозы на Евро-2026',
    description: 'Доступ к эксклюзивным прогнозам от топ-капперов на все матчи чемпионата Европы. Ограниченное количество мест.',
    price: '2 500 ₽',
    participants: 8,
    maxParticipants: 15,
    status: 'active',
    deadline: 'до 20 июня'
  },
  {
    id: 2,
    title: 'Теннисный пакет "Уимблдон"',
    description: 'Полный пакет прогнозов на Уимблдон. Все матчи, детальный анализ и стратегии ставок.',
    price: '3 200 ₽',
    participants: 12,
    maxParticipants: 20,
    status: 'active',
    deadline: 'до 25 июня'
  },
  {
    id: 3,
    title: 'Киберспорт: Intel Extreme Masters',
    description: 'Эксклюзивные прогнозы на IEM. Ставки на CS2 и Dota 2 от профильных экспертов.',
    price: '1 800 ₽',
    participants: 18,
    maxParticipants: 20,
    status: 'filled',
    deadline: 'закрыто'
  },
  {
    id: 4,
    title: 'Сезон НБА 2025/2026 (запись)',
    description: 'Полный архив прогнозов на весь сезон НБА. Более 200 матчей с детальным разбором.',
    price: '4 500 ₽',
    participants: 25,
    maxParticipants: 25,
    status: 'closed',
    deadline: 'завершено'
  },
  {
    id: 5,
    title: 'Хоккейный экспресс "Плей-офф КХЛ"',
    description: 'Прогнозы на все матчи плей-офф КХЛ. Эксклюзивные инсайды от хоккейных аналитиков.',
    price: '2 100 ₽',
    participants: 10,
    maxParticipants: 15,
    status: 'active',
    deadline: 'до 10 июля'
  }
];

// ============================================================
//  6. ОТЗЫВЫ
// ============================================================
const reviews = [
  {
    id: 1,
    name: 'Андрей К.',
    date: '14 июня 2026',
    rating: 5,
    text: 'Отличный сайт! Пользуюсь уже полгода, прогнозы реально заходят. Капперы действительно профессионалы. Рекомендую!',
    source: 'Канал CupBet Pro',
    sourceLink: 'https://t.me/cup_prognoze_all'
  },
  {
    id: 2,
    name: 'Екатерина М.',
    date: '12 июня 2026',
    rating: 5,
    text: 'Теннисные прогнозы просто бомба! Благодаря сайту подняла банк в 2 раза. Спасибо капперам за качественный анализ.',
    source: 'Канал Tennis Ace Insider',
    sourceLink: 'https://t.me/cup_prognoze_all'
  },
  {
    id: 3,
    name: 'Дмитрий П.',
    date: '10 июня 2026',
    rating: 4,
    text: 'Хороший сайт, удобный интерфейс. Прогнозы на футбол очень точные. Единственное - хотелось бы больше бесплатных прогнозов.',
    source: 'Канал Footy Analytics',
    sourceLink: 'https://t.me/cup_prognoze_all'
  },
  {
    id: 4,
    name: 'Олег С.',
    date: '8 июня 2026',
    rating: 5,
    text: 'Киберспорт - это любовь! Благодаря прогнозам с этого сайта начал стабильно зарабатывать. Рекомендую всем.',
    source: 'Канал Cyber Strike',
    sourceLink: 'https://t.me/cup_prognoze_all'
  },
  {
    id: 5,
    name: 'Ирина В.',
    date: '5 июня 2026',
    rating: 5,
    text: 'Очень довольна сайтом. Прогнозы на баскетбол заходят в 80% случаев. Удобно, что есть рейтинг капперов.',
    source: 'Канал Basketball Master',
    sourceLink: 'https://t.me/cup_prognoze_all'
  },
  {
    id: 6,
    name: 'Максим Н.',
    date: '3 июня 2026',
    rating: 4,
    text: 'Хороший ресурс для беттинга. Особенно нравится раздел со статьями - много полезной информации для новичков.',
    source: 'CupPrognoze',
    sourceLink: 'https://t.me/cup_prognoze_all'
  }
];

// ============================================================
//  ФУНКЦИИ РЕНДЕРИНГА
// ============================================================

function renderChannels(filter = 'all') {
  const grid = document.getElementById('cardsGrid');
  if (!grid) return;

  let filtered = channels;
  if (filter !== 'all') {
    filtered = channels.filter(ch => ch.sport === filter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #9ca3af; font-size: 18px; background: rgba(31, 35, 44, 0.3); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.06);">
        😕 Нет каналов по данному фильтру
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(ch => {
    const stars = getStarsHtml(ch.rating);
    const sportIcon = getSportIcon(ch.sport);

    html += `
      <div class="card" data-id="${ch.id}">
        <div class="card-header">
          <div class="card-title">
            <a href="${ch.link}" target="_blank">${sportIcon} ${ch.name}</a>
          </div>
        </div>
        <div class="card-description">${ch.description}</div>
        <div class="card-stats">
          <span>👥 ${ch.subscribers}</span>
          <span>🏷️ ${ch.sport.charAt(0).toUpperCase() + ch.sport.slice(1)}</span>
        </div>
        <div class="card-footer">
          <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="value">${ch.rating.toFixed(1)}</span>
          </div>
          <a href="${ch.link}" target="_blank" class="card-link">Перейти ➜</a>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function renderBookmakers() {
  const grid = document.getElementById('bookmakersGrid');
  if (!grid) return;

  const sorted = [...bookmakers].sort((a, b) => b.rating - a.rating);

  let html = '';
  sorted.forEach(bm => {
    const stars = getStarsHtml(bm.rating);
    const featuresHtml = bm.features.map(f => `<span class="bookmaker-feature">${f}</span>`).join('');
    const logoHtml = bm.logo ?
      `<img src="${bm.logo}" alt="${bm.name}" onerror="this.style.display='none'">` :
      `<span class="logo-placeholder">${bm.name.charAt(0).toUpperCase()}</span>`;

    html += `
      <div class="bookmaker-card" data-id="${bm.id}">
        <div class="bookmaker-logo ${bm.logoBg || bm.logoColor || 'color-1'}">
          ${logoHtml}
        </div>
        <div class="card-header">
          <div class="card-title">
            <span class="highlight">🏆</span> ${bm.name}
          </div>
          <span class="bookmaker-rating-badge">${bm.rating.toFixed(1)} ★</span>
        </div>
        <div class="card-description">${bm.description}</div>
        <div class="bookmaker-features">${featuresHtml}</div>
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin:6px 0 8px; font-size:13px; color:#9ca3af;">
          <span class="bookmaker-bonus">🎁 ${bm.bonus}</span>
        </div>
        <div class="card-footer">
          <div class="card-rating">
            <span class="stars">${stars}</span>
            <span class="value">${bm.rating.toFixed(1)}</span>
          </div>
          <a href="${bm.link}" target="_blank" class="bookmaker-link">Перейти ➜</a>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function renderCappers() {
  const grid = document.getElementById('cappersGrid');
  if (!grid) return;

  const sorted = [...cappers].sort((a, b) => b.rating - a.rating);

  let html = '';
  sorted.forEach(capper => {
    const stars = getStarsHtml(capper.rating);

    html += `
      <div class="capper-card">
        <div class="capper-avatar">${capper.avatar}</div>
        <div class="capper-name">${capper.name}</div>
        <div class="capper-sport">🎯 ${capper.sport}</div>
        <div class="capper-stats">
          <div class="capper-stat">
            <div class="number">${capper.wins}</div>
            <div class="label">✅ Побед</div>
          </div>
          <div class="capper-stat">
            <div class="number">${capper.loses}</div>
            <div class="label">❌ Поражений</div>
          </div>
          <div class="capper-stat">
            <div class="number">${capper.roi}</div>
            <div class="label">📈 ROI</div>
          </div>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin: 8px 0;">
          <span style="color:#9ca3af; font-size:13px;">Рейтинг</span>
          <span style="color:#a78bfa; font-size:18px; font-weight:700;">${stars}</span>
        </div>
        <div style="font-size:13px; color:#9ca3af; margin-bottom:8px; text-align:center;">${capper.description}</div>
        <a href="${capper.link}" target="_blank" class="capper-link">📲 Подписаться</a>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ============================================================
//  4. СТАТЬИ — РЕНДЕРИНГ
// ============================================================

function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;

  let html = '';
  articles.forEach(article => {
    const hasImage = article.image && article.image !== '';

    const imageHtml = hasImage
      ? `<img src="${article.image}" alt="${article.title}" class="article-img" onerror="this.style.display='none'; this.parentElement.querySelector('.article-icon').style.display='flex'">`
      : `<div class="article-icon">${article.icon || '📰'}</div>`;

    const shortExcerpt = article.excerpt.length > 120
      ? article.excerpt.substring(0, 120) + '...'
      : article.excerpt;

    html += `
      <div class="article-card" data-article-id="${article.id}">
        <div class="article-image-wrapper">
          ${imageHtml}
          ${hasImage ? `<div class="article-icon" style="display:none;">${article.icon || '📰'}</div>` : ''}
        </div>
        <div class="article-content">
          <div class="article-title">${article.title}</div>
          <div class="article-excerpt">${shortExcerpt}</div>
          <div class="article-meta">
            <span>📅 ${article.date}</span>
            <span>⏱️ ${article.readTime}</span>
            <span class="article-read-link">Читать →</span>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;

  // Добавляем обработчики после рендера
  document.querySelectorAll('.article-read-link').forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      const card = this.closest('.article-card');
      const id = card.dataset.articleId;
      if (id) {
        openArticle(parseInt(id));
      }
    });
  });
}

// ============================================================
//  СТАТЬИ — ОТКРЫТИЕ ПОЛНОЙ ВЕРСИИ
// ============================================================

function openArticle(id) {
  console.log('openArticle вызвана с ID:', id);

  const article = articles.find(a => a.id === id);
  if (!article) {
    console.error('Статья не найдена:', id);
    return;
  }

  console.log('Статья найдена:', article.title);

  // Скрываем все основные секции
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.filters-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  let content = document.getElementById('articleContent');
  if (!content) {
    content = document.createElement('div');
    content.id = 'articleContent';
    content.className = 'article-detail-page';
    document.querySelector('.main .container').appendChild(content);
  }

  content.className = 'article-detail-page active';

  const hasImage = article.image && article.image !== '';
  const imageHtml = hasImage
    ? `<img src="${article.image}" alt="${article.title}" class="article-detail-img" onerror="this.style.display='none'">`
    : `<div class="article-detail-icon">${article.icon || '📰'}</div>`;

  content.innerHTML = `
    <div class="article-detail">
      <div class="article-detail-back">
        <a href="#" onclick="closeArticle()" class="article-back-link">← Назад к статьям</a>
      </div>
      ${hasImage ? `<div class="article-detail-image">${imageHtml}</div>` : `<div class="article-detail-icon-wrapper">${imageHtml}</div>`}
      <div class="article-detail-header">
        <h1 class="article-detail-title">${article.title}</h1>
        <div class="article-detail-meta">
          <span>📅 ${article.date}</span>
          <span>⏱️ ${article.readTime}</span>
        </div>
      </div>
      <div class="article-detail-body">
        ${article.content || '<p>Полный текст статьи в разработке...</p>'}
      </div>
    </div>
  `;

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeArticle() {
  const content = document.getElementById('articleContent');
  if (content) {
    content.className = 'article-detail-page';
    content.innerHTML = '';
  }
  const articlesTab = document.querySelector('.nav-link[data-tab="articles"]');
  if (articlesTab) {
    articlesTab.click();
  }
  document.title = 'CupPrognoze — Прогнозы на спорт';
}

function renderShares() {
  const grid = document.getElementById('sharesGrid');
  if (!grid) return;

  let html = '';
  shares.forEach(share => {
    const progress = Math.round((share.participants / share.maxParticipants) * 100);
    const statusMap = {
      active: '🟢 Активна',
      filled: '🟡 Заполнена',
      closed: '🔴 Закрыта'
    };
    const statusClassMap = {
      active: 'active',
      filled: 'filled',
      closed: 'closed'
    };

    html += `
      <div class="share-card">
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
          <div class="share-title">${share.title}</div>
          <span class="share-status ${statusClassMap[share.status]}">${statusMap[share.status]}</span>
        </div>
        <div class="share-description">${share.description}</div>
        <div class="share-details">
          <span class="share-detail">💰 <strong>${share.price}</strong></span>
          <span class="share-detail">👥 <strong>${share.participants}/${share.maxParticipants}</strong></span>
          <span class="share-detail">⏰ <strong>${share.deadline}</strong></span>
        </div>
        <div class="share-progress">
          <div class="share-progress-bar" style="width: ${progress}%;"></div>
        </div>
        <button class="share-join-btn" ${share.status === 'closed' ? 'disabled' : ''}>
          ${share.status === 'closed' ? '❌ Недоступно' :
        share.status === 'filled' ? '🔒 Мест нет' :
          '🚀 Участвовать'}
        </button>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function renderReviews() {
  const grid = document.getElementById('reviewsGrid');
  if (!grid) return;

  let html = '';
  reviews.forEach(review => {
    const stars = '★'.repeat(review.rating) + '☆'.repeat(5 - review.rating);

    html += `
      <div class="review-card">
        <div class="review-header">
          <div class="review-avatar">${review.name.charAt(0)}</div>
          <div class="review-user">
            <div class="review-name">${review.name}</div>
            <div class="review-date">${review.date}</div>
          </div>
          <div class="review-rating">${stars}</div>
        </div>
        <div class="review-text">"${review.text}"</div>
        <div class="review-source">
          📌 Источник: <a href="${review.sourceLink}" target="_blank">${review.source}</a>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
}

// ============================================================
//  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ============================================================

function getStarsHtml(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < fullStars; i++) stars += '★';
  if (halfStar) stars += '☆';
  for (let i = 0; i < 5 - fullStars - halfStar; i++) stars += '☆';
  return stars;
}

function getSportIcon(sport) {
  const icons = {
    football: '⚽',
    tennis: '🎾',
    cybersport: '🖥️',
    tabletennis: '🏓',
    basketball: '🏀',
    hockey: '🏒',
    volleyball: '🏐'
  };
  return icons[sport] || '📌';
}

// ============================================================
//  ПРОГНОЗЫ (С ФИЛЬТРОМ)
// ============================================================

function loadForecasts() {
  const container = document.getElementById('forecastsContainer');
  if (!container) return;

  container.innerHTML = `
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>Загрузка прогнозов...</p>
    </div>
  `;

  fetch(`${API_URL}/forecasts?limit=100`)
    .then(response => {
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.success && data.data && data.data.length > 0) {
        allForecastsData = data.data;
        renderFilteredForecasts();
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 50px 30px; background: rgba(31, 35, 44, 0.5); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.08);">
            <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;">📭</div>
            <h3 style="color: #f1f5f9; margin-bottom: 10px; font-weight: 600;">Пока нет прогнозов</h3>
            <p style="font-size: 16px; color: #9ca3af;">Подпишись на каналы, чтобы видеть прогнозы здесь!</p>
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки прогнозов:', error);
      container.innerHTML = `
        <div style="text-align: center; padding: 50px 30px; background: rgba(31, 35, 44, 0.5); border-radius: 16px; border: 1px solid rgba(239, 68, 68, 0.15);">
          <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.6;">⚠️</div>
          <h3 style="color: #fca5a5; margin-bottom: 10px; font-weight: 600;">Ошибка загрузки</h3>
          <p style="font-size: 14px; color: #9ca3af;">Не удалось загрузить прогнозы. Проверь, что сервер запущен.</p>
          <p style="font-size: 12px; color: #6b7280; margin-top: 10px;">${error.message}</p>
        </div>
      `;
    });
}

function renderFilteredForecasts() {
  const container = document.getElementById('forecastsContainer');
  if (!container) return;

  let filtered = allForecastsData;

  if (currentForecastFilter !== 'all') {
    filtered = allForecastsData.filter(f => f.sport === currentForecastFilter);
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 40px 20px; background: rgba(31, 35, 44, 0.3); border-radius: 16px; border: 1px solid rgba(139, 92, 246, 0.06);">
        <div style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;">🔍</div>
        <h3 style="color: #f1f5f9; margin-bottom: 10px; font-weight: 600;">Нет прогнозов по этому виду спорта</h3>
        <p style="font-size: 16px; color: #9ca3af;">Попробуй выбрать другой фильтр</p>
      </div>
    `;
    return;
  }

  container.innerHTML = renderForecastCards(filtered);
}

function initForecastFilters() {
  const filterContainer = document.getElementById('forecastFilters');
  if (!filterContainer) return;

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('#forecastFilters .filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    currentForecastFilter = btn.dataset.forecastFilter;
    renderFilteredForecasts();
  });
}

// ============================================================
//  ОТРИСОВКА КАРТОЧЕК ПРОГНОЗОВ
// ============================================================

function renderForecastCards(forecasts) {
  if (!forecasts || forecasts.length === 0) return '';

  let html = '<div class="forecasts-grid">';

  forecasts.forEach(f => {
    const statusColors = {
      'Завершен': '#9ca3af',
      'Идет': '#6ee7b7',
      'Скоро': '#a78bfa',
      'Перерыв': '#fbbf24'
    };
    const statusEmoji = {
      'Завершен': '⏹️',
      'Идет': '🔴',
      'Скоро': '⏳',
      'Перерыв': '⏸️'
    };

    const statusColor = statusColors[f.status] || '#9ca3af';
    const statusEmojiIcon = statusEmoji[f.status] || '⚪';

    let scoreDisplay = '—';
    if (f.homeScore !== null && f.homeScore !== undefined &&
      f.awayScore !== null && f.awayScore !== undefined) {
      scoreDisplay = `${f.homeScore}-${f.awayScore}`;
    }

    const statsDisplay = f.stats || '';

    html += `
      <div class="forecast-card match-card">
        <div class="match-header">
          <div class="match-tournament">${f.tournament || 'Футбол'}</div>
          <div class="match-time">${f.matchTime || 'Время не указано'}</div>
        </div>

        <div class="match-source">Источник: ${f.source || f.channel || '—'}</div>

        <div class="match-main">
          <div class="match-teams">
            <div class="team home">
              <span class="team-name">${f.homeTeam || 'Команда 1'}</span>
            </div>
            <div class="match-score-wrapper">
              <div class="match-score" style="color: ${statusColor}">
                ${scoreDisplay}
              </div>
              <div class="match-status" style="color: ${statusColor}">
                ${statusEmojiIcon} ${f.status || 'Скоро'}
              </div>
            </div>
            <div class="team away">
              <span class="team-name">${f.awayTeam || 'Команда 2'}</span>
            </div>
          </div>
        </div>

        ${statsDisplay ? `
        <div class="match-stats">
          <span>Детальная статистика</span>
          <span class="stats-numbers">${statsDisplay}</span>
        </div>
        ` : ''}

        <div class="match-footer">
          <a href="forecast.html?id=${f.id}" class="match-link">📊 Смотреть прогноз →</a>
        </div>
      </div>
    `;
  });

  html += '</div>';
  return html;
}

// ============================================================
//  ПОКАЗ СТРАНИЦ (СОГЛАШЕНИЕ, ПОЛИТИКА)
// ============================================================

function showPage(type) {
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.filters-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  let content = document.getElementById('pageContent');
  if (!content) {
    content = document.createElement('div');
    content.id = 'pageContent';
    content.className = 'page-content';
    document.querySelector('.main .container').appendChild(content);
  }

  content.className = 'page-content active';

  if (type === 'terms') {
    content.innerHTML = getTermsPage();
    document.title = 'Пользовательское соглашение — CupPrognoze';
  } else if (type === 'privacy') {
    content.innerHTML = getPrivacyPage();
    document.title = 'Политика конфиденциальности — CupPrognoze';
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePage() {
  const content = document.getElementById('pageContent');
  if (content) {
    content.className = 'page-content';
    content.innerHTML = '';
  }
  const sourcesTab = document.querySelector('.nav-link[data-tab="sources"]');
  if (sourcesTab) sourcesTab.click();
  document.title = 'CupPrognoze — Прогнозы на спорт';
}

function getTermsPage() {
  return `
    <button class="back-btn" onclick="closePage()">← Назад</button>
    <h1>📜 Пользовательское соглашение</h1>

    <p><strong>1. Общие положения</strong></p>
    <p>Настоящее Пользовательское соглашение регулирует отношения между администрацией сайта CupPrognoze и пользователем сайта.</p>
    <p>Используя сайт CupPrognoze, Пользователь подтверждает, что ознакомился с условиями настоящего Соглашения и принимает их в полном объёме.</p>

    <p><strong>2. Предмет Соглашения</strong></p>
    <p>Сайт CupPrognoze предоставляет Пользователю доступ к информации о прогнозах на спортивные события, рейтингам букмекерских контор, капперам и другим материалам, связанным со ставками на спорт.</p>
    <p>Вся информация на сайте носит исключительно информационный характер и не является гарантией получения дохода.</p>

    <p><strong>3. Права и обязанности Пользователя</strong></p>
    <ul>
      <li>Пользователь обязуется использовать сайт только в законных целях.</li>
      <li>Пользователь несёт полную ответственность за свои действия, связанные с использованием информации с сайта.</li>
      <li>Пользователь не имеет права копировать, распространять или использовать контент сайта в коммерческих целях без согласия Администрации.</li>
    </ul>

    <p><strong>4. Ответственность</strong></p>
    <p>Администрация сайта не несёт ответственности за любые убытки, включая финансовые, возникшие в результате использования информации, опубликованной на сайте.</p>
    <p>Администрация не гарантирует точность, полноту и актуальность информации, размещённой на сайте.</p>

    <p><strong>5. Изменение условий</strong></p>
    <p>Администрация оставляет за собой право вносить изменения в настоящее Соглашение без предварительного уведомления Пользователя.</p>

    <p><strong>6. Заключительные положения</strong></p>
    <p>Настоящее Соглашение вступает в силу с момента начала использования сайта Пользователем.</p>
    <p>Все споры и разногласия решаются в соответствии с законодательством Российской Федерации.</p>

    <p style="color:#6b7280; font-size:13px; margin-top:30px;">Последнее обновление: 21 июня 2026 года</p>

    <button class="back-btn" onclick="closePage()">← Назад</button>
  `;
}

function getPrivacyPage() {
  return `
    <button class="back-btn" onclick="closePage()">← Назад</button>
    <h1>🔒 Политика конфиденциальности</h1>

    <p><strong>1. Общие положения</strong></p>
    <p>Настоящая Политика конфиденциальности описывает, как сайт CupPrognoze собирает, использует и защищает информацию о Пользователях.</p>
    <p>Используя Сайт, Пользователь даёт своё согласие на обработку своих данных в соответствии с настоящей Политикой.</p>

    <p><strong>2. Какие данные мы собираем</strong></p>
    <ul>
      <li>Имя пользователя (при регистрации или обращении).</li>
      <li>Контактные данные (email, Telegram) при обращении в поддержку.</li>
      <li>Технические данные: IP-адрес, тип браузера, устройство, время посещения.</li>
      <li>Cookies — для улучшения работы сайта.</li>
    </ul>

    <p><strong>3. Как мы используем данные</strong></p>
    <ul>
      <li>Для обеспечения работы сайта и улучшения пользовательского опыта.</li>
      <li>Для анализа посещаемости сайта.</li>
      <li>Для обратной связи с Пользователями.</li>
    </ul>

    <p><strong>4. Передача данных третьим лицам</strong></p>
    <p>Сайт не передаёт личные данные Пользователей третьим лицам, за исключением случаев, предусмотренных законодательством.</p>

    <p><strong>5. Cookies</strong></p>
    <p>Сайт использует cookies для хранения настроек пользователя и улучшения работы. Пользователь может отключить cookies в настройках браузера.</p>

    <p><strong>6. Защита данных</strong></p>
    <p>Администрация принимает необходимые меры для защиты данных от несанкционированного доступа, изменения и уничтожения.</p>

    <p><strong>7. Права Пользователя</strong></p>
    <ul>
      <li>Запросить информацию о своих данных, хранящихся на сайте.</li>
      <li>Требовать удаления или исправления своих данных.</li>
      <li>Отказаться от получения рекламных материалов в любой момент.</li>
    </ul>

    <p><strong>8. Контакты</strong></p>
    <p>По всем вопросам, связанным с Политикой конфиденциальности, вы можете обратиться через Telegram: <a href="https://t.me/cup_prognoze_all" style="color:#a78bfa;">@cup_prognoze_all</a></p>

    <p style="color:#6b7280; font-size:13px; margin-top:30px;">Последнее обновление: 21 июня 2026 года</p>

    <button class="back-btn" onclick="closePage()">← Назад</button>
  `;
}

// ============================================================
//  НАВИГАЦИЯ И ПЕРЕКЛЮЧЕНИЕ ВКЛАДОК
// ============================================================

function initTabs() {
  const navLinks = document.querySelectorAll('.nav-link');
  if (!navLinks.length) return;

  const tabs = {
    sources: document.getElementById('sourcesContent'),
    forecasts: document.getElementById('forecastsContent'),
    rating: document.getElementById('ratingContent'),
    cappers: document.getElementById('cappersContent'),
    articles: document.getElementById('articlesContent'),
    shares: document.getElementById('sharesContent'),
    reviews: document.getElementById('reviewsContent')
  };

  const filtersSection = document.getElementById('filtersSection');

  function showTab(tabName) {
    Object.values(tabs).forEach(el => {
      if (el) el.style.display = 'none';
    });

    if (tabs[tabName]) {
      tabs[tabName].style.display = 'block';
    }

    if (filtersSection) {
      filtersSection.style.display = tabName === 'sources' ? 'block' : 'none';
    }

    switch (tabName) {
      case 'sources':
        renderChannels('all');
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        const allBtn = document.querySelector('.filter-btn[data-filter="all"]');
        if (allBtn) allBtn.classList.add('active');
        break;
      case 'forecasts':
        loadForecasts();
        setTimeout(() => {
          initForecastFilters();
        }, 200);
        break;
      case 'rating':
        renderBookmakers();
        break;
      case 'cappers':
        renderCappers();
        break;
      case 'articles':
        renderArticles();
        break;
      case 'shares':
        renderShares();
        break;
      case 'reviews':
        renderReviews();
        break;
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      const tabName = link.dataset.tab;
      showTab(tabName);
    });
  });

  showTab('sources');
}

// ============================================================
//  ФИЛЬТРЫ ДЛЯ КАНАЛОВ
// ============================================================

function initFilters() {
  const filterContainer = document.getElementById('filterTabs');
  if (!filterContainer) return;

  filterContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filterValue = btn.dataset.filter;
    renderChannels(filterValue);
  });
}

// ============================================================
//  ЛОГОТИП (ВОЗВРАТ НА ГЛАВНУЮ)
// ============================================================

function initLogo() {
  const logo = document.getElementById('logoLink');
  if (!logo) return;

  logo.addEventListener('click', (e) => {
    e.preventDefault();
    const sourcesTab = document.querySelector('.nav-link[data-tab="sources"]');
    if (sourcesTab) {
      sourcesTab.click();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ============================================================
//  МОБИЛЬНОЕ МЕНЮ
// ============================================================

function initBurger() {
  const burger = document.getElementById('burgerBtn');
  const nav = document.querySelector('.nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// ============================================================
//  ЗАПУСК ПРИ ЗАГРУЗКЕ СТРАНИЦЫ
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initFilters();
  initTabs();
  initLogo();
  initBurger();
});
