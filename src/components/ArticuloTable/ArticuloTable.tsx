// import { useEffect, useState } from "react";
// import { Button, Table } from "react-bootstrap";
// import Loader from "../Loader/Loader";
// import { ModalType } from "../../types";
// import ArticuloModal from "../ArticuloModal/ArticuloModal";
// import { EditButton } from "../EditButton/EditButton";
// import { DeleteButton } from "../DeleteButton/DeleteButton";
// import { ListButton } from "../ListButton/ListButton";
// import type { ArticuloDTO } from "../../types";
// import { ArticuloService } from "../../services/ArticuloSevice";
// import { ButtonAlta } from "../ButtonAlta/ButtonAlta";
// const ArticuloTable = () => {
//   // Constante para inicializar un artículo por defecto y evitar el undefined
//   const initializableNewArticulo = (): ArticuloDTO => {
//     return {
//       id: 0,
//       codArt: "",
//       nomArt: "",
//       precioVenta: 0,
//       descripcionArt: "",
//       fechaHoraBajaArt: "",
//       stock: 0,
//       stockSeguridad: 0,
//       demandaDiaria: 1, // Inicializado a 1 si debe ser mayor que cero
//       desviacionEstandar: 1, // Inicializado a 1 si debe ser mayor que cero
    
//     };
//   };

//   const [articulo, setArticulo] = useState<ArticuloDTO>(
//     initializableNewArticulo()
//   );
//   // Constantes para manejar el estado del modal
//   const [showModal, setShowModal] = useState(false);
//   const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
//   const [title, setTitle] = useState("");

//   // Estado para el modal de proveedores del artículo
//   const [showProveedoresModal, setShowProveedoresModal] = useState(false);
//   const [selectedArticulo, setSelectedArticulo] = useState<ArticuloDTO | null>(null);

//   // Lógica del Modal
//   const handleClick = (
//     newTitle: string,
//     art: ArticuloDTO,
//     modal: ModalType
//   ) => {
//     setTitle(newTitle);
//     setModalType(modal);
//     setArticulo(art);
//     setShowModal(true);
//   };

//   // Función para mostrar proveedores del artículo
//   const handleShowProveedores = (articulo: ArticuloDTO) => {
//     setSelectedArticulo(articulo);
//     setShowProveedoresModal(true);
//   };

//   // Variable que va a contener los datos recibidos de la API
//   const [articulos, setArticulos] = useState<ArticuloDTO[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [refreshData, setRefreshData] = useState(false);

//   // Este hook se va a ejecutar cada vez que se renderice el componente o refreshData cambie de estado
//   useEffect(() => {
//     const fetchArticulos = async () => {
//       const articulosData = await ArticuloService.getArticulos();
//       setArticulos(articulosData);
//       setIsLoading(false);
//     };
//     fetchArticulos();
//   }, [refreshData]);

//   // Estado para el filtro activo (solo uno a la vez)
//   // const [filtroActivo, setFiltroActivo] = useState<'todos' | 'faltantes' | 'areponer' | 'activos' | 'dadosDeBaja'>('todos');
//   // const [isLoadingFiltro, setIsLoadingFiltro] = useState(false);
//   // const [errorFiltro, setErrorFiltro] = useState<string | null>(null);

//   // const handleMostrarTodos = async () => {};
//   // const handleMostrarFaltantes = async () => {};
//   // const handleMostrarAReponer = async () => {};
//   // const handleMostrarActivos = () => {};
//   // const handleMostrarDadosDeBaja = () => {};

//   // Filtrado local
//   // const articulosFiltrados = articulos.filter((art) => {...});

//   return (
//     <div className="articulo-table-container">
//       <div className="page-header">
//         <div className="page-title">
//           <h1>📦 Gestión de Artículos</h1>
//           <p className="page-subtitle">Administra tu inventario de manera eficiente</p>
//         </div>
//         <Button
//           className="btn btn-primary btn-add"
//           onClick={() =>
//             handleClick(
//               "Añadir Artículo",
//               initializableNewArticulo(),
//               ModalType.CREATE
//             )
//           }
//         >
//           <span className="btn-icon">+</span>
//           Nuevo Artículo
//         </Button>p
//       </div>

//       {/* Se eliminaron los filtros */}

//       {isLoading ? (
//         <div className="loader-container">
//           <Loader variant="container" />
//         </div>
//       ) : (
//         <div className="table-container">
//           <Table className="table-modern" striped bordered hover>
//             <thead>
//               <tr>
//                 <th>ID</th>
//                 <th>Código</th>
//                 <th>Nombre</th>
//                 <th>Precio</th>
//                 <th>Stock</th>
//                 <th>Stock Seg.</th>
//                 <th>Proveedor</th>
//                 <th>Estado</th>
//                 <th>Acciones</th>
//               </tr>
//             </thead>
//             <tbody>
//               {articulos.map((art) => (
//                 <tr key={art.id} className="table-row-modern">
//                   <td className="text-center">{art.id}</td>
//                   <td className="text-center">
//                     <span className="code-badge">{art.codArt}</span>
//                   </td>
//                   <td>
//                     <div className="product-info">
//                       <div className="product-name">{art.nomArt}</div>
//                       <div className="product-description">{art.descripcionArt}</div>
//                     </div>
//                   </td>
//                   <td className="text-center">
//                     <span className="price-badge">${art.precioVenta}</span>
//                   </td>
//                   <td className="text-center">
//                     <span className={`stock-badge ${art.stock < art.stockSeguridad ? 'low' : 'normal'}`}>{art.stock}</span>
//                   </td>
//                   <td className="text-center">{art.stockSeguridad}</td>
//                   <td className="text-center">
//                     <span className="provider-badge">{art.proveedorDTO?.nomProv || "Sin proveedor"}</span>
//                   </td>
//                   <td className="text-center">
//                     <span className={`status-badge ${art.fechaHoraBajaArt ? 'inactive' : 'active'}`}>{art.fechaHoraBajaArt ? 'Inactivo' : 'Activo'}</span>
//                   </td>
//                   <td className="text-center">
//                     <div className="action-buttons">
//                       <EditButton
//                         onClick={() =>
//                           handleClick("Editar artículo", art, ModalType.UPDATE)
//                         }
//                       />
//                       <DeleteButton
//                         onClick={() =>
//                           handleClick("Borrar Artículo", art, ModalType.DELETE)
//                         }
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       )}

//       {showModal && (
//         <ArticuloModal
//           show={showModal}
//           onHide={() => setShowModal(false)}
//           modalType={modalType}
//           art={articulo}
//           title={title}
//           refreshData={setRefreshData}
//           proveedorPredeterminado={articulo.proveedorDTO?.nomProv}
//         />
//       )}
//       {/* TODO: Implementar ProveedoresArticuloModal
//       {showProveedoresModal && selectedArticulo !== null && (
//         <ProveedoresArticuloModal
//           show={showProveedoresModal}
//           onHide={() => setShowProveedoresModal(false)}
//           articulo={selectedArticulo}
//         />
//       )}
//       */}
//     </div>
//   );
// };

// export default ArticuloTable;
