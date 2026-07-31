import { BASE_URL, getAuthHeaders } from "../config/apiConfig";

const downloadExcel = async (url, fileName) => {
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Failed to download report");
    }

    const blob = await response.blob();

    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
};

// Office Stock
export const downloadOfficeStockReport = async () => {
    await downloadExcel(
        `${BASE_URL}/report/officeStock/download`,
        "Office_Stock_Report.xlsx"
    );
};

// Employee Stock
export const downloadEmployeeStockReport = async () => {
    await downloadExcel(
        `${BASE_URL}/report/employeeStock/download`,
        "Employee_Stock_Report.xlsx"
    );
};

// Defective Stock
export const downloadDefectiveStockReport = async () => {
    await downloadExcel(
        `${BASE_URL}/report/defectiveStock/download`,
        "Defective_Stock_Report.xlsx"
    );
};

// Purchase Stock
export const downloadPurchaseStockReport = async ({ from, to }) => {
    const formatDate = (date) => date.replaceAll("-", "_");

    const fileName = `Purchase_Stock_Report_${formatDate(from)}_to_${formatDate(to)}.xlsx`;
    await downloadExcel(
        `${BASE_URL}/report/purchase/download?fromDate=${from}&toDate=${to}`,
        fileName
    );
};

// Sales Stock
export const downloadSaleStockReport = async ({ from, to }) => {
    const formatDate = (date) => date.replaceAll("-", "_");

    const fileName = `Sales_Stock_Report_${formatDate(from)}_to_${formatDate(to)}.xlsx`;
    await downloadExcel(
        `${BASE_URL}/report/sale/download?fromDate=${from}&toDate=${to}`,
        fileName
    );
};

// Stock Transfer
export const downloadStockTransferReport = async ({ from, to }) => {
    const formatDate = (date) => date.replaceAll("-", "_");

    const fileName = `Stock_Transfer_Report_${formatDate(from)}_to_${formatDate(to)}.xlsx`;
    await downloadExcel(
        `${BASE_URL}/report/stock/transfer/download?fromDate=${from}&toDate=${to}`,
        fileName
    );
};

// Defective Stock Transfer to Company
export const downloadDefectiveStockTransferCompanyTransactionReport = async ({ from, to }) => {
    const formatDate = (date) => date.replaceAll("-", "_");

    const fileName = `Defective_Stock_Transfer_to_Company_Report_${formatDate(from)}_to_${formatDate(to)}.xlsx`;
    await downloadExcel(
        `${BASE_URL}/report/defective/transfer/toCompany/download?fromDate=${from}&toDate=${to}`,
        fileName
    );
};