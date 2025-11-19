-- GEU Bus Route Management System - Complete Database Schema

CREATE DATABASE IF NOT EXISTS bus_route_management;
USE bus_route_management;

-- Buses Table
CREATE TABLE IF NOT EXISTS buses (
    bus_id INT PRIMARY KEY AUTO_INCREMENT,
    number INT NOT NULL UNIQUE,
    reg VARCHAR(20) NOT NULL UNIQUE,
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Drivers Table
CREATE TABLE IF NOT EXISTS drivers (
    driver_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    contact VARCHAR(15) NOT NULL UNIQUE,
    license_number VARCHAR(50),
    status ENUM('active', 'on_leave', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(200) NOT NULL,
    route_description TEXT,
    starting_point VARCHAR(100),
    ending_point VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Assignments Table (Driver + Bus + Route)
CREATE TABLE IF NOT EXISTS assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    driver_id INT NOT NULL,
    bus_id INT NOT NULL,
    route_name VARCHAR(200) NOT NULL,
    route_description TEXT,
    status ENUM('assigned', 'departing', 'departed', 'completed') DEFAULT 'assigned',
    departure_time DATETIME,
    left_early BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (driver_id) REFERENCES drivers(driver_id) ON DELETE CASCADE,
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE
);

-- Student Requests Table
CREATE TABLE IF NOT EXISTS student_requests (
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    route_id INT,
    route_name VARCHAR(200) NOT NULL,
    status ENUM('waiting', 'fulfilled', 'cancelled') DEFAULT 'waiting',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Bus Locations Table (Real-time tracking)
CREATE TABLE IF NOT EXISTS bus_locations (
    location_id INT PRIMARY KEY AUTO_INCREMENT,
    bus_id INT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_bus (bus_id),
    FOREIGN KEY (bus_id) REFERENCES buses(bus_id) ON DELETE CASCADE
);

-- Updates/Announcements Table
CREATE TABLE IF NOT EXISTS updates (
    update_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target ENUM('all', 'drivers', 'students') DEFAULT 'all',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Boarded Students Table
CREATE TABLE IF NOT EXISTS boarded_students (
    boarding_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(50) NOT NULL,
    assignment_id INT NOT NULL,
    boarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id) ON DELETE CASCADE
);

-- Indexes for better performance
-- Note: These will fail if indexes already exist, which is fine
SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0;

CREATE INDEX idx_assignment_status ON assignments(status);
CREATE INDEX idx_student_requests_status ON student_requests(status);
CREATE INDEX idx_bus_locations_updated ON bus_locations(updated_at);

SET SQL_NOTES=@OLD_SQL_NOTES;
