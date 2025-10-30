import { useState, useMemo, useEffect } from 'react';
import { toDataURL } from 'qrcode';
import { toast } from 'sonner'

// Opciones de configuración del hook
interface UseQrCodeOptions {
  initialValue: string;
  initialViewSize?: number;
  initialBgColor?: string;
  initialFgColor?: string;
  initialLevel?: 'L' | 'M' | 'Q' | 'H';
}

// La resolución fija para la descarga/copia
const HIGH_RES_SIZE = 1024;
const HIGH_RES_MARGIN = 1;

export const useQrCode = (options: UseQrCodeOptions) => {
  const {
    initialValue,
    initialViewSize = 200,
    initialBgColor = "#ffffff",
    initialFgColor = "#000000",
    initialLevel = 'M',
  } = options;

  // --- Estados para el VALOR y la VISTA ---
  const [value, setValue] = useState(initialValue);
  const [viewSize, setViewSize] = useState(initialViewSize);
  const [bgColor, _setBgColor] = useState(initialBgColor);
  const [fgColor, _setFgColor] = useState(initialFgColor);
  const [level, _setLevel] = useState(initialLevel);
  
  // --- Estados para los DATOS (Descarga/Copia) ---
  const [highResDataURL, setHighResDataURL] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Memoizamos las props para el CANVAS VISIBLE
  const viewQrProps = useMemo(() => ({
    value,
    size: viewSize,
    bgColor,
    fgColor,
    level,
    marginSize: 1,
  }), [value, viewSize, bgColor, fgColor, level]);

  // Se ejecuta cada vez que el contenido del QR cambia
  useEffect(() => {
    if (!value) {
      setHighResDataURL(null);
      return;
    }

    setIsLoading(true);
    
    const qrCodeOptions = {
      width: HIGH_RES_SIZE,
      margin: HIGH_RES_MARGIN,
      level: level,
      color: {
        dark: fgColor,
        light: bgColor,
      },
    };

    // Usamos toDataURL para generar un Base64 PNG en memoria
    toDataURL(value, qrCodeOptions)
      .then(url => {
        setHighResDataURL(url);
        toast.success('¡QR generado con éxito!');
      })
      .catch(err => {
        console.error("Error generating high-res QR Code:", err);
        toast.error('Error al generar el código QR.');
        setHighResDataURL(null);
      })
      .finally(() => {
        setIsLoading(false);
      });

  }, [value, bgColor, fgColor, level]); // Depende de los datos, no del viewSize

  
  // 3. Función de DESCARGA
  const downloadQr = (filename = 'qrcode.png') => {
    if (!highResDataURL) return;

    // Crea un link temporal para forzar la descarga
    const link = document.createElement('a');
    link.href = highResDataURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 4. Función de COPIA AL PORTAPAPELES
  const copyImageToClipboard = async () => {
    if (!highResDataURL || !navigator.clipboard?.write) {
      toast.error('La copia al portapapeles no es compatible o falló.');
      return;
    }

    try {
      // El Data URL es un string Base64, debemos convertirlo a un Blob
      // para que el API del portapapeles lo entienda como imagen.
      const response = await fetch(highResDataURL);
      const blob = await response.blob();

      // Creamos un ClipboardItem con el blob de la imagen
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      
      // Notificamos al usuario
      toast.success('Imagen copiada al portapapeles.');
    } catch (err) {
      console.error('Error al copiar la imagen:', err);
      toast.error('Error al copiar la imagen.');
    }
  };

  // 5. Exponemos la API del hook
  return {
    viewQrProps,
    setValue,
    setViewSize,
    downloadQr,
    copyImageToClipboard,
    isLoading,
    currentValue: value,
  };
};