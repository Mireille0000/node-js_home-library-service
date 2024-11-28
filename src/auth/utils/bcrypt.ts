import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
dotenv.config();

export const encodePassword = (password: string) => {
    const salt = bcrypt.genSaltSync(Number(process.env.CRYPT_SALT) || 10)
    return bcrypt.hashSync(password, salt)
}