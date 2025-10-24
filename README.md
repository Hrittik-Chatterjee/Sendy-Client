# Sendy - Parcel Delivery Management System

A modern, full-stack parcel delivery management system built with React, TypeScript, and Vite. Sendy provides a comprehensive platform for managing parcel deliveries with role-based access control for Admins, Senders, and Receivers.

## Project Overview

Sendy is a web-based parcel delivery management system. The platform offers:

- **Real-time Parcel Tracking**: Track parcels in real-time
- **Role-Based Dashboards**: Interfaces for Admins, Senders, and Receivers
- **User Management**: Complete user registration, authentication, and verification system
- **Analytics Dashboard**: Comprehensive analytics and reporting for administrators
- **Secure & Reliable**: Built with modern security practices and reliable delivery tracking

### Key Features

#### For Senders

- Send parcels with detailed pickup and delivery information
- Track ongoing parcels in real-time
- View complete delivery history
- Manage multiple deliveries simultaneously

#### For Receivers

- View incoming parcels
- Confirm parcel delivery with OTP verification
- Track delivery history
- Real-time delivery notifications

#### For Admins

- Comprehensive analytics dashboard with delivery metrics
- Manage all parcels across the platform
- User management and oversight
- System-wide statistics and reporting

## Technology Stack

### Frontend

- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Redux Toolkit** - State management

### UI Components & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library

### Forms & Validation

- **React Hook Form** - Performant form handling
- **Zod** - TypeScript-first schema validation

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd sendy-client
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**

   Create a `.env` file in the root directory:

   ```env
   VITE_BASE_URL=http://localhost:5000/api/v1
   ```

   Update the `VITE_BASE_URL` to point to your backend API endpoint.

4. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

   ```

   ```

## Project Structure

```
sendy-client/
├── src/
│   ├── assets/          # Static assets (icons, images)
│   ├── components/      # Reusable UI components
│   │   ├── layout/      # Layout components (Navbar, Footer, etc.)
│   │   ├── modules/     # Feature-specific components
│   │   └── ui/          # shadcn/ui components
│   ├── constants/       # Application constants (roles, etc.)
│   ├── pages/           # Page components
│   │   ├── admin/       # Admin dashboard pages
│   │   ├── sender/      # Sender dashboard pages
│   │   └── receiver/    # Receiver dashboard pages
│   ├── providers/       # Context providers
│   ├── routes/          # Route configuration
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   └── main.tsx         # Application entry point
├── .env                 # Environment variables
├── package.json         # Project dependencies
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Test Credentials

Use these credentials to test different user roles:

### Admin Account

```
Email: super@gmail.com
Password: 12345678
```

### Sender Account

```
Email: sender@sendy.com
Password: sender123
```

### Receiver Account

```
Email: receiver@sendy.com
Password: receiver123
```

## Features Breakdown

### Public Pages

- **Home** - Landing page with service overview and quick tracking
- **About** - Information about the service
- **Contact** - Contact form and support information
- **Track Parcel** - Public parcel tracking by tracking ID
- **Login/Register** - User authentication
- **Email Verification** - Account verification via OTP

### Admin Dashboard

- **Analytics** - System-wide statistics, charts, and metrics
- **Parcels Management** - View and manage all parcels
- **Users Management** - View and manage all users

### Sender Dashboard

- **Send Parcel** - Create new parcel delivery requests
- **Ongoing Parcels** - Track active deliveries
- **History** - View past deliveries

### Receiver Dashboard

- **Incoming Parcels** - View parcels being delivered to you
- **Confirm Delivery** - Confirm receipt with OTP
- **History** - View received parcels history

## Authentication & Authorization

- **ADMIN** - Full system access
- **SENDER** - Can send parcels and track deliveries
- **RECEIVER** - Can receive parcels and confirm deliveries

## Live URL

**Production:** _[Add your deployed URL here]_
**Backend URL:**

## API Integration

The application connects to a REST API backend. Configure the API endpoint in the `.env` file:

```env
VITE_BASE_URL=<your-backend-api-url>
```
