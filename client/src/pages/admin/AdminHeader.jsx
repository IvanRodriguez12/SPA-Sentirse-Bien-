import { useNavigate } from 'react-router-dom';

const AdminHeader = ({ title }) => {
  const navigate = useNavigate();
  
  return (
    <div className="admin-header">
      <button
        onClick={() => navigate('/admin/dashboard')}
        className="admin-button back-button"
      >
        ← Volver al Dashboard
      </button>
      <h1>{title}</h1>
    </div>
  );
};

export default AdminHeader;