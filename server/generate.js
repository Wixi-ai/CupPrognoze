cd / c / Users / spoti / Sait - naeb / server
cat > generate.js << 'EOF'
/**
 * 🤖 РЕАЛИСТИЧНЫЙ ГЕНЕРАТОР ПРОГНОЗОВ
 */

const BOT_TOKEN = '8923310105:AAHA-ixNw9vKBdfhHo2-SWHuRB18XNwpfjc';
const CHANNEL_ID = '@cup_prognoze_all';

// ===== БОЛЬШАЯ БАЗА РЕАЛЬНЫХ КОМАНД =====
const MATCHES = [
    // АПЛ
    { home: 'Ливерпуль', away: 'Манчестер Сити', league: 'АПЛ' },
    { home: 'Арсенал', away: 'Челси', league: 'АПЛ' },
    { home: 'Манчестер Юнайтед', away: 'Тоттенхэм', league: 'АПЛ' },
    { home: 'Ньюкасл', away: 'Астон Вилла', league: 'АПЛ' },
    { home: 'Вест Хэм', away: 'Брайтон', league: 'АПЛ' },

    // Ла Лига
    { home: 'Реал Мадрид', away: 'Барселона', league: 'Ла Лига' },
    { home: 'Атлетико', away: 'Реал Сосьедад', league: 'Ла Лига' },
    { home: 'Севилья', away: 'Вильярреал', league: 'Ла Лига' },
    { home: 'Атлетик Бильбао', away: 'Валенсия', league: 'Ла Лига' },

    // Серия А
    { home: 'Милан', away: 'Интер', league: 'Серия А' },
    { home: 'Ювентус', away: 'Наполи', league: 'Серия А' },
    { home: 'Рома', away: 'Лацио', league: 'Серия А' },
    { home: 'Аталанта', away: 'Фиорентина', league: 'Серия А' },

    // Бундеслига
    { home: 'Бавария', away: 'Боруссия Дортмунд', league: 'Бундеслига' },
    { home: 'РБ Лейпциг', away: 'Байер Леверкузен', league: 'Бундеслига' },
    { home: 'Айнтрахт', away: 'Вольфсбург', league: 'Бундеслига' },

    // Лига 1
    { home: 'ПСЖ', away: 'Марсель', league: 'Лига 1' },
    { home: 'Монако', away: 'Лион', league: 'Лига 1' },

    // РПЛ
    { home: 'Зенит', away: 'Спартак', league: 'РПЛ' },
    { home: 'Динамо', away: 'ЦСКА', league: 'РПЛ' },
    { home: 'Краснодар', away: 'Локомотив', league: 'РПЛ' },
];

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
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

// ===== ГЕНЕРАЦИЯ РЕАЛИСТИЧНЫХ ДАННЫХ =====
function generateStats() {
    // Атака — реалистичный разброс
    const attackHome = randomInt(45, 95);
    const attackAway = randomInt(40, 90);

    // Защита — чем выше, тем лучше защита
    const defenseHome = randomInt(40, 90);
    const defenseAway = randomInt(40, 90);

    // Форма — текущее состояние команды
    const formHome = randomInt(40, 95);
    const formAway = randomInt(40, 90);

    // Голы — реалистичные числа
    const goalsHome = randomInt(1, 5);
    const goalsAway = randomInt(0, 4);
    const goalsHomeAvg = randomFloat(1.2, 2.8);
    const goalsAwayAvg = randomFloat(1.0, 2.5);

    // Пропущенные голы
    const concededHome = randomInt(0, 4);
    const concededAway = randomInt(0, 4);
    const concededHomeAvg = randomFloat(0.5, 2.0);
    const concededAwayAvg = randomFloat(0.5, 2.0);

    // Лига — сезон (реалистичные показатели)
    const played = randomInt(3, 6);
    let wins, draws, losses;

    // Если одна команда сильнее (рандомно)
    if (Math.random() > 0.5) {
        wins = randomInt(2, played - 1);
        draws = randomInt(0, played - wins - 1);
        losses = played - wins - draws;
    } else {
        wins = randomInt(0, played - 2);
        draws = randomInt(0, played - wins - 1);
        losses = played - wins - draws;
    }

    // Статус матча
    const statuses = ['Завершен', 'Завершен', 'Завершен', 'Завершен', 'Скоро'];
    const status = random(statuses);

    return {
        attackHome, attackAway,
        defenseHome, defenseAway,
        formHome, formAway,
        goalsHome, goalsAway,
        goalsHomeAvg, goalsAwayAvg,
        concededHome, concededAway,
        concededHomeAvg, concededAwayAvg,
        played, wins, draws, losses,
        status
    };
}

// ===== ГЕНЕРАЦИЯ ПОСТА =====
function generatePost() {
    const match = random(MATCHES);
    const stats = generateStats();
    const date = randomDate();

    let post = `${match.home} - ${match.away}\n\n`;
    post += `🏆 Турнир: ${match.league}\n\n`;
    post += `Атака: ${match.home} ${stats.attackHome}, ${match.away} ${stats.attackAway}\n`;
    post += `Защита: ${match.home} ${stats.defenseHome}, ${match.away} ${stats.defenseAway}\n`;
    post += `Форма: ${match.home} ${stats.formHome}, ${match.away} ${stats.formAway}\n`;
    post += `Голы: ${match.home} ${stats.goalsHome} (${stats.goalsHomeAvg}), ${match.away} ${stats.goalsAway} (${stats.goalsAwayAvg})\n`;
    post += `Пропущено: ${match.home} ${stats.concededHome} (${stats.concededHomeAvg}), ${match.away} ${stats.concededAway} (${stats.concededAwayAvg})\n\n`;
    post += `Сыграно: ${stats.played}\n`;
    post += `В: ${stats.wins}\n`;
    post += `Н: ${stats.draws}\n`;
    post += `П: ${stats.losses}\n\n`;
    post += `Источник: AI Predictor\n\n`;
    post += `СЧЕТ: ${stats.goalsHome}-${stats.goalsAway}\n\n`;
    post += `СТАТУС: ${stats.status}\n\n`;
    post += `⏰ ${date}`;

    return post;
}

// ===== ПУБЛИКАЦИЯ =====
async function postToTelegram(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: CHANNEL_ID,
                text: text,
                parse_mode: 'HTML'
            })
        });
        const data = await response.json();

        if (data.ok) {
            console.log('✅ Пост опубликован!');
            console.log(`📝 ${text.split('\n')[0]}`);
            console.log(`⏰ ${new Date().toLocaleString()}`);
            return true;
        } else {
            console.error('❌ Ошибка публикации:', data);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        return false;
    }
}

// ===== ЗАПУСК =====
async function main() {
    console.log(`\n🚀 Генерация прогноза...`);
    console.log(`⏰ ${new Date().toLocaleString()}`);

    const post = generatePost();
    console.log('\n📝 Сгенерированный пост:');
    console.log('─'.repeat(50));
    console.log(post);
    console.log('─'.repeat(50));

    await postToTelegram(post);
}

main().catch(console.error);
EOF
