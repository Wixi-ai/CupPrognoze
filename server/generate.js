cd / c / Users / spoti / Sait - naeb / server
cat > generate.js << 'EOF'
/**
 * 🤖 АВТОМАТИЧЕСКИЙ ГЕНЕРАТОР ПРОГНОЗОВ
 * Создаёт посты в Telegram канале самостоятельно
 * Запускается по расписанию
 */

const BOT_TOKEN = '8923310105:AAHA-ixNw9vKBdfhHo2-SWHuRB18XNwpfjc';
const CHANNEL_ID = '@cup_prognoze_all';

// ===== КОМАНДЫ И ТУРНИРЫ =====
const MATCHES = [
    { home: 'Реал Мадрид', away: 'Барселона', league: 'Ла Лига' },
    { home: 'Ливерпуль', away: 'Манчестер Сити', league: 'АПЛ' },
    { home: 'Бавария', away: 'Боруссия Дортмунд', league: 'Бундеслига' },
    { home: 'ПСЖ', away: 'Марсель', league: 'Лига 1' },
    { home: 'Милан', away: 'Интер', league: 'Серия А' },
    { home: 'Арсенал', away: 'Челси', league: 'АПЛ' },
    { home: 'Атлетико', away: 'Реал Сосьедад', league: 'Ла Лига' },
    { home: 'Наполи', away: 'Ювентус', league: 'Серия А' },
    { home: 'Бенфика', away: 'Порту', league: 'Примейра' },
    { home: 'Аякс', away: 'ПСВ', league: 'Эредивизи' },
    { home: 'Спартак', away: 'Зенит', league: 'РПЛ' },
    { home: 'Динамо', away: 'ЦСКА', league: 'РПЛ' },
];

// ===== СЛУЧАЙНЫЕ ДАННЫЕ =====
function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function randomFloat(min, max) { return (Math.random() * (max - min) + min).toFixed(1); }

function randomDate() {
    const d = new Date();
    d.setDate(d.getDate() + randomInt(1, 7));
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(randomInt(12, 23)).padStart(2, '0');
    const minutes = String(randomInt(0, 59)).padStart(2, '0');
    return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// ===== ГЕНЕРАЦИЯ ПОСТА =====
function generatePost() {
    const match = random(MATCHES);
    const attackHome = randomInt(40, 90);
    const attackAway = randomInt(40, 90);
    const defenseHome = randomInt(40, 90);
    const defenseAway = randomInt(40, 90);
    const formHome = randomInt(40, 90);
    const formAway = randomInt(40, 90);

    const goalsHome = randomInt(1, 5);
    const goalsAway = randomInt(0, 4);
    const goalsHomeAvg = randomFloat(1.0, 2.5);
    const goalsAwayAvg = randomFloat(1.0, 2.5);

    const concededHome = randomInt(0, 4);
    const concededAway = randomInt(0, 4);
    const concededHomeAvg = randomFloat(0.5, 2.0);
    const concededAwayAvg = randomFloat(0.5, 2.0);

    const played = randomInt(2, 5);
    const wins = randomInt(0, played);
    const draws = randomInt(0, played - wins);
    const losses = played - wins - draws;

    const statuses = ['Завершен', 'Завершен', 'Завершен', 'Идет', 'Скоро'];
    const status = random(statuses);

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
    post += `СТАТУС: ${status}\n\n`;
    post += `⏰ ${date}`;

    return post;
}

// ===== ПУБЛИКАЦИЯ В TELEGRAM =====
async function postToTelegram(text) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

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
        console.log('📝', text.split('\n')[0]);
        return true;
    } else {
        console.error('❌ Ошибка:', data);
        return false;
    }
}

// ===== ЗАПУСК =====
async function main() {
    console.log(`\n🚀 Генерация прогноза...`);
    console.log(`⏰ ${new Date().toLocaleString()}`);

    const post = generatePost();
    console.log('\n📝 Сгенерированный пост:');
    console.log('─'.repeat(40));
    console.log(post);
    console.log('─'.repeat(40));

    await postToTelegram(post);
}

main().catch(console.error);
EOF
