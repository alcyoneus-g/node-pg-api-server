import * as argon2 from "argon2";

/**
 * Hash Password Method
 * @param {string} password
 * @returns {string} returns hashed password
 */

const hashPassword = async (password) => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

/**
 * comparePassword
 * @param {string} hashPassword
 * @param {string} password
 * @returns {Boolean} return True or False
 */
const comparePassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password);
};

/**
 * isValidEmail helper method
 * @param {string} email
 * @returns {Boolean} True or False
 */
const isValidEmail = (email) => {
  const regEx = /\S+@\S+\.\S+/;
  return regEx.test(email);
};

/**
 * validatePassword helper method
 * @param {string} password
 * @returns {Boolean} True or False
 */
const validatePassword = (password) => {
  if (password.length <= 5 || password === "") {
    return false;
  }
  return true;
};
/**
 * isEmpty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const isEmpty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
  if (input.replace(/\s/g, "").length) {
    return false;
  }
  return true;
};

/**
 * empty helper method
 * @param {string, integer} input
 * @returns {Boolean} True or False
 */
const empty = (input) => {
  if (input === undefined || input === "") {
    return true;
  }
};

const checkUnique = (routine) => {
  return routine === "_bt_check_unique";
};

export {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  empty,
  checkUnique,
};
