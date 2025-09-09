import type { ArticuloDTO } from "../types/index.ts";
import { apiService } from './ApiService';

export const ArticuloService = {
  getArticulos: async (): Promise<ArticuloDTO[]> => {
    try {
      const result = await apiService.get<ArticuloDTO[]>('/Articulo');
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getArticulo: async (id: number): Promise<ArticuloDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`);
      const result = await handleResponse(response);
      return typeof result === 'object' ? result : {} as ArticuloDTO;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createArticulo: async (articulo: ArticuloDTO): Promise<ArticuloDTO | string> => {
    try {
      console.log("Datos enviados al crear artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });

      if (!response.ok) {
        let errorMessage = `Error al crear artículo: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'object' ? data : data;
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateArticulo: async (articulo: ArticuloDTO): Promise<ArticuloDTO | string> => {
    try {
      console.log("Datos enviados al actualizar artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/modificarArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });

      if (!response.ok) {
        let errorMessage = `Error al actualizar artículo: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'object' ? data : data;
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteArticulo: async (id: number): Promise<string> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        let errorMessage = `Error al eliminar el artículo: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || JSON.stringify(errorData);
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      if (response.status === 204) {
        return "Artículo eliminado exitosamente";
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaLogicaArticulo: async (articulo: ArticuloDTO): Promise<string> => {
     try {
      console.log("Datos enviados al dar de baja lógica artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/bajaArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });

      if (!response.ok) {
        let errorMessage = `Error al dar de baja artículo: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaArticulo: async (articulo: ArticuloDTO): Promise<string> => {
     try {
      console.log("Datos enviados al dar de alta lógica artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/bajaArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });

      if (!response.ok) {
        let errorMessage = `Error al dar de alta artículo: ${response.statusText}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            errorMessage = errorData.error || JSON.stringify(errorData);
          } else {
            const text = await response.text();
            errorMessage = text || errorMessage;
          }
        } catch (error) {
          console.error("Error parsing error response:", error);
        }
        throw new Error(errorMessage);
      }

      // Manejar la respuesta exitosa
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        return typeof data === 'string' ? data : JSON.stringify(data);
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  getProductosFaltantes: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/articulosFaltantes`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud de productos faltantes:", error);
      throw error;
    }
  },

  getProductosAReponer: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/productosAReponer`);
      const result = await handleResponse(response);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud de productos a reponer:", error);
      throw error;
    }
  },

  listarProveedoresPorArticulo: async (articulo: ArticuloDTO): Promise<any[]> => {
    try {
      console.log("Datos enviados al listar proveedores por artículo:", articulo);
      console.log("[DEBUG] ArticuloService - Enviando POST a /Articulo/proveedoresPorArticulo");
      console.log("[DEBUG] ArticuloService - Datos enviados:", JSON.stringify(articulo, null, 2));
      
      const response = await fetch(`${BASE_URL}/Articulo/proveedoresPorArticulo`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      
      console.log("[DEBUG] ArticuloService - Status de respuesta:", response.status);
      console.log("[DEBUG] ArticuloService - Headers de respuesta:", Object.fromEntries(response.headers.entries()));
      
      const result = await handleResponse(response);
      console.log("[DEBUG] ArticuloService - Resultado procesado:", result);
      
      return Array.isArray(result) ? result : [];
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
