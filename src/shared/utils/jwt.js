import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "7d"
    });
};
export const verifyToken = (token) => {
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        return data;
    }
    catch (error) {
        throw new Error("Invalid or expired token");
    }
};
//# sourceMappingURL=jwt.js.map