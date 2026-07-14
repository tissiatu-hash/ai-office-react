import { OfficeActionConnector } from '@/components/OfficeActionConnector'
import { OfficeCanvas } from '@/components/OfficeCanvas'
import './App.css'

function App() {
  return (
    <div className="office-app">
      <OfficeActionConnector />
      <main className="office-main">
        <OfficeCanvas />
      </main>
    </div>
  )
}

export default App
