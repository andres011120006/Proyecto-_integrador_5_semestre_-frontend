import React from "react";
import '../assets/css/footer.css';
const Footer = () => {
  return (
    <footer class="footer bg-lightgray py-4">
        <div id="recursos" class="container">
            <div class="row">
                {/* Columna 1: Información principal */}
                <div class="col-md-4 mb-4 footer-column">
                    <h4>Instituto de Hidrología, Meteorología y Estudios Ambientales</h4>
                    <ul class="list-unstyled">
                        <li>Sede principal</li>
                        <li>Dirección: Calle 25 D No. 96 B - 70 Bogotá D.C.</li>
                        <li>Código Postal: 110911</li>
                        <li>Horario: Lunes a Viernes 8:00 am - 5:00 pm</li>
                    </ul>
                </div>

                {/* Columna 2: Contacto */}
                <div class="col-md-4 mb-4 footer-column">
                    <h4>Contacto</h4>
                    <ul class="list-unstyled">
                        <li>PBX: +57 (601) 352 7160</li>
                        <li>Pronóstico y Alertas: Ext. 1334, 1335, 1336</li>
                        <li>Teléfono fijo nacional: 01 8000 110012</li>
                        <li>
                            Línea anticorrupción:
                            <a href="mailto:denunciacorrupcion@ideam.gov.co">denunciacorrupcion@ideam.gov.co</a>
                        </li>
                        <li>
                            Notificaciones judiciales:
                            <a
                                href="mailto:notificacionesjudiciales@ideam.gov.co">notificacionesjudiciales@ideam.gov.co</a>
                        </li>
                        <li>
                            Radicación oficial:
                            <a href="mailto:contacto@ideam.gov.co">contacto@ideam.gov.co</a>
                        </li>
                    </ul>
                </div>

                {/* Columna 3: Redes sociales */}
                <div class="col-md-4 mb-4 footer-column">
                    <h4>Redes Sociales</h4>
                    <div class="social-icons d-flex flex-column gap-2">
                        <a href="https://www.facebook.com/ideam.instituto" target="_blank"
                            class="d-flex align-items-center gap-2 text-decoration-none text-dark">
                            <i class="fab fa-facebook fa-lg"></i> Facebook
                        </a>
                        <a href="https://www.instagram.com/ideamcolombia" target="_blank"
                            class="d-flex align-items-center gap-2 text-decoration-none text-dark">
                            <i class="fab fa-instagram fa-lg"></i> Instagram
                        </a>
                        <a href="https://x.com/IDEAMColombia" target="_blank"
                            class="d-flex align-items-center gap-2 text-decoration-none text-dark">
                            <i class="fab fa-twitter fa-lg"></i> Twitter
                        </a>
                        <a href="https://www.youtube.com/user/InstitutoIDEAM" target="_blank"
                            class="d-flex align-items-center gap-2 text-decoration-none text-dark">
                            <i class="fab fa-youtube fa-lg"></i> YouTube
                        </a>
                    </div>
                </div>

            </div>


            <p class="text-center mb-0">&copy; 2025 Instituto de Hidrología, Meteorología y Estudios Ambientales. Todos
                los derechos reservados.</p>
        </div>
    </footer>
  );
};

export default Footer;