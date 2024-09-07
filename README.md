Task Management System API
This is a Task Management System API built with Node.js, Express, MongoDB, and JWT authentication. The API supports user registration, login, task management with role-based access control (admin, manager, and user), real-time task updates, and analytics. Swagger is used for API documentation.

Features
User Authentication: Register and login with JWT-based authentication.
Role-Based Access Control: Different roles (Admin, Manager, User) with varying access levels.
Task Management: Create, update, delete, and view tasks based on role.
Analytics: Get task analytics (completed, pending, and overdue tasks).
Swagger Documentation: API documentation and testing with Swagger UI.
Real-Time Updates: Task notifications using Socket.io (optional).
Prerequisites
Before you begin, ensure you have the following installed on your system:

Node.js (v12 or higher)
MongoDB (running locally or a MongoDB Atlas URI)
npm (Node Package Manager)
Getting Started
1. Clone the repository
bash
Copy code
git clone https://github.com/msatyam566/Task-management.git
cd Task-management
2. Install dependencies
Run the following command to install all necessary dependencies:

bash
Copy code
npm install
3. Modify the package.json file for command
In the package.json file, make sure the following script commands are added:

json
Copy code
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
This will allow you to start the server using npm start or npm run dev for development.

4. Set up environment variables
Create a .env file in the root directory and add the following environment variables:

bash
Copy code
PORT=2000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_api_key  # Optional if using email notifications
Replace the values with your actual connection string, JWT secret, and SendGrid API key (if using email notifications).

5. Start the server
To start the server, use:

bash
Copy code
npm start
This will start the server on the port specified in the .env file (default is 2000).

API Documentation
The API is documented using Swagger. Once the server is running, you can access the API documentation via Swagger UI:

Access Swagger UI
Go to: http://localhost:2000/api-docs

Here you can interactively explore and test the API endpoints.

Authentication & Usage
1. Register
Endpoint: /api/register
Method: POST
Description: Register a new user.
Body:
json
Copy code
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securepassword"
}
2. Login
Endpoint: /api/login
Method: POST
Description: Login and receive a JWT token.
Body:
json
Copy code
{
  "email": "user@example.com",
  "password": "securepassword"
}
Response:
json
Copy code
{
  "token": "your_jwt_token_here"
}
3. Get User Profile
Endpoint: /api
Method: GET
Authorization: Requires Bearer token in the Authorization header.
Response: Returns the user profile.
4. Create Task
Endpoint: /api/task
Method: POST
Authorization: Requires Bearer token.
Description: Create a new task (admin and manager roles only).
Body:
json
Copy code
{
  "title": "Complete Project",
  "description": "Finish project documentation",
  "dueDate": "2024-09-15",
  "priority": "High",
  "status": "In Progress"
}
5. Get Tasks
Endpoint: /api/task
Method: GET
Authorization: Requires Bearer token.
Description: Retrieve tasks (available to all roles).
6. Update Task
Endpoint: /api/task/:id
Method: PUT
Authorization: Requires Bearer token.
Description: Update a task (admin and manager roles only).
7. Delete Task
Endpoint: /api/task/:id
Method: DELETE
Authorization: Requires Bearer token.
Description: Delete a task (admin role only).
8. Get Task Analytics
Endpoint: /api/analytics
Method: GET
Authorization: Requires Bearer token.
Description: Retrieve task analytics (available to all roles).
Testing the API
To test the API endpoints, you can use tools like Postman or Swagger UI.

JWT Authentication
When making requests to protected routes (e.g., /api/task), include the JWT token in the Authorization header:

bash
Copy code
Authorization: Bearer <your-jwt-token>
Rate Limiting
The login route is protected by rate limiting to prevent brute-force attacks.
Modify rate limit configurations in middleware/rateLimiter.js.
Error Handling
401 Unauthorized: Returned when no token is provided or the token is invalid.
403 Forbidden: Returned when a user does not have the required role to access a resource.
Deployment (Optional)
To deploy the API, ensure that your environment variables (e.g., MONGO_URI, JWT_SECRET) are correctly set on your hosting provider (e.g., Heroku, AWS, GCP).

License
This project is licensed under the MIT License. See the LICENSE file for details.

Contact
For any questions or support, please contact:

Email: your-email@example.com
GitHub: @your-username
How to Use:
Register a user with the /register endpoint.
Login to get the JWT token.
Use the JWT token for subsequent requests to access protected routes.