import { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import CsvUploader from '../components/upload/CsvUploader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import {
  CloudUpload,
  Database,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  ArrowUpFromLine,
  Sparkles,
  XCircle,
} from 'lucide-react';

const TABLE_NAME = 'stock_summary';

// Columns that the CSV should provide (id and created_at are auto-generated)
const TABLE_COLUMNS = ['item_name', 'salt', 'batch_name', 'qty', 'expiry', 'company', 'branch_code', 'store'];

// Map CSV header names to database column names
const CSV_HEADER_TO_COLUMN = {
  'item name': 'item_name',
  'salt': 'salt',
  'batch name': 'batch_name',
  'qty': 'qty',
  'expiry': 'expiry',
  'company': 'company',
  'branch code': 'branch_code',
  'store': 'store',
};

// Normalize column names by replacing underscores with spaces and vice versa
const normalizeColumnName = (name) => {
  return name.toLowerCase().trim().replace(/[_\s-]+/g, '_');
};

// Check if CSV column matches any table column
const isColumnMatch = (csvCol) => {
  const normalized = normalizeColumnName(csvCol);
  return TABLE_COLUMNS.some(tc => normalizeColumnName(tc) === normalized);
};

const BATCH_SIZE = 500;

export default function UploadData() {
  const [csvData, setCsvData] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadStats, setUploadStats] = useState(null);

  const handleUpload = () => {
    if (!csvData) {
      toast.error('Please upload a CSV file first');
      return;
    }
    setShowConfirm(true);
  };

  const mapRowToTable = (row) => {
    const mapped = {};
    for (const csvKey of Object.keys(row)) {
      const normalizedKey = normalizeColumnName(csvKey);
      
      // Find matching DB column using normalized comparison
      let dbCol = null;
      for (const tc of TABLE_COLUMNS) {
        if (normalizeColumnName(tc) === normalizedKey) {
          dbCol = tc;
          break;
        }
      }
      
      if (dbCol) {
        let value = row[csvKey];
        // Convert qty to number if present
        if (dbCol === 'qty' && value !== null && value !== '' && value !== undefined) {
          value = parseFloat(value);
          if (isNaN(value)) value = null;
        }
        // Treat empty strings as null for nullable fields
        if (value === '' && dbCol !== 'item_name') {
          value = null;
        }
        mapped[dbCol] = value;
      }
    }
    return mapped;
  };

  const confirmUpload = async () => {
    setShowConfirm(false);
    setUploading(true);
    setProgress(0);
    setUploadComplete(false);
    setUploadError('');
    setUploadStats(null);

    try {
      // Step 1: Delete all existing rows (replace mode)
      setProgress(5);
      const { error: deleteError } = await supabase
        .from(TABLE_NAME)
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // deletes all rows

      if (deleteError) {
        throw new Error(`Failed to clear table: ${deleteError.message}`);
      }

      setProgress(15);

      // Step 2: Map CSV rows to table schema
      const mappedRows = csvData.rows.map(mapRowToTable);

      // Filter out rows without required item_code
      const validRows = mappedRows.filter((r) => r.item_name && r.item_name.trim() !== '');
      const skippedCount = mappedRows.length - validRows.length;

      if (validRows.length === 0) {
        throw new Error('No valid rows found. Ensure CSV has an "ITEM NAME" column with values.');
      }

      // Step 3: Insert in batches
      const totalBatches = Math.ceil(validRows.length / BATCH_SIZE);
      let insertedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        const batch = validRows.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);

        const { data, error: insertError } = await supabase
          .from(TABLE_NAME)
          .insert(batch);

        if (insertError) {
          console.error(`Batch ${i + 1} error:`, insertError);
          errorCount += batch.length;
        } else {
          insertedCount += batch.length;
        }

        // Update progress (15% to 95% for insert phase)
        const insertProgress = 15 + ((i + 1) / totalBatches) * 80;
        setProgress(Math.min(insertProgress, 95));
      }

      setProgress(100);
      setUploading(false);
      setUploadComplete(true);
      setUploadStats({
        total: csvData.rows.length,
        inserted: insertedCount,
        skipped: skippedCount,
        errors: errorCount,
      });

      if (errorCount > 0) {
        toast.error(`Upload completed with ${errorCount} errors`);
      } else {
        toast.success(`${insertedCount} rows uploaded to "${TABLE_NAME}" successfully!`);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setUploading(false);
      setUploadError(err.message || 'Upload failed. Please try again.');
      toast.error('Upload failed');
    }
  };

  const handleReset = () => {
    setCsvData(null);
    setProgress(0);
    setUploadComplete(false);
    setUploadError('');
    setUploadStats(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — CSV Upload */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-xl bg-primary-50 flex items-center justify-center">
                <FileSpreadsheet size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">Upload CSV File</h3>
                <p className="text-[11px] text-gray-400">
                  Upload stock data to the <span className="font-semibold text-primary-600">{TABLE_NAME}</span> table in Supabase
                </p>
              </div>
            </div>
            <CsvUploader onDataParsed={setCsvData} />

            {/* Expected columns hint */}
            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <p className="text-[11px] font-semibold text-blue-600 mb-1.5 flex items-center gap-1.5">
                <Database size={11} />
                Expected CSV Columns
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TABLE_COLUMNS.map((col) => (
                  <span
                    key={col}
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${
                      col === 'item_name'
                        ? 'bg-red-50 text-red-600 border border-red-200'
                        : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}
                  >
                    {col}{col === 'item_name' ? ' *' : ''}
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                * required — <code className="bg-gray-100 px-1 rounded text-[10px]">id</code> and <code className="bg-gray-100 px-1 rounded text-[10px]">created_at</code> are auto-generated
              </p>
            </div>
          </Card>
        </div>

        {/* Right column — Upload Summary & Action */}
        <div className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            {/* Decorative gradient corner */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full" />

            <div className="relative space-y-5">
              <h3 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                  <CloudUpload size={14} className="text-primary-600" />
                </div>
                Upload Summary
              </h3>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-[12px] text-gray-500 font-medium">File</span>
                  <span className="text-[12px] font-semibold text-gray-800 truncate max-w-[140px]">
                    {csvData?.fileName || '—'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-[12px] text-gray-500 font-medium">Rows</span>
                  <span className="text-[12px] font-bold text-gray-800">
                    {csvData?.rows.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 bg-gray-50 rounded-xl">
                  <span className="text-[12px] text-gray-500 font-medium">Columns</span>
                  <span className="text-[12px] font-bold text-gray-800">
                    {csvData?.columns.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2.5 px-3 bg-primary-50/50 rounded-xl border border-primary-100">
                  <span className="text-[12px] text-primary-600 font-medium flex items-center gap-1.5">
                    <Database size={11} />
                    Table
                  </span>
                  <span className="text-[12px] font-bold text-primary-700">
                    {TABLE_NAME}
                  </span>
                </div>
              </div>

              {/* Detected columns */}
              {csvData?.columns.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    Detected Columns
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {csvData.columns.map((col) => {
                      const isMatch = isColumnMatch(col);
                      return (
                        <span
                          key={col}
                          className={`text-[10px] font-medium px-2 py-1 rounded-lg border ${
                            isMatch
                              ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
                              : 'text-amber-700 bg-amber-50 border-amber-100'
                          }`}
                          title={isMatch ? 'Matches table column' : 'No matching table column — will be skipped'}
                        >
                          {col} {isMatch ? '✓' : '⚠'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Upload progress / button / result */}
              {uploading ? (
                <div className="space-y-3 pt-2">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-emerald-500 h-2.5 rounded-full transition-all duration-300 progress-pulse"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <ArrowUpFromLine size={12} className="text-primary-500 animate-bounce" />
                    <p className="text-[13px] text-gray-500 font-medium">
                      {progress < 15 ? 'Clearing old data...' : `Uploading... ${Math.min(Math.round(progress), 100)}%`}
                    </p>
                  </div>
                </div>
              ) : uploadError ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 py-3 px-4 bg-red-50 rounded-xl border border-red-100">
                    <XCircle size={16} className="text-red-500 shrink-0" />
                    <p className="text-[12px] text-red-700 font-medium">{uploadError}</p>
                  </div>
                  <Button variant="secondary" onClick={handleReset} className="w-full">
                    Try Again
                  </Button>
                </div>
              ) : uploadComplete ? (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-center gap-2 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    <p className="text-[13px] text-emerald-700 font-semibold">
                      Upload Complete!
                    </p>
                  </div>
                  {uploadStats && (
                    <div className="space-y-1.5 text-[11px]">
                      <div className="flex justify-between text-gray-500">
                        <span>Rows inserted</span>
                        <span className="font-bold text-emerald-600">{uploadStats.inserted}</span>
                      </div>
                      {uploadStats.skipped > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Rows skipped (no item name)</span>
                          <span className="font-bold text-amber-600">{uploadStats.skipped}</span>
                        </div>
                      )}
                      {uploadStats.errors > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Errors</span>
                          <span className="font-bold text-red-600">{uploadStats.errors}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <Button variant="secondary" onClick={handleReset} className="w-full">
                    <Sparkles size={15} />
                    Upload Another File
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={handleUpload}
                  className="w-full"
                  disabled={!csvData}
                >
                  <CloudUpload size={15} />
                  Upload
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* Confirm Modal */}
      <Modal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Upload"
      >
        <div>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                This will <span className="font-bold text-red-600">replace all existing data</span> in the{' '}
                <span className="font-bold text-primary-600">{TABLE_NAME}</span>{' '}
                table with{' '}
                <span className="font-bold text-gray-900">
                  {csvData?.rows.length} new rows
                </span>.
              </p>
              <p className="text-[13px] text-gray-400 mt-1.5">
                This action cannot be undone. Make sure your CSV data is correct.
              </p>
            </div>
          </div>

          {csvData?.columns.length > 0 && (
            <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Columns to upload
              </p>
              <div className="flex flex-wrap gap-1.5">
                {csvData.columns.map((col) => {
                  const isMatch = isColumnMatch(col);
                  return (
                    <span
                      key={col}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border ${
                        isMatch
                          ? 'text-gray-700 bg-white border-gray-200'
                          : 'text-amber-600 bg-amber-50 border-amber-200 line-through'
                      }`}
                    >
                      {col}
                    </span>
                  );
                })}
              </div>
              {csvData.columns.some(
                (col) => !isColumnMatch(col)
              ) && (
                <p className="text-[10px] text-amber-600 mt-2">
                  ⚠ Strikethrough columns don't match the table schema and will be ignored.
                </p>
              )}
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowConfirm(false)}>
              Cancel
            </Button>
            <Button onClick={confirmUpload}>
              <CloudUpload size={15} />
              Confirm Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
