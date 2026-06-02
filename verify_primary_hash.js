import bcrypt from 'bcryptjs';

const hash = '$2a$10$gcVzdqu8CL78Sc4JdAiYNeRzjvdVXwXtufnvL8j2LQjccd.dckoIm'; // brianmuema928@gmail.com
const passwords = ['CreataLabAdmin!2026', 'ChangeMe123!'];

passwords.forEach(pass => {
    const match = bcrypt.compareSync(pass, hash);
    console.log(`Password "${pass}" matches hash: ${match}`);
});
