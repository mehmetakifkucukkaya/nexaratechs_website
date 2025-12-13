"use client";

import { useState, useRef } from "react";
import { X, Upload, FileText, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "./Toast";

interface TesterImportModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface ParsedTester {
    fullName: string;
    email: string;
    device: string;
}

export function TesterImportModal({ isOpen, onClose, onSuccess }: TesterImportModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedTester[]>([]);
    const [importing, setImporting] = useState(false);
    const [importProgress, setImportProgress] = useState({ current: 0, total: 0 });
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { showToast } = useToast();

    const resetState = () => {
        setFile(null);
        setParsedData([]);
        setImportProgress({ current: 0, total: 0 });
    };

    const parseCSV = (text: string): ParsedTester[] => {
        // Normalize line endings (Windows uses \r\n)
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
        const lines = normalizedText.trim().split('\n').filter(line => line.trim());

        console.log('CSV Lines:', lines.length, 'First line:', lines[0]);

        if (lines.length < 2) return [];

        // Get headers - handle quoted values
        const rawHeaders = lines[0].split(',').map(h => h.trim().replace(/"/g, '').toLowerCase());
        console.log('Headers found:', rawHeaders);

        // Find column indices - more flexible matching
        const nameIdx = rawHeaders.findIndex(h =>
            h === 'full name' || h === 'fullname' || h === 'name' || h.includes('name') || h.includes('ad')
        );
        const emailIdx = rawHeaders.findIndex(h =>
            h === 'email' || h.includes('email') || h.includes('mail') || h.includes('e-mail')
        );
        const deviceIdx = rawHeaders.findIndex(h =>
            h === 'device' || h.includes('device') || h.includes('cihaz')
        );

        if (nameIdx === -1 || emailIdx === -1) {
            showToast("CSV must have 'name' and 'email' columns", "error");
            return [];
        }

        const testers: ParsedTester[] = [];

        for (let i = 1; i < lines.length; i++) {
            // Handle CSV with quoted values containing commas
            const line = lines[i];
            const values: string[] = [];
            let current = '';
            let inQuotes = false;

            for (let j = 0; j < line.length; j++) {
                const char = line[j];
                if (char === '"') {
                    inQuotes = !inQuotes;
                } else if (char === ',' && !inQuotes) {
                    values.push(current.trim().replace(/"/g, ''));
                    current = '';
                } else {
                    current += char;
                }
            }
            values.push(current.trim().replace(/"/g, ''));

            const fullName = values[nameIdx]?.trim();
            const email = values[emailIdx]?.trim().toLowerCase();
            const device = deviceIdx !== -1 ? values[deviceIdx]?.trim() : 'Android';

            // Only require name and email to exist (email validation is optional)
            if (fullName && email) {
                testers.push({
                    fullName,
                    email,
                    device: device || 'Android'
                });
            } else {
                console.log('Skipped row:', i, 'name:', fullName, 'email:', email);
            }
        }

        return testers;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            showToast("Please select a CSV file", "error");
            return;
        }

        setFile(selectedFile);

        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target?.result as string;
            const parsed = parseCSV(text);
            setParsedData(parsed);

            if (parsed.length === 0) {
                showToast("No valid testers found in CSV", "error");
            } else {
                showToast(`Found ${parsed.length} testers in CSV`, "info");
            }
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        if (parsedData.length === 0) return;

        setImporting(true);
        setImportProgress({ current: 0, total: parsedData.length });

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < parsedData.length; i++) {
            try {
                await addDoc(collection(db, "testers"), {
                    ...parsedData[i],
                    status: 'pending',
                    appliedAt: serverTimestamp()
                });
                successCount++;
            } catch (error) {
                console.error("Error importing tester:", error);
                errorCount++;
            }
            setImportProgress({ current: i + 1, total: parsedData.length });
        }

        setImporting(false);

        if (errorCount === 0) {
            showToast(`Successfully imported ${successCount} testers`, "success");
        } else {
            showToast(`Imported ${successCount}, failed ${errorCount}`, "error");
        }

        resetState();
        onSuccess();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-[#0a0a1a] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                {/* Header */}
                <div className="border-b border-white/5 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                            <Upload className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Import Testers from CSV</h2>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    {/* CSV Format Info */}
                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-300">
                                <p className="font-medium mb-1">CSV Format:</p>
                                <code className="text-xs bg-black/30 px-2 py-1 rounded">
                                    name,email,device
                                </code>
                                <p className="text-blue-400/70 mt-1 text-xs">
                                    Device column is optional (defaults to Android)
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500/50 hover:bg-white/[0.02] transition-all"
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        {file ? (
                            <div className="flex items-center justify-center gap-3">
                                <FileText className="w-8 h-8 text-purple-400" />
                                <div className="text-left">
                                    <p className="text-white font-medium">{file.name}</p>
                                    <p className="text-sm text-gray-400">{parsedData.length} testers found</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" />
                                <p className="text-gray-400">Click to select CSV file</p>
                                <p className="text-xs text-gray-600 mt-1">or drag and drop</p>
                            </>
                        )}
                    </div>

                    {/* Preview */}
                    {parsedData.length > 0 && (
                        <div className="rounded-xl bg-white/[0.03] border border-white/5 overflow-hidden max-h-48 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="text-left p-3 text-gray-400 font-medium">Name</th>
                                        <th className="text-left p-3 text-gray-400 font-medium">Email</th>
                                        <th className="text-left p-3 text-gray-400 font-medium">Device</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {parsedData.slice(0, 5).map((tester, i) => (
                                        <tr key={i} className="border-t border-white/5">
                                            <td className="p-3 text-white">{tester.fullName}</td>
                                            <td className="p-3 text-gray-400">{tester.email}</td>
                                            <td className="p-3 text-gray-400">{tester.device}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {parsedData.length > 5 && (
                                <div className="p-2 text-center text-gray-500 text-xs bg-white/5">
                                    ... and {parsedData.length - 5} more
                                </div>
                            )}
                        </div>
                    )}

                    {/* Progress */}
                    {importing && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-400">Importing...</span>
                                <span className="text-purple-400">{importProgress.current}/{importProgress.total}</span>
                            </div>
                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-300"
                                    style={{ width: `${(importProgress.current / importProgress.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="border-t border-white/5 p-6 flex items-center justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={importing}
                        className="px-4 py-2 rounded-xl text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleImport}
                        disabled={importing || parsedData.length === 0}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-5 py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        {importing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Import {parsedData.length} Testers
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
