const errors = {
  generalErr: "Operation was not successful",
  authentication: {
    signUp: {
      emptyInput:
        "Email, Password, First Name and Last Name fields cannot be empty",
      invalidEmail: "Please enter a valid Email",
      invalidPassword: "Password must be more than five(5) characters",
      emailExist: "User with that EMAIL already exist",
    },
    login: {
      emptyInput: "Email or Password detail is missing",
      invalidInput: "Please enter a valid Email or Password",
      emailNotExist: "User with this email does not exist",
      wrongPassword: "Password doesn't match",
      verifyEmail: "Please verify your email",
    },
    forgot: {
      invalidEmail:
        "This email is not associated with any account. Double-check your email address and try again.",
    },
    reset: "Password reset token is invalid or has expired.",
    emailconfirmed: "Can't confirm email",
  },
  products: {
    noProducts: "There are no products",
    noGivenProduct: "This product isn't existed",
    deleteProductFailed: "You have no product with that id",
    deleteProductSuccess: "Product deleted successfully",
    updateProductDataInvalid: "New product data is invalid",
  },
};

export default errors;
