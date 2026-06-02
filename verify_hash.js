import bcrypt from 'bcryptjs';

const hash = '$2a$10$aG7b6ncCeyOFZWJyLsuU7.L/wProBI7qoEOasl7SVJpoJpfTTSE/e'; // admin@creatalab.com
const passwords = [process.env.ADMIN_DEFAULT_PASSWORD || ''];

passwords.forEach(pass => {
    const match = bcrypt.compareSync(pass, hash);
    console.log(`Password "${pass}" matches hash: ${match}`);
});
