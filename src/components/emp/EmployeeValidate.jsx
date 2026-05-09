import toast from "react-hot-toast";

// Add employee form validate
export const addValidateForm = (form) => {
    if (
        !form.name
        && !form.phone
        && !form.employeeCode
        && !form.role
    ) {
        toast.error("Please fill all required fields");
        return false;
    }
    if (!form.name.trim()) {
        toast.error("Full Name is required");
        return false;
    }

    if (!form.phone.trim()) {
        toast.error("Phone Number is required");
        return false;
    }

    if (form.phone.length < 10) {
        toast.error("Phone Number must be at least 10 digits");
        return false;
    }

    if (!form.employeeCode.trim()) {
        toast.error("Employee Code is required");
        return false;
    }

    if (form.employeeCode.length !== 6) {
        toast.error("Employee Code must be at least 6 characters");
        return false;
    }

    if (!form.role.trim()) {
        toast.error("Designation is required");
        return false;
    }

    return true;
};


// Edit employee form validate
export const editValidateForm = (form) => {
    if (
        !form.name
        && !form.phone
        && !form.employeeCode
        && !form.role
    ) {
        toast.error("Please fill all required fields");
        return false;
    }
    if (!form.name.trim()) {
        toast.error("Full Name is required");
        return false;
    }

    if (!form.phone.trim()) {
        toast.error("Phone Number is required");
        return false;
    }

    if (form.phone.length < 10) {
        toast.error("Phone Number must be at least 10 digits");
        return false;
    }

    // if (!form.employeeCode.trim()) {
    //     toast.error("Employee Code is required");
    //     return false;
    // }

    // if (form.employeeCode.length !== 6) {
    //     toast.error("Employee Code must be at least 6 characters");
    //     return false;
    // }

    if (!form.role.trim()) {
        toast.error("Designation is required");
        return false;
    }

    return true;
};
