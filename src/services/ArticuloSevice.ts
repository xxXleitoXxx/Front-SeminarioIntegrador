import type { ArticuloDTO } from "../types/index.ts";

const BASE_URL = 'http://localhost:8080';

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error: ${response.statusText}`;
    try {
      const errorData = await response.json();
      // Asumiendo que el error tiene un formato como { error: "Mensaje de error" }
      errorMessage = errorData.error || JSON.stringify(errorData);
    } catch (error) {
      console.error("Error parsing error response:", error);
    }
    throw new Error(errorMessage);
  }
  return response.json();
};

export const ArticuloService = {
  getArticulos: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  getArticulo: async (id: number): Promise<ArticuloDTO> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  createArticulo: async (articulo: ArticuloDTO): Promise<ArticuloDTO> => {
    try {
      console.log("Datos enviados al crear artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/altaArticulo`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  updateArticulo: async (articulo: ArticuloDTO): Promise<ArticuloDTO> => {
    try {
      console.log("Datos enviados al actualizar artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/modificarArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  deleteArticulo: async (id: number): Promise<void> => {
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
        return;
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },

  bajaLogicaArticulo: async (articulo: ArticuloDTO): Promise<void> => {
     try {
      console.log("Datos enviados al dar de baja lógica artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/bajaArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  altaLogicaArticulo: async (articulo: ArticuloDTO): Promise<void> => {
     try {
      console.log("Datos enviados al dar de alta lógica artículo:", articulo);
      const response = await fetch(`${BASE_URL}/Articulo/bajaArticulo`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(articulo)
      });
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  },
  getProductosFaltantes: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/articulosFaltantes`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud de productos faltantes:", error);
      throw error;
    }
  },

  getProductosAReponer: async (): Promise<ArticuloDTO[]> => {
    try {
      const response = await fetch(`${BASE_URL}/Articulo/productosAReponer`);
      return await handleResponse(response);
    } catch (error) {
      console.error("Error en la solicitud de productos a reponer:", error);
      throw error;
    }
  },

  listarProveedoresPorArticulo: async (articulo: ArticuloDTO): Promise<ArticuloProvDTO[]> => {
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
      
      return result;
    } catch (error) {
      console.error("Error en la solicitud:", error);
      throw error;
    }
  }
};
