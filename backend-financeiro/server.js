const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json()); // Permite que a API entenda o formato JSON que o n8n vai enviar

// Configuração da conexão com o banco de dados (usando a porta 5433 que mapeamos)
const pool = new Pool({
  user: 'admin',
  host: 'localhost',
  database: 'controle_financeiro',
  password: 'adminpassword',
  port: 5433,
});

// Função para criar a tabela automaticamente caso não exista
const initDB = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS transacoes (
      id SERIAL PRIMARY KEY,
      categoria VARCHAR(50) NOT NULL,
      descricao VARCHAR(255) NOT NULL,
      valor DECIMAL(10, 2) NOT NULL,
      data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(createTableQuery);
    console.log('✅ Banco de dados sincronizado (Tabela "transacoes" pronta).');
  } catch (err) {
    console.error('❌ Erro ao criar tabela:', err);
  }
};

initDB();

// --- ROTAS DA API ---

// 1. Rota para o Frontend ler os dados (Dashboard)
app.get('/api/transacoes', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM transacoes ORDER BY data DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao buscar transações' });
  }
});

// 2. Rota de Webhook para o n8n enviar os novos gastos/entradas
app.post('/api/webhook/n8n', async (req, res) => {
  const { categoria, descricao, valor } = req.body;

  // Validação básica
  if (!categoria || !descricao || valor === undefined) {
    return res.status(400).json({ erro: 'Dados incompletos. Envie categoria, descricao e valor.' });
  }

  try {
    const insertQuery = `
      INSERT INTO transacoes (categoria, descricao, valor)
      VALUES ($1, $2, $3) RETURNING *;
    `;
    const values = [categoria, descricao, valor];
    
    const { rows } = await pool.query(insertQuery, values);
    console.log('📥 Nova movimentação registrada via n8n:', rows[0]);
    
    res.status(201).json({ 
      sucesso: true, 
      mensagem: 'Transação registrada com sucesso!',
      dados: rows[0] 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: 'Erro ao salvar transação no banco' });
  }
});

// Iniciar o servidor
const PORT = 3005;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 API do Controle Financeiro rodando na porta ${PORT} (Aceitando conexões externas)`);
});
