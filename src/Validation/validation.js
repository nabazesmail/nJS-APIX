// Email validation helper function
function isEmailValid(email) {
    // Regular expression to match standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Password validation helper function
  function isPasswordValid(password) {
    return password.length >= 8 && password.length <= 15;
  }

  module.exports = {
    isEmailValid,
    isPasswordValid
    };