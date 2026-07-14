import { OfficeActionConnector } from '@/components/OfficeActionConnector'
import { OfficeBottomToolbar } from '@/components/OfficeBottomToolbar'
import { OfficeCanvas } from '@/components/OfficeCanvas'
import './App.css'

function App() {
  return (
    <div className="office-app">
      <OfficeActionConnector />
      <main className="office-main">
        <OfficeCanvas />
        <OfficeBottomToolbar />
      </main>
    </div>
  )
}

export default App
