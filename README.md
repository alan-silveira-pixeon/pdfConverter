# API de Conversão e Extração de PDF

API web baseada em Node.js e Vite para converter arquivos PDF em imagens e extrair texto usando PDF.js.

## Funcionalidades

- Recebe um PDF em formato base64
- Converte o PDF em imagem PNG
- Extrai texto do conteúdo do PDF
- Retorna a imagem em formato base64
- Retorna o texto extraído com metadados
- Suporta seleção de página específica para conversão
- Configuração de escala/qualidade da imagem

## Tecnologias

- Node.js
- Express
- Vite
- pdf-to-img (wrapper do PDF.js otimizado para Node.js)
- pdf-parse (extração de texto de PDFs)

## Instalação

```bash
npm install
```

## Como usar

### Desenvolvimento

```bash
npm run dev
```

### Produção

```bash
npm start
```

O servidor irá rodar em `http://localhost:3000`

## Endpoints

### Health Check
```
GET /health
```

### 1. Conversão de PDF para Imagem
```
POST /api/pdf/convert
```

#### Request Body

```json
{
  "pdfBase64": "base64_string_do_pdf",
  "pageNumber": 1,
  "scale": 2.0
}
```

**Parâmetros:**
- `pdfBase64` (obrigatório): String base64 do arquivo PDF
- `pageNumber` (opcional): Número da página a ser convertida (padrão: 1)
- `scale` (opcional): Escala de renderização da imagem (padrão: 2.0)

#### Response

```json
{
  "success": true,
  "imageBase64": "data:image/png;base64,...",
  "message": "PDF convertido com sucesso"
}
```

### 2. Extração de Texto do PDF
```
POST /api/pdf/extract-text
```

#### Request Body

```json
{
  "pdfBase64": "base64_string_do_pdf"
}
```

**Parâmetros:**
- `pdfBase64` (obrigatório): String base64 do arquivo PDF

#### Response

```json
{
  "success": true,
  "text": "Texto completo extraído do PDF...",
  "numPages": 10,
  "info": {
    "PDFFormatVersion": "1.7",
    "Title": "Título do documento",
    "Author": "Autor",
    "Creator": "Creator",
    "Producer": "Producer",
    "CreationDate": "D:20231201120000Z"
  },
  "metadata": null,
  "message": "Texto extraído com sucesso"
}
```

## Exemplos de uso

### Conversão de PDF para Imagem

#### Com JavaScript/Fetch

```javascript
// Lê um arquivo PDF e converte para base64
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = async function(e) {
  const base64 = e.target.result;

  const response = await fetch('http://localhost:3000/api/pdf/convert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pdfBase64: base64,
      pageNumber: 1,
      scale: 2.0
    })
  });

  const result = await response.json();

  if (result.success) {
    // Use o result.imageBase64
    const img = document.createElement('img');
    img.src = result.imageBase64;
    document.body.appendChild(img);
  }
};

reader.readAsDataURL(file);
```

#### Com cURL

```bash
curl -X POST http://localhost:3000/api/pdf/convert \
  -H "Content-Type: application/json" \
  -d '{
    "pdfBase64": "JVBERi0xLjQKJeLjz9MKMSAwIG9iaiA8PAovVHlwZS...",
    "pageNumber": 1,
    "scale": 2.0
  }'
```

### Extração de Texto

#### Com JavaScript/Fetch

```javascript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];
const reader = new FileReader();

reader.onload = async function(e) {
  const base64 = e.target.result;

  const response = await fetch('http://localhost:3000/api/pdf/extract-text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      pdfBase64: base64
    })
  });

  const result = await response.json();

  if (result.success) {
    console.log('Texto extraído:', result.text);
    console.log('Número de páginas:', result.numPages);
    console.log('Informações do documento:', result.info);
  }
};

reader.readAsDataURL(file);
```

#### Com cURL

```bash
curl -X POST http://localhost:3000/api/pdf/extract-text \
  -H "Content-Type: application/json" \
  -d '{
    "pdfBase64": "JVBERi0xLjQKJeLjz9MKMSAwIG9iaiA8PAovVHlwZS..."
  }'
```

## Estrutura do Projeto

```
pdfConverter/
├── src/
│   ├── controllers/
│   │   └── pdfController.js
│   ├── routes/
│   │   └── pdfRoutes.js
│   └── server.js
├── package.json
├── vite.config.js
└── README.md
```

## Notas

- A API suporta PDFs de até 50MB
- A qualidade da imagem pode ser ajustada através do parâmetro `scale`
- Para PDFs com múltiplas páginas, especifique o `pageNumber` desejado para conversão
- A imagem retornada está no formato PNG em base64
- A extração de texto retorna todo o conteúdo textual do PDF, independente do número de páginas
- A extração de texto também retorna metadados do documento (título, autor, data de criação, etc.)

## Licença

MIT
