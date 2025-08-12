import React from "react";
import { Card } from "react-bootstrap";
import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  message: string;
  icon?: string;
}
    
const EmptyState: React.FC<EmptyStateProps> = ({ title, message, icon = "📭" }) => {
  return (
    <div className="empty-state-container">
      <Card className="empty-state-card">
        <Card.Body className="empty-state-body">
          <div className="empty-state-icon">{icon}</div>
          <h3 className="empty-state-title">{title}</h3>
          <p className="empty-state-message">{message}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EmptyState; 