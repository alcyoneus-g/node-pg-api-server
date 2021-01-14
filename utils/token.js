import jwt from "jsonwebtoken";

/**
 * Encode Token
 * @returns {string} token
 */
const generateUserToken = (email, id, firstName, lastName) => {
  const token = jwt.sign(
    {
      email,
      id,
      firstName,
      lastName,
    },
    process.env.SECRET,
    { expiresIn: "2d" }
  );
  return token;
};

/**
 * Decode Token
 * @returns {string} User payload
 */
const decodeUserToken = (token) => {
  const decoded = jwt.verify(token, process.env.SECRET);

  return decoded;
};

export { generateUserToken, decodeUserToken };
