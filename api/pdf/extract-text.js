const pdfParse = require('pdf-parse');

/**
 * Extrai texto de um PDF em base64
 * @param {string} pdfBase64 - String base64 do PDF
 * @returns {Promise<Object>} - Objeto com texto e metadados
 */
async function extractTextFromPdf(pdfBase64) {
  try {
    // Remove o prefixo data:application/pdf;base64, se existir
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    // Converte base64 para buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Extrai o texto do PDF
    const data = await pdfParse(pdfBuffer);

    return {
      text: data.text,
      numPages: data.numpages,
      info: data.info,
      metadata: data.metadata
    };

  } catch (error) {
    console.error('Erro ao extrair texto do PDF:', error);
    throw new Error(`Falha ao extrair texto do PDF: ${error.message}`);
  }
}

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Aceitar apenas POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Método não permitido. Use POST'
    });
  }

  try {
    const { pdfBase64 } = req.body;

    // Validações
    if (!pdfBase64) {
      return res.status(400).json({
        success: false,
        error: 'O campo pdfBase64 é obrigatório'
      });
    }

    if (typeof pdfBase64 !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'O campo pdfBase64 deve ser uma string'
      });
    }

    // Extrai o texto do PDF
    const result = await extractTextFromPdf(pdfBase64);

    // Retorna o texto e metadados
    res.status(200).json({
      success: true,
      text: result.text,
      numPages: result.numPages,
      info: result.info,
      metadata: result.metadata,
      message: 'Texto extraído com sucesso'
    });

  } catch (error) {
    console.error('Erro no handler:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar PDF'
    });
  }
}
