import bcrypt from "bcryptjs";
export const hashpassword = async (password) => {
    return bcrypt.hash(password, 10);
};
export const comparePassword = async (password, hashedPassword) => {
    return bcrypt.compare(password, hashedPassword);
};
//# sourceMappingURL=hash.js.map