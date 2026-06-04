# Image Upload Feature

## Overview
The application has been updated to accept image uploads from the user's device instead of requiring image URLs.

## Changes Made

### Backend Changes

1. **Installed Dependencies**
   - Added `multer` package for handling multipart/form-data file uploads

2. **Created Upload Middleware** (`Backend/middleware/upload.js`)
   - Configured multer with disk storage
   - Set up file naming with timestamps for uniqueness
   - Added file type validation (only images: jpeg, jpg, png, gif, webp)
   - Set file size limit to 5MB
   - Automatically creates `uploads/` directory if it doesn't exist

3. **Updated Routes** (`Backend/routes/productRoutes.js`)
   - Added multer middleware to POST and PUT routes
   - Routes now handle `multipart/form-data` instead of JSON

4. **Updated Server** (`Backend/server.js`)
   - Added static file serving for `/uploads` directory
   - Images are now accessible via `/uploads/filename.jpg`

5. **Updated Controllers** (`Backend/controllers/productController.js`)
   - `createProduct`: Now accepts file upload via `req.file` and stores the file path
   - `updateProduct`: Handles both new file uploads and keeping existing images

6. **Added .gitignore** (`Backend/.gitignore`)
   - Excludes `uploads/` directory from version control

### Frontend Changes

1. **Updated Add Product Modal** (`Frontend/src/components/AddProductModal.jsx`)
   - Changed from text input to file input
   - Added image preview functionality
   - Shows preview of selected image before upload

2. **Updated Product Store** (`Frontend/src/store/useProductStore.jsx`)
   - `addProduct`: Now sends FormData instead of JSON
   - `updateProduct`: Handles both File objects and existing image URLs
   - Added proper Content-Type headers for multipart/form-data

3. **Updated Product Page** (`Frontend/src/pages/ProductPage.jsx`)
   - Changed image input from URL text field to file upload
   - Added preview for current/selected image
   - Allows keeping existing image when updating (optional file upload)
   - Properly constructs image URLs for display

4. **Updated Product Card** (`Frontend/src/components/ProductCard.jsx`)
   - Constructs full image URL using API base URL
   - Handles both absolute URLs and relative paths

## How It Works

### Adding a Product
1. User clicks "Add Product" button
2. Fills in product name and price
3. Selects an image file from their device
4. Preview shows the selected image
5. On submit, the image is uploaded to the server
6. Server saves the file to `Backend/uploads/` directory
7. Database stores the relative path (e.g., `/uploads/1234567890-image.jpg`)

### Updating a Product
1. User navigates to product edit page
2. Current product image is displayed
3. User can optionally select a new image file
4. If no new file is selected, the existing image is kept
5. On submit, new image is uploaded (if provided) or existing path is retained

### Displaying Images
- Images are served as static files from the backend
- Frontend constructs full URLs: `{API_URL}/uploads/filename.jpg`
- Supports both old URL-based images and new uploaded files

## File Structure
```
Backend/
├── middleware/
│   └── upload.js          # Multer configuration
├── uploads/               # Uploaded images (gitignored)
├── controllers/
│   └── productController.js
├── routes/
│   └── productRoutes.js
└── server.js

Frontend/
├── src/
│   ├── components/
│   │   ├── AddProductModal.jsx
│   │   └── ProductCard.jsx
│   ├── pages/
│   │   └── ProductPage.jsx
│   └── store/
│       └── useProductStore.jsx
```

## Security Features
- File type validation (only images allowed)
- File size limit (5MB maximum)
- Unique filename generation to prevent conflicts
- Proper error handling for invalid uploads

## Environment Variables
Make sure your `.env` files are configured:

**Backend** (`Backend/.env`):
```
PORT=3000
DATABASE_URL=your_database_url
```

**Frontend** (`Frontend/.env`):
```
VITE_API_URL=http://localhost:3000
```

## Testing
1. Start the backend: `cd Backend && npm run dev`
2. Start the frontend: `cd Frontend && npm run dev`
3. Try adding a new product with an image
4. Try updating an existing product with a new image
5. Verify images display correctly in the product list and detail pages
