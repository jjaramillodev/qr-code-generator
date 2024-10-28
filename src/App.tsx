import { Toaster } from 'sonner'
import './App.css'
import CodeQr from './components/CodeQr'

function App() {
  return (
    <>
      <main className='container_app'>
        <CodeQr />
      </main>
      <Toaster toastOptions={{
        style: {
          minHeight: '35px',
          padding: '10px',
        }
      }} />
    </>
  )
}

export default App
