const express = require('express');
const PDFDocument = require('pdfmake');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.json());

const filename = 'rekapitulasi_absensi.pdf';

// Fungsi untuk membuat file PDF jika belum ada
function createPdfFile() {
    const docDefinition = {
        content: [
            { text: 'ABSEN STARZERO - Rekapitulasi', style: 'header' },
            {
                table: {
                    body: [
                        [
                            { text: 'Nama', style: 'tableHeader' },
                            { text: 'Nomor', style: 'tableHeader' },
                            { text: 'Link TT', style: 'tableHeader' }
                        ]
                    ]
                }
            }
        ],
        styles: {
            header: {
                fontSize: 22,
                bold: true,
                margin: [0, 0, 20, 20],
                alignment: 'center'
            },
            tableHeader: {
                bold: true,
                fontSize: 14,
                color: 'blue',
                alignment: 'center'
            }
        },
        defaultStyle: {
            fontSize: 12
        }
    };

    const pdfDoc = new PDFDocument({
        Roboto: {normal: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
            bold: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64')
        }
    });
    const pdf = pdfDoc.createPdfKitDocument(docDefinition);
    pdf.pipe(fs.createWriteStream(filename));
    pdf.end();
}

// Membuat file PDF jika belum ada
if (!fs.existsSync(filename)) {
    createPdfFile();
}

app.post('/simpan-absen', (req, res) => {
    const { nama, nomor, linkTT } = req.body;

    const docDefinition = {
        content: [
            {
                table: {
                    body: [
                        [
                            { text: nama, style: 'cellStyle' },
                            { text: nomor, style: 'cellStyle' },
                            { text: linkTT, style: 'cellStyle' }
                        ]
                    ]
                }
            }
        ],
        styles: {
            cellStyle: {
                alignment: 'center',
                margin: [5, 5, 5, 5]
            }
        }
    };

    const pdfDoc = new PDFDocument({
        Roboto: {normal: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Regular.ttf'], 'base64'),
            bold: new Buffer(require('pdfmake/build/vfs_fonts.js').pdfMake.vfs['Roboto-Medium.ttf'], 'base64')
        }
    });
    const pdf = pdfDoc.createPdfKitDocument(docDefinition);
    pdf.pipe(fs.createWriteStream(filename, { flags: 'a' })); // 'a' untuk append
    pdf.end();

    pdf.on('end', () => {
        res.status(200).send('Data berhasil disimpan ke dalam file PDF!');
    });
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
