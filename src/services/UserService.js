const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();
const connectToRedis = require('../config/redisConnection');

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

  async getUsers(resetCache = false) {
    const cacheKey = 'users';

    try {
      // If resetCache is true, delete the users cache
      if (resetCache) {
        await this.redisClient.del(cacheKey);
      }

      // Check if the users are available in the Redis cache
      let cachedUsers = await this.redisClient.get(cacheKey);

      if (cachedUsers) {
        console.log('Fetched users from cache');
        return JSON.parse(cachedUsers);
      }

      // If not available in cache, fetch the users from the database
      const users = await userRepository.getUsers();

      // Cache the users in Redis
      await this.redisClient.set(cacheKey, JSON.stringify(users));

      console.log('Fetched users from database');
      return users;
    } catch (error) {
      console.error('Failed to get users:', error);
      throw new Error('Failed to get users');
    }
  }

  async updateUser(id, data) {
    let transaction;

    try {
      transaction = await sequelize.transaction();

      const user = await userRepository.updateUser(id, data, {
        transaction
      });

      // Update the user data in the cache
      const cacheKey = `user:${id}`;
      await this.redisClient.set(cacheKey, JSON.stringify(user));

      await transaction.commit();

      return user;
    } catch (error) {
      if (transaction) {
        await transaction.rollback();
      }
      console.error('Failed to update user:', error);
      throw new Error('Failed to update user');
    }
  }

  async deleteUser(id) {
    try {
      // Clear user cache for the deleted user
      await this.redisClient.del(`user:${id}`);

      await userRepository.deleteUser(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async login(email, password) {
    const cacheKey = `user:${email}`;

    try {
      // Check if the user is available in the Redis cache
      const cachedUser = await this.redisClient.get(cacheKey);
      if (cachedUser) {
        console.log('Fetched user from cache for Login');
        return JSON.parse(cachedUser);
      }

      // If not available in cache, fetch the user from the database
      const user = await userRepository.getUserByEmail(email);

      // Cache the user in Redis
      await this.redisClient.set(cacheKey, JSON.stringify(user));

      console.log('Fetched user from database for Login');
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