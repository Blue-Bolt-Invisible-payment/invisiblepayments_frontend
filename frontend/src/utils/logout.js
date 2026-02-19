/**
 * Logout hook that clears client-side session and invokes the provided reset callback.
 * This mirrors your inactivity timeout behavior to show the welcome/registration view.
 *
 * @param {function} onResetSession - callback from App to reset state (user, cart, total, currentStep)
 * @returns {function} logout - call to perform logout
 */
import { useNavigate } from "react-router-dom";
export const useLogout = (onResetSession) => {
  const navigate=useNavigate();
  const logout = () => {
    
    try {
      // Clear any stored session artifacts (adjust keys to your app)
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      // If you store more, clear them here:
      // sessionStorage.clear();
      //navigate("/")
      //navigate("/login/", { replace: true });
      // Invoke app's reset logic (same as inactivity timeout)
      if (typeof onResetSession === 'function') {
        onResetSession(false);
      }
      navigate("/login/", { replace: true });
      } catch (err) {
      // Ensure app still resets even if storage cleanup throws
      if (typeof onResetSession === 'function') {
        onResetSession(false);
      }
      navigate("/login/", { replace: true });
    }
  };
  return logout;
};
