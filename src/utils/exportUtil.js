import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import XLSX from "xlsx";
import jsPDF from "jspdf";
import { useAuth } from "../../src/context/AuthContext";
import autoTable from "jspdf-autotable";


/**
 * Export data to an Excel file
 * @param {Array} data - Array of objetcs to export
 * @param {String} fileName - Desired file name without extension
 */

export const exportToExcel = async (data, fileName) => {
    try {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

        const excelData = XLSX.write(workbook, {
            type: "base64",
            bookType: "xlsx",
        });

        const fileUri = `${FileSystem.documentDirectory}${fileName}.xlsx`;
        await FileSystem.writeAsStringAsync(fileUri, excelData, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.log("Sharing is not available on this device.")
        }
    } catch (error) {
        console.error("Error exporting to Excel:", error);
    }
}


/**
 * Export data to an Excel file
 * @param {Array} data - Array of objetcs to export
 * @param {String} fileName - Desired file name without extension
 */

// export const exportToPDF = async (data, fileName) => {
//     try {
//         const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
//         const doc = new PDFDocument();
//         const pdfStream = doc.pipe(FileSystem.createWriteStream(fileUri));

//         doc.fontSize(12).text("Exported Data", {align: "center"})

//         data.forEach((item, index) => {
//             doc.text(`${index + 1}.`);
//             Object.keys(item).forEach((key) => {
//                 doc.text(` ${key}: ${item[key]}`)
//             });
//             doc.moveDown();

//         });
//         doc.end();
//         pdfStream.on("finish", async () => {
//             if(await Sharing.isAvailableAsync()){
//                 await Sharing.shareAsync(fileUri);
//             } else {
//                 console.log("Sharing is not available on this device.");
//             }
//         });
//     } catch (error) {
//         console.error("Error exporting to PDF:", error)
//     }
// }

export const exportToPDF = async (data, fileName) => {
    try {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text("Exported Data", 20, 20);

        let yOffset = 30; // Initial Y offset
        data.forEach((item, index) => {
            doc.text(`${index + 1}.`, 20, yOffset);
            Object.entries(item).forEach(([key, value]) => {
                yOffset += 10;
                doc.text(`${key}: ${value}`, 30, yOffset);
            });
            yOffset += 10; // Add space between items
        });

        const pdfOutput = doc.output("datauristring");

        // Save the PDF to file system
        const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
        await FileSystem.writeAsStringAsync(fileUri, pdfOutput.split(",")[1], {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Share the PDF file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.log("Sharing is not available on this device.");
        }
    } catch (error) {
        console.error("Error exporting to PDF:", error);
    }
};

// export const exportToPDF2 = async (data, fileName) => {
//     try {
//         const doc = new jsPDF();

//         // Add Title
//         doc.setFontSize(16);
//         doc.text("Exported Data", 20, 20);

//         // Prepare table columns and rows
//         const columns = Object.keys(data[0]).map((key) => ({ header: key, dataKey: key }));
//         const rows = data.map((item) => ({ ...item }));

//         // Add table to the PDF
//         autoTable(doc, {
//             startY: 30, // Starting y-position
//             head: [columns.map((col) => col.header)], // Table headers
//             body: rows.map((row) => columns.map((col) => row[col.dataKey])), // Table rows
//             styles: { fontSize: 10 },
//             headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Header styles
//             alternateRowStyles: { fillColor: [245, 245, 245] }, // Alternating row styles
//         });

//         // Generate the PDF as a Base64 string
//         const pdfOutput = doc.output("datauristring");

//         // Save the PDF to the device's file system
//         const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
//         await FileSystem.writeAsStringAsync(fileUri, pdfOutput.split(",")[1], {
//             encoding: FileSystem.EncodingType.Base64,
//         });

//         // Share the PDF file
//         if (await Sharing.isAvailableAsync()) {
//             await Sharing.shareAsync(fileUri);
//         } else {
//             console.log("Sharing is not available on this device.");
//         }
//     } catch (error) {
//         console.error("Error exporting to PDF:", error);
//     }
// };



// export const exportToPDF2 = async (data, fileName) => {
//     try {
//         const doc = new jsPDF();

//         // Add Title
//         doc.setFontSize(16);
//         doc.text(`${fileName || "Exported Data"}`, 20, 20);

//         // Prepare table columns and rows
//         const columns = Object.keys(data[0]).map((key) => ({ header: key, dataKey: key }));
//         const rows = data.map((item) => ({ ...item }));

//         // Add table to the PDF
//         autoTable(doc, {
//             startY: 30, // Starting y-position
//             head: [columns.map((col) => col.header)], // Table headers
//             body: rows.map((row) => columns.map((col) => row[col.dataKey])), // Table rows
//             styles: { fontSize: 10, cellPadding: 2, lineWidth: 0.3, lineColor: [0, 0, 0] }, // Cell padding and border width
//             headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], lineWidth: 0.3 }, // Header styles with border
//             bodyStyles: { lineWidth: 0.3 }, // Border for body cells
//             alternateRowStyles: { fillColor: [245, 245, 245] }, // Alternating row styles
//             tableLineColor: [0, 0, 0], // Line color for borders
//             tableLineWidth: 0.3, // Line width for borders
//         });

//         // Generate the PDF as a Base64 string
//         const pdfOutput = doc.output("datauristring");

//         // Save the PDF to the device's file system
//         const fileUri = `${FileSystem.documentDirectory}${fileName}.pdf`;
//         await FileSystem.writeAsStringAsync(fileUri, pdfOutput.split(",")[1], {
//             encoding: FileSystem.EncodingType.Base64,
//         });

//         // Share the PDF file
//         if (await Sharing.isAvailableAsync()) {
//             await Sharing.shareAsync(fileUri);
//         } else {
//             console.log("Sharing is not available on this device.");
//         }
//     } catch (error) {
//         console.error("Error exporting to PDF:", error);
//     }
// };



export const exportToPDF2 = async (data, fileName, username) => {
    try {
        const doc = new jsPDF();

        // Get current date
        const currentDate = new Date().toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });

        // Default title if fileName is not provided
        const title = fileName || "Exported Data";


        // Add title centered
        doc.setFontSize(16);
        const pageWidth = doc.internal.pageSize.getWidth();
        const textWidth = doc.getTextWidth(title);
        const xCenter = (pageWidth - textWidth) / 2; // Calculate x position for centering
        doc.text(title, xCenter, 20);

        // Add a horizontal line after the title
        doc.setLineWidth(0.25); // Set the line thickness
        doc.setDrawColor(0, 0, 0); // Set the line color (black)
        doc.line(10, 25, pageWidth - 10, 25); // Draw a line across the page

        // Add current date and "Report Generated By" below the title
        doc.setFontSize(12);
        doc.text(`Date: ${currentDate}`, 10, 34);
        doc.text(`Report Generated By: ${username}`, 10, 40);

        // Validate and prepare data
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Invalid or empty data provided for export.");
        }

        const columns = Object.keys(data[0]).map((key) => ({ header: key, dataKey: key }));

        const rows = data.map((item) =>
            columns.map((col) => {
                const value = item[col.dataKey];
                return value !== undefined && value !== null ? value.toString() : "N/A";
            })
        );

        // Add table to the PDF
        autoTable(doc, {
            startY: 50, // Adjusted to give space for the header
            head: [columns.map((col) => col.header)], // Table headers
            body: rows, // Validated Table rows
            styles: { fontSize: 10, cellPadding: 2, lineWidth: 0.3, lineColor: [0, 0, 0] }, // Cell padding and border width
            headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255], lineWidth: 0.3 }, // Header styles
            bodyStyles: { lineWidth: 0.3 }, // Border for body cells
            alternateRowStyles: { fillColor: [245, 245, 245] }, // Alternating row styles
            tableLineColor: [0, 0, 0], // Line color for borders
            tableLineWidth: 0.3, // Line width for borders
        });

        // Generate the PDF as a Base64 string
        const pdfOutput = doc.output("datauristring");

        // Save the PDF to the device's file system
        const fileUri = `${FileSystem.documentDirectory}${fileName || "ExportedData"}.pdf`;
        await FileSystem.writeAsStringAsync(fileUri, pdfOutput.split(",")[1], {
            encoding: FileSystem.EncodingType.Base64,
        });

        // Share the PDF file
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
        } else {
            console.log("Sharing is not available on this device.");
        }
    } catch (error) {
        console.error("Error exporting to PDF:", error);
    }
};