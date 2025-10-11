import multer from "multer";

const storage = multer.memoryStorage(); // guarda el archivo en memoria temporal
export const upload = multer({ storage });
