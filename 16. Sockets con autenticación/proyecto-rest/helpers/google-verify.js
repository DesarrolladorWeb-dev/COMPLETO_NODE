require('dotenv').config()
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID,process.env.GOOGLE_CLIENT_SECRET);


const googleVerify = async (idToken = '') => {

  console.log('token desde verify ' + idToken);
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
    //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  return payload;
};



// verify().catch(console.error);
module.export  = {
  googleVerify
}

// module.exports = googleVerify;