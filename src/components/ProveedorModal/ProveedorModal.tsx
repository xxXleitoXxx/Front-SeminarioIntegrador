import {
  Button,
  Form,
  FormControl,
  FormGroup,
  FormLabel,
  Modal,
  ModalBody,
  ModalFooter,
  ModalTitle,
} from "react-bootstrap";
import { ModalType } from "../../types/ModalType";
import type { Proveedor } from "../../types/Proveedor";

//dependencia para validar Formulario
import * as Yup from "yup";
import { useFormik } from "formik";
import { ProveedorService } from "../../services/ProveedorService";

//notificaciones al usuario
import { toast } from "react-toastify";
import React from "react";

type ProductModalProps = {
  show: boolean;
  onHide: () => void;
  title: String;
  modalType: ModalType;
  prov: Proveedor;
  refreshData: React.Dispatch<React.SetStateAction<boolean>>;
};
const ProveedorModal = ({
  show,
  onHide,
  modalType,
  prov,
  title,
  refreshData,
}: ProductModalProps) => {
  //CREATE-UPDATE
  const handleSaveUpdate = async (pro: Proveedor) => {
    try {
      const isNew = pro.id === 0;
      if (isNew) {
        await ProveedorService.createProveedor(pro);
      } else {
        await ProveedorService.updateProveedor(pro.id, pro);
      }
      toast.success(
        isNew
          ? "Proveedor Creado Con Exito"
          : "Proveedor Actualizado Con Exito",
        {
          position: "top-center",
        }
      );

      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };
  //Delete
  const handleDelete = async () => {
    try {
      await ProveedorService.deleteProveedor(prov.id);
      toast.success("Proveedor eliminado con éxito", {
        position: "top-center",
      });
      onHide();
      refreshData((prevState) => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error");
    }
  };
  //Yup,esquema de validacion
  const validationSchema = () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      codProv: Yup.string().required("El codProv es requerido"),
      nomProv: Yup.string().required("El nombre del proveedor es requerido"),
    });
  };

  //formik, utiliza el esquema de validacion para crear un formulario dinámico
  //Y que lo que bloquea el formulario en caso de haber errores

  const formik = useFormik({
    initialValues: prov,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Proveedor) => handleSaveUpdate(obj),
  });

  return (
    <>
      {modalType === ModalType.DELETE ? (
        <>
          <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton>
              <ModalTitle>{title}</ModalTitle>
            </Modal.Header>

            <Modal.Body>
              <p>
                ¿Esta seguro que desea eliminar el Proveedor?
                <br />
                <strong>{prov.nomProv}</strong>
              </p>
            </Modal.Body>

            <ModalFooter>
              <Button variant="secondary" onClick={onHide}>
                Cancelar
              </Button>
              <Button variant="secondary" onClick={handleDelete}>
                Eliminar
              </Button>
            </ModalFooter>
          </Modal>
        </>
      ) : (
        <>
          <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            className="modal-x1"
          >
            <Modal.Header closeButton>
              <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <ModalBody>
              {/*Aca va el formulario*/}
              {"Formulario"}
              <Form onSubmit={formik.handleSubmit}>
                {/*"CodProv"*/}
                <Form.Group controlId="formCodProv">
                  <FormLabel>CodProv</FormLabel>
                </Form.Group>
                <FormControl
                  name="codProv"
                  type="text"
                  value={formik.values.codProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={Boolean(
                    formik.errors.codProv && formik.touched.codProv
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.codProv}
                </Form.Control.Feedback>
                <FormGroup />
                {/*---------- */}

                {/*"nomProv"*/}
                <Form.Group controlId="nomProv">
                  <FormLabel>nomProv</FormLabel>
                </Form.Group>
                <FormControl
                  name="nomProv"
                  type="text"
                  value={formik.values.nomProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={Boolean(
                    formik.errors.nomProv && formik.touched.nomProv
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.nomProv}
                </Form.Control.Feedback>
                <FormGroup />
                {/*---------- */}
                {/*descripcionProv"*/}
                <Form.Group controlId="descripcionProv">
                  <FormLabel>descripcionProv</FormLabel>
                </Form.Group>
                <FormControl
                  name="descripcionProv"
                  type="text"
                  value={formik.values.descripcionProv || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={Boolean(
                    formik.errors.descripcionProv &&
                      formik.touched.descripcionProv
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.descripcionProv}
                </Form.Control.Feedback>
                <FormGroup />
                {/*---------- */}

                <Modal.Footer className="">
                  <Button variant="secondary" onClick={onHide}>
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={!formik.isValid}
                  >
                    Guardar
                  </Button>
                </Modal.Footer>
              </Form>
            </ModalBody>
          </Modal>
        </>
      )}
    </>
  );
};

export default ProveedorModal;
