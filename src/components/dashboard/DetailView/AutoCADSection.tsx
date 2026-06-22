import { Download, FileUp, Grid3X3, Trash2, ZoomIn } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDeleteAutocadDrawing, useUploadAutocad } from '../../../hooks/useProject';
import type { AutocadDrawing, Level } from '../../../types/project.types';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';

interface AutoCADSectionProps {
  level: Level;
}

interface PendingFile {
  id: string;
  fileDataUrl: string;
  fileName: string;
  fileType: 'dwg' | 'dxf';
}

function isCadFile(fileName: string): boolean {
  return /\.(dwg|dxf)$/i.test(fileName);
}

function getFileType(fileName: string): 'dwg' | 'dxf' {
  return fileName.toLowerCase().endsWith('.dxf') ? 'dxf' : 'dwg';
}

function getDownloadUrl(drawing: AutocadDrawing): string {
  return drawing.fileDataUrl || drawing.url;
}

function CadFilePlaceholder({
  fileName,
  fileType,
  size = 'md',
}: {
  fileName: string;
  fileType: 'dwg' | 'dxf';
  size?: 'sm' | 'md' | 'lg';
}) {
  const heights = { sm: 'h-24', md: 'h-40', lg: 'h-72' };
  return (
    <div
      className={`relative flex ${heights[size]} w-full flex-col items-center justify-center bg-[#1a2332]`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
          backgroundSize: size === 'sm' ? '12px 12px' : '20px 20px',
        }}
      />
      <div className="relative text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg border border-primary-500/40 bg-primary-500/10">
          <span className="text-xs font-bold uppercase text-primary-400">{fileType}</span>
        </div>
        {size !== 'sm' && (
          <p className="max-w-[200px] truncate px-4 text-xs text-gray-400">{fileName}</p>
        )}
      </div>
    </div>
  );
}

export function AutoCADSection({ level }: AutoCADSectionProps) {
  const [selectedDrawing, setSelectedDrawing] = useState<AutocadDrawing | null>(null);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadAutocad = useUploadAutocad(level.id);
  const deleteDrawing = useDeleteAutocadDrawing(level.id);

  const drawings = level.images.autocadDrawings;
  const activeDrawing = drawings[activeIndex];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      if (!isCadFile(file.name)) {
        toast.error(`${file.name}: only DWG and DXF files are allowed`);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setPendingFiles((prev) => [
          ...prev,
          {
            id: `pending-${Date.now()}-${Math.random()}`,
            fileDataUrl: reader.result as string,
            fileName: file.name,
            fileType: getFileType(file.name),
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUploadAll = async () => {
    if (!pendingFiles.length) {
      toast.error('Please select DWG or DXF files to upload');
      return;
    }

    const count = pendingFiles.length;
    for (const file of pendingFiles) {
      await uploadAutocad.mutateAsync({
        fileDataUrl: file.fileDataUrl,
        fileName: file.fileName,
      });
    }

    setPendingFiles([]);
    setActiveIndex(drawings.length + count - 1);
    toast.success(`${count} drawing(s) uploaded`);
  };

  const removePending = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDelete = async (drawingId: string) => {
    await deleteDrawing.mutateAsync(drawingId);
    setActiveIndex(0);
    toast.success('Drawing removed');
  };

  const handleDownload = (drawing: AutocadDrawing) => {
    const link = document.createElement('a');
    link.href = getDownloadUrl(drawing);
    link.download = drawing.fileName;
    link.target = '_blank';
    link.click();
    toast.success('Download started');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">AutoCAD Drawings</h3>
          <p className="text-sm text-gray-500">
            Upload DWG and DXF floor plans, structural &amp; elevation drawings
          </p>
        </div>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
          {drawings.length} drawing{drawings.length !== 1 ? 's' : ''}
        </span>
      </div>

      {activeDrawing && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h4 className="font-medium text-gray-900">{activeDrawing.label}</h4>
              <p className="text-xs text-gray-500">
                {activeDrawing.fileName} · {activeDrawing.fileType.toUpperCase()} ·{' '}
                {new Date(activeDrawing.uploadedAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedDrawing(activeDrawing)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <ZoomIn className="h-4 w-4" />
                Preview
              </button>
              <button
                onClick={() => handleDownload(activeDrawing)}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
              <button
                onClick={() => handleDelete(activeDrawing.id)}
                className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
                disabled={deleteDrawing.isPending}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div
            className="cursor-pointer overflow-hidden rounded-lg border border-gray-200"
            onClick={() => setSelectedDrawing(activeDrawing)}
          >
            <div className="relative bg-black">
              <img
                src={activeDrawing.url}
                alt={activeDrawing.label}
                className="relative mx-auto h-72 w-full object-contain p-2"
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Grid3X3 className="h-4 w-4" />
          All Drawings
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {drawings.map((drawing, index) => (
            <button
              key={drawing.id}
              onClick={() => setActiveIndex(index)}
              className={`group overflow-hidden rounded-xl border bg-white text-left shadow-sm transition-all hover:shadow-md ${
                activeIndex === index
                  ? 'border-primary-500 ring-2 ring-primary-500/20'
                  : 'border-gray-200'
              }`}
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-black">
                <img
                  src={drawing.url}
                  alt={drawing.label}
                  className="h-full w-full object-contain p-1"
                />
                <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase text-primary-300">
                  {drawing.fileType}
                </span>
              </div>
              <div className="border-t border-gray-100 p-3">
                <p className="truncate text-sm font-medium text-gray-900">{drawing.label}</p>
                <p className="truncate text-xs text-gray-500">{drawing.fileName}</p>
              </div>
            </button>
          ))}

          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 transition-colors hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600"
          >
            <FileUp className="mb-2 h-8 w-8" />
            <span className="text-sm font-medium">Upload Drawing</span>
            <span className="mt-1 text-xs">DWG &amp; DXF only</span>
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".dwg,.dxf"
        onChange={handleFileSelect}
        className="hidden"
      />

      {pendingFiles.length > 0 && (
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-medium text-primary-900">
              {pendingFiles.length} file(s) ready to upload
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleUploadAll} isLoading={uploadAutocad.isPending}>
                Upload All
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPendingFiles([])}>
                Clear
              </Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {pendingFiles.map((file) => (
              <div
                key={file.id}
                className="overflow-hidden rounded-lg border border-primary-200 bg-white"
              >
                <CadFilePlaceholder
                  fileName={file.fileName}
                  fileType={file.fileType}
                  size="sm"
                />
                <div className="flex items-center justify-between p-2">
                  <p className="truncate text-xs text-gray-700">{file.fileName}</p>
                  <button
                    onClick={() => removePending(file.id)}
                    className="shrink-0 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {drawings.length === 0 && pendingFiles.length === 0 && (
        <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
          <FileUp className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <p className="text-gray-500">No AutoCAD drawings yet. Upload DWG or DXF files.</p>
          <Button className="mt-4" onClick={() => fileInputRef.current?.click()}>
            Upload Drawings
          </Button>
        </div>
      )}

      <Modal
        isOpen={!!selectedDrawing}
        onClose={() => setSelectedDrawing(null)}
        title={selectedDrawing?.label || 'AutoCAD Preview'}
      >
        {selectedDrawing && (
          <div>
            <div className="rounded-lg bg-black p-2">
              <img
                src={selectedDrawing.url}
                alt={selectedDrawing.label}
                className="w-full rounded object-contain"
              />
            </div>
            <div className="mt-3 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {selectedDrawing.fileName} · {selectedDrawing.fileType.toUpperCase()}
              </p>
              <Button size="sm" variant="outline" onClick={() => handleDownload(selectedDrawing)}>
                <Download className="h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
