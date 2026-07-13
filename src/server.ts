import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

// const PORT = process.env.PORT || 3000;

const PORT = config.port 

async function main() {

    try {
        await prisma.$connect();
        console.log("Database connected successfully");

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting server:", error);

        await prisma.$disconnect();

        process.exit(1);
    }
}

main();