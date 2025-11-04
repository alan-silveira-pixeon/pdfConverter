import { pdf } from 'pdf-to-img';
import pdfParse from 'pdf-parse';

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

/**
 * Controller para converter PDF em imagem
 */
export const convertPdfController = async (req, res) => {
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
    res.json({
      success: true,
      imageBase64: imageBase64,
      message: 'PDF convertido com sucesso'
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar PDF'
    });
  }
};

/**
 * Controller para extrair texto do PDF
 */
export const extractTextController = async (req, res) => {
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
    res.json({
      success: true,
      text: result.text,
      numPages: result.numPages,
      info: result.info,
      metadata: result.metadata,
      message: 'Texto extraído com sucesso'
    });

  } catch (error) {
    console.error('Erro no controller:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Erro interno ao processar PDF'
    });
  }
};
