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

let temperaturas = []; // Array para armazenar as leituras

// Função para simular o envio de dados de temperatura a cada segundo
setInterval(() => {
  const temperaturaSimulada = (Math.random() * 10 + 20).toFixed(1); // Gera uma temperatura entre 20 e 30
  console.log(`Temperatura simulada = ${temperaturaSimulada}°C`);

  temperaturas.push(parseFloat(temperaturaSimulada));

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
}, 1000); // Intervalo de 1 segundo para simular cada leitura

// Fechar conexão ao finalizar
process.on('exit', () => {
  sqliteConnection.close();
});
