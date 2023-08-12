import { connection } from "./src/config/db.js";
import httpServer from "./src/config/http.js";
import { config } from "dotenv";

config();

async function bootstrap() {
    try {
        connection()
        httpServer.listen(process.env.PORT, () => {
            console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
}
bootstrap();
