const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getUserDetails, changePassword } = require('../controllers/authController');
const { authenticate, roleAuth } = require('../middleware/authMiddleware');


/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: The user's name
 *         password:
 *           type: string
 *           description: The user's password
 *       example:
 *         username: johndoe
 *         password: Password123
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: The auth managing API
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Create a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       500:
 *         description: Some server error
 */


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The user's username
 *               password:
 *                 type: string
 *                 description: The user's password
 *             example:
 *               username: testuser
 *               password: password123
 *     responses:
 *       200:
 *         description: Authentication successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The user ID
 *                 username:
 *                   type: string
 *                 role:
 *                   type: string
 *                 token:
 *                   type: string
 *                   description: Bearer token for authorization
 *               example:
 *                 _id: 507f191e810c19729de860ea
 *                 username: testuser
 *                 role: reader
 *                 token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /profile:
 *   put:
 *     summary: Update user profile
 *     description: Allows users to update their profile information including username.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               bio:
 *                 type: string
 *               profilePicture:
 *                 type: string
 *               socialLinks:
 *                 type: object
 *                 properties:
 *                   github:
 *                     type: string
 *                   twitter:
 *                     type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *       400:
 *         description: Username already taken.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user details
 *     description: Retrieves the details of the logged-in user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: User not found.
 *       500:
 *         description: Server error.
 */

/**
 * @swagger
 * /change-password:
 *   put:
 *     summary: Change password
 *     description: Allows users to change their password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully.
 *       400:
 *         description: Old password is incorrect.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Server error.
 */


router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', authenticate, updateUserProfile);
router.get('/profile', authenticate, getUserDetails, roleAuth(["admin"]));
router.put('/change-password', authenticate, changePassword);


module.exports = router;
