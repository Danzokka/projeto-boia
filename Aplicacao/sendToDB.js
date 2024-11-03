const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const sqlite3 = require('better-sqlite3');

const sqliteConnection = sqlite3('temperaturas.db');

// Criação da tabela no SQLite (se não existir)
sqliteConnection.prepare(`
  CREATE TABLE IF NOT EXISTS temperaturas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    temperatura_media REAL NOT NULL,
    timestamp TEXT NOT NULL
  )
`).run();

// Configuração da porta serial
const port = new SerialPort('COM3', { baudRate: 9600 }); // Ajuste 'COM3' para a porta correta
const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

let temperaturas = []; // Array para armazenar as leituras

parser.on('data', (data) => {
  if (data.includes("Temperatura =")) {
    const temperatura = parseFloat(data.split('=')[1].trim());
    temperaturas.push(temperatura);

    // Se já tivermos 10 leituras, calcular a média e subir para o banco de dados
    if (temperaturas.length === 10) {
      const temperaturaMedia = temperaturas.reduce((sum, temp) => sum + temp, 0) / temperaturas.length;
      const timestamp = new Date().toISOString();

      // Inserir a média e a data no SQLite
      try {
        sqliteConnection.prepare('INSERT INTO temperaturas (temperatura_media, timestamp) VALUES (?, ?)').run(temperaturaMedia, timestamp);
        console.log(`Média dos últimos 10 valores (${temperaturaMedia.toFixed(2)}°C) registrada no SQLite com timestamp ${timestamp}`);
      } catch (err) {
        console.error('Erro ao inserir no SQLite:', err);
      }

      // Limpar o array para as próximas 10 leituras
      temperaturas = [];
    }
  }
});

// Fechar conexão ao finalizar
process.on('exit', () => {
  sqliteConnection.close();
});
