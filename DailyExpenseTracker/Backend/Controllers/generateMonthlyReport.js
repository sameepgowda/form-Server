import {
    PutObjectCommand,
    GetObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3 from "../Services/s3.js"
import generateExpensePDF from "../Services/generateExpensePDF.js";
import {User, ExpenseData} from "../../Database/index.js";
import { Op } from "sequelize";

const downloadExpenses = async (req, res, next) => {

    const UserId = req.UserId;
  const month = Number(req.body.month);
  const year = Number(req.body.year);



  if (!(UserId && month && year)) {
    return res.status(400).json({ message: "bad request" });
  }


    try {

        // 1. Check premium status
        const user = await User.findByPk(UserId);
  const username = user.username;

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.isPremium) {
            return res.status(401).json({
                message: "Premium membership required"
            });
        }

        // 2. Fetch all expenses belonging to this user
        

        const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate =
      month < 12
        ? `${year}-${String(month + 1).padStart(2, "0")}-01`
        : `${year + 1}-01-01`;

    const expenses = await ExpenseData.findAll({
      where: {
        UserId,
        date: { [Op.gte]: startDate, [Op.lt]: endDate },
      },
      order: [
        ["date", "desc"],
        ["id", "desc"],
      ],
      raw: true,
    });

        // 3. Generate PDF
        const pdfBuffer = await generateExpensePDF(
            expenses,
            UserId,
            month,year,
            username
        );

        // 4. Generate unique S3 key
        const fileName = `expenses-${Date.now()}.pdf`;

        const s3Key = `expense-reports/${UserId}/${fileName}`;

        // 5. Upload PDF to S3
        await s3.send(
            new PutObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Key,
                Body: pdfBuffer,
                ContentType: "application/pdf"
            })
        );

       

        // 7. Generate temporary download URL
        const url = await getSignedUrl(
            s3,
            new GetObjectCommand({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: s3Key
            }),
            { expiresIn: 3600 }
        );

        // 8. Return URL to frontend
        return res.status(200).json({
            message: "Expense report generated successfully",
            url,
            fileName
        });

    } catch (err) {
        console.error(err);
        next(err);
    }
};

export default {downloadExpenses};