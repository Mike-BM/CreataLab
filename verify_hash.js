import bcrypt from 'bcryptjs';

const hash = '$2a$10$aG7b6ncCeyOFZWJyLsuU7.L/wProBI7qoEOasl7SVJpoJpfTTSE/e'; // admin@creatalab.com
const passwords = ['CreataLabAdmin!2026', 'ChangeMe123!'];

passwords.forEach(pass => {
    const match = bcrypt.compareSync(pass, hash);
    console.log(`Password "${pass}" matches hash: ${match}`);
});
