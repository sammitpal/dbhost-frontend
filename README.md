# DBHost Frontend

A modern React frontend for the DBHost database hosting platform, inspired by WiseHosting's design.

## Features

### 🎨 Modern Design
- Clean, professional UI inspired by WiseHosting
- Responsive design that works on all devices
- Smooth animations with Framer Motion
- Tailwind CSS for consistent styling

### 🔐 Authentication
- User registration and login
- JWT token management
- Protected routes
- Automatic token refresh

### 📊 Dashboard
- Instance overview and statistics
- Real-time monitoring charts
- Recent activity feed
- Quick action buttons

### 🗄️ Instance Management
- Create new database instances
- List and filter instances
- Start/stop/terminate instances
- Instance details and configuration

### 👥 Database User Management
- Create and manage database users
- Set user privileges and permissions
- Connection string generation
- Password management

### 📋 Real-time Logs
- View instance logs in real-time
- Filter by log level and type
- Search functionality
- Download logs
- Auto-refresh capability

## Technology Stack

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **React Router** - Client-side routing
- **React Hook Form** - Form management
- **Axios** - HTTP client
- **Recharts** - Charts and graphs
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. Navigate to the frontend directory:
```bash
cd db-host-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Environment Setup

The frontend is configured to proxy API requests to `http://localhost:3000` where the backend should be running.

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   └── ProtectedRoute.jsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.jsx # Authentication context
├── pages/              # Page components
│   ├── Home.jsx        # Landing page
│   ├── Login.jsx       # Login page
│   ├── Register.jsx    # Registration page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Instances.jsx   # Instance listing
│   ├── CreateInstance.jsx # Instance creation
│   ├── InstanceDetails.jsx # Instance details
│   ├── DatabaseManagement.jsx # User management
│   └── Logs.jsx        # Log viewer
├── App.jsx             # Main app component
├── main.jsx           # App entry point
└── index.css          # Global styles
```

## Key Features

### Authentication Flow
- JWT-based authentication
- Automatic token storage and retrieval
- Protected routes with redirect
- User profile management

### Instance Management
- Multi-step instance creation wizard
- Support for PostgreSQL and MySQL
- Instance type selection with pricing
- Real-time status updates

### Database Administration
- User creation and management
- Privilege assignment
- Connection string generation
- Security best practices

### Monitoring & Logs
- Real-time log streaming
- Log filtering and search
- Download functionality
- Visual log level indicators

## API Integration

The frontend integrates with the following backend endpoints:

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Instance Management
- `GET /api/ec2/list` - List instances
- `POST /api/ec2/create` - Create instance
- `GET /api/ec2/:id` - Get instance details
- `POST /api/ec2/:id/start` - Start instance
- `POST /api/ec2/:id/stop` - Stop instance
- `DELETE /api/ec2/:id` - Terminate instance

### Database Management
- `GET /api/database/:id/users` - List database users
- `POST /api/database/:id/users` - Create user
- `PUT /api/database/:id/users/:username` - Update user
- `DELETE /api/database/:id/users/:username` - Delete user
- `GET /api/database/:id/connection` - Get connection info

### Logs
- `GET /api/logs/:id` - Get instance logs
- `GET /api/logs/:id/database` - Get database logs
- `GET /api/logs/:id/system` - Get system logs

## Design System

### Colors
- Primary: Blue (#0ea5e9)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)
- Gray scale for text and backgrounds

### Components
- Consistent button styles
- Form input styling
- Card layouts
- Loading states
- Toast notifications

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly interactions

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style
- ESLint configuration included
- Consistent naming conventions
- Component-based architecture
- Hooks for state management

## Deployment

1. Build the application:
```bash
npm run build
```

2. The `dist` folder contains the production build
3. Deploy to your preferred hosting service (Vercel, Netlify, etc.)

## Contributing

1. Follow the existing code style
2. Add proper error handling
3. Include loading states
4. Test on multiple screen sizes
5. Update documentation as needed

## License

MIT License - see LICENSE file for details
