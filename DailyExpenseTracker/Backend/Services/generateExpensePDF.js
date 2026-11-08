
import PDFDocument from "pdfkit-table";

const generateExpensePDF = async (expenses, UserId, month, year, username,
            totalCreditOftheMonth,
            totalExpenseOftheMonth,
            totalSavings) => {

            console.log("totalCredit",totalCreditOftheMonth)

    return new Promise(async (resolve, reject) => {

        try {
            const monthName = new Date(Number(year), Number(month) - 1)
                .toLocaleString("en-US", { month: "long" });

            const doc = new PDFDocument({ margin: 40 });
            const chunks = [];

            doc.on("data", chunk => chunks.push(chunk));

            doc.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on("error", reject);

            doc.fontSize(20).text(
                `Expense Report for ${monthName} ${year}`,
                { align: "center" }
            );

            doc.moveDown();

            doc.fontSize(12).text(`User ID: ${UserId}`);
            doc.text(`User name: ${username}`);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`);

            doc.moveDown(2);

            const table = {
                headers: [
                    "Date",
                    "Description",
                    "Category",
                    "Amount"
                ],

                rows: expenses.map(expense => [
                    String(expense.date),
                    String(expense.description),
                    String(expense.category),
                    String(expense.expenseAmount)
                ])
            };

            await doc.table(table, {
                width: 515,
                columnsSize: [100, 180, 115, 120],
                padding: 5,
                prepareHeader: () => doc.font("Helvetica-Bold").fontSize(10),
                prepareRow: () => doc.font("Helvetica").fontSize(9)
            });

            doc.moveDown();

            doc.fontSize(12).text(`Total Income: ${totalCreditOftheMonth}`);
            doc.text(`Total expense: ${totalExpenseOftheMonth}`);
            doc.text(`Total savings : ${totalSavings}`);


            doc.end();

        } catch (error) {
            reject(error);
        }
    });
};

export default generateExpensePDF;
