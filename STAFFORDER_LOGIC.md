# StaffOrder Logic Documentation

## 📋 Tổng quan
`StaffOrder` là trang quản lý đơn hàng dành cho nhân viên, cho phép xem, lọc và điều hướng đến chi tiết đơn hàng.

## 🏗️ Kiến trúc hệ thống

### 1. **Pages Layer** (`src/pages/StaffOrder.jsx`)
**Vai trò:** Orchestration - điều phối các component và logic

```jsx
// Chỉ import và sử dụng hooks + components
const StaffDashboard = () => {
  const { orders, loading, error, currentPage, totalPages, fetchOrders } = useOrders();
  const { searchQuery, statusFilter, dateFilter, buildFilters } = useOrderFilters();
  
  // Logic debounce + fetch khi filter thay đổi
  useEffect(() => {
    const timer = setTimeout(() => {
      const filters = buildFilters();
      fetchOrders(1, filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, statusFilter, dateFilter]);
}
```

**Trách nhiệm:**
- Import và kết nối các hooks
- Xử lý side effects (useEffect)
- Render layout tổng thể
- Navigation logic

---

### 2. **Hooks Layer** (`src/hooks/useOrders.js`)
**Vai trò:** State Management & Business Logic

#### `useOrders()` Hook
```javascript
const useOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchOrders = useCallback(async (page, filters) => {
    // 1. Call API via orderService
    // 2. Transform raw data thành format chuẩn
    // 3. Update state
  }, []);
}
```

**Logic xử lý:**
1. **API Call:** Gọi `orderService.getAllOrders(page, filters)`
2. **Data Transformation:** 
   ```javascript
   const formattedOrders = ordersData.map(order => ({
     id: order.id,
     customerName: order.user_name || order.online_order?.ship_info?.full_name || 'N/A',
     totalAmount: parseFloat(order.total || 0),
     status: order.status || 'pending',
     deliveryType: order.online_order?.shipping_method === 'store_pickup' ? 'pickup' : 'delivery'
   }));
   ```
3. **Pagination:** Tính `totalPages = Math.ceil(totalCount / 10)`

#### `useOrderFilters()` Hook
```javascript
const useOrderFilters = () => {
  const buildFilters = useCallback(() => {
    const filters = {};
    if (statusFilter !== "all") filters.status = statusFilter;
    if (searchQuery.trim()) filters.order_id = searchQuery.trim();
    if (dateFilter) filters.start_date = dateFilter;
    return filters;
  }, [searchQuery, statusFilter, dateFilter]);
}
```

**Logic filter:**
- **Status Filter:** Lọc theo trạng thái đơn hàng
- **Search:** Tìm theo mã đơn hàng (order_id)
- **Date Filter:** Lọc theo ngày tạo đơn

---

### 3. **Features Layer** (`src/features/Order/`)
**Vai trò:** Domain-specific Components

#### `OrderFilters.jsx`
```jsx
const OrderFilters = ({ 
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  dateFilter, setDateFilter 
}) => {
  // 3 input fields: Status dropdown, Date picker, Search input
}
```

**Features:**
- **Controlled Components:** Tất cả inputs đều controlled
- **Configurable Options:** statusOptions có thể customize
- **Responsive Design:** Grid layout 1-3 columns

#### `OrderTable.jsx`
```jsx
const OrderTable = ({ 
  orders, loading, error,
  onViewOrder, onRetry,
  formatCurrency, formatDate,
  getStatusColor, getStatusText 
}) => {
  // Hiển thị table với 3 states: loading, error, success
}
```

**Logic hiển thị:**
1. **Loading State:** Spinner + text
2. **Error State:** Error icon + retry button
3. **Success State:** Table với columns:
   - Mã đơn hàng
   - Khách hàng (tên + loại giao hàng + SĐT)
   - Thời gian
   - Tổng tiền
   - Trạng thái (badge với màu)
   - Thao tác (nút Xem)

#### `OrderStatusBadge.jsx`
```jsx
const OrderStatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    // Map status -> Tailwind classes
  };
  const getStatusText = (status) => {
    // Map English -> Vietnamese
  };
}
```

---

### 4. **UI Layer** (`src/ui/`)
**Vai trò:** Generic, Reusable Components

#### `Pagination.jsx`
```jsx
const Pagination = ({ currentPage, totalPages, onPageChange, loading }) => {
  // Smart pagination: hiển thị max 5 pages
  // Previous/Next buttons
  // Page info display
}
```

**Logic pagination:**
- **Visible Pages:** Tính toán pages hiển thị (max 5)
- **Navigation:** Previous/Next + direct page click
- **Loading State:** Disable buttons khi loading

---

### 5. **Utils Layer** (`src/utils/`)
**Vai trò:** Pure Functions

#### `formatters.js`
```javascript
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN');
};
```

---

### 6. **Services Layer** (`src/services/orderService.js`)
**Vai trò:** API Communication

```javascript
const getAllOrders = async (page, filters) => {
  // Build URL với query params
  // Call Django REST API
  // Return response data
};
```

---

## 🔄 Data Flow

```
User Action (filter change)
       ↓
StaffOrder (useEffect with debounce)
       ↓
useOrderFilters (buildFilters)
       ↓
useOrders (fetchOrders)
       ↓
orderService (getAllOrders)
       ↓
Django API
       ↓
Response data transformation
       ↓
State update (orders, loading, error)
       ↓
Re-render OrderTable
```

## ⚡ Performance Optimizations

1. **Debouncing:** 500ms delay cho search để tránh spam API
2. **useCallback:** Memoize functions để tránh re-render
3. **Controlled Re-renders:** Chỉ re-render khi cần thiết
4. **Loading States:** UX tốt với loading indicators

## 🎯 Key Features

1. **Real-time Filtering:** Debounced search + status + date filters
2. **Pagination:** Smart pagination với navigation
3. **Responsive Design:** Mobile-friendly layout
4. **Error Handling:** Graceful error states với retry
5. **Type Safety Ready:** Structure sẵn sàng cho TypeScript
6. **Reusable Components:** UI components có thể dùng cho features khác

## 🔧 Extensibility

### Thêm filter mới:
1. Update `useOrderFilters` hook
2. Update `OrderFilters` component
3. Update `buildFilters` logic

### Thêm column mới:
1. Update data transformation trong `useOrders`
2. Update `OrderTable` component

### Reuse cho domain khác:
1. Copy pattern sang `features/Medicine/`, `features/Customer/`
2. Reuse `Pagination`, `PageHeader` từ `ui/`
