import { empty } from "../utils/validation.js";
import errors from "../config/errorMessages";
import { errorMessage, successMessage, status } from "../utils/status";
import { query } from "../database/index";

const products = {};

/**
 * Read All Products
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
products.readAll = async (req, res) => {
  const readAllProductsQuery = "SELECT * FROM bd_products ORDER BY id DESC";
  try {
    const { rows } = await query(readAllProductsQuery);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = errors.products.noProducts;
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Read Given Product
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
products.readOne = async (req, res) => {
  const { productId } = req.params;
  const readAllProductsQuery = "SELECT * FROM bd_products WHERE id=$1";
  try {
    const { rows } = await query(readAllProductsQuery, [productId]);
    const dbResponse = rows;
    if (dbResponse[0] === undefined) {
      errorMessage.error = errors.products.noGivenProduct;
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = dbResponse;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Create Product
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
products.create = async (req, res) => {
  const { name, picture, description, price, category } = req.body;
  const readAllProductsQuery = `INSERT INTO
          bd_products(name, picture, description, price, category)
          VALUES($1, $2, $3, $4, $5)
          returning *`;
  try {
    const { rows } = await query(readAllProductsQuery, [
      name,
      picture,
      description,
      price,
      category,
    ]);
    const dbResponse = rows[0];
    successMessage.data = dbResponse;
    return res.status(status.created).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Delete Product
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
products.delete = async (req, res) => {
  const { productId } = req.params;
  const readAllProductsQuery = `DELETE FROM bd_products WHERE id=$1 returning *`;

  try {
    const { rows } = await query(readAllProductsQuery, [productId]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = errors.products.deleteProductFailed;
      return res.status(status.notfound).send(errorMessage);
    }
    successMessage.data = {};
    successMessage.data.message = errors.products.deleteProductSuccess;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

/**
 * Update Product
 * @param {object} req
 * @param {object} res
 * @returns {object} reflection object
 */
products.update = async (req, res) => {
  const { productId } = req.params;
  const { name, picture, description, price, category } = req.body;

  if (
    empty(name) ||
    empty(picture) ||
    empty(description) ||
    empty(price) ||
    empty(category)
  ) {
    errorMessage.error = errors.products.updateProductDataInvalid;
    return res.status(status.bad).send(errorMessage);
  }

  const findProductQuery = `SELECT * FROM bd_products WHERE id=$1`;
  const updateProductQuery = `UPDATE bd_products SET name=$1, picture=$2, description=$3, price=$4, category=$5 WHERE id=$6 returning *`;

  try {
    const { rows } = await query(findProductQuery, [productId]);
    const dbResponse = rows[0];
    if (!dbResponse) {
      errorMessage.error = errors.products.noGivenProduct;
      return res.status(status.notfound).send(errorMessage);
    }

    const response = await query(updateProductQuery, [
      name,
      picture,
      description,
      price,
      category,
      productId,
    ]);

    const dbResult = response.rows[0];
    successMessage.data = dbResult;
    return res.status(status.success).send(successMessage);
  } catch (error) {
    errorMessage.error = errors.generalErr;
    return res.status(status.error).send(errorMessage);
  }
};

export default products;
