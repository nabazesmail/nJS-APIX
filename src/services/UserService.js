const UserRepository = require('../repositories/UserRepository');
const userRepository = new UserRepository();
const { connectToRedis, setKeyWithTimeout } = require('../config/redisConnection'); // Import the setKeyWithTimeout function
const bcrypt = require('bcrypt');
const { sequelize, User, Details } = require('../models');

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

      // Cache the user data in Redis with a 10-minute timeout
      const cacheKey = `user:${user.id}`;
      await setKeyWithTimeout(cacheKey, JSON.stringify(user), 600);

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
      const cacheKey = `user:${id}`;

      this.redisClient.get(cacheKey, async (err, cachedData) => {
        if (err) {
          console.error('Failed to fetch user from Redis cache:', err);
        }

        if (cachedData) {
          const user = JSON.parse(cachedData);
          console.log('Fetched user from Redis cache:');
          resolve(user);
        } else {
          try {
            const user = await userRepository.getUserById(id);

            // Cache the user data in Redis with a 10-minute timeout
            await setKeyWithTimeout(cacheKey, JSON.stringify(user), 600);

            console.log('Fetched user from database:');
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
      if (resetCache) {
        await this.redisClient.del(cacheKey);
      }

      let cachedUsers = await this.redisClient.get(cacheKey);

      if (cachedUsers) {
        console.log('Fetched users from cache');
        return JSON.parse(cachedUsers);
      }

      const users = await userRepository.getUsers();

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

      const cacheKey = `user:${id}`;
      await setKeyWithTimeout(cacheKey, JSON.stringify(user), 600);

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
      await this.redisClient.del(`user:${id}`);

      await userRepository.deleteUser(id);
    } catch (error) {
      console.error('Failed to delete user:', error);
      throw new Error('Failed to delete user');
    }
  }

  async login(email, password) {
    const cacheKey = `user:${email}`;
    const cacheExpirationSeconds = 900; // 15 minutes (900 seconds)

    try {
      const cachedUser = await this.redisClient.get(cacheKey);

      if (cachedUser) {
        console.log('Fetched user from cache for Login');
        return JSON.parse(cachedUser);
      }

      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return null;
      }

      await setKeyWithTimeout(cacheKey, JSON.stringify(user), cacheExpirationSeconds);

      console.log('Fetched user from database for Login');
      return user;
    } catch (error) {
      console.error('Failed to login:', error);
      throw new Error('Failed to login');
    }
  }

  async uploadProfilePicture(id, file) {
    try {
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
