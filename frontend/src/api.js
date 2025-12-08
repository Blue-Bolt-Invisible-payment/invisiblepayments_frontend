import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// ====================================
// 🧪 TESTING MODE CONFIGURATION
// ====================================
// MOCK_MODE: Set to true to use mock data for ALL API calls (when backend is not available)
//            Set to false to connect to real backend
// 
// Note: When MOCK_MODE = false, the test button in WelcomeKiosk will still work
//       by enabling TEST_USER_MODE temporarily for that session
const MOCK_MODE = false;

// Internal flag to track if we're using test user (set by test button)
let TEST_USER_MODE = false;

// Function to enable test mode (called when test button is clicked)
export const enableTestMode = () => {
  TEST_USER_MODE = true;
};

// Function to disable test mode (called on logout)
export const disableTestMode = () => {
  TEST_USER_MODE = false;
};

// Mock data for testing without backend
const MOCK_USER = {
  id: 1,
  name: 'Farheen',
  email: 'farheen@smartpay.com',
  walletBalance: 550,
  enabled: true
};

const MOCK_CART = [
  {
    id: 1,
    userId: 1,
    quantity: 5,
    item: {
      id: 1,
      name: 'Blue Pen',
      brand: 'Cello',
      category: 'Stationery',
      price: 20,
      mrp: 25,
      unit: 'piece',
      imageUrl: 'https://via.placeholder.com/100',
      rfidTag: 'RFID001'
    }
  },
  {
    id: 2,
    userId: 1,
    quantity: 2,
    item: {
      id: 2,
      name: 'Pencil',
      brand: 'Apsara',
      category: 'Stationery',
      price: 10,
      mrp: 12,
      unit: 'piece',
      imageUrl: 'https://via.placeholder.com/100',
      rfidTag: 'RFID002'
    }
  },
  {
    id: 3,
    userId: 1,
    quantity: 1,
    item: {
      id: 3,
      name: 'Eraser',
      brand: 'Apsara',
      category: 'Stationery',
      price: 5,
      mrp: 5,
      unit: 'piece',
      imageUrl: 'https://via.placeholder.com/100',
      rfidTag: 'RFID003'
    }
  }
];

let mockCartData = [...MOCK_CART];

// ====================================================================================
// Authentication & User Management APIs
// ====================================================================================

/**
 * Biometrics API: authenticateUser()
 * Authenticate user via fingerprint and return user details with wallet balance
 * UNIVERSAL SUPPORT: Works with mobile, laptop, tablet built-in sensors AND external USB scanners
 * 
 * Supported Devices:
 * - Mobile: Android fingerprint, iOS Touch ID
 * - Laptop: Windows Hello, Mac Touch ID
 * - Tablet: Built-in fingerprint sensors
 * - Kiosk: External USB fingerprint scanners (DigitalPersona, Mantra, Morpho, etc.)
 * 
 * Backend: Compare captured fingerprint with stored biometric data in database
 * Returns: { userId, name, email, walletBalance, biometricEnabled }
 * Throws: "Fingerprint not recognized. Please try again." if no match found
 */
export const authenticateUser = (fingerprintData) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        return Promise.resolve({ data: MOCK_USER });
    }
    
    // Send fingerprint data to backend
    // Backend will handle different fingerprint formats:
    // - WebAuthn credentials (mobile/laptop built-in)
    // - External scanner templates (USB devices)
    return axios.post(`${API_BASE_URL}/auth/fingerprint`, { 
        fingerprintData,
        deviceInfo: {
            method: fingerprintData.method || 'unknown',
            deviceType: fingerprintData.deviceType || 'unknown',
            timestamp: fingerprintData.timestamp || new Date().toISOString()
        }
    });
};

/**
 * Get user details by userId
 * Returns: { id, name, email, walletBalance, biometricEnabled, createdAt }
 */
export const getUserDetails = (userId) => 
    axios.get(`${API_BASE_URL}/users/${userId}`);

/**
 * Get wallet balance for a user
 * Returns: { userId, balance }
 */
export const getWalletBalance = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        return Promise.resolve({ data: MOCK_USER.walletBalance });
    }
    return axios.get(`${API_BASE_URL}/wallet/${userId}/balance`);
};

/**
 * Register new user with biometric data and wallet
 * Backend: Store user details, biometric hash, and create wallet in database
 * 
 * Request Body:
 * {
 *   name: string,
 *   email: string,
 *   phone: string (optional),
 *   initialWalletBalance: number,
 *   fingerprintData: object (from enrollFingerprint()),
 *   deviceType: string,
 *   enrolledAt: ISO timestamp
 * }
 * 
 * Returns: { userId, name, email, walletBalance, biometricEnabled, status }
 */
export const registerNewUser = (userData) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        // Mock successful registration
        return Promise.resolve({
            data: {
                userId: Date.now(),
                name: userData.name,
                email: userData.email,
                phone: userData.phone,
                walletBalance: userData.initialWalletBalance,
                biometricEnabled: true,
                status: 'ACTIVE',
                message: 'User registered successfully (MOCK MODE)'
            }
        });
    }
    return axios.post(`${API_BASE_URL}/auth/register`, userData);
};

/**
 * Legacy function - kept for backward compatibility
 * Use registerNewUser() instead
 */
export const registerUser = (userData) => 
    axios.post(`${API_BASE_URL}/users/register`, userData);

// ====================================================================================
// RFID & Product Management APIs
// ====================================================================================

/**
 * RFID API: addItemsToCart()
 * Add product to cart via RFID scanning
 * Backend: Lookup product by RFID tag and add to user's cart
 * Throws: "Product not found" if RFID tag doesn't match any product
 */
export const addItemsToCart = (userId, rfidTag) => 
    axios.post(`${API_BASE_URL}/cart/add-by-rfid`, { userId, rfidTag });

/**
 * Get product details by RFID tag
 * Returns: { id, name, brand, category, price, mrp, discount, unit, imageUrl, rfidTag, stock }
 */
export const getProductByRfid = (rfidTag) => 
    axios.get(`${API_BASE_URL}/products/rfid/${rfidTag}`);

/**
 * Get all products with full details
 * Returns: Array of products with pricing, stock, and RFID information
 */
export const getAllProducts = () => 
    axios.get(`${API_BASE_URL}/products`);

/**
 * Get products by category
 * Returns: Array of products filtered by category
 */
export const getProductsByCategory = (category) => 
    axios.get(`${API_BASE_URL}/products/category/${category}`);

/**
 * Search products by name, brand, or description
 */
export const searchProducts = (query) => 
    axios.get(`${API_BASE_URL}/products/search`, { params: { q: query } });

// ====================================================================================
// Cart Management APIs
// ====================================================================================

/**
 * Get cart items for invoice display
 * Returns: Array of cart items with product details and quantities
 */
export const getCart = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        return Promise.resolve({ data: mockCartData });
    }
    return axios.get(`${API_BASE_URL}/cart/${userId}`);
};

/**
 * Get cart total amount
 * Returns: { subtotal, discount, tax, total, itemCount }
 */
export const getCartTotal = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        const total = mockCartData.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
        return Promise.resolve({ data: total });
    }
    return axios.get(`${API_BASE_URL}/cart/${userId}/total`);
};

/**
 * Update cart item quantity
 * Backend: Update quantity and recalculate total
 * Throws: "Insufficient stock" if requested quantity exceeds available stock
 */
export const updateCartItem = (userId, cartItemId, quantity) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        const item = mockCartData.find(i => i.id === cartItemId);
        if (item) {
            item.quantity = quantity;
        }
        return Promise.resolve({ data: { success: true } });
    }
    return axios.put(`${API_BASE_URL}/cart/${userId}/item/${cartItemId}`, { quantity });
};

/**
 * Remove item from cart
 * Backend: Delete cart item and recalculate total
 */
export const removeCartItem = (userId, cartItemId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        mockCartData = mockCartData.filter(i => i.id !== cartItemId);
        return Promise.resolve({ data: { success: true } });
    }
    return axios.delete(`${API_BASE_URL}/cart/${userId}/item/${cartItemId}`);
};

/**
 * Clear entire cart for a user
 * Backend: Remove all items from cart
 */
export const clearCart = (userId) => 
    axios.delete(`${API_BASE_URL}/cart/${userId}/clear`);

// ====================================================================================
// Payment & Transaction APIs
// ====================================================================================

/**
 * Payments API: proceedToPay()
 * Process payment and deduct amount from wallet
 * Backend: 
 * - Validate cart is not empty
 * - Check wallet balance is sufficient
 * - Deduct amount from wallet
 * - Create transaction record
 * - Update product stock
 * - Clear cart
 * - Generate receipt
 * Returns: { transactionId, status, receipt, newBalance, timestamp }
 * Throws: "Insufficient wallet balance" or "Cart is empty"
 */
export const proceedToPay = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        const total = mockCartData.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
        mockCartData = []; // Clear cart after payment
        return Promise.resolve({
            data: {
                transactionId: 'TXN' + Date.now(),
                status: 'success',
                receipt: 'Receipt generated',
                newBalance: MOCK_USER.walletBalance - total,
                timestamp: new Date().toISOString()
            }
        });
    }
    return axios.post(`${API_BASE_URL}/payment/process`, { userId });
};

/**
 * Validate payment before processing
 * Backend: Check cart and wallet balance without processing
 * Returns: { valid, message, cartTotal, walletBalance }
 */
export const validatePayment = (userId) => 
    axios.get(`${API_BASE_URL}/payment/validate/${userId}`);

/**
 * Get transaction history for a user
 * Returns: Array of past transactions with details
 */
export const getTransactionHistory = (userId) => 
    axios.get(`${API_BASE_URL}/transactions/${userId}`);

/**
 * Get transaction details by transaction ID
 * Returns: Complete transaction details with receipt
 */
export const getTransactionDetails = (transactionId) => 
    axios.get(`${API_BASE_URL}/transactions/details/${transactionId}`);

/**
 * Add money to wallet
 * Backend: Increase wallet balance and create transaction record
 */
export const addMoneyToWallet = (userId, amount) => 
    axios.post(`${API_BASE_URL}/wallet/${userId}/add`, { amount });

// ====================================================================================
// Legacy API (For backward compatibility - can be removed after migration)
// ====================================================================================
export const login = (fingerprint) => authenticateUser(fingerprint);
export const addToCart = (userId, rfidTag) => addItemsToCart(userId, rfidTag);
export const pay = (userId) => proceedToPay(userId);
