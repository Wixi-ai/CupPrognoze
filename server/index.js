const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const TOKEN = process.env.BOT_TOKEN;
const PORT = process.env.PORT || 3000;

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

// ========== ИЗВЛЕЧЕНИЕ КОМАНД ==========
function extractTeams(text) {
    if (!text) return null;
    const match = text.match(/([А-Яа-яA-Za-z\s]+)\s*[-–—]\s*([А-Яа-яA-Za-z\s]+)/);
    if (match && match[1] && match[2]) {
        return {
            home: match[1].trim(),
            away: match[2].trim()
        };
    }
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ СЧЕТА ==========
function extractScore(text) {
    if (!text) return null;
    const match = text.match(/(\d+)\s*[-–—:]\s*(\d+)/);
    if (match) {
        return {
            home: parseInt(match[1]),
            away: parseInt(match[2])
        };
    }
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ СТАТУСА ==========
function extractStatus(text) {
    if (!text) return null;
    const lower = text.toLowerCase();
    if (lower.includes('завершен') || lower.includes('finished')) return 'Завершен';
    if (lower.includes('идет') || lower.includes('live')) return 'Идет';
    if (lower.includes('скоро')) return 'Скоро';
    if (lower.includes('перерыв')) return 'Перерыв';
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ ТУРНИРА ==========
function extractTournament(text) {
    if (!text) return null;
    const match = text.match(/🏆\s*([^\n]+)/);
    if (match) return match[1].trim();
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ ИСТОЧНИКА ==========
function extractSource(text) {
    if (!text) return null;
    const match = text.match(/источник[:.]?\s*([^\n]+)/i);
    if (match) return match[1].trim();
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ ВРЕМЕНИ ==========
function extractMatchTime(text) {
    if (!text) return null;
    const match = text.match(/(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})/);
    if (match) return `${match[1]} ${match[2]}`;
    return null;
}

// ========== ГЛАВНАЯ ФУНКЦИЯ — ПАРСИНГ СТАТИСТИКИ ==========
function parseStats(text) {
    if (!text) return { teams: {}, league: {} };

    const lines = text.split('\n');
    const result = { teams: {}, league: {} };
    let currentTeam = null;

    for (const line of lines) {
        const trimmed = line.trim();

        // Ищем статистику команды: "Атака: Ливерпуль 63, Арсенал 1"
        let match = trimmed.match(/(Атака|Защита|Форма|Attack|Defense|Form)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)/i);
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

        // Ищем голы: "Голы: Ливерпуль 8 (1.6), Арсенал 15 (3.0)"
        match = trimmed.match(/(Голы|Goals)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)/i);
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

        // Ищем пропущенные: "Пропущено: Ливерпуль 6 (1.2), Арсенал 10 (2.0)"
        match = trimmed.match(/(Пропущено|Conceded)[:.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)[,.]?\s*([А-Яа-яA-Za-z\s]+)\s*(\d+)\s*\(([\d.]+)\)/i);
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

        // ===== ЛИГА — СЕЗОН =====
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
            // Формируем teamStatsDetailed для отображения
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
            console.log(`   ⚽ ${forecast.homeTeam || '?'} - ${forecast.awayTeam || '?'}`);
            console.log(`   🏆 ${forecast.tournament || '—'}`);
            console.log(`   📊 Счет: ${forecast.homeScore ?? '?'}-${forecast.awayScore ?? '?'}`);
            console.log(`   🔴 Статус: ${forecast.status}`);
            console.log(`   ⏰ Время: ${forecast.matchTime}`);
            if (forecast.teamStatsDetailed) {
                console.log(`   📊 Статистика: ${forecast.teamStatsDetailed.length} команд`);
            }
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
    res.json({ success: true, message: 'Сервер работает! С новым парсингом!' });
});

// ========== ЗАПУСК ==========
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Открой: http://localhost:${PORT}/api/test`);
    console.log(`📡 Вебхук путь: /webhook/${TOKEN}`);
});

console.log('✅ Парсер готов к работе!');
console.log('🗑️ Автоудаление: прогнозы удаляются через 5 часов после завершения матча');
console.log('📊 Новый парсинг статистики на русском!');
