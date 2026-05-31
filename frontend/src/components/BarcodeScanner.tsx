import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { SpinnerIcon } from "./icons";

type BarcodeScannerProps = {
  onDetected: (barcode: string) => void;
  isSearching: boolean;
};

export const BarcodeScanner = ({ onDetected, isSearching }: BarcodeScannerProps) => {
  const [cameras, setCameras] = useState<any[]>([]);
  const [selectedCameraId, setSelectedCameraId] = useState<string>("");
  const [isScanning, setIsScanning] = useState(false);
  const [scannerError, setScannerError] = useState("");
  const [manualBarcode, setManualBarcode] = useState("");
  
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const scannerId = "barcode-scanner-viewport";

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        html5QrCodeRef.current.stop().catch((err) => console.error("Failed to stop scanner on unmount:", err));
      }
    };
  }, []);

  const startScanner = async (cameraId: string) => {
    setScannerError("");
    try {
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode(scannerId);
      }

      // If already scanning, stop it first
      if (html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
      }

      setIsScanning(true);
      await html5QrCodeRef.current.start(
        cameraId,
        {
          fps: 10,
          qrbox: (width, height) => {
            const boxWidth = Math.min(width * 0.8, 300);
            const boxHeight = Math.min(height * 0.4, 150);
            return { width: boxWidth, height: boxHeight };
          },
          aspectRatio: 1.333333
        },
        (decodedText) => {
          stopScanner();
          onDetected(decodedText);
        },
        () => {
          // Silent frame-by-frame error
        }
      );
    } catch (err: any) {
      console.error("Failed to start scanner:", err);
      setScannerError("Unable to access camera. Please allow camera permissions or type barcode manually.");
      setIsScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (err) {
        console.error("Failed to stop scanner:", err);
      }
    }
    setIsScanning(false);
  };

  const initCameras = async () => {
    setScannerError("");
    try {
      const devices = await Html5Qrcode.getCameras();
      if (devices && devices.length > 0) {
        setCameras(devices);
        const backCamera = devices.find(device => 
          device.label.toLowerCase().includes("back") || 
          device.label.toLowerCase().includes("rear") || 
          device.label.toLowerCase().includes("environment")
        );
        const defaultId = backCamera ? backCamera.id : devices[0].id;
        setSelectedCameraId(defaultId);
        await startScanner(defaultId);
      } else {
        setScannerError("No cameras found on your device.");
      }
    } catch (err: any) {
      console.error("Error getting cameras:", err);
      setScannerError("Camera permission denied or camera not found. Please enter barcode manually below.");
    }
  };

  useEffect(() => {
    initCameras();
    return () => {
      stopScanner();
    };
  }, []);

  const handleCameraChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCameraId = e.target.value;
    setSelectedCameraId(newCameraId);
    if (isScanning) {
      await startScanner(newCameraId);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) {
      onDetected(manualBarcode.trim());
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Video stream container */}
      <div className="relative w-full max-w-md bg-black rounded-2xl overflow-hidden aspect-video border border-border flex items-center justify-center mb-4 shadow-inner">
        <div id={scannerId} className="w-full h-full object-cover" />

        {/* Custom Bounding Target overlay */}
        {isScanning && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Dark mask outside scanning box */}
            <div className="absolute inset-0 border-[35px] border-black/40" />
            
            {/* Viewfinder Target */}
            <div className="relative w-[80%] h-[50%] border-2 border-primary rounded-xl overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(122,158,126,0.3)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-primary rounded-tl" />
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-primary rounded-tr" />
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-primary rounded-bl" />
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-primary rounded-br" />
              
              {/* Laser guideline */}
              <div 
                className="absolute left-0 right-0 h-0.5 bg-rose opacity-80 scan-line"
                style={{
                  boxShadow: "0 0 10px #D47A7A",
                }}
              />
            </div>
          </div>
        )}

        {!isScanning && (
          <div className="absolute inset-0 bg-[#F5F6F1] flex flex-col items-center justify-center p-6 text-center z-10">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-12 h-12 text-textMuted mb-3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
            </svg>
            <p className="text-sm font-bold text-textHeading mb-2">Camera is inactive</p>
            <button
              type="button"
              onClick={() => selectedCameraId ? startScanner(selectedCameraId) : initCameras()}
              className="px-4 py-2 bg-[#9DB89F] hover:bg-[#7A9E7E] text-white rounded-full text-xs font-bold transition-all shadow-sm"
            >
              Start Camera
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes scanLine {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .scan-line {
          animation: scanLine 2s linear infinite;
        }
      `}</style>

      {/* Camera selector dropdown */}
      {isScanning && cameras.length > 1 && (
        <div className="w-full max-w-md flex items-center gap-2 mb-4 bg-white border border-border p-2 rounded-xl">
          <label className="text-[10px] font-bold text-textMuted whitespace-nowrap uppercase tracking-wider pl-1">Camera:</label>
          <select
            value={selectedCameraId}
            onChange={handleCameraChange}
            className="flex-1 text-xs bg-transparent text-textHeading outline-none cursor-pointer font-semibold"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label || `Camera ${cameras.indexOf(camera) + 1}`}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={stopScanner}
            className="px-3 py-1 bg-[#FEF0EB] border border-[#FEE2D5] text-[#E8815A] hover:bg-[#FEE2D5] rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider"
          >
            Stop
          </button>
        </div>
      )}

      {/* Manual Input Fallback */}
      <form onSubmit={handleManualSubmit} className="w-full max-w-md border-t border-border pt-4 mt-2">
        <label className="block text-xs font-bold text-textMuted uppercase tracking-wider mb-2 text-left">
          Or Enter Barcode Manually
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            value={manualBarcode}
            onChange={(e) => setManualBarcode(e.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 8901030700865"
            disabled={isSearching}
            className="flex-1 px-4 py-2.5 bg-[#F9FAF8] border border-border focus:border-[#7A9E7E] focus:ring-1 focus:ring-[#7A9E7E] rounded-xl text-textHeading text-sm outline-none font-medium transition-all shadow-sm"
          />
          <button
            type="submit"
            disabled={isSearching || !manualBarcode.trim()}
            className="px-5 py-2.5 rounded-xl bg-[#9DB89F] hover:bg-[#7A9E7E] text-white text-xs font-bold transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm shrink-0"
          >
            {isSearching ? (
              <SpinnerIcon className="h-3.5 w-3.5 animate-spin text-white" />
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            )}
            Lookup
          </button>
        </div>
      </form>

      {/* Scanner error */}
      {scannerError && (
        <div className="w-full max-w-md mt-4 rounded-xl border border-danger/20 bg-danger/10 p-3 text-xs font-medium text-danger text-center animate-fade-in">
          {scannerError}
        </div>
      )}
    </div>
  );
};
