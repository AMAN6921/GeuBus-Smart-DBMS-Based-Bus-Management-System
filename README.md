# 🚌 GEU Bus Route Management System

A comprehensive real-time bus tracking and management system for Graphic Era University.

## 📋 Features

- **Admin Dashboard**: Manage buses, drivers, students, routes with full CRUD operations
- **Driver Portal**: Real-time GPS tracking, countdown timer, journey management
- **Student Portal**: Live bus tracking, boarding system, dual location display
- **Real-time Updates**: Live location tracking with map visualization
- **Smart Notifications**: Countdown alerts and announcements

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript, Leaflet.js
- **Backend**: Node.js, Express.js
- **Database**: MySQL

## 📦 Quick Start

```bash
# Clone repository
git clone https://github.com/AMAN6921/GEU-Bus-Management.git
cd GEU-Bus-Management

# Setup database
mysql -u root -p bus_route_management < Backend_Related/database/schema.sql

# Install dependencies
cd Backend_Related
npm install

# Configure environment
cp .env.example .env
# Edit .env with your MySQL password

# Start server
npm start

# Open loginpage.html in browser
```

## 🔐 Default Credentials

- **Admin**: admin / admin123
- **Student**: 230211160 / student123
- **Driver**: 9999999999 / driver123

## 📁 Project Structure

```
├── Backend_Related/        # Node.js backend
├── Frontend_Related/       # HTML/CSS/JS frontend
├── loginpage.html         # Main entry point
└── README.md
```

## 🚀 Key Features

✅ Real-time GPS tracking (🚌 bus + 🧑 student)
✅ Duplicate boarding prevention
✅ 45-minute countdown timer
✅ Live monitoring dashboard
✅ Smart notifications
✅ Full CRUD operations

## 👨‍💻 Developer

**Aman Devrani** - [@AMAN6921](https://github.com/AMAN6921)

## 📝 License

MIT License

---

Made with ❤️ for Graphic Era University
