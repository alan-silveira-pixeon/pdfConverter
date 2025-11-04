const { pdf } = require('pdf-to-img');

/**
 * Converte um PDF em base64 para uma imagem em base64
 * @param {string} pdfBase64 - String base64 do PDF
 * @param {number} pageNumber - Número da página a ser convertida (padrão: 1)
 * @param {number} scale - Escala da renderização (padrão: 2.0)
 * @returns {Promise<string>} - String base64 da imagem PNG
 */
async function convertPdfToImage(pdfBase64, pageNumber = 1, scale = 2.0) {
  try {
    // Remove o prefixo data:application/pdf;base64, se existir
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');

    // Converte base64 para buffer
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Converte o PDF
    const document = await pdf(pdfBuffer, { scale });

    let currentPage = 0;
    let targetPageImage = null;

    // Itera sobre as páginas até encontrar a desejada
    for await (const image of document) {
      currentPage++;
      if (currentPage === pageNumber) {
        targetPageImage = image;
        break;
      }
    }

    if (!targetPageImage) {
      throw new Error(`Número de página inválido. Não foi possível acessar a página ${pageNumber}.`);
    }

    // Converte o buffer da imagem para base64
    const imageBase64 = `data:image/png;base64,${targetPageImage.toString('base64')}`;

    return imageBase64;

  } catch (error) {
    console.error('Erro ao converter PDF:', error);
    throw new Error(`Falha ao converter PDF: ${error.message}`);
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
    const { pdfBase64, pageNumber, scale } = req.body;

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

    // Converte o PDF
    const imageBase64 = await convertPdfToImage(
      pdfBase64,
      pageNumber || 1,
      scale || 2.0
    );

    // Retorna a imagem em base64
    res.status(200).json({
      success: true,
      imageBase64: imageBase64,
      message: 'PDF convertido com sucesso'
    });

  } catch (error) {
    console.error('Erro no handler:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar PDF'
    });
  }
}
