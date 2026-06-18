import { Check, Download, Merge, Plane, Smartphone, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useMergeImages } from '../../../hooks/useProject';
import type { CapturedImage, Level } from '../../../types/project.types';
import { Button } from '../../common/Button';
import { Modal } from '../../common/Modal';

interface ImageSectionProps {
  level: Level;
}

function SourceBadge({ source }: { source: CapturedImage['source'] }) {
  const config = {
    mobile: { icon: Smartphone, label: 'Mobile', className: 'bg-primary-100 text-primary-700' },
    drone: { icon: Plane, label: 'Drone', className: 'bg-purple-100 text-purple-700' },
    merged: { icon: Merge, label: 'Merged', className: 'bg-green-100 text-green-700' },
  };
  const { icon: Icon, label, className } = config[source];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${className}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

export function ImageSection({ level }: ImageSectionProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeThumb, setActiveThumb] = useState(0);
  const [mergeMode, setMergeMode] = useState(false);
  const [selectedForMerge, setSelectedForMerge] = useState<string[]>([]);
  const mergeImages = useMergeImages(level.id);

  const allImages = level.images.captured;

  const toggleMergeSelect = (id: string) => {
    setSelectedForMerge((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleMerge = async () => {
    if (selectedForMerge.length < 2) {
      toast.error('Select at least 2 images to merge');
      return;
    }
    await mergeImages.mutateAsync(selectedForMerge);
    setSelectedForMerge([]);
    setMergeMode(false);
    toast.success('Images merged successfully');
  };

  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = '_blank';
    link.click();
    toast.success('Download started');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Site Images</h3>
          <p className="text-sm text-gray-500">
            Mobile captures and drone survey photos — merge to compare progress
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={mergeMode ? 'primary' : 'outline'}
            size="sm"
            onClick={() => {
              setMergeMode(!mergeMode);
              setSelectedForMerge([]);
            }}
          >
            <Merge className="h-4 w-4" />
            {mergeMode ? 'Cancel Merge' : 'Merge Photos'}
          </Button>
          {mergeMode && selectedForMerge.length >= 2 && (
            <Button size="sm" onClick={handleMerge} isLoading={mergeImages.isPending}>
              Merge {selectedForMerge.length} Images
            </Button>
          )}
        </div>
      </div>

      {allImages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 py-16 text-center">
          <Plane className="mx-auto mb-3 h-10 w-10 text-gray-400" />
          <p className="text-gray-500">No images yet. Schedule a drone flight to capture photos.</p>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <SourceBadge source={allImages[activeThumb]?.source || 'mobile'} />
              <button
                onClick={() =>
                  handleDownload(
                    allImages[activeThumb]?.url || '',
                    `image-${activeThumb}`
                  )
                }
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
            <div
              className="cursor-pointer overflow-hidden rounded-lg bg-gray-100"
              onClick={() => setSelectedImage(allImages[activeThumb]?.url)}
            >
              <img
                src={allImages[activeThumb]?.url}
                alt="Site capture"
                className="h-80 w-full object-cover"
              />
            </div>
            <p className="mt-2 text-xs text-gray-400">
              Captured:{' '}
              {allImages[activeThumb]
                ? new Date(allImages[activeThumb].capturedAt).toLocaleString()
                : '—'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {allImages.map((img, i) => {
              const isSelected = selectedForMerge.includes(img.id);
              return (
                <div key={img.id} className="relative">
                  <button
                    onClick={() => {
                      if (mergeMode) {
                        toggleMergeSelect(img.id);
                      } else {
                        setActiveThumb(i);
                      }
                    }}
                    className={`w-full overflow-hidden rounded-lg border-2 transition-all ${
                      mergeMode
                        ? isSelected
                          ? 'border-primary-500 ring-2 ring-primary-500/30'
                          : 'border-gray-200'
                        : activeThumb === i
                          ? 'border-primary-500'
                          : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img.thumbnail} alt="" className="aspect-[4/3] w-full object-cover" />
                  </button>
                  {mergeMode && isSelected && (
                    <div className="absolute right-1 top-1 rounded-full bg-primary-600 p-0.5 text-white">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  <div className="mt-1 flex justify-center">
                    <SourceBadge source={img.source} />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {level.images.merged.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <h4 className="mb-3 font-semibold text-gray-900">Merged Comparisons</h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {level.images.merged.map((merged) => (
              <div
                key={merged.id}
                className="cursor-pointer overflow-hidden rounded-lg border border-gray-200"
                onClick={() => setSelectedImage(merged.url)}
              >
                <img src={merged.url} alt="Merged" className="h-40 w-full object-cover" />
                <p className="p-2 text-xs text-gray-500">
                  Merged {merged.sourceIds.length} images ·{' '}
                  {new Date(merged.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="Image Preview"
      >
        {selectedImage && (
          <div className="relative">
            <img src={selectedImage} alt="Preview" className="w-full rounded-lg" />
            <div className="absolute bottom-2 right-2 rounded-full bg-black/50 p-2 text-white">
              <ZoomIn className="h-4 w-4" />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
