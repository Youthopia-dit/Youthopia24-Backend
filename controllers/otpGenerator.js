const {TOTP} = require('totp-generator');
console.log(TOTP)

// Use a base32 encoded secret key
const secret = 'JBSWY3DPEHPK3PXP';
let currentOtp = '';
function generateOtp(req, res){
// Generate a TOTP
try{
    currentOtp = TOTP.generate(secret, {
    digits: 6,
	period: 300,
});
console.log('TOTP:', currentOtp);
res.status(200).json({ message: 'OTP generated successfully' });
} catch(err) {
    res.status(500).json({ message: 'Server error' });
}
}

// Function to verify OTP
function verifyOtp(req, res) {
    try {
        const { userOtp } = req.body;

        // Step 1: Verify that the OTP entered by the user is 6 digits long
        if (!/^\d{6}$/.test(userOtp)) {
            return res.status(400).json({ message: 'OTP must be 6 digits long' });
        }

        // Step 2: Compare the user-entered OTP with the generated OTP stored in `currentOtp`
        if (userOtp === currentOtp) {
            return res.status(200).json({ message: 'OTP verified successfully' });
        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = { generateOtp, verifyOtp };




