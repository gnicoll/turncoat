import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClassesProvider } from './components/context/classesContext/ClassesProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClassesProvider>
      <App />
    </ClassesProvider>
  </StrictMode>,
)
