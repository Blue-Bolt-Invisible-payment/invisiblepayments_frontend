import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// ====================================
// TESTING MODE CONFIGURATION
// ====================================
const MOCK_MODE = false;

let TEST_USER_MODE = false;

export const enableTestMode = () => {
    TEST_USER_MODE = true;
};

export const disableTestMode = () => {
    TEST_USER_MODE = false;
};

// Mock data for testing without backend
const MOCK_USER = {
    id: 34,
    name: 'JOHN',
    email: 'vinodhg278@gmail.com',
    walletBalance: 409.18,
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

export const authenticateUser = (fingerprintData) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        return Promise.resolve({ data: MOCK_USER });
    }
    return axios.post(`${API_BASE_URL}/auth/fingerprint`, {
        fingerprintData,
        deviceInfo: {
            method: fingerprintData.method || 'unknown',
            deviceType: fingerprintData.deviceType || 'unknown',
            timestamp: fingerprintData.timestamp || new Date().toISOString()
        }
    });
};

export const getUserDetails = (userId) =>
    axios.get(`${API_BASE_URL}/users/${userId}`);

export const getWalletBalance = (userId) => {
    if (MOCK_MODE && TEST_USER_MODE) {
        return Promise.resolve({ data: MOCK_USER.walletBalance });
    }
    return axios.get(`${API_BASE_URL}/wallet/${userId}/balance`);
};

export const registerNewUser = (userData) => {
    if (MOCK_MODE || TEST_USER_MODE) {
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

export const registerUser = (userData) =>
    axios.post(`${API_BASE_URL}/users/register`, userData);

// ====================================================================================
// RFID & Product Management APIs
// ====================================================================================

/**
* Add product to cart via RFID tag (used by manual RFID entry if needed)
*/
export const addItemsToCart = (userId, rfidTag) =>
    axios.post(`${API_BASE_URL}/cart/add-by-rfid`, { userId, rfidTag });

/**
* MULTI-USER RFID SUPPORT
* Register the current user as the active scanner so the backend
* sends scanned RFID items to the correct user's cart
*/
export const registerScanner = (userId) =>
    axios.post(`${API_BASE_URL}/scan/register-scanner/${userId}`);

/**
* Unregister the user from the scanner when they log out or finish payment
*/
export const unregisterScanner = (userId) =>
    axios.post(`${API_BASE_URL}/scan/unregister-scanner/${userId}`);

/**
* Get current scanner status - check which user is registered
*/
export const getScannerStatus = () =>
    axios.get(`${API_BASE_URL}/scan/scanner-status`);

/**
* Send scanned RFID tags to backend for processing
* Backend maps tags to products and adds them to the active user cart
*/
export const sendScannedTags = (scannedTags) =>
    axios.post(`${API_BASE_URL}/scan/addtocart`, scannedTags);

export const getProductByRfid = (rfidTag) =>
    axios.get(`${API_BASE_URL}/products/rfid/${rfidTag}`);

export const getAllProducts = () =>
    axios.get(`${API_BASE_URL}/products`);

export const getProductsByCategory = (category) =>
    axios.get(`${API_BASE_URL}/products/category/${category}`);

export const searchProducts = (query) =>
    axios.get(`${API_BASE_URL}/products/search`, { params: { q: query } });

// ====================================================================================
// Cart Management APIs
// ====================================================================================

export const getCart = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        return Promise.resolve({ data: mockCartData });
    }
    return axios.get(`${API_BASE_URL}/cart/${userId}`);
};

export const getCartTotal = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        const total = mockCartData.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
        return Promise.resolve({ data: total });
    }
    return axios.get(`${API_BASE_URL}/cart/${userId}/total`).then(response => {
        return { data: response.data.total };
    });
};

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

export const removeCartItem = (userId, cartItemId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        mockCartData = mockCartData.filter(i => i.id !== cartItemId);
        return Promise.resolve({ data: { success: true } });
    }
    return axios.delete(`${API_BASE_URL}/cart/${userId}/item/${cartItemId}`);
};

export const clearCart = (userId) =>
    axios.delete(`${API_BASE_URL}/cart/${userId}/clear`);

// ====================================================================================
// Payment & Transaction APIs
// ====================================================================================

export const proceedToPay = (userId) => {
    if (MOCK_MODE || TEST_USER_MODE) {
        const total = mockCartData.reduce((sum, item) => sum + (item.item.price * item.quantity), 0);
        mockCartData = [];
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

export const validatePayment = (userId) =>
    axios.get(`${API_BASE_URL}/payment/validate/${userId}`);

export const getTransactionHistory = (userId) =>
    axios.get(`${API_BASE_URL}/transactions/${userId}`);

export const getTransactionDetails = (transactionId) =>
    axios.get(`${API_BASE_URL}/transactions/details/${transactionId}`);

export const addMoneyToWallet = (userId, amount) =>
    axios.post(`${API_BASE_URL}/wallet/${userId}/add`, { amount });

// ====================================================================================
// Legacy API (For backward compatibility)
// ====================================================================================
export const login = (fingerprint) => authenticateUser(fingerprint);
export const addToCart = (userId, rfidTag) => addItemsToCart(userId, rfidTag);
export const pay = (userId) => proceedToPay(userId);
