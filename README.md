# School Payment and Dashboard Application

A full-stack application for managing school payments and transactions, featuring a NestJS backend and React frontend.

## Live Demos
- Frontend: [https://edviron-assignment-weld.vercel.app](https://edviron-assignment-weld.vercel.app)
- Backend API: [https://edvironassignment.onrender.com/api](https://edvironassignment.onrender.com/api)

## Backend

### Features
- JWT Authentication
- Transaction management
- School-specific transaction tracking
- Webhook integration for payment status updates
- MongoDB integration

### API Endpoints

#### Public Routes
```
POST /api/signup - User registration
POST /api/login - User authentication
POST /api/webhook - Payment status webhook
POST /api/update-status - Manual transaction status update
```

#### Protected Routes (Require JWT)
```
GET /api/transactions - Fetch all transactions
GET /api/transactions/:schoolId - Get school-specific transactions
GET /api/transactions/collect/:collectId - Get transactions by collect ID
GET /api/transactions/gateway/:gateway - Filter by payment gateway
GET /api/transactions/status/:customOrderId - Check transaction status
GET /api/transactions/:status - Filter by transaction status
GET /api/transactions/:amount - Filter by order amount
GET /api/transactions/transaction-amount/:amount - Filter by transaction amount
POST /api/create-payment - Create new payment request
```

### Backend Setup

1. Clone the repository
2. Navigate to server directory:
   ```bash
   cd server
   npm install
   ```
3. Configure environment variables:
   ```
   PORT=
   MONGODB_URI=
   JWT_SECRET=
   API_KEY=
   PG_KEY=
   ```
4. Start the server:
   ```bash
   npm run start
   ```

## Frontend

### Features
- User authentication (signup/login)
- Interactive dashboard with real-time data visualization
- Transaction management interface
- School-specific transaction viewing
- Status checking functionality
- Filter and search capabilities
- Responsive design

### Transaction Table Columns
- Collect ID
- School ID
- Gateway
- Order Amount
- Transaction Amount
- Status
- Custom Order ID

### Frontend Setup

1. Navigate to client directory:
   ```bash
   cd client
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```

### Dashboard Features
- Real-time transaction visualization using pie charts and bar charts
- Recent transactions display
- Advanced filtering options:
  - Date range selection
  - Status filter (Success, Pending, Failed)
  - School ID filter
  - Custom Order ID search

## Tech Stack

### Backend
- Node.js with NestJS
- MongoDB
- JWT Authentication
- Express middleware

### Frontend
- React
- Tailwind CSS
- Axios for API integration
- React Router for navigation
- Chart.js for data visualization

## Security
- Protected routes using JWT authentication
- Secure API endpoints
- Environment variable configuration
- Input validation and sanitization

## Deployment
- Backend: Deployed on Render
- Frontend: Deployed on Vercel
- Database: MongoDB Atlas

For any questions or issues, please contact: Email : kaletishyam@gmail.com , 7702762749 ,Portfolio : [text](https://samsonkaleti.netlify.app/)