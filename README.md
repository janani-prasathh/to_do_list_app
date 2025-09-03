# TaskFlow - Innovative To-Do List Application

A modern, feature-rich task management application built with React, TypeScript, and Express.js. TaskFlow combines productivity with gamification to help you stay motivated and organized.

## ✨ Features

### Core Functionality
- **Task Management**: Create, edit, delete, and organize tasks with ease
- **Category Organization**: Color-coded categories to group related tasks
- **Progress Tracking**: Visual progress bars and completion percentages
- **Priority Levels**: Low, medium, and high priority indicators
- **Due Time Tracking**: Set and track task deadlines

### Innovative Features
- **Dark/Light Theme Toggle**: Seamlessly switch between themes
- **Focus Mode**: Distraction-free interface for maximum productivity
- **Gamification**: Streak counters and achievement tracking
- **Smart Suggestions**: AI-powered task suggestions for common activities
- **Real-time Stats**: Daily progress tracking and analytics
- **Glass Morphism Design**: Modern UI with beautiful glass effects
- **Smooth Animations**: Engaging hover effects and transitions

### User Experience
- **Quick Add**: Fast task creation with keyboard shortcuts (Enter key)
- **Search Functionality**: Find tasks quickly with real-time search
- **Drag & Drop**: Reorder tasks with intuitive drag-and-drop
- **Responsive Design**: Works perfectly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd taskflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5000`

## 🏗️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/UI** component library
- **TanStack Query** for state management
- **Wouter** for routing
- **Framer Motion** for animations

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence
- **In-memory storage** for development

### Development Tools
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Hot reload** for instant updates

## 📁 Project Structure

```
taskflow/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/        # Shadcn/UI components
│   │   │   ├── sidebar.tsx
│   │   │   ├── main-content.tsx
│   │   │   └── task-card.tsx
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/                # Backend Express application
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   └── storage.ts        # Data storage layer
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schemas and types
└── package.json         # Project dependencies
```

## 🎮 Usage

### Basic Operations

1. **Adding Tasks**
   - Use the quick-add input at the top of the main content
   - Press Enter or click "Add Task"
   - Optionally select a category

2. **Managing Tasks**
   - Click the checkbox to mark tasks as complete
   - Use the edit button to modify task details
   - Delete tasks with the trash icon

3. **Organization**
   - Create and use categories for better organization
   - Filter tasks by category using the sidebar
   - Use search to find specific tasks

### Advanced Features

- **Focus Mode**: Click the "Focus Mode" button to hide distractions
- **Theme Toggle**: Use the sun/moon icon to switch themes
- **Smart Suggestions**: Click on suggested tasks to add them quickly
- **Progress Tracking**: Monitor your daily completion percentage

## 🎨 Customization

### Themes
The application supports both light and dark themes with smooth transitions. Theme preference is saved in localStorage.

### Categories
Default categories include:
- Work (Blue)
- Personal (Green)  
- Learning (Purple)

Additional categories can be added through the API.

### Colors
Category colors are customizable through the categoryColors object in components.

## 🔧 API Endpoints

### Tasks
- `GET /api/tasks` - Retrieve all tasks
- `POST /api/tasks` - Create a new task
- `PATCH /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/reorder` - Reorder tasks

### Categories
- `GET /api/categories` - Retrieve all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/:id` - Delete a category

### Stats
- `GET /api/stats` - Get user statistics
- `GET /api/suggestions` - Get smart task suggestions

## 🚀 Deployment

### Development
The application runs on port 5000 in development mode with hot reload enabled.

### Production
For production deployment:
1. Build the application: `npm run build`
2. Set environment variables as needed
3. Deploy to your preferred hosting platform

### Replit Deployment
If using Replit, simply click the "Deploy" button in your workspace for instant deployment.

## 📱 Browser Support

TaskFlow works on all modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🔮 Future Enhancements

- User authentication and multi-user support
- Cloud synchronization
- Mobile app version
- Team collaboration features
- Advanced analytics and reporting
- Integration with calendar applications
- Export/import functionality

---

Built with ❤️ using modern web technologies for an exceptional user experience.
