/**
 * ============================================================
 *  CupPrognoze - Основной скрипт
 *  Содержит все данные и логику для всех вкладок
 * ============================================================
 */

// ============================================================
//  НАСТРОЙКА API (ДЛЯ РАБОТЫ С RENDER)
// ============================================================
const API_URL = 'https://cupprognoze.onrender.com/api';

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
    subscribers: '12.5K',
    price: 'Бесплатно'
  },
  {
    id: 2,
    name: 'Tennis Ace Insider',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Аналитика и прогнозы на ATP и WTA. Точные ставки на тоталы и форы.',
    sport: 'tennis',
    rating: 4.6,
    subscribers: '8.2K',
    price: 'Premium'
  },
  {
    id: 3,
    name: 'Cyber Strike',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Прогнозы на CS2, Dota 2, Valorant. Экспресс-ставки и лайв-советы.',
    sport: 'cybersport',
    rating: 4.9,
    subscribers: '23.7K',
    price: 'Бесплатно'
  },
  {
    id: 4,
    name: 'Table Tennis Daily',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Настольный теннис: прогнозы на все турниры ITTF. Высокая точность.',
    sport: 'tabletennis',
    rating: 4.3,
    subscribers: '5.1K',
    price: 'Бесплатно'
  },
  {
    id: 5,
    name: 'Basketball Master',
    link: 'https://t.me/cup_prognoze_all',
    description: 'НБА, Евролига, Китай. Ставки на тоталы и форы с детальной статистикой.',
    sport: 'basketball',
    rating: 4.7,
    subscribers: '9.8K',
    price: 'Premium'
  },
  {
    id: 6,
    name: 'Hockey Pucks',
    link: 'https://t.me/cup_prognoze_all',
    description: 'КХЛ, НХЛ. Прогнозы на матчи дня, анализ вратарей и спецбригад.',
    sport: 'hockey',
    rating: 4.4,
    subscribers: '6.3K',
    price: 'Бесплатно'
  },
  {
    id: 7,
    name: 'Volley Pro',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Волейбольные прогнозы: мужские и женские лиги, плей-офф.',
    sport: 'volleyball',
    rating: 4.2,
    subscribers: '3.9K',
    price: 'Бесплатно'
  },
  {
    id: 8,
    name: 'Footy Analytics',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Углубленный анализ футбольных матчей. Эксклюзивные инсайды.',
    sport: 'football',
    rating: 4.9,
    subscribers: '18.3K',
    price: 'Premium'
  },
  {
    id: 9,
    name: 'Tennis Betting Edge',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Профессиональные прогнозы на теннис. Стратегии на геймы и сеты.',
    sport: 'tennis',
    rating: 4.5,
    subscribers: '7.4K',
    price: 'Бесплатно'
  },
  {
    id: 10,
    name: 'Cyber Odds',
    link: 'https://t.me/cup_prognoze_all',
    description: 'Киберспорт: аналитика коэффициентов, прогнозы на андердогов.',
    sport: 'cybersport',
    rating: 4.1,
    subscribers: '4.2K',
    price: 'Бесплатно'
  }
];

// ============================================================
//  2. БУКМЕКЕРЫ (РЕЙТИНГ) — ССЫЛКИ НЕ МЕНЯЕМ
// ============================================================
const bookmakers = [
  {
    id: 1,
    name: 'BetWinner',
    description: 'Один из лучших букмекеров с широкой росписью на спортивные события. Быстрые выплаты и отличный бонус за регистрацию.',
    rating: 4.9,
    bonus: 'Бонус до 25 000 ₽',
    features: ['📱 Мобильное приложение', '💳 Моментальный вывод', '🎯 Широкая роспись'],
    link: 'https://ref.betwinner.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-1'
  },
  {
    id: 2,
    name: '1xBet',
    description: 'Международный бренд с огромным выбором видов спорта и тысячью событий ежедневно. Лучшие коэффициенты на топ-матчи.',
    rating: 4.7,
    bonus: 'Бонус до 100 000 ₽',
    features: ['🌍 Мировые лиги', '📺 Лайв-трансляции', '🎰 Казино в подарок'],
    link: 'https://ref.1xbet.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-2'
  },
  {
    id: 3,
    name: 'Parimatch',
    description: 'Надежный букмекер с отличной репутацией. Высокие коэффициенты на футбол и киберспорт. Удобный интерфейс.',
    rating: 4.8,
    bonus: 'Бонус до 10 000 ₽',
    features: ['⚡ Быстрая регистрация', '🔒 Надежность', '📊 Аналитика матчей'],
    link: 'https://ref.parimatch.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-3'
  },
  {
    id: 4,
    name: 'WinLine',
    description: 'Отечественный букмекер с приятными бонусами и кэшбэком. Отличная поддержка русскоязычных игроков.',
    rating: 4.5,
    bonus: 'Кэшбэк до 10%',
    features: ['🇷🇺 Русский язык', '💳 Быстрый вывод', '🎁 Еженедельные акции'],
    link: 'https://ref.winline.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-4'
  },
  {
    id: 5,
    name: 'Mostbet',
    description: 'Популярный букмекер с низкой маржой и отличным выбором ставок. Особенно хорош для ставок на теннис и киберспорт.',
    rating: 4.6,
    bonus: 'Бонус до 35 000 ₽',
    features: ['🎾 Большой выбор спорта', '📱 App', '💰 Низкая маржа'],
    link: 'https://ref.mostbet.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-5'
  },
  {
    id: 6,
    name: 'Leon',
    description: 'Букмекер с приятным дизайном и отличной поддержкой. Часто дает фрибеты активным игрокам.',
    rating: 4.4,
    bonus: 'Фрибет до 5 000 ₽',
    features: ['🎨 Стильный дизайн', '📞 Круглосуточная поддержка', '🎁 Фрибеты'],
    link: 'https://ref.leon.com/your_ref_link_here',
    logo: '',
    logoColor: 'color-6'
  }
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
//  4. СТАТЬИ (С ИЗОБРАЖЕНИЯМИ)
// ============================================================
const articles = [
  {
    id: 1,
    title: 'Как анализировать футбольные матчи: полное руководство',
    excerpt: 'Узнайте, как профессиональные капперы анализируют матчи, на что обращают внимание и как находить валуйные ставки.',
    image: 'images/articles/football-guide.jpg',
    date: '15 июня 2026',
    readTime: '12 мин',
    link: '#'
  },
  {
    id: 2,
    title: 'Топ-5 стратегий ставок на теннис в 2026 году',
    excerpt: 'Разбираем самые эффективные стратегии для ставок на теннис. От классических флэтов до современных систем.',
    image: 'images/articles/tennis-strategy.jpg',
    date: '12 июня 2026',
    readTime: '8 мин',
    link: '#'
  },
  {
    id: 3,
    title: 'Киберспорт: как зарабатывать на CS2 и Dota 2',
    excerpt: 'Полный гайд по ставкам на киберспорт. Анализ команд, мета-игры и психология игроков.',
    image: 'images/articles/cybersport-guide.jpg',
    date: '10 июня 2026',
    readTime: '15 мин',
    link: '#'
  },
  {
    id: 4,
    title: 'Психология ставок: как не проигрывать эмоционально',
    excerpt: 'Важнейший аспект успешного беттинга — контроль эмоций. Узнайте, как сохранять холодный рассудок.',
    image: 'images/articles/betting-psychology.jpg',
    date: '8 июня 2026',
    readTime: '10 мин',
    link: '#'
  },
  {
    id: 5,
    title: 'Самые прибыльные турниры для ставок на хоккей',
    excerpt: 'Какие хоккейные турниры дают лучшую проходимость? Анализ статистики за последние годы.',
    image: 'images/articles/hockey-tournaments.jpg',
    date: '5 июня 2026',
    readTime: '7 мин',
    link: '#'
  },
  {
    id: 6,
    title: 'БК с лучшими коэффициентами: рейтинг 2026',
    excerpt: 'Сравнительный обзор букмекерских контор по коэффициентам на топ-события. Где выгоднее ставить?',
    image: 'images/articles/bookmaker-rating.jpg',
    date: '3 июня 2026',
    readTime: '9 мин',
    link: '#'
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
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: #6a5a5a; font-size: 18px;">
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
          <span class="card-badge">${ch.price}</span>
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
      `<img src="${bm.logo}" alt="${bm.name}">` :
      `<span class="logo-placeholder">${bm.name.charAt(0).toUpperCase()}</span>`;

    html += `
      <div class="bookmaker-card" data-id="${bm.id}">
        <div class="bookmaker-logo ${bm.logoColor || 'color-1'}">
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
        <div style="display:flex; gap:12px; flex-wrap:wrap; margin:6px 0 8px; font-size:13px; color:#8a7a7a;">
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
          <span style="color:#8a7a7a; font-size:13px;">Рейтинг</span>
          <span style="color:#ffb800; font-size:18px; font-weight:700;">${stars}</span>
        </div>
        <div style="font-size:13px; color:#8a7a7a; margin-bottom:8px; text-align:center;">${capper.description}</div>
        <a href="${capper.link}" target="_blank" class="capper-link">📲 Подписаться</a>
      </div>
    `;
  });

  grid.innerHTML = html;
}

function renderArticles() {
  const grid = document.getElementById('articlesGrid');
  if (!grid) return;

  let html = '';
  articles.forEach(article => {
    // Если есть изображение — показываем его, иначе — иконку
    const imageHtml = article.image
      ? `<img src="${article.image}" alt="${article.title}" class="article-img">`
      : `<div class="article-image">${article.icon || '📰'}</div>`;

    html += `
      <div class="article-card">
        <div class="article-image-wrapper">
          ${imageHtml}
        </div>
        <div class="article-content">
          <div class="article-title">${article.title}</div>
          <div class="article-excerpt">${article.excerpt}</div>
          <div class="article-meta">
            <span>📅 ${article.date}</span>
            <span>⏱️ ${article.readTime}</span>
            <a href="${article.link}" class="article-read-link">Читать →</a>
          </div>
        </div>
      </div>
    `;
  });

  grid.innerHTML = html;
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
//  ПРОГНОЗЫ (РЕАЛЬНЫЙ API)
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

  fetch(`${API_URL}/forecasts?limit=50`)
    .then(response => {
      if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
      return response.json();
    })
    .then(data => {
      if (data.success && data.data && data.data.length > 0) {
        container.innerHTML = renderForecastCards(data.data);
      } else {
        container.innerHTML = `
          <div style="text-align: center; padding: 40px 20px; color: #6a5a5a; background: #161010; border-radius: 16px; border: 1px solid #2a1818;">
            <div style="font-size: 48px; margin-bottom: 20px;">📭</div>
            <h3 style="color: #f0e0e0; margin-bottom: 10px;">Пока нет прогнозов</h3>
            <p style="font-size: 16px; color: #8a7a7a;">Подпишись на каналы, чтобы видеть прогнозы здесь!</p>
          </div>
        `;
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки прогнозов:', error);
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #ff4444; background: #161010; border-radius: 16px; border: 1px solid #2a1818;">
          <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
          <h3 style="color: #f0e0e0; margin-bottom: 10px;">Ошибка загрузки</h3>
          <p style="font-size: 14px; color: #8a7a7a;">Не удалось загрузить прогнозы. Проверь, что сервер запущен.</p>
          <p style="font-size: 12px; color: #6a5a5a; margin-top: 10px;">${error.message}</p>
        </div>
      `;
    });
}

// ============================================================
//  ОТРИСОВКА КАРТОЧЕК ПРОГНОЗОВ (ФУТБОЛЬНЫЙ СТИЛЬ)
// ============================================================

function renderForecastCards(forecasts) {
  if (!forecasts || forecasts.length === 0) return '';

  let html = '<div class="forecasts-grid">';

  forecasts.forEach(f => {
    const statusColors = {
      'Завершен': '#ff4444',
      'Идет': '#00ff88',
      'Скоро': '#ffd700',
      'Перерыв': '#ff6b6b'
    };
    const statusEmoji = {
      'Завершен': '⏹️',
      'Идет': '🔴',
      'Скоро': '⏳',
      'Перерыв': '⏸️'
    };

    const statusColor = statusColors[f.status] || '#6a5a5a';
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
// ============================================================
//  ПОКАЗ СТРАНИЦ (СОГЛАШЕНИЕ, ПОЛИТИКА)
// ============================================================

function showPage(type) {
  // Скрываем все основные секции
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.filters-section').forEach(el => el.style.display = 'none');

  // Убираем активные классы с навигации
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  // Показываем страницу
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

  // Прокрутка вверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePage() {
  const content = document.getElementById('pageContent');
  if (content) {
    content.className = 'page-content';
    content.innerHTML = '';
  }
  // Возвращаемся на главную
  const sourcesTab = document.querySelector('.nav-link[data-tab="sources"]');
  if (sourcesTab) sourcesTab.click();
  document.title = 'CupPrognoze — Прогнозы на спорт';
}

function getTermsPage() {
  return `
    <button class="back-btn" onclick="closePage()">← Назад</button>
    <h1>📜 Пользовательское соглашение</h1>

    <p><strong>1. Общие положения</strong></p>
    <p>Настоящее Пользовательское соглашение (далее — «Соглашение») регулирует отношения между администрацией сайта CupPrognoze (далее — «Администрация») и пользователем сайта (далее — «Пользователь»).</p>
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
    <p>Администрация оставляет за собой право вносить изменения в настоящее Соглашение без предварительного уведомления Пользователя. Актуальная версия Соглашения всегда доступна по этой ссылке.</p>

    <p><strong>6. Заключительные положения</strong></p>
    <p>Настоящее Соглашение вступает в силу с момента начала использования сайта Пользователем.</p>
    <p>Все споры и разногласия решаются в соответствии с законодательством Российской Федерации.</p>

    <p style="color:#6a5a5a; font-size:13px; margin-top:30px;">Последнее обновление: 18 июня 2026 года</p>

    <button class="back-btn" onclick="closePage()">← Назад</button>
  `;
}

function getPrivacyPage() {
  return `
    <button class="back-btn" onclick="closePage()">← Назад</button>
    <h1>🔒 Политика конфиденциальности</h1>

    <p><strong>1. Общие положения</strong></p>
    <p>Настоящая Политика конфиденциальности (далее — «Политика») описывает, как сайт CupPrognoze (далее — «Сайт») собирает, использует и защищает информацию о Пользователях.</p>
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
      <li>Для информирования о новых материалах (только с согласия Пользователя).</li>
    </ul>

    <p><strong>4. Передача данных третьим лицам</strong></p>
    <p>Сайт не передаёт личные данные Пользователей третьим лицам, за исключением случаев, предусмотренных законодательством Российской Федерации.</p>

    <p><strong>5. Cookies</strong></p>
    <p>Сайт использует cookies для хранения настроек пользователя и улучшения работы. Пользователь может отключить cookies в настройках браузера.</p>

    <p><strong>6. Ссылки на другие сайты</strong></p>
    <p>Сайт может содержать ссылки на сторонние ресурсы. Администрация не несёт ответственности за политику конфиденциальности этих ресурсов.</p>

    <p><strong>7. Защита данных</strong></p>
    <p>Администрация принимает необходимые меры для защиты данных от несанкционированного доступа, изменения и уничтожения.</p>

    <p><strong>8. Права Пользователя</strong></p>
    <ul>
      <li>Запросить информацию о своих данных, хранящихся на сайте.</li>
      <li>Требовать удаления или исправления своих данных.</li>
      <li>Отказаться от получения рекламных материалов в любой момент.</li>
    </ul>

    <p><strong>9. Контакты</strong></p>
    <p>По всем вопросам, связанным с Политикой конфиденциальности, вы можете обратиться через Telegram: <a href="https://t.me/cup_prognoze_all" style="color:#d42a2a;">@cup_prognoze_all</a></p>

    <p style="color:#6a5a5a; font-size:13px; margin-top:30px;">Последнее обновление: 18 июня 2026 года</p>

    <button class="back-btn" onclick="closePage()">← Назад</button>
  `;
}
// ============================================================
//  ДЕТАЛЬНАЯ СТРАНИЦА ПРОГНОЗА
// ============================================================

function openForecast(id) {
  // Показываем страницу прогноза
  const page = document.getElementById('forecastPage');
  if (!page) {
    // Если страницы нет — создаём
    createForecastPage();
  }

  // Скрываем все основные секции
  document.querySelectorAll('.tab-content').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.filters-section').forEach(el => el.style.display = 'none');
  document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));

  // Показываем страницу прогноза
  const forecastPage = document.getElementById('forecastPage');
  forecastPage.style.display = 'block';

  // Загружаем данные прогноза
  loadForecastDetails(id);

  // Прокрутка наверх
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function createForecastPage() {
  const container = document.querySelector('.main .container');

  const page = document.createElement('div');
  page.id = 'forecastPage';
  page.className = 'forecast-detail-page';
  page.style.display = 'none';

  page.innerHTML = `
        <div class="forecast-detail-content">
            <!-- Хлебные крошки -->
            <div class="breadcrumb">
                <a href="#" onclick="closeForecast()">← Назад к прогнозам</a>
                <span> / </span>
                <span id="breadcrumbMatch">Матч</span>
            </div>

            <!-- Карточка прогноза -->
            <div class="forecast-detail-card">
                <div class="detail-header">
                    <div class="detail-tournament" id="detailTournament">Чемпионат мира 2026</div>
                    <div class="detail-time" id="detailTime">00:59</div>
                </div>

                <div class="detail-teams">
                    <div class="detail-team home">
                        <span class="detail-team-name" id="detailHomeTeam">Шотландия</span>
                        <span class="detail-team-date" id="detailHomeDate">20 Июль, 2026г</span>
                    </div>
                    <div class="detail-score-wrapper">
                        <div class="detail-score" id="detailScore">0-1</div>
                        <div class="detail-status" id="detailStatus">Завершен</div>
                    </div>
                    <div class="detail-team away">
                        <span class="detail-team-name" id="detailAwayTeam">Марокко</span>
                        <span class="detail-team-date" id="detailAwayDate">00:00</span>
                    </div>
                </div>

                <div class="detail-title" id="detailTitle">
                    ШОТЛАНДИЯ МАРОККО ПРОГНОЗ И СТАВКА НА МАТЧ 20 ИЮНЯ 2026 ГОДА В 00:59
                </div>

                <div class="detail-meta">
                    <span>📅 Опубликовано: <span id="detailPublished">20 июня 2026, 01:12</span></span>
                    <span>🔄 Обновлено: <span id="detailUpdated">20 июня 2026, 01:12</span></span>
                </div>

                <div class="detail-actions">
                    <a href="#" class="detail-btn" id="detailStats">📊 Статистика</a>
                    <a href="#" class="detail-btn" id="detailOverview">📋 Обзор</a>
                </div>
            </div>
        </div>
    `;

  container.appendChild(page);
}

function loadForecastDetails(id) {
  // Загружаем прогнозы с API
  fetch(`${API_URL}/forecasts?limit=100`)
    .then(response => response.json())
    .then(data => {
      if (data.success && data.data) {
        const forecast = data.data.find(f => f.id === id);
        if (forecast) {
          renderForecastDetail(forecast);
        } else {
          document.getElementById('detailTitle').textContent = 'Прогноз не найден';
        }
      }
    })
    .catch(error => {
      console.error('Ошибка загрузки прогноза:', error);
    });
}

function renderForecastDetail(forecast) {
  document.getElementById('breadcrumbMatch').textContent = `${forecast.homeTeam || 'Команда 1'} — ${forecast.awayTeam || 'Команда 2'}`;
  document.getElementById('detailTournament').textContent = forecast.tournament || 'Футбол';
  document.getElementById('detailTime').textContent = forecast.matchTime || '00:00';
  document.getElementById('detailHomeTeam').textContent = forecast.homeTeam || 'Команда 1';
  document.getElementById('detailAwayTeam').textContent = forecast.awayTeam || 'Команда 2';
  document.getElementById('detailHomeDate').textContent = forecast.homeDate || '—';
  document.getElementById('detailAwayDate').textContent = forecast.awayDate || '—';

  // Счет
  let scoreDisplay = '—';
  if (forecast.homeScore !== null && forecast.homeScore !== undefined &&
    forecast.awayScore !== null && forecast.awayScore !== undefined) {
    scoreDisplay = `${forecast.homeScore}-${forecast.awayScore}`;
  }
  document.getElementById('detailScore').textContent = scoreDisplay;

  // Статус с цветом
  const statusEl = document.getElementById('detailStatus');
  const statusColors = {
    'Завершен': '#ff4444',
    'Идет': '#00ff88',
    'Скоро': '#ffd700',
    'Перерыв': '#ff6b6b'
  };
  statusEl.textContent = forecast.status || 'Скоро';
  statusEl.style.color = statusColors[forecast.status] || '#6a5a5a';

  // Заголовок
  const title = `${forecast.homeTeam || ''} ${forecast.awayTeam || ''} прогноз и ставка на матч ${forecast.matchTime || ''}`.trim();
  document.getElementById('detailTitle').textContent = title || 'Прогноз на матч';

  // Даты
  const now = new Date().toLocaleString('ru-RU');
  document.getElementById('detailPublished').textContent = forecast.dateDisplay || now;
  document.getElementById('detailUpdated').textContent = now;

  // Кнопки
  document.getElementById('detailStats').href = forecast.link || '#';
  document.getElementById('detailOverview').href = forecast.link || '#';
}

function closeForecast() {
  const page = document.getElementById('forecastPage');
  if (page) {
    page.style.display = 'none';
  }

  // Возвращаемся на вкладку прогнозов
  const forecastsTab = document.querySelector('.nav-link[data-tab="forecasts"]');
  if (forecastsTab) {
    forecastsTab.click();
  }

  document.title = 'CupPrognoze — Прогнозы на спорт';
}
