import User from "../models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function login(user) {
    const { email ,password } = user

    const profile = await User.findOne({email})

    if (!profile) {
        throw new Error("Credenciales inválidas");
    }

   
    const isPasswordMatching = await bcrypt.compare(password, profile.password);
    if (!isPasswordMatching) {
        throw new Error("Credenciales inválidas");
    }


    const credentials =  await authGenericResponse(profile)

    return {
        profile,
        credentials

    };
}


async function authGenericResponse(user) {


    const payload = {
        id: user.id,
        isAdmin: user.isAdmin,
    };
    return {
        access_token: jwt.sign(payload, process.env.JWT_SECRET),
        refresh_token: jwt.sign(
            {
                ...payload,
                type: 'REFRESH',
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION_TIME }, // Utiliza expiresIn para definir la duración
        ),

    };
}