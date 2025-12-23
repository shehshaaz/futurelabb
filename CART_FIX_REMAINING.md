# Remaining Files to Fix - Cart "temp-user-id" Issue

The following files still have the `|| "temp-user-id"` issue and need to be fixed:

## Files to Fix:
1. ✅ `frontend/src/pages/SingleTest.jsx` - FIXED
2. ✅ `frontend/src/pages/Product.jsx` - FIXED  
3. ✅ `frontend/src/pages/CreatePackage.jsx` - FIXED
4. ✅ `frontend/src/pages/Home.jsx` - FIXED
5. ⏳ `frontend/src/pages/Checkups.jsx` - Line 73
6. ⏳ `frontend/src/pages/WomanCare.jsx` - Line 67
7. ⏳ `frontend/src/pages/VitalOrgan.jsx` - Line 65
8. ⏳ `frontend/src/pages/SpecialCare.jsx` - Line 36
9. ⏳ `frontend/src/pages/Package.jsx` - Line 36
10. ⏳ `frontend/src/pages/MenCare.jsx` - Line 65
11. ⏳ `frontend/src/pages/LifestyleCheckup.jsx` - Line 65

## Fix Pattern:
Replace:
```javascript
const userId = localStorage.getItem("userId") || "temp-user-id";
if (!userId) {
  alert("Please login to add items to cart");
  return;
}
```

With:
```javascript
const userId = localStorage.getItem("userId");

if (!userId) {
  alert("Please login to add items to cart");
  // Trigger the login sidebar
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.add("show");
  }
  return;
}
```

Also change error handling from `response.message` to `response.error` to match backend response format.

## Status:
- 4 files fixed
- 7 files remaining
- Will fix in next batch to avoid overwhelming the system
