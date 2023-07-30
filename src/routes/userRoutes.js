const express = require('express');
const UserController = require('../controllers/UserController');
const userController = new UserController();
const {authenticate} = require('../middleware/authenticate');
const loggerMiddleware = require('../middleware/Logger');
const checkAccess = require('../middleware/checkAccess');
const upload = require('../middleware/multerConfig');
const router = express.Router();

// Route for inserting data into the table
router.post('/register', userController.createUser);

// Route for logging in
router.post('/login', userController.login);

// Route for authenticating user
router.use(authenticate);

// Route for logging requests
router.use(loggerMiddleware);

// Route for getting user profile
router.get('/profile', userController.getProfile);

// Route for uploading profile picture
router.post('/upload/:userId', checkAccess('admin'), upload.single('profileImage'), userController.uploadProfilePicture);

// Route for getting profile picture
router.get('/profile-picture/:userId', userController.getProfilePicture);

// Route for getting profile pic path
router.get('/profile-pic-path/:userId',userController.getProfilePicPath);

// Route for removing profile picture
router.delete('/remove-pic/:userId', checkAccess('admin'), userController.removeProfilePicture);


// Route for getting one user by id
router.get('/users/:id', checkAccess('user'), userController.getUserById);

// Route for getting all users
router.get('/users', checkAccess('user'), userController.getUsers);

// Route for updating data in the table
router.patch('/users/:userId', checkAccess('admin'), userController.updateUser);

// Route for deleting user from the table
router.delete('/users/:userId', checkAccess('admin'), userController.deleteUser);


module.exports = router;