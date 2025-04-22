import fs from 'fs';
import pdf from 'pdf-parse';

let cvContent = null;

export async function readCV() {
  if (cvContent) return cvContent;
  
  try {
    const dataBuffer = fs.readFileSync('public/documents/CV David Badell.pdf');
    const data = await pdf(dataBuffer);
    cvContent = data.text;
    return cvContent;
  } catch (error) {
    console.error('Error al leer el CV:', error);
    return '';
  }
} 