import { useEffect, useState } from "react";
import type { Proveedor } from "../../types/Proveedor";
import { ProveedorService } from "../../services/ProveedorService";
import Loader from "../Loader/Loader";
import { Button, Table } from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import ProveedorModal from "../ProveedorModal/ProveedorModal";
import { EditButton } from "../EditButton/EditButton";
import { DeleteButton } from "../DeleteButton/DeleteButton";

const ProveedorTable = () => {
  //Const para inicializar un proveedor por defecto y evitar el undefined

  const initializableNewProveedor = (): Proveedor => {
    return {
      id: 0,
      codProv: "",
      nomProv: "",
      descripcionProv: "",
      fechaHoraBajaProv: null,
    };
  };
  //Const para manejar el estado del modal

  const [proveedor, setProveedor] = useState<Proveedor>(
    initializableNewProveedor
  );

  //Const para manejar estado del modal
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<ModalType>(ModalType.NONE);
  const [title, setTitle] = useState("");

  //Logica del Modal

  const handleClick = (newTitle: string, prov: Proveedor, modal: ModalType) => {
    setTitle(newTitle);
    setModalType(modal);
    setProveedor(prov);
    setShowModal(true);
  };

  //Variable que va a contener los datos recibido de la api
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);

  const [isLoading, setIsloading] = useState(true);
  //variable que va a actualizar los datos de la tabla luego de cada operacion exitosa
  const [refreshData, setRefreshData] = useState(false);
  //Este hook se va a ejecutar cada vez que se renderice el componente o
  //refresData cambie de estado
  useEffect(() => {
    const fetchProveedores = async () => {
      const proveedor = await ProveedorService.getProveedores();
      setProveedores(proveedor);
      setIsloading(false);
    };
    fetchProveedores();
  }, [refreshData]);
  //Test, para que este log esta modificado para que se muestre
  console.log(JSON.stringify(proveedores));
  return (
    <div>
      <h1>Tabla Proveedores</h1>
      <Button
        onClick={() =>
          handleClick(
            "Añadir Proveedor",
            initializableNewProveedor(),
            ModalType.CREATE
          )
        }
      >
        Nuevo Proveedor
      </Button>
      {isLoading ? (
        <Loader />
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Id</th>
              <th>codProv</th>
              <th>nomProv</th>
              <th>descripcionProv</th>
              <th>fechaHoraBajaProv</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prove) => (
              <tr key={prove.id}>
                <td>{prove.id}</td>
                <td>{prove.codProv}</td>
                <td>{prove.nomProv}</td>
                <td>{prove.descripcionProv}</td>
                <td>{String(prove.fechaHoraBajaProv)}</td>
                <td>
                  <EditButton
                    onClick={() =>
                      handleClick("Editar proveedor", prove, ModalType.UPDATE)
                    }
                  />
                </td>
                <td>
                  <DeleteButton
                    onClick={() =>
                      handleClick("Borrar proveedor", prove, ModalType.DELETE)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
      {showModal && (
        <ProveedorModal
          show={showModal}
          onHide={() => setShowModal(false)}
          modalType={modalType}
          prov={proveedor}
          title={title}
          refreshData={setRefreshData}
        />
      )}
    </div>
  );
};

export default ProveedorTable;
