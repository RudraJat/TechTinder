# TechTinder - Error Fixes Guide

## Issues Found

### Issue 1: `400 (Bad Request)` on `/profile/view` 
**Status**: ✅ Expected behavior - Not an error

The 400 error when calling `GET http://localhost:1111/profile/view` happens because:
- The endpoint requires JWT authentication via the `userAuth` middleware
- On initial app load, if no valid JWT token exists in cookies, the request is rejected with 400
- This is **intentional** - it's how the app checks if the user is authenticated
- The app correctly handles this and marks the user as not authenticated

**No fix needed** - This is working as designed.

---

### Issue 2: `403 (Forbidden)` Google OAuth Button
**Status**: ❌ Needs fixing

The error: _"The given origin is not allowed for the given client ID"_

**Root Cause**:
- Your Google OAuth 2.0 Client ID does not have your frontend's origin added to the authorized origins
- The frontend is running on some localhost origin (likely `http://localhost:5173`)
- Google is blocking requests from unauthorized origins for security

**Solution**:

1. **Find your frontend's origin**:
   - Open browser DevTools (F12) → Console
   - Check the URL bar - note the exact origin (e.g., `http://localhost:5173`)

2. **Update Google Cloud Console**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Select your project
   - Navigate to **Credentials** → Find your OAuth 2.0 Client ID
   - Click the client ID to edit it
   - Scroll to "Authorized JavaScript origins"
   - Add both:
     ```
     http://localhost:5173
     http://localhost:3000
     http://localhost:5174
     ```
   - (Add whichever port your Vite dev server is using)
   - Click **Save**

3. **For Production**:
   - Also add your production domain:
     ```
     https://yourdomain.com
     https://www.yourdomain.com
     ```

---

## Verification Checklist

- [ ] Find the exact localhost port your frontend is running on
- [ ] Add that origin to Google Cloud Console OAuth client
- [ ] Refresh the browser (Ctrl+F5 or Cmd+Shift+R) to clear cache
- [ ] Try Google login again - the button should load without 403 error

---

## Files Involved

- **Frontend Auth Check**: [App.jsx](TechTinder-web/src/App.jsx#L47) - Calls `/profile/view` to check if user is logged in
- **Backend Auth Middleware**: [auth.js](server-side/src/middlewares/auth.js) - Validates JWT tokens
- **Backend Profile Route**: [profile.js](server-side/src/routes/profile.js#L11) - Requires authentication
- **Google OAuth Setup**: [main.jsx](TechTinder-web/src/main.jsx#L9) - Initializes GoogleOAuthProvider
- **Google Login Handler**: [Login.jsx](TechTinder-web/src/Pages/Login.jsx#L47) - Processes Google credentials
