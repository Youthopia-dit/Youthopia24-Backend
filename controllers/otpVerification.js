//const totp = require('totp-generator');

//const secret = 'JBSWY3DPEHPK3PXP';

//const token = totp(secret);

//const userProvidedToken = '123456';

//if (token === userProvidedToken) {
//  console.log('OTP is valid');
//} else {
 // console.log('OTP is invalid');
//}
const totp = require("otpGenerator");
const code = require("");

console.log(code)
// '552179'
if(totp.verify(code)){
  console.log("OTP is valid")
} else {
  console.log("OTP is not valid")
}

const totp2 = new TOTP(TOTP.base32.encode('your key'));
totp2.genOTP()
