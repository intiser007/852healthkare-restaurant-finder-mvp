# Setup Instructions for Smart Restaurant Finder MVP

## If Node.js/npm is not installed

### Windows:
1. **Download Node.js**: Visit [nodejs.org](https://nodejs.org/) and download the LTS version for Windows
2. **Install Node.js**: Run the installer and follow the prompts (npm is included)
3. **Verify Installation**: Open PowerShell and run:
   ```powershell
   node --version
   npm --version
   ```

### Alternative: Using Package Managers

**Using Chocolatey (Windows):**
```powershell
# Install Chocolatey first if not installed
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs
```

## Step-by-Step Setup

### 1. Get Required API Keys

**OpenAI API Key:**
1. Go to [https://platform.openai.com/](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to "API Keys" in the left sidebar
4. Click "Create new secret key"
5. Copy and save the key securely

**Foursquare API Key:**
1. Go to [https://foursquare.com/developers/signup](https://foursquare.com/developers/signup)
2. Sign up for a developer account
3. Click "Create a New App"
4. Fill in the app details:
   - App Name: "Restaurant Finder"
   - App Description: "Restaurant recommendation app"
   - Website URL: http://localhost:8080
5. Copy the API Key from your app dashboard
6. Note: Free tier includes 10,000 API calls for testing

### 2. Backend Setup

```bash
# Navigate to backend directory
cd restaurant-finder-api

# Install dependencies
npm install

# Create environment file
copy .env.example .env

# Edit .env file with your API keys:
# GEMINI_API_KEY=your_actual_gemini_key_here
# FOURSQUARE_API_KEY=your_actual_foursquare_key_here
# PORT=3000
```

**Edit the .env file:**
- Open `.env` in any text editor
- Replace `your_gemini_api_key_here` with your actual Gemini key
- Replace `your_foursquare_api_key_here` with your actual Foursquare key
- Save the file

### 3. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal/command prompt)
cd restaurant-finder-ui

# Install dependencies
npm install

# Create environment file
echo VITE_API_BASE_URL=http://localhost:3000/api > .env.development
```

### 4. Running the Application

**Terminal 1 (Backend):**
```bash
cd restaurant-finder-api
npm run dev
```
You should see: "Server is running at http://localhost:3000"

**Terminal 2 (Frontend):**
```bash
cd restaurant-finder-ui  
npm run dev
```
You should see: "Local: http://localhost:8080"

### 5. Testing the Application

1. Open your browser and go to `http://localhost:8080`
2. Click "Find Restaurants Near Me"
3. Allow location access when prompted
4. Wait for the AI to analyze and return recommendations

## Troubleshooting

### Common Issues:

**"npm is not recognized"**
- Node.js is not installed or not in PATH
- Restart your terminal after installing Node.js
- Verify installation: `node --version`

**"Permission denied" on location****
- Click "Allow" when browser asks for location permission
- Check browser settings to ensure location is enabled
- Try using Chrome or Firefox for best compatibility

**"API authentication failed"**
- Check that your API keys are correctly set in `.env`
- Ensure there are no extra spaces or quotes around the keys
- Verify the keys are valid by testing them directly with the APIs

**"Restaurant data service unavailable"**
- Check your Foursquare API key is correct
- Verify you haven't exceeded the free tier limits (10,000 calls/month)
- Check your internet connection

**Backend won't start**
- Ensure port 3000 is not in use by another application
- Check that all dependencies installed correctly: `npm install`
- Look for error messages in the terminal

**Frontend won't start**
- Ensure port 8080 is available
- Check that backend is running first
- Verify `.env.development` file exists and has correct API URL

### Testing Without Location

If location services aren't working, you can test the API directly:

```bash
# Test the backend API with curl or Postman
curl -X POST http://localhost:3000/api/suggestions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-patient-123" \
  -d '{"latitude": 40.7128, "longitude": -74.0060}'
```

### Free Tier Limits

**OpenAI:**
- $5 free credit for new accounts
- GPT-4 costs about $0.03-0.06 per request
- Monitor usage at platform.openai.com

**Foursquare API:**
- 10,000 free API calls per month
- No credit card required for free tier
- Monitor usage in your developer dashboard

## Production Deployment

For production deployment, you would need to:

1. **Backend**: Deploy to services like Heroku, Railway, or AWS
2. **Frontend**: Deploy to Netlify, Vercel, or similar
3. **Environment Variables**: Set production API keys in deployment platform
4. **Database**: Replace mock health service with real database
5. **Authentication**: Implement real JWT authentication

## Support

If you encounter issues:

1. Check the console/terminal for error messages
2. Verify all API keys are correct
3. Ensure both backend and frontend are running
4. Check browser developer tools for network errors
5. Review the README files in each project folder

The application is designed to work out of the box once the API keys are configured correctly.
