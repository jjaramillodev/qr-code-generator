import { QRCodeCanvas } from 'qrcode.react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'
import './CodeQr.scss'
import CustomButton from './CustomButton'

function CodeQr () {
  // Estado para almacenar el link ingresado
  const [link, setLink] = useState<string>('')
  // Referencia del input
  const inputRef = useRef<HTMLInputElement>(null)
  // Referencia al canvas QR
  const qrRef = useRef<HTMLDivElement>(null)

  // Función para generar el QR
  const generateQR = (e: React.FormEvent<HTMLFormElement>): void => {
    // Evitar que se recargue la página
    e.preventDefault()
    // Validar si el input tiene valor
    if (!inputRef.current) return
    // Obtener el valor del input
    const { value } = inputRef.current
    // Validar si el valor es vacío
    if (!value) {
      // Mostrar mensaje de error
      toast.error('Debes ingresar un enlace')
      return
    }
    // Actualizar el estado con el link ingresado
    setLink(value)
    // Limpiar el input
    inputRef.current.value = ''
    // Mostrar mensaje de éxito
    toast.success('QR generado correctamente')
  }

  // Función para copiar la URL del QR generado
  const copyToClipboard = async (): Promise<void> => {
    if (!qrRef.current) return
    const qrCanvas = qrRef.current.querySelector('canvas')
    if (!qrCanvas) return
    qrCanvas.toBlob((blob) => {
      if (!blob) return
      const clipboardItem = new ClipboardItem({ 'image/png': blob })
      navigator.clipboard.write([clipboardItem])
        .then(() => toast.success('Imagen copiada al portapapeles'))
        .catch(() => toast.error('Error al copiar la imagen'))
    })
  }

  // Función para descargar el QR en formato PNG
  const downloadQR = (): void => {
    if (!qrRef.current) return
    const qrCanvas = qrRef.current.querySelector('canvas')
    if (!qrCanvas) return
    const a = document.createElement('a')
    a.href = qrCanvas.toDataURL('image/png')
    a.download = 'qrcode.png'
    a.click()
    toast.success('QR descargado correctamente')
  }

  return (
    <section className='container_code_qr'>
      <h1>Generador de QR</h1>
      <p>Introduce el enlace que deseas convertir en un código QR</p>
      <form className='container-form' onSubmit={generateQR}>
        <input
          ref={inputRef}
          type="text"
          className="input"
          placeholder="https://example.com"
        />
        <CustomButton type='submit' text='Generar QR' />
      </form>

      {link && (
        <div className='container_canvas'>
          <div ref={qrRef}>
            <QRCodeCanvas
              bgColor='#fff'
              marginSize={1}
              value={link}
              size={300}
            />
          </div>
          <em className="link">{link}</em>
        </div>
      )}

      {link && (
        <div className='button-actions'>
          <CustomButton color="accent" text='Copiar Imagen' action={copyToClipboard} />
          <CustomButton color="accent" text='Descargar Imagen' action={downloadQR} />
        </div>
      )}
    </section>
  )
}

export default CodeQr
