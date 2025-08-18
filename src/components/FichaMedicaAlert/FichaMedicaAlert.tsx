import React from 'react';
import type { Alumno } from '../../types/alumnos';
import './FichaMedicaAlert.css';

type Props = {
  name: string;
  condition: string;
  lastVisit: string;
};

export const FichaMedicaAlert: React.FC<Props> = ({ name, condition, lastVisit }) => {
  const alumnos: Alumno[] = [
    {
      id: 1,
      nombre: 'Juan',
      apellido: 'Pérez',
      fechaNacimiento: '1990-10-01',
    },
    {
      id: 2,
      nombre: 'María',
      apellido: 'Gómez',
      fechaNacimiento: '1992-10-02',
    },
    {
      id: 3,
      nombre: 'Carlos',
      apellido: 'López',
      fechaNacimiento: '1995-10-03',
    },
  ];

  return (
    <div className="alert alert-warning">
      <h4>🏥 Alerta de Ficha Médica 🏥</h4>
      <p>Paciente: {name}</p>
      <p>Condición: {condition}</p>
      <p>Última Visita: {lastVisit}</p>
      <div className="card-container">
        {alumnos.map((alumno) => (
          <div key={alumno.id} className="card">
            <div className="card-header">
              <h5>👨‍🎓 {alumno.nombre} {alumno.apellido}</h5>
            </div>
            <div className="card-body">
              <p><strong>📋 Condición:</strong> {condition}</p>
              <p><strong>📅 Última Visita:</strong> {lastVisit}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};