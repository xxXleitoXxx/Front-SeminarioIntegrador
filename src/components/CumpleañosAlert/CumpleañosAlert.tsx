import React from "react";
import type { Alumno } from "../../types/alumnos";
import "./CumpleañosAlert.css";

type Props = {
  name: string;
  date: string;
};

export const CumpleañosAlert: React.FC<Props> = ({ name, date }) => {
  const alumnos: Alumno[] = [
    {
      id: 1,
      nombre: "Juan",
      apellido: "Pérez",
      fechaNacimiento: "1990-10-01",
    },
    {
      id: 2,
      nombre: "María",
      apellido: "Gómez",
      fechaNacimiento: "1992-10-02",
    },
    {
      id: 3,
      nombre: "Carlos",
      apellido: "López",
      fechaNacimiento: "1995-10-03",
    },
  ];

  const getCumpleañosStatus = (fechaNacimiento: string) => {
    const today = new Date();
    const cumpleañosDate = new Date(fechaNacimiento);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (
      cumpleañosDate.getDate() === today.getDate() &&
      cumpleañosDate.getMonth() === today.getMonth()
    ) {
      return "Hoy";
    } else if (
      cumpleañosDate.getDate() === tomorrow.getDate() &&
      cumpleañosDate.getMonth() === tomorrow.getMonth()
    ) {
      return "Mañana";
    } else {
      return cumpleañosDate.toLocaleDateString();
    }
  };

  return (
    <div className="alert alert-info">
      <h4>¡¡Cumples de la semana!!</h4>
      <p>Hoy es el cumpleaños de {name}.</p>
      <p>Fecha: {date}</p>
      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Día de Cumpleaños</th>
          </tr>
        </thead>
        <tbody>
          {alumnos.map((alumno) => (
            <tr key={alumno.id}>
              <td>{alumno.nombre}</td>
              <td>{alumno.apellido}</td>
              <td>{getCumpleañosStatus(alumno.fechaNacimiento)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
