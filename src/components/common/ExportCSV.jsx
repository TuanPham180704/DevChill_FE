import { toast } from "react-toastify";

export default function ExportCSV({ data, fileName = "export", fields }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("Không có dữ liệu để xuất CSV!");
      return;
    }
    const headers = fields || Object.keys(data[0]);

    const rows = data.map((item) =>
      headers.map((key) => (item[key] !== null ? item[key] : "")),
    );

    const csv =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <button
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
    >
      Xuất CSV
    </button>
  );
}
