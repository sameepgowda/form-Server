import PDFDocument from "pdfkit";

const generateExpensePDF = (expenses, UserId, month, year,username) => {
    return new Promise((resolve, reject) => {
        
        const Year = String(year);
        const monthName = new Date(2026, month - 1)
            .toLocaleString("en-US", { month: "long" });
        const doc = new PDFDocument();
        const chunks = [];

        doc.on("data", chunk => chunks.push(chunk));

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", reject);

        doc.fontSize(20).text(`Expense Report for ${monthName} ${Year}`, {
            align: "center"
        });

        doc.moveDown();

        doc.fontSize(12).text(`User ID: ${UserId}`);
        doc.fontSize(12).text(`User name: ${username}`);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`);

        doc.moveDown();

        expenses.forEach((expense, index) => {
            doc.fontSize(11).text(
                `${index + 1}. Date: ${expense.date}`
            );

            doc.text(`Description: ${expense.description}`);
            doc.text(`Category: ${expense.category}`);
            doc.text(`Amount: ${expense.expenseAmount}`);

            doc.moveDown();
        });

        doc.end();
    });
};

export default generateExpensePDF;