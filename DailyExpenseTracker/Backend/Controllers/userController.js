import { User, ForgotPasswordRequest } from "../../Database/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import emailService from "../Services/emailService.js";
import { randomUUID } from "crypto";
import { sequelize } from "../../Database/db.js";
import renderHTML from "../Services/renderHTML.js";
import dotenv from "dotenv";
dotenv.config();

const JWTkey = process.env.JWT_KEY;

const createUser = async (req, res) => {
  if (req.body.username && req.body.email && req.body.password) {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const createId = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      const responseData = {
        username,
        email,
      };
      return res.status(201).json({
        message: "User created",
        userInfo: responseData,
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    }
  } else {
    return res.status(400).json({ message: "Bad request" });
  }
};

const userLogin = async (req, res) => {
  if (req.body.email && req.body.password) {
    try {
      const { email, password } = req.body;
      const userInfo = await User.findOne({ where: { email }, raw: true });
      if (!userInfo) {
        return res
          .status(404)
          .json({ message: "User not found", success: false });
      } else {
        const passwordsMatch = await bcrypt.compare(
          password,
          userInfo.password,
        );
        if (passwordsMatch) {
          const token = jwt.sign({ UserId: userInfo.id }, JWTkey, {
            expiresIn: "1h",
          });
          res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
          });
          return res.status(200).json({
            message: "Login successful",
            success: true,
            isPremium: userInfo.isPremium,
          });
        } else {
          return res
            .status(401)
            .json({ message: "User not authorized", success: false });
        }
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
      console.log(err);
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};

const getLeaderBoardData = async (req, res, next) => {
  if (req.UserId) {
    try {
      const leaderBoardData = await User.findAll({
        attributes: ["username", "totalExpense"],
        order: [["totalExpense", "desc"]],
        raw: true,
      });

      res.status(200).json({ leaderBoardList: leaderBoardData });
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({ message: "Bad request" });
  }
};

const sendForgotPasswordLink = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ message: "Bad request" });
  }

  try {
    const receiverEmailId = req.body.email;
    const userInfo = await User.findAll({
      where: { email: receiverEmailId },
      raw: true,
    });
    if (userInfo.length == 0) {
      return res.status(400).json({ message: "User not found" });
    }
    const id = randomUUID();
    await ForgotPasswordRequest.create({
      id,
      UserId: userInfo[0].id,
      isActive: true,
    });
    const hyperLink = `${process.env.CLIENT_ORIGIN}/api/expenseTracker/user/showResetForm/${id}`;
    await emailService.sendEmail(hyperLink, receiverEmailId);
    return res.status(204).json();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

const showResetForm = async (req, res) => {
  if (!req.params.token) {
    return res
      .status(400)
      .send(
        renderHTML.renderPage(
          "Invalid request",
          "Please go back and try again.",
        ),
      );
  }
  try {
    const token = req.params.token;
    const forgotPasswordData = await ForgotPasswordRequest.findAll({
      where: { id: token, isActive: true },
      raw: true,
    });
    if (forgotPasswordData.length == 0) {
      return res
        .status(400)
        .send(
          renderHTML.renderPage(
            "Link expired",
            "This reset link is invalid or has expired. Please request a new one.",
          ),
        );
    }
    res.send(
      renderHTML.renderPage(
        "Reset password",
        "Enter your new password.",
        `
            <form method="POST" action="${process.env.CLIENT_ORIGIN}/api/expenseTracker/user/resetPassword">
                <input type="hidden" name="token" value="${token}">
                <input type="password" name="newPassword" placeholder="New password" minlength="8" required>
                <button type="submit">Change password</button>
            </form>`,
      ),
    );
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send(
        renderHTML.renderPage(
          "Something went wrong",
          "Please try again later.",
        ),
      );
  }
};

const resetPassword = async (req, res) => {
  if (!req.body.newPassword || !req.body.token) {
    return res.status(400).json({ message: "Bad request" });
  }
  const t4 = await sequelize.transaction();
  try {
    const { token, newPassword } = req.body;
    const forgotPasswordData = await ForgotPasswordRequest.findAll({
      where: { id: token, isActive: true },
      raw: true,
    });
    if (forgotPasswordData.length == 0) {
      await t4.rollback();
      return res
        .status(400)
        .send(
          renderHTML.renderPage(
            "Link expired",
            "This reset link is invalid or has expired. Please request a new one.",
          ),
        );
    }
    const UserId = forgotPasswordData[0].UserId;
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update(
      { password: hashedPassword },
      { where: { id: UserId }, transaction: t4 },
    );
    await ForgotPasswordRequest.update(
      { isActive: false },
      { where: { id: token }, transaction: t4 },
    );
    await t4.commit();
    res.send(
      renderHTML.renderPage(
        "Password changed",
        "Your password has been changed successfully. You can now log in with your new password.",
      ),
    );
  } catch (err) {
    console.log(err);
    await t4.rollback();
    res
      .status(500)
      .send(
        renderHTML.renderPage(
          "Something went wrong",
          "Please try again later.",
        ),
      );
  }
};

export default {
  createUser,
  userLogin,
  getLeaderBoardData,
  sendForgotPasswordLink,
  showResetForm,
  resetPassword,
};

//401 is authentication and 403 is access

// Method	What happens?
// next()	Moves to the next regular middleware/handler
// next(err)	Skips regular middleware and moves to error-handling middleware
// next("route")	next("route") skips the rest of the current route, not every route in your application.

// const user = User.findByPk(1);
//user.totalExpense += 100;

// import axios from 'axios';

// export const sendEmail = async ({ to, subject, htmlContent }) => {
//     return axios.post(
//         'https://api.brevo.com/v3/smtp/email',
//         {
//             sender: { name: 'Expense Tracker', email: process.env.BREVO_SENDER_EMAIL },
//             to: [{ email: to }],
//             subject,
//             htmlContent
//         },
//         { headers: { 'api-key': process.env.BREVO_API_KEY } }
//     );
// };
//const response = await sendEMail({to,subject, htmlContent});
//The sendEMail function returns a pending promise whoch needs to be resolved

// Booking.findAll({include:[{model:User,attributes:["name","email"],required:true},{model:countReset,attributes:["courseName","fee"],required:true}],where:{paymentStatus:"paid"}})

// const users = await User.findAll({
//     attributes: ["name", "email"],
//     include: [
//         {
//             model: Booking,
//             where: { paymentStatus: "paid" },
//             required: true,
//             include: [
//                 {
//                     model: Course,
//                     attributes: ["courseName", "fee"]
//                 }
//             ]
//         }
//     ]
// });

// Customer.findAll({attributes:["name","email"],include:[
//     {model:Order,attributes:["status","totalAmount"],where:{status:"delivered"},
//     include:[{model:Product , attributes:["productName","price"] }]
// }]})

// User.findAll({attributes:["name"],include:[{model:Expense,attributes:["amount"],where:{amount:{[Op.gt]:300}},include:[{model:Category, attributes:["categoryName"],required:true}],required:true}],where:{name:{[Op.in]:["Alice","Bob"]}}})

// User.findAll({
//   attributes: ["Name"],
//   include: [
//     {
//       model: Expense,
//       where: { amount: { [Op.gt]: 0 } },
//       attributes: [
//         [fn("SUM", col("amount")), "totalAmount"],
//         [fn("count", col("id")), "expenseCount"],
//       ],
//       include: [{ model: Category,required:true, attributes: ["categoryName"] }]
//
//     },
//   ],
//  group:["Expense.UserId","Expense.CategoryId"],
// });

//Remember: Group belongs at the top level of the query, always.

//If something fails mid-generation, the Promise rejects so your await throws an error hence
// it moves to catch block.
