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
    const patterns = [
        /([А-Яа-яA-Za-z\s]+)\s*[-–—]\s*([А-Яа-яA-Za-z\s]+)/,
        /([А-Яа-яA-Za-z\s]+)\s+vs\s+([А-Яа-яA-Za-z\s]+)/i,
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match && match[1] && match[2]) {
            return {
                home: match[1].trim(),
                away: match[2].trim()
            };
        }
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
    const statuses = ['завершен', 'идет', 'скоро', 'live', 'finished', 'в перерыве'];
    const lower = text.toLowerCase();
    for (const status of statuses) {
        if (lower.includes(status)) {
            const map = {
                'завершен': 'Завершен',
                'finished': 'Завершен',
                'идет': 'Идет',
                'live': 'Идет',
                'скоро': 'Скоро',
                'в перерыве': 'Перерыв'
            };
            return map[status] || status;
        }
    }
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

// ========== ИЗВЛЕЧЕНИЕ СТАТИСТИКИ ==========
function extractStats(text) {
    if (!text) return null;
    const match = text.match(/[+-]?\d+\s*[-–—]\s*[+-]?\d+/);
    if (match) return match[0];
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ ВРЕМЕНИ ==========
function extractMatchTime(text) {
    if (!text) return null;
    const patterns = [
        /(\d{2}\.\d{2}\.\d{4})\s+(\d{2}:\d{2})/,
        /(\d{2}\/\d{2}\/\d{4})\s+(\d{2}:\d{2})/,
        /(\d{2}:\d{2})\s+(\d{2}\.\d{2}\.\d{4})/,
        /в\s+(\d{2}:\d{2})/i,
        /начало\s+(\d{2}:\d{2})/i,
    ];
    for (const pattern of patterns) {
        const match = text.match(pattern);
        if (match) {
            if (match.length >= 3) {
                let dateStr = match[1].replace(/\//g, '.').replace(/-/g, '.');
                let timeStr = match[2];
                if (dateStr.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
                    return `${dateStr} ${timeStr}`;
                }
            }
            if (match.length === 2 && match[1].match(/^\d{2}:\d{2}$/)) {
                const today = new Date();
                const dateStr = today.toLocaleDateString('ru-RU', {
                    day: '2-digit', month: '2-digit', year: 'numeric'
                });
                return `${dateStr} ${match[1]}`;
            }
        }
    }
    return null;
}

// ========== ИЗВЛЕЧЕНИЕ СТАТИСТИКИ КОМАНД ==========
function extractTeamStats(text) {
    if (!text) return null;

    const lines = text.split('\n');
    const stats = [];

    for (const line of lines) {
        let match = line.match(/([А-Яа-яA-Za-z\s]+)[:.]?\s*победы\s*(\d+)[,.]?\s*поражения\s*(\d+)/i);
        if (match) {
            stats.push({
                team: match[1].trim(),
                wins: parseInt(match[2]),
                losses: parseInt(match[3])
            });
            continue;
        }

        match = line.match(/([А-Яа-яA-Za-z\s]+)[:.]?\s*(\d+)\s*[-–—]\s*(\d+)/);
        if (match) {
            stats.push({
                team: match[1].trim(),
                wins: parseInt(match[2]),
                losses: parseInt(match[3])
            });
            continue;
        }
    }

    return stats.length > 0 ? stats : null;
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
        const stats = extractStats(text);
        const matchTime = extractMatchTime(text);
        const teamStats = extractTeamStats(text);

        const title = text.split('\n')[0].substring(0, 80) || 'Новый прогноз';

        let forecasts = readForecasts();
        const exists = forecasts.some(f => f.id === `${channel.id}_${post.message_id}`);
        if (!exists) {
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
                stats: stats || null,
                teamStats: teamStats || null,
                matchTime: matchTime || 'Время не указано',
                matchTimeRaw: matchTime,
                date: new Date(post.date * 1000).toISOString(),
                dateDisplay: new Date(post.date * 1000).toLocaleString('ru-RU'),
                channel: channel.title || channel.username,
                sport: 'football',
                link: `https://t.me/${channel.username}/${post.message_id}`
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
            if (forecast.teamStats) {
                console.log(`   📊 Форма: ${forecast.teamStats.map(s => `${s.team} ${s.wins}-${s.losses}`).join(', ')}`);
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
    res.json({ success: true, message: 'Сервер работает на WEBHOOK! С автоудалением!' });
});

// ========== ЗАПУСК ==========
app.listen(PORT, () => {
    console.log(`✅ Сервер запущен на порту ${PORT}`);
    console.log(`🌐 Открой: http://localhost:${PORT}/api/test`);
    console.log(`📡 Вебхук путь: /webhook/${TOKEN}`);
});

console.log('✅ Парсер готов к работе!');
console.log('🗑️ Автоудаление: прогнозы удаляются через 5 часов после завершения матча');
