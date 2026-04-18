import { useState, useRef } from 'react';
import Papa from 'papaparse';
import { Upload, FileSpreadsheet, X, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function LeadsUploader({ onLeadsUploaded }) {
  const [csvLeads, setCsvLeads] = useState([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const processFile = (file) => {
    if (!file) return;
    setError('');
    setFileName(file.name);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const parsed = results.data
          .filter((row) => row.name && row.phone)
          .map((row, i) => ({
            id: `csv-${i}`,
            name: row.name,
            phone: row.phone,
            source: 'csv',
            selected: true,
          }));

        if (parsed.length === 0) {
          setError('No valid leads found. CSV must have "name" and "phone" columns.');
          return;
        }

        setCsvLeads(parsed);
        onLeadsUploaded(parsed);
      },
      error: () => {
        setError('Failed to parse CSV file.');
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
    setCsvLeads([]);
    setFileName('');
    setError('');
    onLeadsUploaded([]);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">Upload Leads (CSV)</label>
      {!fileName ? (
        <label
          className={`flex flex-col items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
            dragOver
              ? 'border-primary-500 bg-primary-50/50 scale-[1.01]'
              : 'border-gray-300 hover:border-primary-400 hover:bg-primary-50/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center mb-2">
            <Upload size={20} className="text-primary-500" />
          </div>
          <span className="text-sm font-medium text-gray-600">Drop CSV here or click to upload</span>
          <span className="text-[11px] text-gray-400 mt-1">Requires "name" and "phone" columns</span>
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>
      ) : (
        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileSpreadsheet size={16} className="text-primary-600" />
              </div>
              <div>
                <span className="text-sm font-semibold text-gray-700 block">{fileName}</span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                  <CheckCircle2 size={10} className="text-emerald-500" />
                  {csvLeads.length} leads imported
                </span>
              </div>
            </div>
            <button onClick={handleClear} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
              <X size={16} />
            </button>
          </div>
          {csvLeads.length > 0 && (
            <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 bg-white">
              <table className="w-full text-[11px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-1.5 px-3 text-gray-500 font-semibold">Name</th>
                    <th className="text-left py-1.5 px-3 text-gray-500 font-semibold">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {csvLeads.slice(0, 5).map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-50">
                      <td className="py-1.5 px-3 text-gray-700">{lead.name}</td>
                      <td className="py-1.5 px-3 text-gray-500">{lead.phone}</td>
                    </tr>
                  ))}
                  {csvLeads.length > 5 && (
                    <tr>
                      <td colSpan={2} className="py-1.5 text-gray-400 text-center">
                        +{csvLeads.length - 5} more
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 mt-2 text-sm text-red-500">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
    </div>
  );
}
