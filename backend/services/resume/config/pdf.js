import fs from "fs"
import {PDFParse} from "pdf-parse"

const extractText = async (filePath) => {
    // Implementation for extracting text from a PDF file
    const buffer = fs.readFileSync(filePath);

    const pdf = new PDFParse({
        data:buffer
    })

    const result = await pdf.getText();

    return result.text;
}

export default extractText