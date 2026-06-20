const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;
const CHANNEL_ID = '@cup_prognoze_all';

console.log('🚀 Запуск парсера CupPrognoze (WEBHOOK)');
console.log('📡 Токен:', TOKEN ? 'НАЙДЕН' : 'НЕ НАЙДЕН!');

if (!TOKEN) {
    console.error('❌ Токен не найден!');
    process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

const FORECASTS_FILE = path.join(__dirname, 'forecasts.json');

function readForecasts() {
    try {
        if (fs.existsSync(FORECASTS_FILE)) {
            return JSON.parse(fs.readFileSync(FORECASTS_FILE, 'utf8'));
        }
        return [];
    } catch (error) {
        return [];
    }
}

function saveForecasts(data) {
    try {
        fs.writeFileSync(FORECASTS_FILE, JSON.stringify(data, null, 2));
        console.log('💾 Сохранено прогнозов:', data.length);
        return true;
    } catch (error) {
        console.error('❌ Ошибка сохранения:', error);
        return false;
    }
}

// ========== АВТОУДАЛЕНИЕ ==========
function autoDeleteOldForecasts() {
    const forecasts = readForecasts();
    const now = new Date();
    let deletedCount = 0;

    const filtered = forecasts.filter(f => {
        if (f.status !== 'Завершен') return true;
        if (!f.matchTimeRaw) return true;

        try {
            const parts = f.matchTimeRaw.match(/(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})/);
            if (!parts) return true;

            const matchDate = new Date(
                parseInt(parts[3]),
                parseInt(parts[2]) - 1,
                parseInt(parts[1]),
                parseInt(parts[4]),
                parseInt(parts[5])
            );

            const deleteAfter = new Date(matchDate.getTime() + 5 * 60 * 60 * 1000);

            if (now > deleteAfter) {
                console.log(`🗑️ Удален прогноз: ${f.title} (завершен ${f.matchTime})`);
                deletedCount++;
                return false;
            }
        } catch (e) {
            console.error('Ошибка парсинга даты:', e);
        }

        return true;
    });

    if (deletedCount > 0) {
        saveForecasts(filtered);
        console.log(`🗑️ Автоудаление: удалено ${deletedCount} прогнозов`);
    }

    return deletedCount;
}

// ========== ГЕНЕРАТОР ПОСТОВ ==========
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomFloat(min, max) { return parseFloat((Math.random() * (max - min) + min).toFixed(1)); }

function randomDate() {
    const d = new Date();
    d.setDate(d.getDate() + randomInt(1, 10));
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(randomInt(12, 23)).padStart(2, '0');
    const minutes = String(randomInt(0, 59)).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

function generatePost() {
    const MATCHES = [
        { home: 'Ливерпуль', away: 'Манчестер Сити', league: 'АПЛ' },
        { home: 'Арсенал', away: 'Челси', league: 'АПЛ' },
        { home: 'Манчестер Юнайтед', away: 'Тоттенхэм', league: 'АПЛ' },
        { home: 'Ньюкасл', away: 'Астон Вилла', league: 'АПЛ' },
        { home: 'Вест Хэм', away: 'Брайтон', league: 'АПЛ' },
        { home: 'Реал Мадрид', away: 'Барселона', league: 'Ла Лига' },
        { home: 'Атлетико', away: 'Реал Сосьедад', league: 'Ла Лига' },
        { home: 'Севилья', away: 'Вильярреал', league: 'Ла Лига' },
        { home: 'Милан', away: 'Интер', league: 'Серия А' },
        { home: 'Ювентус', away: 'Наполи', league: 'Серия А' },
        { home: 'Рома', away: 'Лацио', league: 'Серия А' },
        { home: 'Бавария', away: 'Боруссия Дортмунд', league: 'Бундеслига' },
        { home: 'РБ Лейпциг', away: 'Байер Леверкузен', league: 'Бундеслига' },
        { home: 'ПСЖ', away: 'Марсель', league: 'Лига 1' },
        { home: 'Зенит', away: 'Спартак', league: 'РПЛ' },
        { home: 'Динамо', away: 'ЦСКА', league: 'РПЛ' },
    ];

    const match = random(MATCHES);

    // Реалистичная статистика
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

    const statuses = ['Завершен', 'Завершен', 'Завершен', 'Завершен', 'Скоро'];
    const date = randomDate();

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
    post += `⏰ ${date}`;

    return post;
}

async function generateAndPost() {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`;
    const post = generatePost();

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
            console.log(`📝 ${post.split('\n')[0]}`);
        } else {
            console.error('❌ Ошибка авто-поста:', data);
        }
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
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

        let forecasts = readForecasts();
        const exists = forecasts.some(f => f.id === `${channel.id}_${post.message_id}`);
        if (!exists) {
            const teamStatsDetailed = [];
            for (const [name, stats] of Object.entries(parsedStats.teams)) {
                teamStatsDetailed.push({ name, stats });
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
                sport: 'football',
                link: `https://t.me/${channel.username}/${post.message_id}`,
                teamStatsDetailed: teamStatsDetailed.length > 0 ? teamStatsDetailed : null,
                leagueStats: Object.keys(parsedStats.league).length > 0 ? parsedStats.league : null
            };

            forecasts.push(forecast);
            forecasts.sort((a, b) => new Date(b.date) - new Date(a.date));
            if (forecasts.length > 500) forecasts = forecasts.slice(0, 500);
            saveForecasts(forecasts);

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
    autoDeleteOldForecasts();
    const forecasts = readForecasts();
    const limit = parseInt(req.query.limit) || 50;
    const result = forecasts.slice(0, limit);
    res.json({ success: true, count: result.length, total: forecasts.length, data: result });
});

app.get('/api/test', (req, res) => {
    res.json({ success: true, message: 'Сервер работает! С авто-генерацией!' });
});

// ========== ЗАПУСК ==========
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Открой: http://localhost:${PORT}/api/test`);
    console.log(`📡 Вебхук путь: /webhook/${TOKEN}`);
    console.log('🤖 Авто-генератор: будет создавать посты каждые 30 минут');
});

// ===== АВТО-ГЕНЕРАЦИЯ КАЖДЫЕ 30 МИНУТ =====
console.log('🤖 Первый пост будет через 5 секунд...');

setTimeout(async () => {
    await generateAndPost();
}, 5000);

setInterval(async () => {
    await generateAndPost();
}, 30 * 60 * 1000);

console.log('✅ Парсер готов к работе!');
console.log('🗑️ Автоудаление: прогнозы удаляются через 5 часов после завершения матча');
console.log('📊 Новый парсинг статистики на русском!');
