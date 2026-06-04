# Quick Start Guide - Image Upload Feature

## ✅ All Fixed! Here's What Changed

Your application now accepts **image files from the device** instead of URLs.

## 🚀 Start the Application

### Terminal 1 - Backend
```bash
cd Backend
npm run dev
```
Should show: `Server is running on port 3000`

### Terminal 2 - Frontend  
```bash
cd Frontend
npm run dev
```
Should show: `Local: http://localhost:5173`

## 🎯 How to Use

### Add a New Product
1. Open `http://localhost:5173` in your browser
2. Click **"Add Product"** button
3. Fill in:
   - **Product Name**: e.g., "Laptop"
   - **Price**: e.g., "999.99"
   - **Image**: Click "Choose File" and select an image from your computer
4. You'll see a **preview** of your image
5. Click **"Add Product"**
6. ✨ Done! Your product appears with the uploaded image

### Edit a Product
1. Click the **edit icon** (pencil) on any product
2. You can:
   - Change name/price without touching the image
   - Upload a **new image** to replace the old one
3. Click **"Save Changes"**

### View Products
- All products display with their uploaded images
- Images are served from: `http://localhost:3000/uploads/[filename]`

## 🔧 What Was Fixed

1. ✅ **Removed duplicate code** in store
2. ✅ **Fixed .env file** (removed duplicate URL)
3. ✅ **Fixed Arcjet blocking images** (static files now bypass security middleware)
4. ✅ **Added error handling** (shows placeholder if image fails)
5. ✅ **Better URL construction** (handles both old URLs and new uploads)

## 📁 Where Images Are Stored

- **Location**: `Backend/uploads/`
- **Format**: `1234567890-filename.jpg` (timestamp + random number)
- **Database**: Stores path like `/uploads/1234567890-filename.jpg`
- **Access**: `http://localhost:3000/uploads/1234567890-filename.jpg`

## 🐛 Troubleshooting

### Images not showing?

**1. Check both servers are running**
```bash
# Backend should show:
Server is running on port 3000

# Frontend should show:  
Local: http://localhost:5173
```

**2. Check browser console (F12)**
- Look for any red errors
- Check Network tab for failed requests

**3. Verify uploads directory**
```bash
ls Backend/uploads
```
Should show uploaded image files

**4. Test image URL directly**
- Upload a product with an image
- Right-click the image → "Open in new tab"
- URL should be: `http://localhost:3000/uploads/[filename]`
- If it shows 404: File wasn't saved
- If it shows 403: Arcjet is blocking (shouldn't happen)

**5. Check .env files**

Frontend `.env`:
```
VITE_API_URL=http://localhost:3000
```

Backend `.env`:
```
PORT=3000
[...other variables...]
```

**6. Restart both servers**
After changing .env files, always restart!

## 📸 Image Requirements

- **Types**: JPEG, JPG, PNG, GIF, WEBP
- **Max Size**: 5MB
- **Validation**: Automatic (invalid files are rejected)

## 🎨 Features

✅ File upload from device  
✅ Live image preview  
✅ Keep existing image when editing  
✅ Automatic unique filenames  
✅ File type validation  
✅ Size limit (5MB)  
✅ Error handling with placeholders  
✅ Works with old URL-based images  

## 🔒 Security

- Only image files accepted
- File size limited to 5MB
- Unique filenames prevent conflicts
- Uploads directory excluded from git
- Static files bypass rate limiting

## 📝 Example Workflow

```
1. User selects image file
   ↓
2. Preview shows in modal
   ↓
3. User clicks "Add Product"
   ↓
4. Frontend sends FormData to backend
   ↓
5. Backend saves file to uploads/
   ↓
6. Database stores path: /uploads/123-image.jpg
   ↓
7. Frontend displays: http://localhost:3000/uploads/123-image.jpg
```

## 🎉 You're All Set!

Everything is configured and ready to go. Just start both servers and try uploading a product with an image!

If you see any issues, check the `IMAGE_UPLOAD_FIX.md` file for detailed troubleshooting.
