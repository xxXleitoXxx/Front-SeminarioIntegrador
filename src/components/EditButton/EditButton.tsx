interface EditButtonProps {
  onClick: () => void;
}
export const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <span
      style={{
        fontSize: '20px',
        cursor: 'pointer',
        padding: '8px',
        borderRadius: '6px',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        color: '#856404'
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#ffeaa7';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(255, 193, 7, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#fff3cd';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      title="Editar"
    >
      ✏️
    </span>
  );
};
