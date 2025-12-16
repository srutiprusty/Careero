// server/utils/dataUri.js
// parser is CommonJS but ships as parser.js — with `type: module` we must include the .js extension
import DataUriParser from "datauri/parser.js";
import path from "path";

/**
 * Convert multer file object (memoryStorage) to a Data URI string.
 * Expects file to have: originalname (string) and buffer (Buffer).
 * Returns the parser.format(...) result which includes .content.
 */
const getDataUri = (file) => {
  if (!file || !file.originalname || !file.buffer) {
    throw new Error("Invalid file object passed to getDataUri");
  }

  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();

  try {
    // parser.format returns an object (the parser instance) with a .content property
    // return the full parser result so callers can access `.content` and other metadata
    const result = parser.format(extName, file.buffer);
    return result;
  } catch (error) {
    console.error("DataUri Error:", error);
    throw new Error("Failed to convert file to Data URI");
  }
};

export default getDataUri;
