# GEU Bus Route Management - Backend Server

Node.js + Express + MySQL backend for the bus route management system.

## Setup Instructions

### 1. Install Dependencies
```bash
cd Backend
npm install
```

### 2. Configure Database
1. Create a MySQL database:
```sql
CREATE DATABASE bus_route_management;
```

2. Import the schema:
```bash
mysql -u root -p bus_route_management < database/schema.sql
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_route_management
DB_PORT=3306
PORT=3000
```

### 3. Start Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will run on `http://localhost:3000`

## API Endpoints

### Buses
- `GET /api/buses` - Get all buses
- `GET /api/buses/:id` - Get bus by ID
- `POST /api/buses` - Add new bus
- `PUT /api/buses/:id` - Update bus
- `DELETE /api/buses/:id` - Delete bus

### Drivers
- `GET /api/drivers` - Get all drivers
- `GET /api/drivers/:id` - Get driver by ID
- `POST /api/drivers` - Add new driver
- `PUT /api/drivers/:id` - Update driver
- `DELETE /api/drivers/:id` - Delete driver

### Students
- `GET /api/students` - Get all students
- `POST /api/students` - Add new student
- `POST /api/students/requests` - Submit route request
- `GET /api/students/requests` - Get all requests
- `DELETE /api/students/:id` - Delete student

### Routes
- `GET /api/routes` - Get all routes
- `GET /api/routes/:id` - Get route by ID

### Assignments
- `GET /api/assignments` - Get all active assignments
- `POST /api/assignments` - Create new assignment
- `PUT /api/assignments/:id/status` - Update assignment status
- `POST /api/assignments/location` - Update bus location
- `GET /api/assignments/location/:bus_id` - Get bus location
- `DELETE /api/assignments/:id` - End assignment

### Updates
- `GET /api/updates?target=students` - Get updates (filter by target)
- `POST /api/updates` - Create new update
- `PUT /api/updates/:id` - Update an update
- `DELETE /api/updates/:id` - Delete update

## Testing
Test the API with:
```bash
curl http://localhost:3000/api/health
```

## Project Structure
```
Backend/
├── config/
│   └── database.js       # Database connection
├── routes/
│   ├── buses.js          # Bus routes
│   ├── drivers.js        # Driver routes
│   ├── students.js       # Student routes
│   ├── routes.js         # Route routes
│   ├── assignments.js    # Assignment routes
│   └── updates.js        # Update routes
├── database/
│   └── schema.sql        # Database schema
├── server.js             # Main server file
├── package.json          # Dependencies
└── .env                  # Environment variables
```
