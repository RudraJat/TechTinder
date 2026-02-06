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
  
  // Additional validation for role if present
  if (req.body.role) {
    const validRoles = ["Frontend Developer", "Backend Developer", "Fullstack Developer", "Mobile Developer", "DevOps Engineer", "Designer", "Student", "Other"];
    
    // Check if role is an array
    if (!Array.isArray(req.body.role)) {
      throw new Error("Role must be an array");
    }
    
    // Check if array has 1-3 items
    if (req.body.role.length < 1 || req.body.role.length > 3) {
      throw new Error("You must select 1-3 roles");
    }
    
    // Check if all roles are valid
    const allValid = req.body.role.every(role => validRoles.includes(role));
    if (!allValid) {
      throw new Error("Invalid role(s) provided");
    }
  }
  
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
