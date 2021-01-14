import moment from "moment";
import crypto from "crypto";
import errors from "../config/errorMessages";
import { errorMessage, successMessage, status } from "../utils/status";
import {
  hashPassword,
  comparePassword,
  isValidEmail,
  validatePassword,
  isEmpty,
  checkUnique,
} from "../utils/validation.js";
import { generateUserToken, decodeUserToken } from "../utils/token";
import {
  sendConformationRequest,
  sendPasswordResetRequest,
  sendPasswordResetedNotify,
} from "../utils/mailjet";
import { query } from "../database/index";

const auth = {};

/**
 * User Log In
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.login = async (req, res) => {
  const { email, password } = req.body;
  if (isEmpty(email) || isEmpty(password)) {
    errorMessage.error = errors.authentication.login.emptyInput;
    return res.status(status.bad).send(errorMessage);
  }
  if (!isValidEmail(email) || !validatePassword(password)) {
    errorMessage.error = errors.authentication.login.invalidInput;
    return res.status(status.bad).send(errorMessage);
  }
  const loginUserQuery = "SELECT * FROM bd_users WHERE email = $1";
  try {
    const { rows } = await query(loginUserQuery, [email]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = errors.authentication.login.emailNotExist;
      return res.status(status.notfound).send(errorMessage);
    }
    if (!dbResponse.emailconfirmed) {
      errorMessage.error = errors.authentication.login.verifyEmail;
      return res.status(status.bad).send(errorMessage);
    }
    if (!(await comparePassword(dbResponse.password, password))) {
      errorMessage.error = errors.authentication.login.wrongPassword;
      return res.status(status.bad).send(errorMessage);
    }
    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.firstname,
      dbResponse.lastname
    );
    delete dbResponse.password;
    successMessage.data = dbResponse;
    successMessage.data.token = token;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * User Sign Up
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.signup = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  const createdAt = moment(new Date());

  if (
    isEmpty(email) ||
    isEmpty(firstName) ||
    isEmpty(lastName) ||
    isEmpty(password)
  ) {
    errorMessage.error = errors.authentication.signUp.emptyInput;
    return res.status(status.bad).send(errorMessage);
  }

  if (!isValidEmail(email)) {
    errorMessage.error = errors.authentication.signUp.invalidEmail;
    return res.status(status.bad).send(errorMessage);
  }

  if (!validatePassword(password)) {
    errorMessage.error = errors.authentication.signUp.invalidPassword;
    return res.status(status.bad).send(errorMessage);
  }

  const hashedPassword = await hashPassword(password);

  const createUserQuery = `INSERT INTO
      bd_users(email, firstname, lastname, password, createdat)
      VALUES($1, $2, $3, $4, $5)
      returning *`;

  try {
    const { rows } = await query(createUserQuery, [
      email,
      firstName,
      lastName,
      hashedPassword,
      createdAt,
    ]);
    const dbResponse = rows[0];
    delete dbResponse.password;

    const token = generateUserToken(
      dbResponse.email,
      dbResponse.id,
      dbResponse.firstname,
      dbResponse.lastname
    );
    successMessage.data = dbResponse;
    successMessage.data.token = token;

    sendConformationRequest(email, firstName, lastName, token);
    return res.status(status.created).send(successMessage);
  } catch (error) {
    if (checkUnique(error.routine)) {
      errorMessage.error = errors.authentication.signUp.emailExist;
      return res.status(status.conflict).send(errorMessage);
    }
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Forgot Password
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.forgotPassword = async (req, res) => {
  const { email } = req.body;

  const findUserQuery = "SELECT * FROM bd_users WHERE email = $1";
  try {
    const { rows } = await query(findUserQuery, [email]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = errors.authentication.forgot.invalidEmail;
      return res.status(status.unauthorized).send(errorMessage);
    }
    const resetPasswordToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpires = moment(Date.now() + 1800000); //expires in 30 mins

    const updateResetTokenExpriesQuery =
      "UPDATE bd_users SET resetpasswordtoken = $1, resetpasswordexpires = $2 WHERE email = $3";

    try {
      await query(updateResetTokenExpriesQuery, [
        resetPasswordToken,
        resetPasswordExpires,
        email,
      ]);
    } catch (error) {
      return res.status(status.error).send(errorMessage);
    }

    sendPasswordResetRequest(
      dbResponse.email,
      dbResponse.firstname,
      dbResponse.lastname,
      resetPasswordToken
    );
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Reset Password
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const hashedPassword = await hashPassword(password);
  const findMatchUserQuery =
    "SELECT * FROM bd_users WHERE resetpasswordtoken = $1 AND resetpasswordexpires >= $2";

  try {
    const { rows } = await query(findMatchUserQuery, [
      token,
      moment(Date.now()),
    ]);
    const dbResponse = rows[0];

    if (!dbResponse) {
      errorMessage.error = errors.authentication.reset;
      return res.status(status.unauthorized).send(errorMessage);
    }
    const updatePasswordQuery =
      "UPDATE bd_users SET resetpasswordtoken = NULL, resetpasswordexpires = NULL, password = $1 WHERE resetpasswordtoken = $2";

    try {
      await query(updatePasswordQuery, [hashedPassword, token]);
    } catch (error) {
      return res.status(status.error).send(errorMessage);
    }

    sendPasswordResetedNotify(
      dbResponse.email,
      dbResponse.firstname,
      dbResponse.lastname
    );
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Logout
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.logout = async (req, res) => {
  return res.send("Auth logout");
};

/**
 * Email Confirmation
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
auth.confirmEmail = async (req, res) => {
  const { token } = req.params;
  const { id } = decodeUserToken(token);

  const activateUserQuery =
    "UPDATE bd_users SET emailconfirmed = TRUE WHERE id = $1";

  try {
    await query(activateUserQuery, [id]);
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

export default auth;
