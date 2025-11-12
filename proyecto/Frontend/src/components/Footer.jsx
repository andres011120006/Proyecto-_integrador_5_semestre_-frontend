import React from "react";
import '../assets/css/footer.css';
import logo from '../assets/img/Ideam_(Colombia)_logo.png';

/**
 * Footer Component - Pie de página institucional del IDEAM
 * 
 * Este componente representa el pie de página oficial del Instituto de Hidrología, 
 * Meteorología y Estudios Ambientales (IDEAM) de Colombia. Proporciona información 
 * institucional completa incluyendo datos de contacto, ubicación física, horarios 
 * de atención y enlaces a redes sociales oficiales.
 * 
 * @component
 * @version 1.2.1
 * @author Angie Mariana Ruales Diaz

 */
const Footer = () => {
    return (
        // Contenedor principal del footer con clases de Bootstrap para estilo y espaciado
        <footer className="footer bg-lightgray py-4">
            
            {/* Contenedor principal de Bootstrap para el contenido del footer */}
            <div id="recursos" className="container">
                
                {/* Fila principal que contiene las 4 columnas de información */}
                <div className="row">
                    
                    {/* Columna 1: Información institucional principal */}
                    <div className="col-md-4 mb-4 footer-column">
                        {/* Título de la institución */}
                        <h4>Instituto de Hidrología, Meteorología y Estudios Ambientales</h4>
                        
                        {/* Lista no ordenada con información de ubicación y horarios */}
                        <ul className="list-unstyled">
                            <li>Sede principal</li>
                            <li>Dirección: Calle 25 D No. 96 B - 70 Bogotá D.C.</li>
                            <li>Código Postal: 110911</li>
                            <li>Horario: Lunes a Viernes 8:00 am - 5:00 pm</li>
                        </ul>
                    </div>

                    {/* Columna 2: Información de contacto y canales de comunicación */}
                    <div className="col-md-4 mb-4 footer-column">
                        <h4>Contacto</h4>
                        <ul className="list-unstyled">
                            {/* Número telefónico principal de la institución */}
                            <li>PBX: +57 (601) 352 7160</li>
                            
                            {/* Extensiones específicas para servicios de pronóstico */}
                            <li>Pronóstico y Alertas: Ext. 1334, 1335, 1336</li>
                            
                            {/* Línea gratuita nacional para atención al ciudadano */}
                            <li>Teléfono fijo nacional: 01 8000 110012</li>
                            
                            {/* Enlace de correo para reporte de corrupción */}
                            <li>
                                Línea anticorrupción:
                                <a 
                                    href="mailto:denunciacorrupcion@ideam.gov.co"
                                    className="ms-1"
                                >
                                    denunciacorrupcion@ideam.gov.co
                                </a>
                            </li>
                            
                            {/* Enlace de correo para notificaciones judiciales */}
                            <li>
                                Notificaciones judiciales:
                                <a 
                                    href="mailto:notificacionesjudiciales@ideam.gov.co"
                                    className="ms-1"
                                >
                                    notificacionesjudiciales@ideam.gov.co
                                </a>
                            </li>
                            
                            {/* Enlace de correo para radicación oficial de documentos */}
                            <li>
                                Radicación oficial:
                                <a 
                                    href="mailto:contacto@ideam.gov.co"
                                    className="ms-1"
                                >
                                    contacto@ideam.gov.co
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Columna 3: Enlaces a redes sociales oficiales */}
                    <div className="col-md-2 mb-2 footer-column">
                        <h4>Redes Sociales</h4>
                        
                        {/* Contenedor flexible para los iconos de redes sociales */}
                        <div className="social-icons d-flex flex-column gap-2">
                            
                            {/* Enlace a Facebook oficial con icono de Font Awesome */}
                            <a 
                                href="https://www.facebook.com/ideam.instituto" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                            >
                                <i className="fab fa-facebook fa-lg"></i> 
                                Facebook
                            </a>
                            
                            {/* Enlace a Instagram oficial con icono de Font Awesome */}
                            <a 
                                href="https://www.instagram.com/ideamcolombia" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                            >
                                <i className="fab fa-instagram fa-lg"></i> 
                                Instagram
                            </a>
                            
                            {/* Enlace a Twitter/X oficial con icono de Font Awesome */}
                            <a 
                                href="https://x.com/IDEAMColombia" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                            >
                                <i className="fab fa-twitter fa-lg"></i> 
                                Twitter
                            </a>
                            
                            {/* Enlace a YouTube oficial con icono de Font Awesome */}
                            <a 
                                href="https://www.youtube.com/user/InstitutoIDEAM" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="d-flex align-items-center gap-2 text-decoration-none text-dark"
                            >
                                <i className="fab fa-youtube fa-lg"></i> 
                                YouTube
                            </a>
                        </div>
                    </div>

                    {/* Columna 4: Logotipo institucional */}
                    <div className="col-md-2 mb-2 footer-column">
                        <div className="logo footer d-flex flex-column gap-2">
                            
                            {/* Imagen del logotipo oficial del IDEAM */}
                            <img
                                src={logo}
                                alt="Logo del Instituto de Hidrología, Meteorología y Estudios Ambientales - IDEAM"
                                height="120"
                                width="120"
                                className="img-fluid"
                            />
                        </div>
                    </div>

                </div>

                {/* Sección de derechos de autor y información legal */}
                <p className="text-center mb-0">
                    &copy; 2025 Instituto de Hidrología, Meteorología y Estudios Ambientales. 
                    Todos los derechos reservados.
                </p>
            </div>
        </footer>
    );
};

export default Footer;