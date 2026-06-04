# Image Upload Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                     (http://localhost:5173)                     │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────┐     ┌──────────────────┐
        │  Add Product      │     │  Edit Product    │
        │  Modal            │     │  Page            │
        │                   │     │                  │
        │  [Choose File]    │     │  [Choose File]   │
        │  [Preview Image]  │     │  [Preview Image] │
        └───────────────────┘     └──────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │   useProductStore      │
                    │   (Zustand State)      │
                    │                        │
                    │  - addProduct()        │
                    │  - updateProduct()     │
                    │  - FormData creation   │
                    └────────────────────────┘
                                 │
                                 │ FormData with file
                                 │
                                 ▼
        ┌────────────────────────────────────────────┐
        │         AXIOS POST/PUT REQUEST             │
        │  Content-Type: multipart/form-data         │
        │                                            │
        │  {                                         │
        │    name: "Product Name",                   │
        │    price: "99.99",                         │
        │    image: [File Object]                    │
        │  }                                         │
        └────────────────────────────────────────────┘
                                 │
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                             │
│                  (http://localhost:3000)                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────┐     ┌──────────────────┐
        │  CORS Middleware  │     │  Helmet Config   │
        │  ✓ localhost:5173 │     │  ✓ CORP: false   │
        └───────────────────┘     └──────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Static File Serving   │
                    │  /uploads → uploads/   │
                    │  (Bypass Arcjet)       │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Arcjet Middleware     │
                    │  (Skip /uploads path)  │
                    │  - Rate limiting       │
                    │  - Bot detection       │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Product Routes        │
                    │  /api/products         │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Multer Middleware     │
                    │  upload.single("image")│
                    │                        │
                    │  - Validate file type  │
                    │  - Check size (5MB)    │
                    │  - Generate filename   │
                    │  - Save to uploads/    │
                    └────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Product Controller    │
                    │                        │
                    │  createProduct() or    │
                    │  updateProduct()       │
                    └────────────────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
        ┌───────────────────┐     ┌──────────────────┐
        │  Save File        │     │  Save to DB      │
        │  uploads/123.jpg  │     │  /uploads/123.jpg│
        └───────────────────┘     └──────────────────┘
                    │                         │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │  Response to Frontend  │
                    │  { success: true,      │
                    │    data: {...} }       │
                    └────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DISPLAY IMAGE                              │
│                                                                 │
│  <img src="http://localhost:3000/uploads/123.jpg" />           │
│                                                                 │
│  If fails → Show placeholder image                             │
└─────────────────────────────────────────────────────────────────┘
```

## File Structure

```
project/
│
├── Frontend/
│   ├── .env                          # VITE_API_URL=http://localhost:3000
│   └── src/
│       ├── components/
│       │   ├── AddProductModal.jsx   # File input + preview
│       │   └── ProductCard.jsx       # Display image with error handling
│       ├── pages/
│       │   └── ProductPage.jsx       # Edit with file upload
│       └── store/
│           └── useProductStore.jsx   # FormData handling
│
└── Backend/
    ├── .env                          # PORT=3000, DB config
    ├── .gitignore                    # uploads/ excluded
    ├── server.js                     # Static serving + middleware order
    ├── middleware/
    │   └── upload.js                 # Multer configuration
    ├── routes/
    │   └── productRoutes.js          # Routes with multer
    ├── controllers/
    │   └── productController.js      # File handling logic
    └── uploads/                      # Uploaded images (auto-created)
        ├── 1234567890-image1.jpg
        └── 1234567890-image2.png
```

## Data Flow

### 1. Adding a Product

```
User selects file
    ↓
File stored in formData.image (File object)
    ↓
Preview: URL.createObjectURL(file)
    ↓
Submit: Create FormData
    ↓
POST /api/products with multipart/form-data
    ↓
Multer saves file → uploads/123-image.jpg
    ↓
Controller saves path → DB: /uploads/123-image.jpg
    ↓
Response: { success: true, data: {...} }
    ↓
Frontend fetches all products
    ↓
Display: http://localhost:3000/uploads/123-image.jpg
```

### 2. Editing a Product

```
Load product → formData.image = "/uploads/123-image.jpg" (string)
    ↓
Display current image
    ↓
User can:
  - Keep existing (don't select new file)
  - Upload new (select file → formData.image = File object)
    ↓
Submit:
  - If File: Send as multipart, backend saves new file
  - If string: Send as imageUrl, backend keeps existing
    ↓
Update database with new or existing path
    ↓
Display updated product
```

## Key Components

### Frontend

**AddProductModal.jsx**
- File input: `<input type="file" accept="image/*" />`
- Preview: `URL.createObjectURL(file)`
- Submit: Calls `addProduct()`

**ProductCard.jsx**
- Constructs URL: `${VITE_API_URL}${product.image}`
- Error handling: Shows placeholder on fail

**useProductStore.jsx**
- Creates FormData with file
- Sends with `Content-Type: multipart/form-data`

### Backend

**middleware/upload.js**
- Multer disk storage
- File validation (type, size)
- Unique filename generation

**server.js**
- Static serving: `/uploads` → `uploads/`
- Middleware order: Static → Arcjet → Routes
- Arcjet skip: `/uploads` path

**controllers/productController.js**
- Access file: `req.file`
- Save path: `/uploads/${req.file.filename}`
- Store in database

## Security Layers

```
1. File Type Validation
   ↓ Only: jpeg, jpg, png, gif, webp
   
2. File Size Limit
   ↓ Max: 5MB
   
3. Unique Filenames
   ↓ Timestamp + Random: 1234567890-123456789.jpg
   
4. CORS Protection
   ↓ Only allowed origins
   
5. Rate Limiting (Arcjet)
   ↓ Prevents abuse (skipped for static files)
   
6. Helmet Security Headers
   ↓ XSS, clickjacking protection
```

## URL Construction Logic

```javascript
// Frontend: Construct image URL
const getImageUrl = (imagePath) => {
  // Case 1: Full URL (old data)
  if (imagePath.startsWith('http')) {
    return imagePath; // https://example.com/image.jpg
  }
  
  // Case 2: Relative path (new uploads)
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  return `${baseUrl}${imagePath}`; // http://localhost:3000/uploads/123.jpg
};
```

## Error Handling

```javascript
// All images have onError handler
<img 
  src={imageUrl}
  onError={(e) => {
    console.error('Image failed:', imageUrl);
    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
  }}
/>
```

## Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3000
```

**Backend (.env)**
```
PORT=3000
PGHOST=...
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
ARCJET_KEY=...
```

## Database Schema

```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,      -- Stores: /uploads/123.jpg
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Testing Checklist

- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Can add product with image
- [ ] Image preview shows in modal
- [ ] Product displays with image
- [ ] Can edit product keeping image
- [ ] Can edit product with new image
- [ ] Images load without errors
- [ ] Placeholder shows on error
- [ ] Files saved in uploads/
- [ ] Database stores correct path
