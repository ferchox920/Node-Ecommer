import { expressjwt } from "express-jwt";


function authJwt(){
    const secret = process.env.JWT_SECRET;
    const api = process.env.API_URL;

    
    return expressjwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked
       
    }).unless({
        path: [
            {url: /\/public\/uploads(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/products(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/category(.*)/ , methods: ['GET', 'OPTIONS'] },
            {url: /\/api\/v1\/orders(.*)/,methods: ['GET', 'OPTIONS', 'POST']},
            `${api}/auth/login`,
            `${api}/user/register`,
        ]
    })
}

async function isRevoked(req, payload) {
    if(!payload.payload.isAdmin) {
       return true;
    }

    return false;
}



export default authJwt;