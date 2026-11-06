import { Modal, Button } from '../../ui';

export function WorkspaceSignOutModal({ open, onOpenChange, onLogout }) {
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Sign out everywhere?"
      description="This ends your session on every device you are signed in on. Your drafts and published stories are safely saved."
    >
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onOpenChange(false)}>
          Stay signed in
        </Button>
        <Button variant="danger" onClick={onLogout}>
          Sign out
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
