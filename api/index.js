module.exports = function handler(req, res) {
  res.status(200).json({
    message: 'API de Conversão e Extração de PDF',
    endpoints: {
      health: 'GET /api/health',
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
};
