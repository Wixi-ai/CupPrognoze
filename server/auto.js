const { exec } = require('child_process');

console.log('🔄 Автоматический генератор прогнозов');
console.log('⏰ Каждые 60 минут\n');

function generate() {
    console.log(`\n📅 ${new Date().toLocaleString()}`);
    console.log('🤖 Генерирую прогноз...');
    exec('node generate.js', (error, stdout, stderr) => {
        if (error) console.error('❌', error.message);
        else console.log(stdout);
    });
}

setTimeout(generate, 5000);
setInterval(generate, 60 * 60 * 1000);
console.log('✅ Запущен!');
