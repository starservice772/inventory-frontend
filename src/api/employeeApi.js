const BASE_URL = "https://dev.starserviceinventory.cloud/api";

// GET ALL EMPLOYEE DETAILS
export const getEmployees = async (page = 0) => {
    try {
        const token = localStorage.getItem("token");

        const res = await fetch(
            `${BASE_URL}/employee/getAll/${page}/10`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        let data = null;

        try {
            data = await res.json();
        } catch {
            console.log("Non-JSON response");
        }

        if (!res.ok) {
            throw new Error(data?.message || "Failed to fetch employees");
        }

        // ✅ return only what component needs
        return {
            employees: data?.response || [],
            totalPages: data?.totalPages || 0,
            totalRecords: data?.totalRecords || 0,
        };

    } catch (error) {
        console.error("API Error:", error.message);
        throw error; // 🔥 important (so component can handle it)
    }
};


// CREATE NEW EMPLOYEE
export const createEmployee = async (payload) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/employee/save`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    let data = null;
    try {
        data = await res.json();
    } catch { }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to create employee");
    }

    return data;
};

// Get Employee by ID
export const getEmployeeById = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(
        `${BASE_URL}/employee/getById?id=${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    let data = null;

    try {
        data = await res.json();
    } catch {
        console.log("Non-JSON response");
    }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to fetch employee");
    }

    // Return employee object
    return data?.response || data;
};


// TOGGLE EMPLOYEE STATUS
export const toggleEmployeeStatus = async (emp) => {
    const token = localStorage.getItem("token");

    const url = `${BASE_URL}/employee/changeStatus?id=${emp.id}`;

    const res = await fetch(url, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    let data = null;
    try {
        data = await res.json();
    } catch { }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to toggle status");
    }

    return data;
};

// UPDATE EMPLOYEE DETAILS
export const updateEmployee = async (emp) => {
    const token = localStorage.getItem("token");

    const url = `${BASE_URL}/employee/update`;
    // console.log("Updating:", url, payload); // 🔥 debug

    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(emp),
    });

    let data = null;
    try {
        data = await res.json();
    } catch { }

    if (!res.ok) {
        throw new Error(data?.message || "Failed to update employee");
    }

    return data;
};


// DELETE EMPLOYEE DETAILS
export const deleteEmployee = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/employee/delete?id=${id}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!res.ok) {
        throw new Error("Failed to delete employee");
    }

    return true;
};

// SEARCH EMPLOYEE DETAILS
export const searchEmployees = async (page, search = "") => {
    const token = localStorage.getItem("token");

    const url = `${BASE_URL}/employee/getAll/${page}/10?search=${search}`;

    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await res.json();

    return {
        employees: data?.response || [],
        totalPages: data?.totalPages || 0,
        totalRecords: data?.totalRecords || 0,
    };
};