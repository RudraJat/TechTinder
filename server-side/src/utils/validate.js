const validator = require("validator");
const bcrypt = require("bcrypt");

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
    "role",
  ];
  const isEditAllowd = Object.keys(req.body).every((fields) =>
    allowedData.includes(fields)
  );
  return isEditAllowd;
};

const validatePassword = (req) => {
    const { oldPassword, newPassword } = req.body;
    const isOldPasswordMatch = bcrypt.compareSync(oldPassword, req.user.password);
    if(!isOldPasswordMatch){
        throw new Error("Old password does not match");
    }
    if(!validator.isStrongPassword(newPassword)){
        throw new Error("New password is not strong enough");
    }
    return true;
};

module.exports = {
  validateSignupData,
  validateEditProfileData,
  validatePassword
};
