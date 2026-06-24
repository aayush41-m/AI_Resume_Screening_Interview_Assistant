import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';

export default function FileDropZone({
  accept = '.pdf,.docx,.txt',
  multiple = false,
  files,
  onFiles,
  label,
  hint,
}) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) {
      onFiles(multiple ? dropped : [dropped[0]]);
    }
  };

  const handleChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length) {
      onFiles(multiple ? selected : [selected[0]]);
    }
  };

  const removeFile = (idx) => {
    if (multiple) {
      onFiles(files.filter((_, i) => i !== idx));
    } else {
      onFiles([]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const fileCount = files?.length || 0;

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-white mb-1.5">{label}</label>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={[
          'relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200',
          dragOver ? 'scale-[1.01]' : '',
        ].join(' ')}
        style={{
          background: dragOver ? 'rgba(139,92,246,0.10)' : 'rgba(15,10,46,0.40)',
          borderColor: dragOver ? '#a78bfa' : 'rgba(139,92,246,0.30)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div className="flex flex-col items-center gap-2 pointer-events-none">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              background: dragOver ? 'rgba(139,92,246,0.30)' : 'rgba(139,92,246,0.20)',
              color: '#a78bfa',
            }}
          >
            <UploadCloud size={26} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              {dragOver ? 'Drop your file(s) here' : (
                <>
                  <span className="text-brand-300">Click to upload</span>{' '}
                  <span className="text-purple-300">or drag and drop</span>
                </>
              )}
            </p>
            {hint && <p className="text-xs text-purple-400 mt-1">{hint}</p>}
          </div>
        </div>
      </div>

      {/* Selected file list */}
      {fileCount > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg group transition-colors"
              style={{
                background: 'rgba(26,16,64,0.60)',
                border: '1px solid rgba(139,92,246,0.20)',
              }}
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(139,92,246,0.20)', color: '#a78bfa' }}
              >
                <FileText size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{file.name}</p>
                <p className="text-xs text-purple-400">{formatSize(file.size)}</p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(i);
                }}
                className="text-purple-400 hover:text-danger-500 transition-colors p-1"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
