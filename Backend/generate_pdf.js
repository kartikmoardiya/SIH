const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const PDF = require('./Models/pdf');


// Function to create a PDF
function createPDF(filename, content, heading) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4' });
        const filePath = path.join(__dirname, filename);

        const writeStream = fs.createWriteStream(filePath);
        // const writeStream = fs.createWriteStream(Date.now());

        doc.pipe(writeStream);

        const width = doc.page.width;
        const height = doc.page.height;
        let yPosition = 50;

        // Draw the heading at the top of the first page
        doc.font('Helvetica-Bold').fontSize(16);

        // Calculate the width of the heading text to center it
        const headingWidth = doc.widthOfString(heading.toUpperCase());
        const headingXPosition = (width - headingWidth) / 2; // Centering the heading

        doc.text(heading.toUpperCase(), headingXPosition, yPosition);
        yPosition += 30; // Adjust space after the heading

        content.forEach(item => {
            const title = item.title.toUpperCase();
            const description = item.description;
            const link = item.link;

            // Draw the title in uppercase
            doc.font('Helvetica-Bold').fontSize(14).fillColor('black');
            doc.text(title, 50, yPosition);
            yPosition += 20;

            // Draw the description in lowercase
            doc.font('Helvetica').fontSize(12).fillColor('black');
            doc.text(description.toLowerCase(), 50, yPosition);
            yPosition += doc.heightOfString(description, { width: width - 100 });

            // Add extra space before the link
            yPosition += 15; // Extra line space

            // Draw the label for the link
            doc.font('Helvetica-Oblique').fontSize(12).fillColor('black');
            doc.text('Documentation/Video Link:', 50, yPosition);

            // Draw the clickable link
            const linkXPosition = 200; // Adjust the x position of the link if needed
            doc.font('Helvetica-Oblique').fontSize(12).fillColor('blue');
            doc.text(link, linkXPosition, yPosition, { link: link, underline: true });

            // Add extra space after the link (two lines)
            yPosition += 30; // Two extra line spaces after the link

            // Check if the y_position is too low, if so, create a new page
            if (yPosition > height - 50) {
                doc.addPage();
                yPosition = 50;
            }
        });

        doc.end();

        writeStream.on('finish', () => {
            resolve(filePath);
            // resolve(Date.now());

        });

        writeStream.on('error', reject);
    });
}

// Route to create PDF
router.post('/create-pdf',async (req, res) => {
    let { content, heading, pdf_title } = req.body;

    if (!content || !heading) {
        return res.status(400).send('Bad request: content or heading missing');
    }
    // Pdf Nu Name Lakhay chhe
    let filename = `./files/${Date.now()}${heading}.pdf`;

    // heading = Date.now() + heading;
    // console.log(heading)
    // console.log(filename)
    filename = `${Date.now()}${heading}.pdf`
    try {
        const filePath = await createPDF(filename, content, heading);
        const data = new PDF({
            pdf: filename,
            title : pdf_title
        });

        try {
            await data.save();
            res.status(200).json({
                message: "PDF added successfully",
                success: true,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }

    } catch (error) {
        console.error('Error creating PDF:', error);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;
