# Live Table Reservation System - Deployment Guide

## 🚀 Quick Deploy Options

### 1. **Vercel (Recommended - Easiest)**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/surajahnavi/LiveTableReservation)

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect and deploy both frontend and backend
4. Add environment variables in Vercel dashboard:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`

### 2. **Railway (Great for Database Apps)**
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/github)

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Railway will deploy using the Dockerfile
4. Add environment variables:
   - `NODE_ENV=production`
   - `MONGO_URI=your_mongodb_connection_string`
   - `PORT=5000`

### 3. **Netlify + Backend Hosting**
1. **Frontend on Netlify:**
   - Connect your GitHub repo to Netlify
   - Build command: `cd frontend-app && npm run build`
   - Publish directory: `frontend-app/build`

2. **Backend on Heroku/Railway:**
   - Deploy backend separately
   - Update frontend API calls to point to backend URL

### 4. **Heroku (Traditional)**
```bash
# Install Heroku CLI, then:
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set MONGO_URI=your_mongodb_connection_string
git push heroku main
```

## 🔧 Environment Variables Needed

```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
EMAIL_USER=your-smtp-email (optional)
EMAIL_PASS=your-smtp-password (optional)
```

## 🏗️ Project Structure

```
reservation/
├── backend/                 # Node.js API server
│   ├── server.js           # Development server
│   ├── server-production.js # Production server
│   ├── routes/             # API endpoints
│   └── models/             # Database models
├── frontend-app/           # React application
│   ├── src/               # React components
│   └── build/             # Built files (created on deploy)
├── vercel.json            # Vercel configuration
├── netlify.toml           # Netlify configuration
├── Dockerfile             # Docker configuration
└── package.json           # Root dependencies
```

## 🔄 Development vs Production

**Development:**
- Frontend: `http://localhost:3000` (React dev server)
- Backend: `http://localhost:5000` (Mock or real server)

**Production:**
- Single URL serves both frontend and API
- React app built and served by Express server
- API endpoints available at `/api/*`

## 📊 Deployment Features

✅ **Full-stack deployment**  
✅ **React routing support**  
✅ **API endpoints preserved**  
✅ **Environment variable support**  
✅ **MongoDB integration**  
✅ **Email functionality**  
✅ **Voice features included**  

## 🛠️ Manual Deployment Steps

If you prefer manual deployment:

1. **Build the frontend:**
   ```bash
   cd frontend-app
   npm install
   npm run build
   ```

2. **Deploy the backend:**
   ```bash
   # Copy frontend build to backend public folder
   cp -r frontend-app/build backend/public
   
   # Deploy backend with static files
   node backend/server-production.js
   ```

## 🔗 Live Demo

Once deployed, your app will be available with:
- **Restaurant search and booking**
- **Voice-powered interface**  
- **Real-time table availability**
- **Email confirmations**
- **Mobile-responsive design**

## 📱 Post-Deployment Testing

Test these features:
- [ ] Homepage loads correctly
- [ ] Restaurant search works
- [ ] Booking flow completes
- [ ] Voice commands function
- [ ] API endpoints respond
- [ ] Database operations work