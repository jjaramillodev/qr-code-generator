import { Toaster } from 'sonner'
import './App.scss'
import { QrCode } from './components/QrCode'

function App () {
  return (
    <>
      <main className='container_app'>
        <QrCode />
      </main>
      <Toaster toastOptions={{
        style: {
          minHeight: '35px',
          padding: '10px'
        }
      }} />
    </>
  )
}

export default App
