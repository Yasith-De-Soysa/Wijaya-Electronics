import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {} from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const URL = "http://localhost:5000/productActivityLog";
const fetchHandler = async () => {
  return await axios.get(URL).then((res) => res.data.logs);
};

function ProductActivityLogDisplay() {
  const [logs, setLogs] = useState([]);
  const [docName, setDocName] = useState("");
  const [shouldPrint, setShouldPrint] = useState(false);
  const [showDocName, setShowDocName] = useState(false);

  useEffect(() => {
    fetchHandler().then((data) => setLogs(data));
  }, []);
  const ComponentsRef = useRef();
  const handlePrintClick = () => {
    if (!docName.trim()) {
      alert("Please enter a document name!");
      return;
    }

    if (!ComponentsRef.current) {
      alert("Nothing to print");
      return;
    }
    setShowDocName(false);
    setShouldPrint(true);
  };

  const handlePrint = useReactToPrint({
    contentRef: ComponentsRef,
    documentTitle: docName,
    onAfterPrint: () => alert("Inventory report downloaded successfully..."),
  });

  useEffect(() => {
    if (shouldPrint && ComponentsRef.current) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint, handlePrint]);

  return (
    <div className="p-6" ref={ComponentsRef}>
      {/* Print Modal */}
      {showDocName && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md space-y-4 max-w-md w-full">
            <p className="text-[#212529] font-medium">Enter Document name:</p>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePrintClick()}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#0057B8]"
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={handlePrintClick}
                className="bg-[#FFA500] text-white px-4 py-2 rounded hover:bg-orange-600"
              >
                Print
              </button>
              <button
                onClick={() => setShowDocName(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Product Activity Logs</h1>
        <button
          onClick={() => setShowDocName(true)}
          className="bg-[#0057B8] text-white px-4 py-2 rounded hover:bg-blue-700 print:hidden"
        >
          Print
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-[#0057B8] text-white">
            <tr>
              <th className="border px-4 py-2">Date & Time</th>
              <th className="border px-4 py-2">Product</th>
              <th className="border px-4 py-2">Action</th>
              <th className="border px-4 py-2">Reason</th>
              <th className="border px-4 py-2">Changes</th>
              <th className="border px-4 py-2">By</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td className="border px-4 py-2">
                  {new Date(log.at).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {log.productName || "Deleted Product"}
                </td>
                <td className="border px-4 py-2">{log.action}</td>
                <td className="border px-4 py-2">{log.reason}</td>
                <td className="border px-4 py-2">
                  {log.changes && log.changes.length > 0 ? (
                    <ul className="list-disc list-inside">
                      {log.changes.map((c, idx) => (
                        <li key={idx}>
                          <strong>{c.field}</strong>: {c.oldValue} →{" "}
                          {c.newValue}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border px-4 py-2">{log.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductActivityLogDisplay;
