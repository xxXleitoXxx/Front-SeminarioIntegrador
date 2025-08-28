interface DeleteButtonProps {
  onClick: () => void;
}
export const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  return (
    <span
      style={{
        fontSize: '20px',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '6px',
        backgroundColor: '#f8d7da',
        border: '1px solid #f5c6cb',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: '#721c24'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f5c6cb';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(220, 53, 69, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#f8d7da';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title="Eliminar"
    >
      🗑️
    </span>
  );
};
