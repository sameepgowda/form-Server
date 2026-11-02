import dotenv from 'dotenv';
import SibApiV3Sdk from 'sib-api-v3-sdk';

dotenv.config();

const sendEmail = async (hyperLink,receiverEmailId) => {

const defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

const transactionalApi = new SibApiV3Sdk.TransactionalEmailsApi();

const sender = {
    email:'sameepgowda97@gmail.com'
}

const receivers = [{
    email:receiverEmailId
}]

return transactionalApi.sendTransacEmail({
sender,to:receivers,subject:"Password reset",
htmlContent: `<p>Click <a href="${hyperLink}">here</a> to reset your password.</p>`

})

}

export default {sendEmail};