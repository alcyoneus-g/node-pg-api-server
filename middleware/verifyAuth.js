import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { errorMessage, status } from "../utils/status.js";

dotenv.config();
/**
 * Verify Token
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns {object|void} response object
 */

const verifyToken = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    errorMessage.error = "Token not provided";
    return res.status(status.bad).send(errorMessage);
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = {
      email: decoded.email,
      id: decoded.id,
      firstname: decoded.firstname,
      lastname: decoded.lastname,
    };
    next();
  } catch (error) {
    errorMessage.error = "Authentication Failed";
    return res.status(status.unauthorized).send(errorMessage);
  }
};

export default verifyToken;
