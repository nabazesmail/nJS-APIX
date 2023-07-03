const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();
const connectToRedis = require('../config/redisConnection');

const path = require('path');
const {
  sequelize,
  User,
  Details
} = require('../models');

class UserService {

  constructor() {
    this.redisClient = connectToRedis();
  }

  async createUser(data) {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const user = await User.create(data, {
        transaction
      });

      const detailsData = {
        userId: user.id,
        status: data.status
      };

      await Details.create(detailsData, {
        transaction
      });

      await transaction.commit();

      return user;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error('Failed to create user:', error);
      throw new Error('Failed to create user');
    }
  }

  async getUserById(id) {
    return new Promise((resolve, reject) => {
      // Check if user data is cached in Redis
      this.redisClient.get(`user:${id}`, async (err, cachedData) => {
        if (err) {
          console.error('Failed to fetch user from Redis cache:', err);
        }

        // If cached data exists, return it
        if (cachedData) {
          const user = JSON.parse(cachedData);
          console.log('Fetched user from Redis cache:', user);
          resolve(user);
        } else {
          try {
            // Retrieve user data from the database
            const user = await userRepository.getUserById(id);

            // Cache the user data in Redis
            this.redisClient.set(`user:${id}`, JSON.stringify(user));

            console.log('Fetched user from database:', user);
            resolve(user);
          } catch (error) {
            console.error('Failed to get user by ID:', error);
            reject(new Error('Failed to get user by ID'));
          }
        }
      });
    });
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

      if (!user) {
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

      const profileImage = file.filename;
      await userRepository.updateUserProfilePicture(id, profileImage);
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      throw new Error('Failed to upload profile picture');
    }
  }

  async getProfilePicture(userId) {
    try {
      const user = await userRepository.getUserById(userId);

      if (!user) {
        throw new Error('User not found');
      }

      const profilePicture = user.profile_image;

      if (!profilePicture) {
        return null;
      }

      return profilePicture;
    } catch (error) {
      console.error('Failed to get profile picture:', error);
      throw new Error('Failed to get profile picture');
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