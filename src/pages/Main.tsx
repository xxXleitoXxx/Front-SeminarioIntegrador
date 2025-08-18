import React from "react";
import { CumpleañosAlert } from "../components/CumpleañosAlert/CumpleañosAlert";

export default function Main() {
  return (
    <div>
      <h1>Página Principal</h1>
      <h3>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Architecto
        explicabo laborum nesciunt necessitatibus quisquam ea consectetur.
        Mollitia cupiditate dolor, asperiores minima quod nulla dolores corporis
        accusantium magni error. Modi, maxime.
      </h3>
      <CumpleañosAlert name="Ejemplo" date="2023-10-01" />
    </div>
  );
}
