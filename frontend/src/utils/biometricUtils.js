/**
 * Universal Biometric Authentication Utility
 * Supports: Mobile built-in, Laptop fingerprint, Tablet, External USB scanners
 *
 * Device Detection Order:
 * 1. Web Authentication API (WebAuthn) - Modern browsers, built-in sensors
 * 2. Android Biometric API - Mobile devices
 * 3. iOS Touch ID / Face ID - Apple devices
 * 4. Windows Hello - Windows laptops
 * 5. External USB Scanner SDK - Kiosk mode
 */
 
/* global PublicKeyCredential */
 
// Device capability flags
let biometricCapabilities = {
  webauthn: false,
  platformAuthenticator: false,
  androidBiometric: false,
  iosTouchID: false,
  windowsHello: false,
  externalScanner: false
};
 
/**
 * Detect available biometric authentication methods
 */
export const detectBiometricCapabilities = async () => {
  try {
    // 1. Check for Web Authentication API (WebAuthn) - Most modern devices
    if (window.PublicKeyCredential) {
      biometricCapabilities.webauthn = true;
     
      // Check if platform authenticator is available (built-in sensor)
      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      biometricCapabilities.platformAuthenticator = available;
    }
 
    // 2. Check for Android Biometric API
    if (navigator.userAgent.includes('Android') && 'credentials' in navigator) {
      biometricCapabilities.androidBiometric = true;
    }
 
    // 3. Check for iOS Touch ID / Face ID
    if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      biometricCapabilities.iosTouchID = true;
    }
 
    // 4. Check for Windows Hello
    if (navigator.userAgent.includes('Windows') && window.PublicKeyCredential) {
      biometricCapabilities.windowsHello = true;
    }
 
    // 5. Check for external scanner (via backend detection)
    // This will be detected by backend when USB scanner is connected
    try {
      biometricCapabilities.externalScanner = await checkExternalScanner();
    } catch (err) {
      biometricCapabilities.externalScanner = false;
    }
 
    return biometricCapabilities;
  } catch (error) {
    console.warn('Biometric detection failed:', error);
    return biometricCapabilities;
  }
};
 
/**
 * Check if external USB fingerprint scanner is connected (via backend)
 */
const checkExternalScanner = async () => {
  try {
    // Backend will expose this endpoint to check scanner status
    // const response = await fetch('/api/hardware/scanner-status');
    // const data = await response.json();
    // return data.scannerConnected;
   
    // For now, return false - will be implemented in backend
    return false;
 
  }
  // eslint-disable-next-line
  catch (error) {
    return false;
  }
};
 
/**
 * Get user-friendly device name
 */
export const getBiometricDeviceName = () => {
  if (biometricCapabilities.platformAuthenticator) {
    if (navigator.userAgent.includes('Android')) return 'Android Fingerprint';
    if (navigator.userAgent.includes('iPhone')) return 'Touch ID';
    if (navigator.userAgent.includes('iPad')) return 'Touch ID';
    if (navigator.userAgent.includes('Windows')) return 'Windows Hello';
    if (navigator.userAgent.includes('Mac')) return 'Touch ID';
    return 'Built-in Fingerprint';
  }
  if (biometricCapabilities.externalScanner) return 'External Scanner';
  return 'Fingerprint Scanner';
};
 
/**
 * Universal fingerprint capture function
 * Automatically selects the best available method
 */
export const captureFingerprintUniversal = async () => {
  try {
    // IMPORTANT: WebAuthn requires prior enrollment
    // For production, users must be enrolled first via enrollFingerprint()
    // For development/testing, this falls back to mock mode
   
    // Method 1: WebAuthn (Modern browsers with built-in sensors)
    if (biometricCapabilities.platformAuthenticator) {
      try {
        return await captureViaWebAuthn();
      } catch (error) {
        // If WebAuthn fails (no enrollment), throw descriptive error
        if (error.message.includes('No credentials')) {
          throw new Error('User not enrolled. Please register your fingerprint first or use test mode.');
        }
        throw error;
      }
    }
 
    // Method 2: Android Biometric API
    if (biometricCapabilities.androidBiometric) {
      return await captureViaAndroid();
    }
 
    // Method 3: iOS Touch ID
    if (biometricCapabilities.iosTouchID) {
      return await captureViaIOS();
    }
 
    // Method 4: Windows Hello
    if (biometricCapabilities.windowsHello) {
      return await captureViaWindowsHello();
    }
 
    // Method 5: External USB Scanner (Backend handles capture)
    if (biometricCapabilities.externalScanner) {
      return await captureViaExternalScanner();
    }
 
    // Fallback: No biometric available
    throw new Error('No biometric authentication available on this device');
  } catch (error) {
    console.error('Fingerprint capture failed:', error);
    throw error;
  }
};
 
/**
 * Method 1: WebAuthn - Works on most modern devices with built-in sensors
 * (Mobile fingerprint, laptop fingerprint, Windows Hello, Touch ID)
 *
 * NOTE: WebAuthn requires users to be enrolled first!
 * This is a DEMO implementation. Real production needs:
 * 1. User enrollment flow (call enrollFingerprint() first)
 * 2. Backend to store and manage credentials
 * 3. Challenge generation from backend
 */
const captureViaWebAuthn = async () => {
  try {
    // Fetch all registered credentials from backend
    let allowCredentials = [];
    try {
      const response = await fetch('http://localhost:8080/api/auth/credentials');
      const credentialIds = await response.json();
     
      // Convert credential IDs to the format WebAuthn expects
      allowCredentials = credentialIds.map(id => ({
        id: base64ToArrayBuffer(id),
        type: 'public-key'
      }));
     
      console.log('Fetched credentials for authentication:', allowCredentials.length);
     
      if (allowCredentials.length === 0) {
        throw new Error('No registered users found. Please register first.');
      }
    } catch (err) {
      console.error('Failed to fetch credentials:', err);
      throw new Error('No registered users found. Please register first.');
    }
 
    // Generate random challenge (in production, get this from backend)
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
 
    // Request fingerprint authentication - platform authenticator only
    const credential = await navigator.credentials.get({
      publicKey: {
        challenge: challenge,
        timeout: 60000,
        userVerification: 'required',
        allowCredentials: allowCredentials
      }
    });
 
    // Convert credential to fingerprint data
    const fingerprintData = {
      method: 'webauthn',
      deviceType: getBiometricDeviceName(),
      credentialId: arrayBufferToBase64(credential.rawId),
      authenticatorData: arrayBufferToBase64(credential.response.authenticatorData),
      signature: arrayBufferToBase64(credential.response.signature),
      userHandle: credential.response.userHandle ? arrayBufferToBase64(credential.response.userHandle) : null,
      timestamp: new Date().toISOString()
    };
 
    return fingerprintData;
  } catch (error) {
    if (error.name === 'NotAllowedError') {
      throw new Error('User cancelled fingerprint scan');
    }
    if (error.name === 'NotSupportedError') {
      throw new Error('No credentials found. User not enrolled.');
    }
    throw new Error('WebAuthn authentication failed: ' + error.message);
  }
};
 
/**
 * Method 2: Android Biometric API (for Android apps/PWAs)
 */
 
const captureViaAndroid = async () => {
  try {
 
    // This requires Android WebView or Cordova/Capacitor plugin
    // For web, falls back to WebAuthn
   
    if (window.androidBiometric) {
      // Custom Android bridge (if implemented)
      const result = await window.androidBiometric.authenticate({
        title: 'Cognizant SmartPay',
        subtitle: 'Scan fingerprint to continue',
        description: 'Place your finger on the sensor'
      });
     
      return {
        method: 'android',
        deviceType: 'Android Fingerprint',
        biometricData: result.signature,
        timestamp: new Date().toISOString()
      };
    }
   
    // Fallback to WebAuthn
    return await captureViaWebAuthn();
  } catch (error) {
    throw new Error('Android biometric failed: ' + error.message);
  }
};
 
/**
 * Method 3: iOS Touch ID / Face ID (for iOS devices)
 */
const captureViaIOS = async () => {
  try {
    // For iOS web, uses WebAuthn
    // For native iOS app, would use Local Authentication Framework
   
    if (window.iosBiometric) {
      // Custom iOS bridge (if implemented via Cordova/Capacitor)
      const result = await window.iosBiometric.authenticate({
        reason: 'Authenticate to access SmartPay'
      });
     
      return {
        method: 'ios',
        deviceType: 'Touch ID',
        biometricData: result.token,
        timestamp: new Date().toISOString()
      };
    }
   
    // Fallback to WebAuthn
    return await captureViaWebAuthn();
  } catch (error) {
    throw new Error('iOS biometric failed: ' + error.message);
  }
};
 
/**
 * Method 4: Windows Hello (for Windows laptops)
 */
const captureViaWindowsHello = async () => {
  try {
    // Windows Hello uses WebAuthn natively
    return await captureViaWebAuthn();
  } catch (error) {
    throw new Error('Windows Hello failed: ' + error.message);
  }
};
 
/**
 * Method 5: External USB Scanner (for kiosk mode)
 */
const captureViaExternalScanner = async () => {
  try {
    // Backend handles USB scanner communication
    // Frontend polls backend for scan result
   
    const response = await fetch('/api/biometric/scan-external', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'start_scan',
        timeout: 30000
      })
    });
 
    if (!response.ok) {
      throw new Error('External scanner not responding');
    }
 
    const result = await response.json();
   
    return {
      method: 'external_usb',
      deviceType: result.scannerModel || 'External USB Scanner',
      fingerprintTemplate: result.template,
      quality: result.quality,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    throw new Error('External scanner failed: ' + error.message);
  }
};
 
/**
 * Helper: Convert ArrayBuffer to Base64
 */
const arrayBufferToBase64 = (buffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};
 
/**
 * Helper: Convert Base64 to ArrayBuffer
 */
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};
 
/**
 * Enroll new fingerprint (for user registration)
 */
export const enrollFingerprint = async (userId, userName) => {
  try {
    // Generate challenge from backend
    const challenge = new Uint8Array(32);
    window.crypto.getRandomValues(challenge);
   
    const userIdBytes = new TextEncoder().encode(userId.toString());
 
    // Create credential (enrollment)
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: challenge,
        rp: {
          name: 'Cognizant SmartPay'
        },
        user: {
          id: userIdBytes,
          name: userName,
          displayName: userName
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' } // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required',
          requireResidentKey: false,
          residentKey: 'discouraged'
        },
        timeout: 60000,
        attestation: 'direct'
      }
    });
 
    // Send enrollment data to backend
    const enrollmentData = {
      method: 'webauthn',  // Add method field for backend
      userId: userId,
      credentialId: arrayBufferToBase64(credential.rawId),
      publicKey: arrayBufferToBase64(credential.response.getPublicKey()),
      attestationObject: arrayBufferToBase64(credential.response.attestationObject),
      clientDataJSON: arrayBufferToBase64(credential.response.clientDataJSON),
      deviceType: getBiometricDeviceName(),
      enrolledAt: new Date().toISOString()
    };
 
    return enrollmentData;
  } catch (error) {
    throw new Error('Fingerprint enrollment failed: ' + error.message);
  }
};
 
/**
 * Check if biometric is available on current device
 */
export const isBiometricAvailable = async () => {
  const capabilities = await detectBiometricCapabilities();
  return capabilities.platformAuthenticator ||
         capabilities.androidBiometric ||
         capabilities.iosTouchID ||
         capabilities.windowsHello ||
         capabilities.externalScanner;
};
 
/**
 * Get status message for user
 */
export const getBiometricStatus = async () => {
  const available = await isBiometricAvailable();
  const deviceName = getBiometricDeviceName();
 
  if (available) {
    return {
      available: true,
      message: `${deviceName} detected and ready`,
      deviceType: deviceName
    };
  } else {
    return {
      available: false,
      message: 'No fingerprint sensor detected. Please use external scanner or test mode.',
      deviceType: 'None'
    };
  }
};
 
// Export capabilities for debugging
export const getCapabilities = () => biometricCapabilities;