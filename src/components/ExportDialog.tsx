import { useState } from 'react'
import { Download } from 'lucide-react'
import type * as THREE from 'three'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { exportModel, EXPORT_FORMATS, type ExportFormat } from '@/lib/exporters'

interface ExportDialogProps {
  /**
   * Callback to get the current mesh object for export
   */
  onGetMesh: () => THREE.Object3D | null
}

export function ExportDialog({ onGetMesh }: ExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('stl')
  const [isExporting, setIsExporting] = useState(false)
  const [open, setOpen] = useState(false)

  const handleExport = async () => {
    const mesh = onGetMesh()
    
    if (!mesh) {
      console.error('No mesh available to export')
      return
    }

    setIsExporting(true)

    try {
      const filename = `bracket-plate.${selectedFormat}`
      await exportModel(mesh, { format: selectedFormat, filename })
      
      // Close dialog after successful export
      setOpen(false)
    } catch (error) {
      console.error('Export failed:', error)
      alert(`Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export 3D Model</DialogTitle>
          <DialogDescription>
            Choose a format to download your customized bracket plate.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {/* Format selection */}
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-900">Format</label>
            <div className="grid grid-cols-3 gap-3">
              {EXPORT_FORMATS.map((format) => (
                <button
                  key={format}
                  type="button"
                  onClick={() => setSelectedFormat(format)}
                  className={`
                    px-4 py-3 text-base font-bold rounded-lg border-2 transition-all duration-200 transform
                    ${
                      selectedFormat === format
                        ? 'bg-blue-600 text-white border-blue-700 shadow-lg scale-105'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:bg-blue-50 hover:scale-102'
                    }
                  `}
                >
                  {format.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Format info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 text-sm">
            <div className="font-semibold text-gray-900 mb-1.5">
              {selectedFormat === 'stl' && '📄 STL (Binary)'}
              {selectedFormat === 'obj' && '📄 OBJ (Wavefront)'}
              {selectedFormat === 'glb' && '📄 GLB (GLTF Binary)'}
            </div>
            <div className="text-gray-700">
              {selectedFormat === 'stl' && 
                'Standard format for 3D printing. Compatible with slicers like Cura, PrusaSlicer, etc.'}
              {selectedFormat === 'obj' && 
                'Universal mesh format. Compatible with most 3D software and viewers.'}
              {selectedFormat === 'glb' && 
                'Modern format with material support. Good for sharing and online viewers.'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
          >
            {isExporting ? (
              <>Exporting...</>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download {selectedFormat.toUpperCase()}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

