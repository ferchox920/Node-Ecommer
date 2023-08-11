import jwt from "jsonwebtoken";

const tokenVerification = (req, res, next) => {
    try {
       
        const tokenHeader = req.header("Authorization");

        if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
            
            throw new Error("Token de autorización no proporcionado o formato no válido");
        }

     
        const token = tokenHeader.split("Bearer ")[1].trim();

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

       
        req.user = decodedToken;

        // Procede al siguiente middleware.
        next();
    } catch (error) {
       
        next(error);
    }
};

export default tokenVerification;