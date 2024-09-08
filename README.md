
🌟 Task Management System API

This is a Task Management System API built with Node.js, Express, MongoDB, and JWT authentication. The API supports user registration, login, task management with role-based access control (Admin, Manager, and User), real-time task updates, and analytics. API documentation is available via Swagger UI.

Note-
Due to my account suspension i am not able to use twilio or send grid but has use smtp nodemailer sevices and there is not much difference in both services i am able to use any services and i was busy in couple of interviews task also so not able to add socket and redis if get enough time  i can add both but you can ask me about this interview now below you can read the documentation 

🚀 Features
🔒 User Authentication: Register and login with JWT-based authentication.
🔐 Role-Based Access Control: Different roles (Admin, Manager, User) with specific access levels.
📋 Task Management: Create, update, delete, and view tasks based on user roles.
📊 Task Analytics: Get detailed analytics of completed, pending, and overdue tasks.
📑 Swagger Documentation: API documentation and testing via Swagger UI.


🛠️ Prerequisites
Before starting, make sure you have the following installed:

Node.js (v16 or higher)
MongoDB (running locally or a MongoDB Atlas URI)
npm (Node Package Manager)
💻 Getting Started
1. Clone the Repository
bash
Copy code
git clone https://github.com/msatyam566/Task-management.git
cd Task-management

2. Install Dependencies
Install all necessary dependencies by running:
npm install

3. Modify the package.json Scripts
Ensure the following scripts are included in your package.json:

"scripts": {
  "start": "nodemon index.js",
}
This allows you to start the server with npm start or npm run dev for development.

4. Configure Environment Variables
Create a .env file in the root directory with the following content:
The content will be in cred foler just for accebility i provide the env in folder 

PORT=2000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

5. Start the Server
To start the server, run:


npm start
The server will run on the port specified in the .env file (default is 2000).

📜 API Documentation
The API is fully documented using Swagger. You can access the documentation via Swagger UI after starting the server.


Postman collection
I have added a postman collection folder you can access all api in that folder the collection is in json format

Access Swagger UI
📍 Navigate to: http://localhost:2000/api-docs

Here you can explore and test the API endpoints interactively.

🔐 Authentication & Usage
1. Register a User
Endpoint: /api/auth/register
Method: POST
Description: Register a new user.
Request Body:
{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "securepassword"
}


2. Login
Endpoint: /api/auth/login
Method: POST
Description: Login and receive a JWT token.
Request Body:

{
  "email": "user@example.com",
  "password": "securepassword"
}
Response:

{
  "token": "Bearer token"
}

3. Get User Profile
Endpoint: /api/user
Method: GET
Authorization: Requires Bearer token in the Authorization header.
Response: Returns the authenticated user's profile.

4. Create Task
Endpoint: /api/task
Method: POST
Authorization: Requires Bearer token.
Description: Create a new task (admin and manager roles only).
Body:
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

Authorization: Bearer <jwtToken>

Rate Limiting
The login route is protected by rate limiting to prevent brute-force attacks.
Modify rate limit configurations in middleware/rateLimiter.js.

Error Handling
401 Unauthorized: Returned when no token is provided or the token is invalid.
403 Forbidden: Returned when a user does not have the required role to access a resource.



Contact
For any questions or support, please contact:

Email: satyam28147@gmail.com
GitHub: msatyam566
