import { useState } from "react";
import { registerUser } from "../api/userApi";
import { validateUserForm } from "../validators/userValidator";

export function useRegisterForm() {
    const [formData, setFormData] = useState(
        {
            username: "",
            email: "",
            password: ""
        }
    );
    const [fieldErrors, setFieldErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setServerError("");
        setSuccess(false);

        const clientErrors = validateUserForm(formData);
        if (Object.keys(clientErrors).length) {
            setFieldErrors(clientErrors);
            return;
        }

        setLoading(true);

        try {
            await registerUser(formData);
            setSuccess(true);
            setFormData(
                {
                    username: "",
                    email: "",
                    password: ""
                }
            );
        } catch (err) {
            try {
                const parsed = JSON.parse(err.message);
                if (parsed.errors) {
                    setFieldErrors(parsed.errors);
                    return;
                }
            } catch {
                setServerError(err.message || "Registration failed.");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        fieldErrors,
        serverError,
        success,
        loading,
        handleChange,
        handleSubmit
    };
}
