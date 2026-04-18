import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2, Table2 } from 'lucide-react';

export default function CsvUploader({ onDataParsed }) {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.data.length === 0) {
          setError('CSV file is empty or has no valid rows.');
          return;
        }

        const cols = results.meta.fields || [];
        const data = results.data;

        setColumns(cols);
        setRows(data);
        onDataParsed({ columns: cols, rows: data, fileName: file.name });
      },
      error: () => {
        setError('Failed to parse CSV file. Please check the format.');
      },
    });
  };

  const handleFile = (e) => processFile(e.target.files?.[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleClear = () => {
    setRows([]);
    setColumns([]);
    setFileName('');
    setError('');
    onDataParsed(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {!fileName ? (
        <label
          className={`flex flex-col items-center justify-center w-full py-14 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            dragOver
              ? 'border-primary-500 bg-primary-50/50 scale-[1.005]'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center mb-3 shadow-sm">
            <Upload size={28} className="text-primary-500" />
          </div>
          <span className="text-sm font-semibold text-gray-700">Drop your CSV file here</span>
          <span className="text-[13px] text-gray-500 mt-1">or click to browse</span>
          <span className="text-[11px] text-gray-400 mt-3 px-3 py-1.5 bg-gray-100 rounded-lg">
            Supports any CSV format with headers
          </span>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      ) : (
        <div className="space-y-4">
          {/* File info bar */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary-50/80 to-emerald-50/50 rounded-xl border border-primary-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-primary-100">
                <FileSpreadsheet size={18} className="text-primary-600" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-800 block">{fileName}</span>
                <span className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-emerald-500" />
                  {rows.length} rows · {columns.length} columns detected
                </span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="p-2 rounded-xl hover:bg-white/80 text-gray-400 hover:text-red-500 transition-all cursor-pointer"
              title="Remove file"
            >
              <X size={18} />
            </button>
          </div>

          {/* Data preview */}
          {rows.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2.5">
                <Table2 size={14} className="text-gray-400" />
                <span className="text-[12px] font-semibold text-gray-500 uppercase tracking-wider">
                  Data Preview
                </span>
                {rows.length > 10 && (
                  <span className="text-[11px] text-gray-400 ml-auto">
                    Showing 10 of {rows.length} rows
                  </span>
                )}
              </div>
              <div className="max-h-72 overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
                <table className="w-full text-[12px]">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-2.5 px-3 text-gray-400 font-semibold w-10">#</th>
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="text-left py-2.5 px-3 text-gray-600 font-bold whitespace-nowrap"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(0, 10).map((row, i) => (
                      <tr
                        key={i}
                        className="border-b border-gray-50 hover:bg-primary-50/20 transition-colors"
                      >
                        <td className="py-2 px-3 text-gray-300 font-medium">{i + 1}</td>
                        {columns.map((col) => (
                          <td
                            key={col}
                            className="py-2 px-3 text-gray-700 max-w-[200px] truncate"
                            title={row[col] || ''}
                          >
                            {row[col] || <span className="text-gray-300 italic">empty</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-sm text-red-600 border border-red-100">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
}
