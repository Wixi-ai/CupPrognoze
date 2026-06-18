/**
 * 🤖 Генератор прогнозов (БЕЗ НЕЙРОСЕТИ)
 * Работает автономно, создает реалистичные прогнозы
 */

const BOT_TOKEN = '8923310105:AAHA-ixNw9vKBdfhHo2-SWHuRB18XNwpfjc';
const CHANNEL_ID = '@cup_prognoze_test';

const TEAMS = [
    { home: 'Реал Мадрид', away: 'Барселона', league: 'Ла Лига' },
    { home: 'Ливерпуль', away: 'Манчестер Сити', league: 'АПЛ' },
    { home: 'Бавария', away: 'Боруссия Дортмунд', league: 'Бундеслига' },
    { home: 'ПСЖ', away: 'Марсель', league: 'Лига 1' },
    { home: 'Милан', away: 'Интер', league: 'Серия А' },
    { home: 'Арсенал', away: 'Челси', league: 'АПЛ' },
    { home: 'Атлетико', away: 'Реал Сосьедад', league: 'Ла Лига' },
    { home: 'Наполи', away: 'Ювентус', league: 'Серия А' },
    { home: 'Бенфика', away: 'Порту', league: 'Примейра' },
    { home: 'Аякс', away: 'ПСВ', league: 'Эредивизи' }
];

const PREDICTIONS = [
    'Победа хозяев',
    'Ничья',
    'Победа гостей',
    'Тотал больше 2.5',
    'Тотал меньше 2.5',
    'Обе команды забьют',
    'Фора хозяев (-1)',
    'Фора гостей (+1)'
];

function random(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

function randomDate() {
    const d = new Date();
    d.setDate(d.getDate() + Math.floor(Math.random() * 7) + 1);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()} ${String(Math.floor(Math.random()*12)+12).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`;
}

function generate() {
    const match = random(TEAMS);
    const prediction = random(PREDICTIONS);
    const odds = (1.5 + Math.random() * 1.5).toFixed(2);
    const date = randomDate();
    const score = Math.random() > 0.6 ? `\n📊 Счет: ${Math.floor(Math.random()*3)}-${Math.floor(Math.random()*3)}` : '';

    return `⚽ ${match.home} — ${match.away}

🏆 Турнир: ${match.league}

📊 Анализ: ${match.home} в отличной форме, ${match.away} показывает нестабильные результаты.

🎯 Прогноз: ${prediction}
📈 Коэффициент: ${odds}

📅 ${date}
🏁 СТАТУС: Скоро${score}

🔗 Источник: CupPrognoze AI

🤖 Прогноз сгенерирован автоматически
📱 Подписывайся: ${CHANNEL_ID}`;
}

async function post() {
    const post = generate();
    console.log('📝 Прогноз:\n' + '─'.repeat(50) + '\n' + post + '\n' + '─'.repeat(50));

    const r = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHANNEL_ID, text: post, parse_mode: 'HTML' })
    });
    const d = await r.json();
    console.log(d.ok ? '✅ Опубликовано!' : '❌ Ошибка');
}

post();
