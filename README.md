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

## Demo Credentials for Testing

Use these credentials to test different user roles:

### Admin Account

```
Email: super@gmail.com
Password: 12345678
```

### Sender Account

```
Email: sender@demo.com
Password: @Password1
```

### Receiver Account

```
Email: receiver@demo.com
Password: @Password1
```

### Quick Testing Guide

1. **Login as Sender** (`sender@demo.com`)
   - Navigate to "Send Parcel"
   - Create a new parcel with receiver email: `receiver@demo.com`
   - Note the tracking ID

2. **Login as Admin** (`super@gmail.com`)
   - Go to "Parcels Management"
   - Find the newly created parcel
   - Update status from "Requested" → "Approved" → "Dispatched" → "In Transit"

3. **Login as Receiver** (`receiver@demo.com`)
   - After admin approval, parcel will appear in "Incoming Parcels"
   - When status is "In Transit", click "Confirm Delivery"
   - Parcel will be marked as "Delivered"

4. **Test Edit/Cancel Restrictions**
   - Login as sender and try to cancel a parcel after it's dispatched (should fail)
   - Try to edit parcel details after dispatch (should be restricted)

## Parcel Delivery Workflow

### Complete Delivery Flow

1. **Sender Creates Parcel Request**
   - Sender logs in and creates a new parcel delivery request
   - Provides receiver details, pickup/delivery addresses, and parcel weight
   - Parcel is created with status: **"Requested"**

2. **Admin Reviews and Approves**
   - Admin reviews the parcel request in the admin dashboard
   - Admin can approve or update the status
   - Once approved, status changes to: **"Approved"**

3. **Receiver Can View Parcel**
   - After admin approval, the receiver can see the parcel in their dashboard
   - Receiver can track the parcel status in real-time

4. **Admin Updates Status to Dispatched**
   - Admin changes status to: **"Dispatched"**
   - Admin can further update to: **"In Transit"**

5. **Sender Edit/Cancel Permissions**
   - **Before Dispatch**: Sender can edit parcel details or cancel the parcel
   - **After Dispatch**: Sender **CANNOT** edit or cancel the parcel
   - Cancellation is only allowed for statuses: "Requested" or "Approved"

6. **Parcel In Transit**
   - Admin updates status to: **"In Transit"**
   - Receiver can see real-time updates

7. **Delivery Confirmation**
   - **Only when status is "In Transit"**: Receiver can confirm delivery
   - Receiver clicks "Confirm Delivery" button
   - Status changes to: **"Delivered"**
   - **Important**: Delivery confirmation is ONLY available in "In Transit" status

### Status Permissions Summary

| Status | Sender Can Edit | Sender Can Cancel | Receiver Can Confirm | Admin Can Update |
|--------|----------------|-------------------|---------------------|------------------|
| Requested | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Approved | ✅ Yes | ✅ Yes | ❌ No | ✅ Yes |
| Dispatched | ❌ No | ❌ No | ❌ No | ✅ Yes |
| In Transit | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| Delivered | ❌ No | ❌ No | ❌ No | ❌ No |
| Cancelled | ❌ No | ❌ No | ❌ No | ❌ No |

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
- **Parcels Management** - View, manage, and update all parcel statuses
- **Users Management** - View and manage all users
- **Status Control** - Update parcel status through the delivery workflow

### Sender Dashboard

- **Send Parcel** - Create new parcel delivery requests
- **Ongoing Parcels** - Track active deliveries
- **Edit Parcel** - Modify parcel details (only before dispatch)
- **Cancel Parcel** - Cancel delivery (only before dispatch)
- **History** - View past deliveries

### Receiver Dashboard

- **Incoming Parcels** - View parcels being delivered (visible after admin approval)
- **Confirm Delivery** - Confirm receipt (only when status is "In Transit")
- **Track Status** - Real-time tracking of incoming parcels
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
