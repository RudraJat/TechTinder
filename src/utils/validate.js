const validator = require("validator");

const validateSignupData = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  } else if (!validator.isEmail(email)) {
    throw new Error("Invalid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Password is not strong enough");
  }
};

const validateEditProfileData = (req) => {
  const allowedData = [
    "firstName",
    "lastName",
    "bio",
    "skills",
    "photoUrl",
    "age",
    "gender",
  ];
  const isEditAllowd = Object.keys(req.body).every((fields) =>
    allowedData.includes(fields)
  );
  return isEditAllowd;
};
module.exports = {
  validateSignupData,
  validateEditProfileData,
};
