const express = require('express');
const router = express.Router();

// Import necessary middlewares and controllers
const { loginLimiter } = require("../middleware/rateLimiter");
const { registerUser, loginUser, getUserProfile } = require('../controller/userController');
const roleCheck = require('../middleware/roleCheck');
const { getTasks, updateTask, deleteTask, createTask } = require('../controller/taskController');
const validateAccessToken = require('../middleware/jwtValidation');
const { getTaskAnalytics } = require('../controller/getAnalytics');

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/register", registerUser);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       400:
 *         description: Invalid credentials
 */
router.post("/login", loginLimiter, loginUser);

/**
 * @swagger
 * /api:
 *   get:
 *     summary: Get the user profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user profile
 *       401:
 *         description: Unauthorized
 */
router.get("/", validateAccessToken, getUserProfile);

// Task management
/**
 * @swagger
 * /api/task:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date
 *               priority:
 *                 type: string
 *                 enum: [Low, Medium, High]
 *               status:
 *                 type: string
 *                 enum: [Pending, In Progress, Completed]
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/task', validateAccessToken, (req, res, next) => roleCheck(req, res, next, ["admin", "manager"]), createTask);

// Get tasks
/**
 * @swagger
 * /api/task:
 *   get:
 *     summary: Get tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of tasks
 *       401:
 *         description: Unauthorized
 */
router.get('/task', validateAccessToken, (req, res, next) => roleCheck(req, res, next, ["admin", "manager", "user"]), getTasks);

// Update task
/**
 * @swagger
 * /api/task/{id}:
 *   put:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put('/task/:id', validateAccessToken, (req, res, next) => roleCheck(req, res, next, ["admin", "manager"]), updateTask);

// Delete task
/**
 * @swagger
 * /api/task/{id}:
 *   delete:
 *     summary: Delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       401:
 *         description: Unauthorized
 */
router.delete('/task/:id', validateAccessToken, (req, res, next) => roleCheck(req, res, next, ["admin"]), deleteTask);

// Analytics
/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get task analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Task analytics data
 *       401:
 *         description: Unauthorized
 */
router.get('/analytics', validateAccessToken, getTaskAnalytics);

module.exports = router;
