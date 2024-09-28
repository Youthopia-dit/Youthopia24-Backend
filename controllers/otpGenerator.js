const {TOTP} = require('totp-generator');
console.log(TOTP)

// Use a base32 encoded secret key
const secret = 'JBSWY3DPEHPK3PXP';

function opt(req, res){
// Generate a TOTP
try{
const {otp} = TOTP.generate(secret, {
    digits: 6,
	period: 300,
});
console.log('TOTP:', otp);
} catch(err) {
    res.status(500).json({ message: 'Server error' });
}
}



