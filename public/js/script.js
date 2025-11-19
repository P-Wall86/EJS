// Toggle password visibility
const toggleBtn = document.getElementById("togglePassword");
const pwdField = document.getElementById("account_password");

if (toggleBtn && pwdField) {
    toggleBtn.addEventListener("click", () => {
        const isPassword = pwdField.type === "password";
        pwdField.type = isPassword ? "text" : "password";
        toggleBtn.textContent = isPassword ? "Hide" : "Show";
    });
}