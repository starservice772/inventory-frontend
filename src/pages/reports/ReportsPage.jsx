import toast from "react-hot-toast";
import { useState } from "react";
import {
  CalendarDays,
  Download,
  FileSpreadsheet,
} from "lucide-react";

import {
  downloadOfficeStockReport,
  downloadEmployeeStockReport,
  downloadDefectiveStockReport,
  downloadPurchaseStockReport,
  downloadSaleStockReport,
  downloadStockTransferReport,
  downloadDefectiveStockTransferCompanyTransactionReport
} from "../../api/reportApi";

const reports = [
  "Office Stock Report",
  "Engineer Stock Report",
  "Defective Stock Report",
  "Stock Transfer Transaction Report",
  "Purchases Report",
  "Sales Report",
  "Defective stock transfer to company transaction report"
];

export default function ReportsPage() {

  const [loadingReport, setLoadingReport] = useState("");
  const [dateRange, setDateRange] = useState({
    from: "",
    to: "",
  });

  const handleDownload = async (report) => {
    try {
      // Date validation only for reports that require it
      if (
        report === "Purchases Report" ||
        report === "Sales Report" ||
        report === "Stock Transfer Transaction Report"
      ) {
        if (!dateRange.from || !dateRange.to) {
          toast.error("Please select From and To Date");
          return;
        }
      }

      setLoadingReport(report);

      switch (report) {

        case "Office Stock Report":
          await downloadOfficeStockReport();
          break;

        case "Engineer Stock Report":
          await downloadEmployeeStockReport();
          break;

        case "Defective Stock Report":
          await downloadDefectiveStockReport();
          break;

        case "Purchases Report":
          await downloadPurchaseStockReport(dateRange);
          break;

        case "Sales Report":
          await downloadSaleStockReport(dateRange);
          break;

        case "Stock Transfer Transaction Report":
          await downloadStockTransferReport(dateRange);
          break;

        case "Defective stock transfer to company transaction report":
          await downloadDefectiveStockTransferCompanyTransactionReport(dateRange);
          break;

        default:
          toast.error("Report not available");
          return;
      }

      toast.success("Download Started");

    } catch (err) {
      toast.error("Download Failed");
    } finally {
      setLoadingReport("");
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Reports</h2>
        <p className="text-slate-500">Generate and export reports in Excel format</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {reports.map((report) => (
          <div
            key={report}
            className="
            group
            relative
            overflow-hidden
            rounded-2xl
            border border-slate-200
            bg-gradient-to-br from-white to-slate-50
            p-6
            shadow-sm
            transition-all duration-300
            hover:-translate-y-2
            hover:shadow-2xl
            "
          >

            {/* Top Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500"></div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center mb-5 group-hover:scale-110 transition">
              <FileSpreadsheet size={28} className="text-emerald-600" />
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-slate-800 leading-6">
              {report}
            </h3>

            <p className="text-sm text-slate-500 mt-2">
              Export report in Microsoft Excel (.xlsx) format.
            </p>

            {/* Badge */}
            <div className="inline-flex items-center mt-4 mb-5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              Excel (.xlsx)
            </div>

            {/* Dates */}

            {/* Date Range (Only for reports that require it) */}

            {[
              "Purchases Report",
              "Sales Report",
              "Stock Transfer Transaction Report",
              "Defective stock transfer to company transaction report",
            ].includes(report) && (

                <div className="mt-5 mb-5">

                  {/* Header */}
                  {/* <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-semibold text-slate-700">
                      <CalendarDays size={16} className="text-slate-400 mr-2" /> Filter by Date
                    </span>

                    <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </div> */}

                  <div className="grid grid-cols-2 gap-4">

                    {/* From Date */}

                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        From
                      </label>

                      <div
                        className="
                        flex items-center
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        px-2
                        h-11
                        transition-all
                        duration-300
                        group-focus-within:border-emerald-500
                        group-focus-within:ring-2
                        group-focus-within:ring-emerald-100
                        "
                      >
                        <span className="text-slate-400"><CalendarDays size={16} className="text-slate-400 mr-2" /></span>

                        <input
                          type="date"
                          value={dateRange.from}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              from: e.target.value,
                            })
                          }
                          className="
                          bg-transparent
                          outline-none
                          w-full
                          text-sm
                          text-slate-700
                          "
                        />
                      </div>
                    </div>

                    {/* To Date */}

                    <div className="group">
                      <label className="block text-xs font-medium text-slate-500 mb-1">
                        To
                      </label>

                      <div
                        className="
                        flex items-center
                        rounded-xl
                        border border-slate-200
                        bg-slate-50
                        px-2
                        h-11
                        transition-all
                        duration-300
                        group-focus-within:border-emerald-500
                        group-focus-within:ring-2
                        group-focus-within:ring-emerald-100
                        "
                      >
                        <span className="text-slate-400"><CalendarDays size={16} className="text-slate-400 mr-2" /></span>

                        <input
                          type="date"
                          value={dateRange.to}
                          onChange={(e) =>
                            setDateRange({
                              ...dateRange,
                              to: e.target.value,
                            })
                          }
                          className="
                          bg-transparent
                          outline-none
                          w-full
                          text-sm
                          text-slate-700
                          "
                        />
                      </div>
                    </div>

                  </div>

                </div>

              )}

            {/* Button */}

            <button
              onClick={() => handleDownload(report)}
              disabled={loadingReport === report}
              className={`
              w-full
              mt-2
              flex
              items-center
              justify-center
              gap-2
              py-3
              rounded-xl
              font-semibold
              transition-all
              duration-300

                ${loadingReport === report
                  ? "bg-slate-400 text-white cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700 hover:shadow-lg hover:scale-[1.02] active:scale-95"
                }
              `}
            >
              {loadingReport === report ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Exporting...
                </>
              ) : (
                <>
                  <Download size={18} /> Export Excel
                </>
              )}
            </button>

          </div>
        ))}
      </div>
    </div>
  );
}