import bcrypt from 'bcryptjs';

const hash = '$2a$10$O2IfuHeoVId0BDVYZbD7vOz3cZF041BmBMqIFj0S0rbvssqBh8Wkm';
const pass = 'CreataLabAdmin!2026';

const match = bcrypt.compareSync(pass, hash);
console.log(`Hash matches "${pass}": ${match}`);
