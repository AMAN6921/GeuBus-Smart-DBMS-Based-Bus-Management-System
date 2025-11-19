# 🚀 GEU Bus Route Management - Setup Guide

## Prerequisites
- ✅ Node.js installed
- ✅ MySQL installed
- ✅ npm installed

## Step-by-Step Setup

### 1. Setup Database

Open your terminal and run:

```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL password when prompted
```

Then in MySQL console, run:

```sql
-- Create database
CREATE DATABASE bus_route_management;

-- Exit MySQL
exit;
```

Now import the schema:

```bash
# From the project root directory
mysql -u root -p bus_route_management < Backend/database/schema.sql
# Enter your MySQL password when prompted
```

### 2. Configure Backend

Edit `Backend/.env` file and update your MySQL password:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=Devraj!sevenayoyoXD
DB_NAME=bus_route_management
DB_PORT=3306
PORT=3000
```

### 3. Start Backend Server

```bash
cd Backend_Related
npm start
```

You should see:
```
✅ Database connected successfully
🚀 Server running on http://localhost:3000
📡 API available at http://localhost:3000/api
```

### 4. Open Frontends

Open these files in your browser:

1. **Admin Dashboard**: `Frontend_Related/admin_frontend.html`
2. **Driver Dashboard**: `Frontend_Related/driver_frontend.html`
3. **Student Portal**: `Frontend_Related/student_frontend.html`

## Testing the Setup

### Test Backend API
Open browser and go to: `http://localhost:3000/api/health`

You should see:
```json
{"status":"OK","message":"Server is running"}
```

### Test Database Connection
```bash
mysql -u root -p bus_route_management -e "SHOW TABLES;"
```

You should see all the tables listed.

## Troubleshooting

### MySQL Connection Error
- Make sure MySQL is running: `brew services start mysql` (on Mac)
- Check your password in `.env` file
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Port Already in Use
- Change PORT in `.env` to another port (e.g., 3001)
- Or kill the process using port 3000: `lsof -ti:3000 | xargs kill`

### Dependencies Error
```bash
cd Backend
rm -rf node_modules package-lock.json
npm install
```

## Quick Start Commands

```bash
# Start backend server
cd Backend && npm start

# Start backend in development mode (auto-reload)
cd Backend && npm run dev

# Check if server is running
curl http://localhost:3000/api/health
```

## Project Structure

```
GEU Bus Management/
├── Frontend_Related/
│   ├── admin_frontend.html      # Admin dashboard
│   ├── driver_frontend.html     # Driver interface
│   └── student_frontend.html    # Student portal
├── Backend/
│   ├── config/                  # Database config
│   ├── routes/                  # API routes
│   ├── database/                # SQL schema
│   ├── server.js                # Main server
│   └── .env                     # Environment variables
└── Databases_Related/           # SQL reference files
```

## Next Steps

1. ✅ Setup database
2. ✅ Configure .env
3. ✅ Start backend server
4. ✅ Open frontends in browser
5. 🎉 Start using the system!

## Support

If you encounter any issues:
1. Check the console for error messages
2. Verify MySQL is running
3. Ensure all dependencies are installed
4. Check `.env` configuration
