
import jwt from "jsonwebtoken";

export const authenticateToken = ( req, res, next ) => {
    const authHeader = req.headers.authorization;

    if ( !authHeader || !authHeader.startsWith("Bearer ") ) {
        return res.status(401).json({ error: "No token provided "});
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
            status: "error",
            message: "Token invalid or expired",
            error: error.message,
        });
    }
}