import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Inicio } from './pages/inicio';
import { LoginS } from './pages/login';
import { RegistroConglomerado } from './pages/registrocon';
import { RegistroIndividuos } from './pages/registroarboreo';
import { RegistroMuestraBotanica } from './pages/regitromuestra';
import { GenerarReporte } from './pages/reporte';
// Importa los componentes con nombres en PascalCase
import BotanicoDashboard from './pages/botanico_dashboard';
import JefeBrigadaDashboard from './pages/jefe_brigada_dashboard';
import BrigadistaDashboard from './pages/brigadista_dashboard';

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginS />} />
            <Route path='/inicio' element={<Inicio />} />
            <Route path='/registroCon' element={<RegistroConglomerado />} />
            <Route path='/registroArboreos' element={<RegistroIndividuos />} />
            <Route path='/registroMuestra' element={<RegistroMuestraBotanica />} />
            <Route path='/reporte' element={<GenerarReporte />} />
            
            {/* Nuevas rutas de dashboard - usa PascalCase */}
            <Route path='/botanico_dashboard' element={<BotanicoDashboard />} />
            <Route path='/jefe_brigada_dashboard' element={<JefeBrigadaDashboard />} />
            <Route path='/brigadista_dashboard' element={<BrigadistaDashboard />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;