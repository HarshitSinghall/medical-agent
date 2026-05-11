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
  Eye,
} from 'lucide-react';

const TABLE_NAME = 'medicines_watched';

const TABLE_COLUMNS = ['medicine_name', 'salt_name'];

const normalizeColumnName = (name) =>
  name.toLowerCase().trim().replace(/[_\s-]+/g, '_');

const isColumnMatch = (csvCol) => {
  const normalized = normalizeColumnName(csvCol);
  return TABLE_COLUMNS.some((tc) => normalizeColumnName(tc) === normalized);
};

const BATCH_SIZE = 500;

export default function MedicinesWatched() {
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
      let dbCol = null;
      for (const tc of TABLE_COLUMNS) {
        if (normalizeColumnName(tc) === normalizedKey) {
          dbCol = tc;
          break;
        }
      }
      if (dbCol) {
        let value = row[csvKey];
        if (typeof value === 'string') value = value.trim();
        if (value === '') value = null;
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
      setProgress(5);

      const mappedRows = csvData.rows.map(mapRowToTable);

      const validRows = mappedRows.filter(
        (r) => r.medicine_name && r.salt_name
      );
      const skippedCount = mappedRows.length - validRows.length;

      if (validRows.length === 0) {
        throw new Error(
          'No valid rows found. Ensure CSV has "medicine_name" and "salt_name" columns with values.'
        );
      }

      // Dedupe by medicine_name within payload (keep last occurrence)
      // so upsert batch doesn't fail on intra-batch duplicates.
      const byName = new Map();
      for (const row of validRows) {
        byName.set(row.medicine_name, row);
      }
      const dedupedRows = Array.from(byName.values());
      const intraDupCount = validRows.length - dedupedRows.length;

      const totalBatches = Math.ceil(dedupedRows.length / BATCH_SIZE);
      let upsertedCount = 0;
      let errorCount = 0;

      for (let i = 0; i < totalBatches; i++) {
        const batch = dedupedRows.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE);

        const { error: upsertError } = await supabase
          .from(TABLE_NAME)
          .upsert(batch, { onConflict: 'medicine_name' });

        if (upsertError) {
          console.error(`Batch ${i + 1} error:`, upsertError);
          errorCount += batch.length;
        } else {
          upsertedCount += batch.length;
        }

        const insertProgress = 5 + ((i + 1) / totalBatches) * 90;
        setProgress(Math.min(insertProgress, 95));
      }

      setProgress(100);
      setUploading(false);
      setUploadComplete(true);
      setUploadStats({
        total: csvData.rows.length,
        upserted: upsertedCount,
        skipped: skippedCount,
        intraDuplicates: intraDupCount,
        errors: errorCount,
      });

      if (errorCount > 0) {
        toast.error(`Upload completed with ${errorCount} errors`);
      } else {
        toast.success(
          `${upsertedCount} rows added/updated in "${TABLE_NAME}"`
        );
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
                <Eye size={16} className="text-primary-600" />
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Append Medicines to Watch List
                </h3>
                <p className="text-[11px] text-gray-400">
                  Adds rows to the{' '}
                  <span className="font-semibold text-primary-600">
                    {TABLE_NAME}
                  </span>{' '}
                  table. Existing rows with the same medicine name are updated.
                </p>
              </div>
            </div>
            <CsvUploader onDataParsed={setCsvData} />

            <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
              <p className="text-[11px] font-semibold text-blue-600 mb-1.5 flex items-center gap-1.5">
                <Database size={11} />
                Expected CSV Columns
              </p>
              <div className="flex flex-wrap gap-1.5">
                {TABLE_COLUMNS.map((col) => (
                  <span
                    key={col}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200"
                  >
                    {col} *
                  </span>
                ))}
              </div>
              <p className="text-[10px] text-gray-400 mt-1.5">
                * both required —{' '}
                <code className="bg-gray-100 px-1 rounded text-[10px]">id</code>,{' '}
                <code className="bg-gray-100 px-1 rounded text-[10px]">created_at</code>,{' '}
                <code className="bg-gray-100 px-1 rounded text-[10px]">updated_at</code>{' '}
                are auto-generated. <code className="bg-gray-100 px-1 rounded text-[10px]">medicine_name</code> must be unique.
              </p>
            </div>
          </Card>
        </div>

        {/* Right column — Upload Summary & Action */}
        <div className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-primary-100/50 to-transparent rounded-full" />

            <div className="relative space-y-5">
              <h3 className="text-[13px] font-bold text-gray-900 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                  <CloudUpload size={14} className="text-primary-600" />
                </div>
                Upload Summary
              </h3>

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
                <div className="flex items-center justify-between py-2.5 px-3 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <span className="text-[12px] text-emerald-700 font-medium">Mode</span>
                  <span className="text-[12px] font-bold text-emerald-700">
                    Append (upsert)
                  </span>
                </div>
              </div>

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
                          title={
                            isMatch
                              ? 'Matches table column'
                              : 'No matching table column — will be skipped'
                          }
                        >
                          {col} {isMatch ? '✓' : '⚠'}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

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
                      Uploading... {Math.min(Math.round(progress), 100)}%
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
                        <span>Rows added/updated</span>
                        <span className="font-bold text-emerald-600">
                          {uploadStats.upserted}
                        </span>
                      </div>
                      {uploadStats.skipped > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Rows skipped (missing fields)</span>
                          <span className="font-bold text-amber-600">
                            {uploadStats.skipped}
                          </span>
                        </div>
                      )}
                      {uploadStats.intraDuplicates > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Duplicates in file (deduped)</span>
                          <span className="font-bold text-amber-600">
                            {uploadStats.intraDuplicates}
                          </span>
                        </div>
                      )}
                      {uploadStats.errors > 0 && (
                        <div className="flex justify-between text-gray-500">
                          <span>Errors</span>
                          <span className="font-bold text-red-600">
                            {uploadStats.errors}
                          </span>
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
                <Button onClick={handleUpload} className="w-full" disabled={!csvData}>
                  <CloudUpload size={15} />
                  Append to Table
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
        title="Confirm Append"
      >
        <div>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center shrink-0">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-600 leading-relaxed">
                This will append{' '}
                <span className="font-bold text-gray-900">
                  {csvData?.rows.length} rows
                </span>{' '}
                to the{' '}
                <span className="font-bold text-primary-600">{TABLE_NAME}</span>{' '}
                table. Rows with a duplicate{' '}
                <code className="bg-gray-100 px-1 rounded text-[12px]">medicine_name</code>{' '}
                will update the existing salt instead of creating duplicates.
              </p>
              <p className="text-[13px] text-gray-400 mt-1.5">
                Existing rows that aren't in this CSV stay untouched.
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
              {csvData.columns.some((col) => !isColumnMatch(col)) && (
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
              Confirm Append
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
