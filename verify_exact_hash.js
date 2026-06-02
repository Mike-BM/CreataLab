import bcrypt from 'bcryptjs';

const hash = '$2a$10$O2IfuHeoVId0BDVYZbD7vOz3cZF041BmBMqIFj0S0rbvssqBh8Wkm';
const DEFAULT_PASS = process.env.ADMIN_DEFAULT_PASSWORD;
if (!DEFAULT_PASS) {
  console.error("FATAL: ADMIN_DEFAULT_PASSWORD is required in .env");
  process.exit(1);
}

const match = bcrypt.compareSync(DEFAULT_PASS, hash);
console.log(`Hash matches "${DEFAULT_PASS}": ${match}`);
