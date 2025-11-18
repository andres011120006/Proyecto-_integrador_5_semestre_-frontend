import React, { useState, useEffect, useCallback } from 'react';
import debounce from 'lodash/debounce';

const ConglomeradoModal = ({ show, onClose, usuario, onConglomeradoSelected }) => {
  const [conglomerados, setConglomerados] = useState([]);
  const [filteredConglomerados, setFilteredConglomerados] = useState([]);
  const [selectedConglomerado, setSelectedConglomerado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');

  // Debounce para la búsqueda
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchTerm(searchValue);
    }, 300),
    []
  );

  /**
   * Cargar todos los conglomerados (usando la ruta que SÍ funciona)
   */
  const fetchConglomerados = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log("🔍 Cargando conglomerados desde: http://localhost:4000/api/conglomerados");
      
      const response = await fetch('http://localhost:4000/api/conglomerados');
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log(`✅ ${data.length} conglomerados cargados correctamente`);
      
      setConglomerados(data);
      setFilteredConglomerados(data);
      
    } catch (error) {
      console.error('❌ Error al obtener conglomerados:', error);
      setError(`Error al cargar los conglomerados: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Filtrar conglomerados localmente según la búsqueda
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredConglomerados(conglomerados);
    } else {
      const filtered = conglomerados.filter(conglomerado =>
        conglomerado.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredConglomerados(filtered);
    }
  }, [searchTerm, conglomerados]);

  /**
   * Cargar datos cuando se abre el modal
   */
  useEffect(() => {
    if (show) {
      fetchConglomerados();
      setSearchTerm('');
      setSelectedConglomerado(null);
    }
  }, [show]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    debouncedSearch(value);
  };

  const handleConfirm = async () => {
    if (!selectedConglomerado) return;

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:4000/usuarios/conglomerado', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: usuario,
          conglomerado_id: selectedConglomerado.id_conglomerado
        })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar localStorage con el nuevo conglomerado
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));
        userInfo.conglomerado = data.conglomerado;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
        
        onConglomeradoSelected(data.conglomerado);
        onClose();
      } else {
        throw new Error(data.message || 'Error al actualizar conglomerado');
      }
    } catch (error) {
      console.error('Error al actualizar conglomerado:', error);
      setError(`Error al actualizar el conglomerado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (conglomerado) => {
    setSelectedConglomerado(conglomerado);
  };

  const isSelected = (conglomerado) => {
    return selectedConglomerado && selectedConglomerado.id_conglomerado === conglomerado.id_conglomerado;
  };

  if (!show) return null;

  return (
    <div className="conglomerado-modal-overlay">
      <div className="conglomerado-modal-content">
        {/* Header del modal */}
        <div className="conglomerado-modal-header">
          <h3 className="conglomerado-modal-title"> Seleccionar Conglomerado</h3>
          <button 
            type="button" 
            className="conglomerado-modal-close" 
            onClick={onClose}
            aria-label="Cerrar"
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        {/* Body del modal */}
        <div className="conglomerado-modal-body">
          {/* Barra de búsqueda */}
          <div className="search-container">
            <div className="search-input-group">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                className="search-input"
                placeholder="Buscar conglomerado por nombre..."
                onChange={handleSearchChange}
                disabled={loading}
              />
            </div>
            <div className="search-results-info">
              {loading ? 'Cargando...' : `${filteredConglomerados.length} de ${conglomerados.length} conglomerados`}
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Tabla de conglomerados */}
          <div className="table-container">
            <table className="conglomerados-table">
              <thead className="table-header">
                <tr>
                  <th width="60">Seleccionar</th>
                  <th>Nombre del Conglomerado</th>
                  <th>Latitud</th>
                  <th>Longitud</th>
                </tr>
              </thead>
              <tbody>
                {filteredConglomerados.map((conglomerado) => (
                  <tr 
                    key={conglomerado.id_conglomerado}
                    className={`table-row ${isSelected(conglomerado) ? 'selected' : ''}`}
                    onClick={() => handleRowClick(conglomerado)}
                  >
                    <td>
                      <input
                        type="radio"
                        name="conglomerado"
                        checked={isSelected(conglomerado)}
                        onChange={() => handleRowClick(conglomerado)}
                        className="radio-input"
                      />
                    </td>
                    <td className="conglomerado-name">
                      {conglomerado.nombre}
                    </td>
                    <td>{conglomerado.latitud}</td>
                    <td>{conglomerado.longitud}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Indicador de carga */}
            {loading && (
              <div className="loading-indicator">
                <div className="loading-spinner"></div>
                <span>Cargando conglomerados...</span>
              </div>
            )}

            {/* Mensaje cuando no hay resultados */}
            {filteredConglomerados.length === 0 && !loading && (
              <div className="no-results">
                {searchTerm ? `No se encontraron conglomerados para "${searchTerm}"` : 'No hay conglomerados disponibles'}
              </div>
            )}
          </div>

          {/* Información del conglomerado seleccionado */}
          {selectedConglomerado && (
            <div className="selected-conglomerado-info">
              <h6> Conglomerado Seleccionado:</h6>
              <p><strong>Nombre:</strong> {selectedConglomerado.nombre}</p>
              <p><strong>Coordenadas:</strong> {selectedConglomerado.latitud}, {selectedConglomerado.longitud}</p>
            </div>
          )}
        </div>

        {/* Footer del modal */}
        <div className="conglomerado-modal-footer">
          <button 
            onClick={onClose}
            className="btn-cancel"
            disabled={loading}
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm}
            className="btn-confirm"
            disabled={loading || !selectedConglomerado}
          >
            {loading ? 'Confirmando...' : 'Confirmar Conglomerado'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConglomeradoModal;