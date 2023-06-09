const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();
const path = require('path');

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

class UserService {
  async createUser(data) {
    const {
      email,
      password
    } = data;

    // Email validation
    if (!isEmailValid(email)) {
      throw new Error('Invalid email format');
    }

    // Password validation
    if (!isPasswordValid(password)) {
      throw new Error('Invalid password format');
    }

    try {
      return await userRepository.createUser(data);
    } catch (error) {
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(id) {
    try {
      return await userRepository.getUserById(id);
    } catch (error) {
      console.error('Failed to get user by ID:', error);
      throw new Error('Failed to get user by ID');
    }
  }

  async getUsers() {
    try {
      return await userRepository.getUsers();
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error('Failed to get users');
    }
  }

  async updateUser(id, data) {
    try {
      return await userRepository.updateUser(id, data);
    } catch (error) {
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id) {
    try {
      await userRepository.deleteUser(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async login(email, password) {
    try {
      const user = await userRepository.getUserByEmail(email);

      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      return user;
    } catch (error) {
      console.error('Failed to login:', error);
      throw new Error('Failed to login');
    }
  }

  async uploadProfilePicture(id, file) {
    try {
      // Validate file
      if (!file || !file.filename) {
        throw new Error('Invalid file');
      }

      const profileImage = path.join('/img/', file.filename);
      await userRepository.updateUserProfilePicture(id, profileImage);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw new Error('Failed to upload profile picture');
    }
  }


  async updateUserProfilePicture(id, profileImage) {
    try {
      return await userRepository.updateUserProfilePicture(id, profileImage);
    } catch (error) {
      console.error('Failed to update profile picture:', error);
      throw new Error('Failed to update profile picture');
    }
  }
}

module.exports = UserService;