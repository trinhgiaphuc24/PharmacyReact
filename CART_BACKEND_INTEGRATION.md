# Cart Backend Integration

## Tổng quan

Đã tích hợp CartContext với backend API để đồng bộ hóa dữ liệu giỏ hàng giữa frontend và backend.

## Các thay đổi chính

### 1. Cập nhật axiosConfig.js

Thêm các endpoints mới cho cart API:
- `my-cart`: `/carts/my-cart/` - Lấy giỏ hàng của user hiện tại
- `cart-items`: `/cart-items/` - CRUD cart items
- `add-to-cart`: `/cart-items/add-to-cart/` - Thêm sản phẩm vào giỏ hàng
- `update-cart-quantity`: `/cart-items/{itemId}/update-quantity/` - Cập nhật số lượng

Thêm function `createAuthenticatedAxios()` để tạo axios instance có Bearer token.

### 2. Cập nhật CartContext.js

#### Thêm state mới:
- `isSyncing`: Boolean để track trạng thái đồng bộ với backend

#### Thêm helper functions:
- `syncCartWithBackend()`: Đồng bộ cart từ backend về frontend
- `addToBackend()`: Thêm sản phẩm vào backend
- `updateQuantityInBackend()`: Cập nhật số lượng trên backend
- `removeFromBackend()`: Xóa sản phẩm khỏi backend

#### Cập nhật các functions chính:
- `addToCart()`: Async function, thêm vào backend trước, sau đó cập nhật local state
- `updateQuantity()`: Async function, cập nhật backend trước, sau đó cập nhật local state
- `removeFromCart()`: Async function, xóa khỏi backend trước, sau đó cập nhật local state
- `clearCart()`: Async function, xóa tất cả items khỏi backend

#### Cập nhật data structure:
Mỗi cart item bây giờ có thêm field `cartItemId` để lưu ID của cart item trên backend.

### 3. Cập nhật các components sử dụng cart

#### Cart.jsx:
- Thêm `isSyncing` vào useCart hook
- Cập nhật `handleRemoveItem()` và `handleClearCart()` thành async functions
- Tạo `handleUpdateQuantity()` async function

#### MedicineList.jsx:
- Cập nhật `handleAddToCart()` thành async function

#### MedicineDetail.jsx:
- Cập nhật `handleAddToCart()` thành async function

## Luồng hoạt động

### 1. Đăng nhập
- Khi user đăng nhập, CartContext tự động sync cart từ backend
- Nếu có cart items trên backend, sẽ load về local state

### 2. Thêm sản phẩm vào giỏ hàng
1. Frontend gọi `addToCart(medicine, quantity)`
2. Function gọi API `POST /cart-items/add-to-cart/` để thêm vào backend
3. Nếu thành công, cập nhật local state và lưu `cartItemId` từ response
4. Hiển thị thông báo thành công/thất bại

### 3. Cập nhật số lượng
1. Frontend gọi `updateQuantity(id, newQuantity)`
2. Tìm `cartItemId` tương ứng với medicine id
3. Gọi API `PATCH /cart-items/{cartItemId}/update-quantity/`
4. Nếu thành công, cập nhật local state

### 4. Xóa sản phẩm
1. Frontend gọi `removeFromCart(id)`
2. Tìm `cartItemId` tương ứng với medicine id
3. Gọi API `DELETE /cart-items/{cartItemId}/`
4. Nếu thành công, xóa khỏi local state

### 5. Đăng xuất
- Khi user đăng xuất, tự động clear cart khỏi local state và localStorage

## Error Handling

- Tất cả API calls đều có try-catch để handle errors
- Nếu API call thất bại, vẫn giữ local state để user có thể thử lại
- Hiển thị toast messages cho user biết trạng thái thành công/thất bại

## Compatibility

- Vẫn tương thích với localStorage để backup offline
- Nếu backend không available, vẫn có thể sử dụng cart cơ bản
- Auto-sync khi reconnect

## Backend API Requirements

Backend cần implement các endpoints sau:

### CartViewSet
- `GET /carts/my-cart/` - Lấy cart của user hiện tại
- Response format:
```json
{
  "id": 1,
  "user": 1,
  "items": [
    {
      "id": 1,
      "medicine": {
        "id": 1,
        "name": "Medicine Name",
        "price": 50000,
        "images": [{"imgMedicineUrl": "url"}],
        "medicineGenre": {"name": "Genre"},
        "produce": {"name": "Producer"}
      },
      "quantity": 2,
      "created_at": "2025-08-11T10:00:00Z"
    }
  ]
}
```

### CartItemViewSet
- `POST /cart-items/add-to-cart/` - Thêm sản phẩm
- `PATCH /cart-items/{id}/update-quantity/` - Cập nhật số lượng
- `DELETE /cart-items/{id}/` - Xóa sản phẩm

## Testing

Để test integration:
1. Đăng nhập vào ứng dụng
2. Thêm sản phẩm vào giỏ hàng
3. Kiểm tra Network tab để confirm API calls
4. Refresh trang để test sync
5. Đăng xuất và đăng nhập lại để test persistence
