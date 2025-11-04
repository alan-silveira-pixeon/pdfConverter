import express from 'express';
import cors from 'cors';
import pdfRoutes from './routes/pdfRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumenta o limite para suportar PDFs grandes
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rotas
app.use('/api/pdf', pdfRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'API está funcionando' });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API de Conversão e Extração de PDF',
    endpoints: {
      health: 'GET /health',
      convert: 'POST /api/pdf/convert',
      extractText: 'POST /api/pdf/extract-text'
    },
    usage: [
      {
        name: 'Converter PDF para Imagem',
        method: 'POST',
        url: '/api/pdf/convert',
        body: {
          pdfBase64: 'string (base64 do PDF)',
          pageNumber: 'number (opcional, padrão: 1)',
          scale: 'number (opcional, padrão: 2.0)'
        }
      },
      {
        name: 'Extrair Texto do PDF',
        method: 'POST',
        url: '/api/pdf/extract-text',
        body: {
          pdfBase64: 'string (base64 do PDF)'
        }
      }
    ]
  });
});

// Tratamento de erros 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada'
  });
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor'
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Conversão PDF->Imagem: POST http://localhost:${PORT}/api/pdf/convert`);
  console.log(`Extração de texto: POST http://localhost:${PORT}/api/pdf/extract-text`);
});

export default app;
