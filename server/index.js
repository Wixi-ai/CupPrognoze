const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const CHANNEL_ID = '@cup_prognoze_test';

console.log('🚀 Запуск парсера CupPrognoze (WEBHOOK)');
console.log('📡 Токен:', TOKEN ? 'НАЙДЕН' : 'НЕ НАЙДЕН!');
console.log('📡 Канал:', CHANNEL_ID);

if (!TOKEN) {
    console.error('❌ Токен не найден!');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

// ========== ПАМЯТЬ ==========
let forecasts = [];
const FORECASTS_FILE = path.join(__dirname, 'forecasts.json');

function readForecasts() {
    return forecasts;
}

function saveForecasts(data) {
    forecasts = data;
    console.log('💾 Сохранено прогнозов:', data.length);
    try {
        fs.writeFileSync(FORECASTS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) { }
    return true;
}

function addForecast(forecast) {
    const exists = forecasts.some(f => f.id === forecast.id);
    if (exists) return false;
    forecasts.push(forecast);
    forecasts.sort((a, b) => {
        if (!a.matchTimeRaw) return 1;
        if (!b.matchTimeRaw) return -1;
        return a.matchTimeRaw.localeCompare(b.matchTimeRaw);
    });
    if (forecasts.length > 20) {
        forecasts = forecasts.slice(0, 20);
    }
    saveForecasts(forecasts);
    return true;
}

// ========== ГЕНЕРАТОР ==========
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFloat(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)); }

function randomDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() + daysOffset);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(randomInt(12, 23)).padStart(2, '0');
    const minutes = String(randomInt(0, 59)).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function randomPastDate(daysOffset) {
    const d = new Date();
    d.setDate(d.getDate() - daysOffset);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(randomInt(12, 23)).padStart(2, '0');
    const minutes = String(randomInt(0, 59)).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

const MATCHES = [
    { home: 'Ливерпуль', away: 'Манчестер Сити', league: 'АПЛ', sport: 'football' },
    { home: 'Арсенал', away: 'Челси', league: 'АПЛ', sport: 'football' },
    { home: 'Реал Мадрид', away: 'Барселона', league: 'Ла Лига', sport: 'football' },
    { home: 'Атлетико', away: 'Реал Сосьедад', league: 'Ла Лига', sport: 'football' },
    { home: 'Бавария', away: 'Боруссия Дортмунд', league: 'Бундеслига', sport: 'football' },
    { home: 'Милан', away: 'Интер', league: 'Серия А', sport: 'football' },
    { home: 'Ювентус', away: 'Наполи', league: 'Серия А', sport: 'football' },
    { home: 'ПСЖ', away: 'Марсель', league: 'Лига 1', sport: 'football' },
    { home: 'Зенит', away: 'Спартак', league: 'РПЛ', sport: 'football' },
    { home: 'Динамо', away: 'ЦСКА', league: 'РПЛ', sport: 'football' },
    { home: 'Карлос Алькарас', away: 'Новак Джокович', league: 'Уимблдон', sport: 'tennis' },
    { home: 'Даниил Медведев', away: 'Янник Синнер', league: 'US Open', sport: 'tennis' },
    { home: 'FaZe Clan', away: 'Team Vitality', league: 'IEM Rio', sport: 'cybersport' },
    { home: 'NAVI', away: 'G2 Esports', league: 'BLAST Premier', sport: 'cybersport' },
    { home: 'Бостон Селтикс', away: 'Даллас Маверикс', league: 'НБА', sport: 'basketball' },
    { home: 'Эдмонтон Ойлерз', away: 'Флорида Пантерз', league: 'НХЛ', sport: 'hockey' },
];

// ========== ГЕНЕРАЦИЯ ИСТОРИИ ==========
function generateHeadToHead(homeTeam, awayTeam, count = 4) {
    const history = [];
    const tournaments = ['Лига Чемпионов', 'Кубок страны', 'Чемпионат', 'Товарищеский матч', 'Суперкубок'];
    const homeAdvantage = Math.random() > 0.5;

    for (let i = 0; i < count; i++) {
        const daysAgo = randomInt(30, 365);
        let homeScore, awayScore;

        if (homeAdvantage && Math.random() > 0.3) {
            homeScore = randomInt(1, 4);
            awayScore = randomInt(0, 2);
        } else if (!homeAdvantage && Math.random() > 0.3) {
            homeScore = randomInt(0, 2);
            awayScore = randomInt(1, 4);
        } else {
            homeScore = randomInt(0, 2);
            awayScore = randomInt(0, 2);
        }

        if (Math.random() > 0.7) {
            homeScore = randomInt(1, 2);
            awayScore = homeScore;
        }

        history.push({
            home: homeTeam,
            away: awayTeam,
            score: `${homeScore}-${awayScore}`,
            date: randomPastDate(daysAgo + i * 7),
            tournament: random(tournaments)
        });
    }

    history.sort((a, b) => {
        const dateA = a.date.split(' ')[0].split('.').reverse().join('');
        const dateB = b.date.split(' ')[0].split('.').reverse().join('');
        return dateB.localeCompare(dateA);
    });

    return history;
}

// ========== ГЕНЕРАЦИЯ ПОСТА ==========
function generatePost() {
    const match = random(MATCHES);
    const attackHome = randomInt(45, 95);
    const attackAway = randomInt(40, 90);
    const defenseHome = randomInt(40, 90);
    const defenseAway = randomInt(40, 90);
    const formHome = randomInt(40, 95);
    const formAway = randomInt(40, 90);
    const goalsHome = randomInt(1, 5);
    const goalsAway = randomInt(0, 4);
    const goalsHomeAvg = randomFloat(1.2, 2.8);
    const goalsAwayAvg = randomFloat(1.0, 2.5);
    const concededHome = randomInt(0, 4);
    const concededAway = randomInt(0, 4);
    const concededHomeAvg = randomFloat(0.5, 2.0);
    const concededAwayAvg = randomFloat(0.5, 2.0);
    const played = randomInt(3, 6);
    let wins, draws, losses;
    if (Math.random() > 0.5) {
        wins = randomInt(2, played - 1);
        draws = randomInt(0, played - wins - 1);
        losses = played - wins - draws;
    } else {
        wins = randomInt(0, played - 2);
        draws = randomInt(0, played - wins - 1);
        losses = played - wins - draws;
    }
    const daysOffset = randomInt(1, 10);
    const statuses = ['Скоро', 'Скоро', 'Скоро', 'Скоро'];
    const h2h = generateHeadToHead(match.home, match.away, 4);

    let post = `${match.home} - ${match.away}\n\n`;
    post += `🏆 Турнир: ${match.league}\n\n`;
    post += `Атака: ${match.home} ${attackHome}, ${match.away} ${attackAway}\n`;
    post += `Защита: ${match.home} ${defenseHome}, ${match.away} ${defenseAway}\n`;
    post += `Форма: ${match.home} ${formHome}, ${match.away} ${formAway}\n`;
    post += `Голы: ${match.home} ${goalsHome} (${goalsHomeAvg}), ${match.away} ${goalsAway} (${goalsAwayAvg})\n`;
    post += `Пропущено: ${match.home} ${concededHome} (${concededHomeAvg}), ${match.away} ${concededAway} (${concededAwayAvg})\n\n`;
    post += `Сыграно: ${played}\n`;
    post += `В: ${wins}\n`;
    post += `Н: ${draws}\n`;
    post += `П: ${losses}\n\n`;
    post += `Источник: AI Predictor\n\n`;
    post += `СЧЕТ: ${goalsHome}-${goalsAway}\n\n`;
    post += `СТАТУС: ${random(statuses)}\n\n`;
    post += `⏰ ${randomDate(daysOffset)}`;

    return { post, h2h };
}

// ========== ГЕНЕРАЦИЯ И СОХРАНЕНИЕ ==========
async function generateAndSaveForecast() {
    const { post, h2h } = generatePost();
    const lines = post.split('\n');
    const title = lines[0] || 'Новый прогноз';

    const teams = extractTeams(post);
    const score = extractScore(post);
    const status = extractStatus(post);
    const tournament = extractTournament(post);
    const source = extractSource(post);
    const matchTime = extractMatchTime(post);
    const parsedStats = parseStats(post);

    const teamStatsDetailed = [];
    for (const [name, stats] of Object.entries(parsedStats.teams)) {
        teamStatsDetailed.push({ name, stats });
    }

    let sport = 'football';
    if (tournament) {
        if (tournament.includes('Уимблдон') || tournament.includes('US Open') || tournament.includes('Ролан Гаррос')) sport = 'tennis';
        else if (tournament.includes('IEM') || tournament.includes('BLAST') || tournament.includes('The International')) sport = 'cybersport';
        else if (tournament.includes('НБА')) sport = 'basketball';
        else if (tournament.includes('НХЛ')) sport = 'hockey';
    }

    const id = `generated_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const forecast = {
        id: id,
        title: title,
        text: post,
        homeTeam: teams ? teams.home : null,
        awayTeam: teams ? teams.away : null,
        homeScore: score ? score.home : null,
        awayScore: score ? score.away : null,
        status: status || 'Скоро',
        tournament: tournament || null,
        source: source || 'AI Predictor',
        matchTime: matchTime || 'Время не указано',
        matchTimeRaw: matchTime,
        date: new Date().toISOString(),
        dateDisplay: new Date().toLocaleString('ru-RU'),
        channel: 'AI Predictor',
        sport: sport,
        link: '#',
        teamStatsDetailed: teamStatsDetailed.length > 0 ? teamStatsDetailed : null,
        leagueStats: Object.keys(parsedStats.league).length > 0 ? parsedStats.league : null,
        headToHead: h2h
    };

    addForecast(forecast);
    console.log(`💾 СОХРАНЕНО: ${forecast.title}`);
    console.log(`   📊 История встреч: ${h2h.length} матчей`);

    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: post,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();
        if (data.ok) {
            console.log('✅ Авто-пост создан!');
            console.log(`📝 ${title}`);
            return true;
        } else {
            console.error('❌ Ошибка авто-поста:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        return false;
    }
}

// ========== ИЗВЛЕЧЕНИЕ ДАННЫХ ==========
function extractTeams(text) {
    if (!text) return null;
    const match = text.match(/([А-Яа-яA-Za-z\s]+)\s*[-–—]\s*([А-Яа-яA-Za-z\s]+)/);
    if (match && match[1] && match[2]) {
        return { home: match[1].trim(), away: match[2].trim() };
    }
    return null;
}

function extractScore(text) {
    if (!text) return null;
    const match = text.match(/(\d+)\s*[-–—:]\s*(\d+)/);
    if (match) {
        return { home: parseInt(match[1]), away: parseInt(match[2]) };
    }
    return null;
}

function extractStatus(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('завершен') || lower.includes('finished')) return 'Завершен';
    if (lower.includes('идет') || lower.includes('live')) return 'Идет';
    if (lower.includes('скоро')) return 'Скоро';
    return null;
}

function extractTournament(text) {
    if (!text) return null;
    const match = text.match(/🏆\s*([^\n]+)/);
    if (match) return match[1].trim();
    return null;
}

function extractSource(text) {
    if (!text) return null;
    const match = text.match(/источник[:.]?\s*([^\n]+)/i);
    if (match) return match[1].trim();
    return null;
}

function extractMatchTime(text) {
    if (!text) return null;
    const match = text.match(/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})/);
    if (match) return `${match[1]} ${match[2]}`;
    return null;
}

function parseStats(text) {
    if (!text) return { teams: {}, league: {} };
    const lines = text.split('\n');
    const result = { teams: {}, league: {} };
    for (const line of lines) {
        const trimmed = line.trim();
        let match = trimmed.match(/(Атака|Защита|Форма)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)/i);
        if (match) {
            const statType = match[1];
            const team1 = match[2].trim();
            const val1 = parseInt(match[3]);
            const team2 = match[4].trim();
            const val2 = parseInt(match[5]);
            if (!result.teams[team1]) result.teams[team1] = {};
            if (!result.teams[team2]) result.teams[team2] = {};
            result.teams[team1][statType] = val1;
            result.teams[team2][statType] = val2;
            continue;
        }
        match = trimmed.match(/(Голы)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)/i);
        if (match) {
            const team1 = match[2].trim();
            const val1 = parseInt(match[3]);
            const avg1 = parseFloat(match[4]);
            const team2 = match[5].trim();
            const val2 = parseInt(match[6]);
            const avg2 = parseFloat(match[7]);
            if (!result.teams[team1]) result.teams[team1] = {};
            if (!result.teams[team2]) result.teams[team2] = {};
            result.teams[team1]['Голы'] = `${val1} (${avg1})`;
            result.teams[team2]['Голы'] = `${val2} (${avg2})`;
            continue;
        }
        match = trimmed.match(/(Пропущено)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)/i);
        if (match) {
            const team1 = match[2].trim();
            const val1 = parseInt(match[3]);
            const avg1 = parseFloat(match[4]);
            const team2 = match[5].trim();
            const val2 = parseInt(match[6]);
            const avg2 = parseFloat(match[7]);
            if (!result.teams[team1]) result.teams[team1] = {};
            if (!result.teams[team2]) result.teams[team2] = {};
            result.teams[team1]['Пропущено'] = `${val1} (${avg1})`;
            result.teams[team2]['Пропущено'] = `${val2} (${avg2})`;
            continue;
        }
        match = trimmed.match(/Сыграно[:.]?\s*(\d+)/i);
        if (match) {
            result.league.сыграно = parseInt(match[1]);
            continue;
        }
        match = trimmed.match(/[ВВ][:.]?\s*(\d+)/i);
        if (match) {
            result.league.в = parseInt(match[1]);
            continue;
        }
        match = trimmed.match(/[НН][:.]?\s*(\d+)/i);
        if (match) {
            result.league.н = parseInt(match[1]);
            continue;
        }
        match = trimmed.match(/[ПП][:.]?\s*(\d+)/i);
        if (match) {
            result.league.п = parseInt(match[1]);
            continue;
        }
    }
    return result;
}

// ========== ВЕБХУК ==========
app.post(`/webhook/${TOKEN}`, (req, res) => {
    console.log('📩 Получен вебхук!');
    const update = req.body;

    if (update.channel_post) {
        const post = update.channel_post;
        const channel = post.chat;
        const text = post.text || '';
        console.log(`📝 Новый пост из канала: ${channel.title} (@${channel.username})`);

        const teams = extractTeams(text);
        const score = extractScore(text);
        const status = extractStatus(text);
        const tournament = extractTournament(text);
        const source = extractSource(text);
        const matchTime = extractMatchTime(text);
        const parsedStats = parseStats(text);
        const title = text.split('\n')[0].substring(0, 80) || 'Новый прогноз';

        let currentForecasts = readForecasts();
        const exists = currentForecasts.some(f => f.id === `${channel.id}_${post.message_id}`);

        if (!exists) {
            const teamStatsDetailed = [];
            for (const [name, stats] of Object.entries(parsedStats.teams)) {
                teamStatsDetailed.push({ name, stats });
            }

            let sport = 'football';
            if (tournament) {
                if (tournament.includes('Уимблдон') || tournament.includes('US Open') || tournament.includes('Ролан Гаррос')) sport = 'tennis';
                else if (tournament.includes('IEM') || tournament.includes('BLAST') || tournament.includes('The International')) sport = 'cybersport';
                else if (tournament.includes('НБА')) sport = 'basketball';
                else if (tournament.includes('НХЛ')) sport = 'hockey';
            }

            const forecast = {
                id: `${channel.id}_${post.message_id}`,
                title: title,
                text: text,
                homeTeam: teams ? teams.home : null,
                awayTeam: teams ? teams.away : null,
                homeScore: score ? score.home : null,
                awayScore: score ? score.away : null,
                status: status || 'Скоро',
                tournament: tournament || null,
                source: source || channel.title || null,
                matchTime: matchTime || 'Время не указано',
                matchTimeRaw: matchTime,
                date: new Date(post.date * 1000).toISOString(),
                dateDisplay: new Date(post.date * 1000).toLocaleString('ru-RU'),
                channel: channel.title || channel.username,
                sport: sport,
                link: `https://t.me/${channel.username}/${post.message_id}`,
                teamStatsDetailed: teamStatsDetailed.length > 0 ? teamStatsDetailed : null,
                leagueStats: Object.keys(parsedStats.league).length > 0 ? parsedStats.league : null,
                headToHead: null
            };

            currentForecasts.push(forecast);
            currentForecasts.sort((a, b) => {
                if (!a.matchTimeRaw) return 1;
                if (!b.matchTimeRaw) return -1;
                return a.matchTimeRaw.localeCompare(b.matchTimeRaw);
            });
            if (currentForecasts.length > 20) {
                currentForecasts = currentForecasts.slice(0, 20);
            }
            saveForecasts(currentForecasts);

            console.log(`✅ СОХРАНЕНО: ${forecast.title}`);
        } else {
            console.log(`⏩ Пост уже есть`);
        }
    } else {
        console.log('⚠️ Не channel_post, игнорирую');
    }

    res.sendStatus(200);
});

// ========== API ==========
app.get('/api/forecasts', (req, res) => {
    const data = readForecasts();
    const limit = parseInt(req.query.limit) || 50;
    const result = data.slice(0, limit);
    res.json({ success: true, count: result.length, total: data.length, data: result });
});

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Сервер работает!' });
});

// ========== ПРОВЕРКА КОЛИЧЕСТВА ==========
async function ensureMinimumForecasts() {
    const data = readForecasts();
    console.log(`📊 Текущее количество прогнозов: ${data.length}`);
    if (data.length < 15) {
        console.log(`⚠️ Мало прогнозов (${data.length}), создаю новые...`);
        const needed = 15 - data.length;
        let created = 0;
        for (let i = 0; i < needed; i++) {
            const success = await generateAndSaveForecast();
            if (success) created++;
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        console.log(`✅ Создано ${created} новых прогнозов`);
    } else {
        console.log(`✅ Прогнозов достаточно (${data.length}/15)`);
    }
}

// ========== ЗАПУСК ==========
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Открой: http://localhost:${PORT}/api/test`);
    console.log(`📡 Вебхук путь: /webhook/${TOKEN}`);
    console.log('🤖 Авто-генератор: будет создавать посты каждые 30 минут');
    console.log('📊 Минимальное количество прогнозов: 15');
});

setTimeout(async () => {
    console.log('🔄 Проверяю количество прогнозов...');
    await ensureMinimumForecasts();
}, 5000);

setInterval(async () => {
    await generateAndSaveForecast();
    setTimeout(async () => {
        await ensureMinimumForecasts();
    }, 3000);
}, 30 * 60 * 1000);

console.log('✅ Парсер готов к работе!');
