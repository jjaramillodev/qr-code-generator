import { QRCodeCanvas } from 'qrcode.react'
import { useState } from 'react'
import './QrCode.scss'
import { CustomButton } from './CustomButton'
import { useQrCode } from '../hooks/useQrCode';

export function QrCode () {
  const {
    viewQrProps,
    setValue,
    downloadQr,
    copyImageToClipboard,
    isLoading,
    currentValue,
  } = useQrCode({
    initialValue: '',
    initialViewSize: 200,
  });

  // Estado local para el input (controlado)
  const [inputValue, setInputValue] = useState(currentValue);

  const handleApplyClick = () => {
    setValue(inputValue);
  };

  return (
    <section className='container_code_qr'>
      <h1>Generador de QR</h1>
      <p>Introduce el enlace que deseas convertir en un código QR</p>
      <form className='container-form' onSubmit={(e) => {
        e.preventDefault();
        handleApplyClick();
      }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          type="text"
          className="input"
          placeholder="https://example.com"
        />
        <CustomButton type='submit' text='Generar QR' disabled={isLoading || inputValue === currentValue} />
      </form>

      <div className='container_canvas'>
        {currentValue && 
          <QRCodeCanvas {...viewQrProps} />
        }
        <em className="link">{currentValue}</em>
      </div>

      {currentValue && (
        <div className='button-actions'>
          <CustomButton color="accent" text='Copiar Imagen' action={copyImageToClipboard} />
          <CustomButton color="accent" text='Descargar Imagen' action={downloadQr} />
        </div>
      )}
    </section>
  )
}
