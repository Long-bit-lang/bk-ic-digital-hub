// Member QR Check-in & Camera Scanner Modal
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import jsQR from 'jsqr';
import { useApp } from '../../context/AppContext';
import { isSessionAttendanceOpen, parseScannedQrPayload } from '../../utils/qrConfig';
import {
  QrCode,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowRight,
  Camera,
  RefreshCw,
  Keyboard,
  ImagePlus,
  RotateCw
} from 'lucide-react';

interface QRScannerModalProps {
  onClose: () => void;
  defaultSessionId?: string;
  defaultToken?: string;
}

type ScanMode = 'camera' | 'manual';
type CameraState = 'initializing' | 'active' | 'error';

const MAX_VIDEO_SCAN_DIM = 640;
const MAX_IMAGE_SCAN_DIM = 1024;
const SCAN_INTERVAL_MS = 150;

function formatCameraErrorMessage(err: any): string {
  const name = err?.name || '';
  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return 'Trình duyệt chưa được cấp quyền truy cập camera. Vui lòng cho phép quyền Camera trong cài đặt trình duyệt rồi bấm "Thử mở lại camera", hoặc chụp ảnh / nhập mã thủ công.';
  }
  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return 'Không tìm thấy camera khả dụng trên thiết bị này. Bạn có thể chọn ảnh mã QR hoặc chuyển sang nhập mã thủ công.';
  }
  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return 'Camera đang được ứng dụng khác sử dụng hoặc tạm thời không khả dụng. Hãy đóng ứng dụng khác rồi thử lại.';
  }
  if (!window.isSecureContext) {
    return 'Trình duyệt chỉ cho phép mở camera trực tiếp qua kết nối HTTPS (hoặc localhost). Trên điện thoại, bạn vẫn có thể bấm "Chụp ảnh QR" bên dưới.';
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return 'Trình duyệt hoặc WebView hiện tại không hỗ trợ bật camera trực tiếp. Bạn có thể bấm "Chụp ảnh QR" hoặc chuyển sang "Nhập mã thủ công".';
  }
  return err?.message || 'Không thể khởi động camera. Bạn có thể chụp ảnh mã QR hoặc nhập mã thủ công.';
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  onClose,
  defaultSessionId,
  defaultToken
}) => {
  const { sessions, checkInSession, currentUser } = useApp();

  const openSessions = useMemo(
    () => sessions.filter(s => isSessionAttendanceOpen(s)),
    [sessions]
  );

  const [scanMode, setScanMode] = useState<ScanMode>(defaultToken ? 'manual' : 'camera');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraRetryTick, setCameraRetryTick] = useState(0);
  const [cameraState, setCameraState] = useState<CameraState>('initializing');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scanWarning, setScanWarning] = useState<string | null>(null);
  const [isDecodingImage, setIsDecodingImage] = useState(false);

  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    defaultSessionId || (openSessions.length > 0 ? openSessions[0].id : '')
  );
  const [tokenInput, setTokenInput] = useState<string>(defaultToken || '');
  const [result, setResult] = useState<{ success: boolean; message: string; status?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const scanLockRef = useRef(false);
  const processingFrameRef = useRef(false);
  const lastWarningAtRef = useRef(0);
  const barcodeDetectorRef = useRef<any>(null);
  const handleDecodedPayloadRef = useRef<(rawText: string) => Promise<boolean>>(async () => false);

  // Sync default selected session once sessions finish loading
  useEffect(() => {
    if (!selectedSessionId && openSessions.length > 0) {
      setSelectedSessionId(openSessions[0].id);
    }
  }, [selectedSessionId, openSessions]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        try {
          track.stop();
        } catch {
          // ignore track stop error
        }
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  const handleClose = useCallback(() => {
    stopCamera();
    onClose();
  }, [stopCamera, onClose]);

  const submitCheckIn = useCallback(async (sessionId: string, token: string) => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const res = await checkInSession(sessionId, 'qr', token.trim());
      setResult(res);

      if (res.success) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {
          // fallback if canvas unavailable
        }
      }
    } catch (err: any) {
      setResult({
        success: false,
        message: err.message || 'Lỗi quét QR'
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [checkInSession]);

  const decodeCanvasQr = useCallback(async (
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ): Promise<string | null> => {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const decoded = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth'
    });
    if (decoded?.data) {
      return decoded.data;
    }

    const BarcodeDetectorCtor = (window as any).BarcodeDetector;
    if (BarcodeDetectorCtor) {
      try {
        if (!barcodeDetectorRef.current) {
          barcodeDetectorRef.current = new BarcodeDetectorCtor({ formats: ['qr_code'] });
        }
        const barcodes = await barcodeDetectorRef.current.detect(canvas);
        if (Array.isArray(barcodes) && barcodes[0]?.rawValue) {
          return barcodes[0].rawValue;
        }
      } catch {
        // Ignore native detector errors and rely on jsQR
      }
    }

    return null;
  }, []);

  const handleDecodedPayload = useCallback(async (rawText: string): Promise<boolean> => {
    const parsed = parseScannedQrPayload(rawText, sessions);
    if (!parsed.valid) {
      const now = Date.now();
      if (now - lastWarningAtRef.current > 1800) {
        lastWarningAtRef.current = now;
        setScanWarning('Đã quét thấy mã QR nhưng không phải mã điểm danh của BK-IC. Vui lòng hướng camera vào mã QR trên màn hình máy chiếu.');
      }
      return false;
    }

    setScanWarning(null);
    const resolvedSessionId =
      parsed.sessionId ||
      selectedSessionId ||
      (openSessions.length === 1 ? openSessions[0].id : '');
    const resolvedToken = parsed.token || '';

    stopCamera();

    if (resolvedSessionId) {
      setSelectedSessionId(resolvedSessionId);
    }
    if (resolvedToken) {
      setTokenInput(resolvedToken);
    }

    if (!resolvedSessionId) {
      setScanMode('manual');
      setResult({
        success: false,
        message: 'Đã quét được mã xác thực nhưng chưa xác định được buổi sinh hoạt. Vui lòng chọn buổi bên dưới và bấm Xác nhận Điểm danh.'
      });
      return true;
    }

    await submitCheckIn(resolvedSessionId, resolvedToken);
    return true;
  }, [sessions, selectedSessionId, openSessions, stopCamera, submitCheckIn]);

  useEffect(() => {
    handleDecodedPayloadRef.current = handleDecodedPayload;
  }, [handleDecodedPayload]);

  const hasResult = Boolean(result);

  // Camera stream & continuous QR scanning loop
  useEffect(() => {
    const shouldRunCamera =
      scanMode === 'camera' &&
      !isSubmitting &&
      !hasResult;

    if (!shouldRunCamera) {
      stopCamera();
      return;
    }

    let cancelled = false;
    let scanTimer: ReturnType<typeof setInterval> | null = null;

    const startCameraAndScanner = async () => {
      scanLockRef.current = false;
      processingFrameRef.current = false;
      setCameraState('initializing');
      setCameraError(null);
      setScanWarning(null);

      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        setCameraState('error');
        setCameraError(formatCameraErrorMessage(null));
        return;
      }

      try {
        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 }
            },
            audio: false
          });
        } catch (constraintErr: any) {
          if (
            constraintErr?.name === 'OverconstrainedError' ||
            constraintErr?.name === 'ConstraintNotSatisfiedError'
          ) {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          } else {
            throw constraintErr;
          }
        }

        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (!video) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }

        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        if (cancelled) {
          stopCamera();
          return;
        }

        setCameraState('active');

        scanTimer = setInterval(async () => {
          if (
            cancelled ||
            scanLockRef.current ||
            processingFrameRef.current ||
            !videoRef.current ||
            videoRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA ||
            videoRef.current.videoWidth === 0 ||
            videoRef.current.videoHeight === 0
          ) {
            return;
          }

          processingFrameRef.current = true;
          try {
            const vid = videoRef.current;
            const scale = Math.min(1, MAX_VIDEO_SCAN_DIM / Math.max(vid.videoWidth, vid.videoHeight));
            const targetW = Math.max(1, Math.round(vid.videoWidth * scale));
            const targetH = Math.max(1, Math.round(vid.videoHeight * scale));

            if (!canvasRef.current) {
              canvasRef.current = document.createElement('canvas');
            }
            const canvas = canvasRef.current;
            canvas.width = targetW;
            canvas.height = targetH;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            ctx.drawImage(vid, 0, 0, targetW, targetH);
            const rawText = await decodeCanvasQr(canvas, ctx);

            if (rawText && !cancelled && !scanLockRef.current) {
              scanLockRef.current = true;
              const accepted = await handleDecodedPayloadRef.current(rawText);
              if (!accepted && !cancelled) {
                scanLockRef.current = false;
              }
            }
          } finally {
            processingFrameRef.current = false;
          }
        }, SCAN_INTERVAL_MS);
      } catch (err: any) {
        if (!cancelled) {
          setCameraState('error');
          setCameraError(formatCameraErrorMessage(err));
        }
      }
    };

    startCameraAndScanner();

    return () => {
      cancelled = true;
      if (scanTimer) clearInterval(scanTimer);
      stopCamera();
    };
  }, [scanMode, facingMode, cameraRetryTick, isSubmitting, hasResult, stopCamera, decodeCanvasQr]);

  // Fallback: decode QR from captured/uploaded photo
  const handleFileCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    setIsDecodingImage(true);
    setScanWarning(null);
    setResult(null);

    const objectUrl = URL.createObjectURL(file);
    try {
      const img = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error('Không thể đọc tệp ảnh đã chọn.'));
        el.src = objectUrl;
      });

      const scale = Math.min(1, MAX_IMAGE_SCAN_DIM / Math.max(img.width, img.height));
      const targetW = Math.max(1, Math.round(img.width * scale));
      const targetH = Math.max(1, Math.round(img.height * scale));

      const canvas = canvasRef.current || document.createElement('canvas');
      canvasRef.current = canvas;
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        throw new Error('Trình duyệt không hỗ trợ xử lý ảnh QR.');
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);
      const rawText = await decodeCanvasQr(canvas, ctx);

      if (!rawText) {
        setResult({
          success: false,
          message: 'Không tìm thấy mã QR trong ảnh vừa chụp/chọn. Vui lòng chụp rõ nét hơn hoặc nhập mã thủ công.'
        });
        return;
      }

      await handleDecodedPayload(rawText);
    } catch (err: any) {
      setResult({
        success: false,
        message: err?.message || 'Không thể giải mã ảnh QR.'
      });
    } finally {
      URL.revokeObjectURL(objectUrl);
      setIsDecodingImage(false);
    }
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = tokenInput.trim();
    const parsed = trimmedInput ? parseScannedQrPayload(trimmedInput, sessions) : null;

    const targetSessionId = parsed?.valid && parsed.sessionId ? parsed.sessionId : selectedSessionId;
    const targetToken = parsed?.valid && parsed.token ? parsed.token : trimmedInput;

    if (!targetSessionId) {
      setResult({ success: false, message: 'Vui lòng chọn buổi sinh hoạt cần điểm danh.' });
      return;
    }

    await submitCheckIn(targetSessionId, targetToken);
  };

  const handleRetryCamera = () => {
    setResult(null);
    setScanWarning(null);
    scanLockRef.current = false;
    setScanMode('camera');
    setCameraRetryTick(t => t + 1);
  };

  const selectedSession = sessions.find(s => s.id === selectedSessionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <QrCode className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Quét QR Điểm danh</h3>
              <p className="text-[11px] text-slate-500">Mở camera quét mã trên màn hình máy chiếu</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition"
            aria-label="Đóng"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Hidden file input for native mobile camera photo capture fallback */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileCapture}
        />

        {/* Body */}
        <div className="p-5 sm:p-6">
          {result && result.success ? (
            <div className="text-center py-4 space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  {result.status === 'present' ? 'Điểm danh Thành công!' : 'Đã ghi nhận Đến muộn'}
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                  {result.message}
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Thành viên:</span>
                  <span className="font-semibold text-slate-800">{currentUser?.fullName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mã sinh viên:</span>
                  <span className="font-mono text-slate-800">{currentUser?.studentId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Thời gian ghi nhận:</span>
                  <span className="font-mono text-slate-800">{new Date().toLocaleTimeString('vi-VN')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="w-full rounded-xl bg-slate-900 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
              >
                Hoàn tất
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mode Switcher Tabs */}
              <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-slate-100 p-1 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    setScanWarning(null);
                    setScanMode('camera');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                    scanMode === 'camera'
                      ? 'bg-white text-[#245BFA] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Quét bằng Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    stopCamera();
                    setScanWarning(null);
                    setScanMode('manual');
                  }}
                  className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition ${
                    scanMode === 'manual'
                      ? 'bg-white text-[#245BFA] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Keyboard className="h-3.5 w-3.5" />
                  <span>Nhập mã thủ công</span>
                </button>
              </div>

              {/* Error / Submission status banner */}
              {result && !result.success && (
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2.5 text-xs text-red-700">
                  <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <div className="font-semibold">Điểm danh chưa thành công</div>
                    <div className="text-[11px] leading-relaxed">{result.message}</div>
                    {scanMode === 'camera' && (
                      <button
                        type="button"
                        onClick={handleRetryCamera}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-2.5 py-1 text-[11px] font-semibold text-white hover:bg-red-700 transition"
                      >
                        <RefreshCw className="h-3 w-3" />
                        <span>Quét lại bằng Camera</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Invalid QR warning */}
              {scanWarning && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 flex items-start gap-2 text-[11px] text-amber-800">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{scanWarning}</span>
                </div>
              )}

              {/* Submitting overlay state */}
              {isSubmitting && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50/70 py-10 px-4 text-center space-y-3">
                  <RotateCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                  <div>
                    <div className="text-sm font-bold text-slate-900">Đang xác thực điểm danh...</div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Hệ thống đang kiểm tra mã QR với máy chủ BK-IC
                    </p>
                  </div>
                </div>
              )}

              {/* CAMERA SCANNER VIEW */}
              {scanMode === 'camera' && !isSubmitting && !(result && !result.success) && (
                <div className="space-y-3">
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-950 border border-slate-200 shadow-inner">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      autoPlay
                      className={`h-full w-full object-cover ${cameraState === 'active' ? 'opacity-100' : 'opacity-0'}`}
                    />

                    {/* Viewfinder frame when camera is active */}
                    {cameraState === 'active' && (
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                        <div className="relative h-48 w-48 sm:h-52 sm:w-52 rounded-2xl border-2 border-white/80 shadow-[0_0_0_9999px_rgba(2,6,23,0.45)]">
                          <span className="absolute -top-0.5 -left-0.5 h-5 w-5 border-t-4 border-l-4 border-blue-400 rounded-tl-lg" />
                          <span className="absolute -top-0.5 -right-0.5 h-5 w-5 border-t-4 border-r-4 border-blue-400 rounded-tr-lg" />
                          <span className="absolute -bottom-0.5 -left-0.5 h-5 w-5 border-b-4 border-l-4 border-blue-400 rounded-bl-lg" />
                          <span className="absolute -bottom-0.5 -right-0.5 h-5 w-5 border-b-4 border-r-4 border-blue-400 rounded-br-lg" />
                          <div className="absolute inset-x-3 top-1/2 h-0.5 -translate-y-1/2 bg-blue-400/90 shadow-[0_0_8px_rgba(96,165,250,0.9)] animate-pulse" />
                        </div>
                      </div>
                    )}

                    {/* Initializing state */}
                    {cameraState === 'initializing' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 text-white p-4 text-center">
                        <RotateCw className="h-7 w-7 animate-spin text-blue-400" />
                        <div className="text-xs font-semibold">Đang mở camera thiết bị...</div>
                        <p className="text-[11px] text-slate-300 max-w-[240px]">
                          Vui lòng bấm "Cho phép" nếu trình duyệt hỏi quyền sử dụng camera.
                        </p>
                      </div>
                    )}

                    {/* Camera error fallback state */}
                    {cameraState === 'error' && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white p-5 text-center bg-slate-900">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                          <Camera className="h-5 w-5" />
                        </div>
                        <p className="text-xs text-slate-200 leading-relaxed max-w-xs">
                          {cameraError}
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={handleRetryCamera}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-1.5 text-[11px] font-semibold text-white hover:bg-blue-500 transition"
                          >
                            <RefreshCw className="h-3.5 w-3.5" />
                            <span>Thử mở lại camera</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isDecodingImage}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-800 border border-slate-700 px-3 py-1.5 text-[11px] font-semibold text-slate-100 hover:bg-slate-700 transition"
                          >
                            <ImagePlus className="h-3.5 w-3.5" />
                            <span>{isDecodingImage ? 'Đang đọc ảnh...' : 'Chụp ảnh QR'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Camera controls overlay when active */}
                    {cameraState === 'active' && (
                      <div className="absolute top-3 right-3 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-950/70 backdrop-blur-md border border-white/15 px-2.5 py-1.5 text-[11px] font-medium text-white hover:bg-slate-900 transition"
                          title="Chuyển camera trước/sau"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          <span>Đổi camera</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Helper footer below viewfinder */}
                  <div className="flex items-center justify-between gap-2 text-[11px] text-slate-500">
                    <span>Đưa mã QR trên máy chiếu vào khung vuông để tự động điểm danh.</span>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isDecodingImage}
                      className="inline-flex items-center gap-1 shrink-0 font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <ImagePlus className="h-3.5 w-3.5" />
                      <span>{isDecodingImage ? 'Đang xử lý...' : 'Chọn/Chụp ảnh'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* MANUAL FALLBACK VIEW */}
              {scanMode === 'manual' && !isSubmitting && (
                <form onSubmit={handleManualCheckIn} className="space-y-4">
                  {/* Session Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Chọn Phiên sinh hoạt đang diễn ra
                    </label>
                    {openSessions.length === 0 ? (
                      <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800">
                        Hiện chưa thấy phiên sinh hoạt nào đang mở cổng điểm danh. Bạn vẫn có thể dán link hoặc dùng camera quét trực tiếp mã QR trên máy chiếu.
                      </div>
                    ) : (
                      <select
                        value={selectedSessionId}
                        onChange={(e) => setSelectedSessionId(e.target.value)}
                        className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
                      >
                        {openSessions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.title} ({s.startTime} - {s.endTime})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>

                  {selectedSession && (
                    <div className="rounded-xl bg-blue-50/60 border border-blue-100 p-3 text-xs text-slate-600 space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Khung giờ buổi:</span>
                        <span className="font-medium text-slate-800">{selectedSession.startTime} - {selectedSession.endTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Ngưỡng tính muộn:</span>
                        <span className="font-medium text-amber-700 font-mono">{selectedSession.lateThresholdTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Địa điểm:</span>
                        <span className="font-medium text-slate-800 truncate max-w-[200px]">{selectedSession.location}</span>
                      </div>
                    </div>
                  )}

                  {/* Security Token Input */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Mã xác thực điểm danh (Token từ màn hình máy chiếu)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: BKIC-QR-... hoặc dán link điểm danh"
                      value={tokenInput}
                      onChange={(e) => setTokenInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none"
                    />
                    <p className="mt-1 text-[11px] text-slate-400">
                      Mã này hiển thị bên dưới mã QR trên màn hình máy chiếu và thay đổi sau mỗi 1 phút (60 giây) để đảm bảo tính hiện diện.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || (openSessions.length === 0 && !tokenInput.trim())}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#245BFA] py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    <span>Xác nhận Điểm danh</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
