import {Routes, Route, BrowserRouter} from 'react-router-dom'
import { Inicio } from './pages/inicio';
import { LoginS } from './pages/login';
import { RegistroConglomerado } from './pages/registrocon';
import { RegistroIndividuos } from './pages/registroarboreo';
import { RegistroMuestraBotanica } from './pages/regitromuestra';
import { GenerarReporte } from './pages/reporte';


function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path='/' element={<LoginS></LoginS>}></Route>
            <Route path='/inicio' element={<Inicio></Inicio>}></Route>
            <Route path='/registroCon' element={<RegistroConglomerado></RegistroConglomerado>}></Route>
            <Route path='/registroArboreos' element={<RegistroIndividuos></RegistroIndividuos>}></Route>
            <Route path='/registroMuestra' element={<RegistroMuestraBotanica></RegistroMuestraBotanica>}></Route>
            <Route path='/reporte' element={<GenerarReporte></GenerarReporte>}></Route>
        </Routes>
      </BrowserRouter>
  )
}

export default App;