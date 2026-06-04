// app.jsx
import NavBar from "./components/NavBar"
import HomePage from "./pages/HomePage"
import ProductPage from "./pages/ProductPage"
import AboutPage from "./pages/AboutPage"
import ServicesPage from "./pages/ServicesPage"
import ContactPage from "./pages/ContactPage"
import TrackOrderPage from "./pages/TrackOrderPage"
import { Route, Routes } from 'react-router-dom'
import { useThemeStore } from './store/useThemeStore'
import { Toaster } from 'react-hot-toast'

function App() {
  const {theme}=useThemeStore()
  return (
    <div className='min-h-screen bg-base-200 transition-colors duration-300' data-theme={theme}>
      <NavBar/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/product/:id' element={<ProductPage/>}/>
        <Route path='/about' element={<AboutPage/>}/>
        <Route path='/services' element={<ServicesPage/>}/>
        <Route path='/contact' element={<ContactPage/>}/>
        <Route path='/track-order' element={<TrackOrderPage/>}/>
      </Routes>
      <Toaster/>
    </div>
     
  )
}

export default App