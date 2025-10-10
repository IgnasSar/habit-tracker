export function validateUserForm(formData) {
    const errors = {};

    if (!formData.username.trim()) {
        errors.username = "Username is required.";
    } else if (formData.username.trim().length < 2) {
        errors.username = "Username must be at least 2 characters long.";
    } else if (formData.username.trim().length > 50) {
        errors.username = "Username cannot be longer than 50 characters.";
    }

    if (!formData.email.trim()) {
        errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
        errors.password = "Password is required.";
    } else if (formData.password.length < 8) {
        errors.password = "Password must be at least 8 characters long.";
    } else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).+$/.test(formData.password)) {
        errors.password = "Password must include uppercase, lowercase, number, and symbol.";
    }

    return errors;
}
