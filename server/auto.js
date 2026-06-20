cat > auto.js << 'EOF'
/**
 * ⏰ АВТОМАТИЧЕСКИЙ ЗАПУСК ГЕНЕРАТОРА
 * Запускает generate.js каждые N минут
 */

const { exec } = require('child_process');

// Интервал в минутах (по умолчанию 30 минут)
const INTERVAL_MINUTES = 30;

console.log('🔄 Автоматический генератор прогнозов');
console.log(`⏰ Интервал: каждые ${INTERVAL_MINUTES} минут`);
console.log(`📅 Запуск: ${new Date().toLocaleString()}\n`);

function generate() {
    console.log(`\n📅 ${new Date().toLocaleString()}`);
    console.log('🤖 Генерирую прогноз...');

    exec('node generate.js', (error, stdout, stderr) => {
        if (error) {
            console.error('❌ Ошибка:', error.message);
            return;
        }
        console.log(stdout);
        if (stderr) console.error('⚠️', stderr);
    });
}

// Первый запуск через 3 секунды
setTimeout(generate, 3000);

// Запуск по расписанию
setInterval(generate, INTERVAL_MINUTES * 60 * 1000);

console.log('✅ Генератор запущен!');
EOF
