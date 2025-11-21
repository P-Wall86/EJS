// Register toggle password visibility
const toggleBtn = document.getElementById("togglePassword");
const pwdField = document.getElementById("account_password");

if (toggleBtn && pwdField) {
    toggleBtn.addEventListener("click", () => {
        const isPassword = pwdField.type === "password";
        pwdField.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "Hide" : "Show";
    });
}

// Login toggle password visibility
const loginToggleBtn = document.getElementById("togglePasswordLogin");
const loginPwdField = document.getElementById("account_password");

if (loginToggleBtn && loginPwdField) {
    loginToggleBtn.addEventListener("click", () => {
        const isPassword = loginPwdField.type === "password";
        loginPwdField.type = isPassword ? "text" : "password";
        loginToggleBtn.textContent = isPassword ? "Hide" : "Show";
    });
}