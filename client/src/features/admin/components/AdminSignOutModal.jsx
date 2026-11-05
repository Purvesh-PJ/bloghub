import { useNavigate } from 'react-router-dom';
import { Modal, Button } from '../../../components/ui';
import { useAuth } from '../../../features/auth';

/**
 * Sign out confirmation dialog for the administrator console.
 */
export function AdminSignOutModal({ open, onOpenChange }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    navigate('/', { replace: true });
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out of Administrator Console?"
      description="Your administrative session will be ended securely."
    >
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Stay signed in
        </Button>
        <Button variant="danger" onClick={handleSignOut}>
          Sign out
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
