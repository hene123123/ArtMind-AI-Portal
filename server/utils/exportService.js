const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');

function buildCatalogueText(painting, aiSummary) {
  return {
    title: painting.title,
    artist: painting.artist,
    style: painting.style,
    category: painting.category,
    medium: painting.medium,
    surface: painting.surface,
    price: painting.price,
    description: painting.description || '',
    aiSummary: aiSummary || painting.ai_summary || '',
    id: painting.id
  };
}

async function generatePdfBuffer(painting, aiSummary) {
  const info = buildCatalogueText(painting, aiSummary);

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];

    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(22).text('ArtMind AI Catalogue', { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(info.title, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(12)
      .text(`Artist: ${info.artist}`)
      .text(`Style: ${info.style}`)
      .text(`Category: ${info.category}`)
      .text(`Medium: ${info.medium}`)
      .text(`Surface: ${info.surface}`)
      .text(`Price: $${info.price}`)
      .text(`ID: ${info.id}`);
    doc.moveDown();
    doc.fontSize(13).text('Description', { underline: true });
    doc.fontSize(11).text(info.description || 'No description');
    doc.moveDown();
    doc.fontSize(13).text('AI Summary', { underline: true });
    doc.fontSize(11).text(info.aiSummary || 'No AI summary available.');
    doc.end();
  });
}

async function generateDocxBuffer(painting, aiSummary) {
  const info = buildCatalogueText(painting, aiSummary);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'ArtMind AI Catalogue',
          heading: HeadingLevel.HEADING_1
        }),
        new Paragraph({
          children: [new TextRun({ text: info.title, bold: true, size: 28 })]
        }),
        new Paragraph({ text: `Artist: ${info.artist}` }),
        new Paragraph({ text: `Style: ${info.style}` }),
        new Paragraph({ text: `Category: ${info.category}` }),
        new Paragraph({ text: `Medium: ${info.medium}` }),
        new Paragraph({ text: `Surface: ${info.surface}` }),
        new Paragraph({ text: `Price: $${info.price}` }),
        new Paragraph({ text: `ID: ${info.id}` }),
        new Paragraph({ text: 'Description', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: info.description || 'No description' }),
        new Paragraph({ text: 'AI Summary', heading: HeadingLevel.HEADING_2 }),
        new Paragraph({ text: info.aiSummary || 'No AI summary available.' })
      ]
    }]
  });

  return Packer.toBuffer(doc);
}

module.exports = {
  generatePdfBuffer,
  generateDocxBuffer
};
