import { useState } from 'react';
import { Info, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Card, Button, Input, Switch, Modal } from '../../../components/ui';

const MIN_PASSWORD_LENGTH = 10;

export function AccountSecuritySettings({
  userEmail,
  privacy,
  onPrivacyChange,
  onPasswordChange,
  isPasswordPending,
  onDeleteAccount,
  isDeletePending,
}) {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    if (passwordForm.newPassword.length < MIN_PASSWORD_LENGTH) {
      return toast.error(`New password must be at least ${MIN_PASSWORD_LENGTH} characters`);
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      return toast.error('New passwords do not match');
    }
    onPasswordChange(passwordForm);
  };

  const handleDeleteSubmit = (event) => {
    event.preventDefault();
    if (!deletePassword) return toast.error('Enter your password to confirm');
    onDeleteAccount(deletePassword);
  };

  return (
    <>
      {/* Privacy Settings */}
      <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Privacy
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            What other people can see on your public page.
          </p>
        </div>

        <div className="flex flex-col">
          <Switch
            label="Show my email address"
            note="Visitors to your profile can see it."
            checked={privacy.showEmail}
            onChange={(val) => onPrivacyChange('showEmail', val)}
          />
          <Switch
            label="Show my activity"
            note="Recent posts and comments appear on your profile."
            checked={privacy.showActivity}
            onChange={(val) => onPrivacyChange('showActivity', val)}
          />
        </div>
      </Card>

      {/* Change Password */}
      <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Change password
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            You will be signed out everywhere once it changes, including here — that is what makes
            changing it useful if the old one leaked.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted text-sm text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 text-primary" />
          <span>
            Signed in as <strong>{userEmail}</strong>. Sessions use a short-lived token that
            refreshes silently while you are active.
          </span>
        </div>

        <form onSubmit={handlePasswordSubmit} className="flex flex-col gap-4">
          <Input
            label="Current password"
            type="password"
            autoComplete="current-password"
            value={passwordForm.currentPassword}
            onChange={(event) =>
              setPasswordForm((f) => ({ ...f, currentPassword: event.target.value }))
            }
          />
          <Input
            label="New password"
            type="password"
            autoComplete="new-password"
            value={passwordForm.newPassword}
            onChange={(event) =>
              setPasswordForm((f) => ({ ...f, newPassword: event.target.value }))
            }
            hint={`At least ${MIN_PASSWORD_LENGTH} characters. A passphrase beats punctuation.`}
          />
          <Input
            label="Confirm new password"
            type="password"
            autoComplete="new-password"
            value={passwordForm.confirmPassword}
            onChange={(event) =>
              setPasswordForm((f) => ({ ...f, confirmPassword: event.target.value }))
            }
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={isPasswordPending}>
              {isPasswordPending ? 'Changing…' : 'Change password'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Delete Account */}
      <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-destructive">Delete account</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Removes your account, your stories, and the comments and likes on them. This cannot be
            undone.
          </p>
        </div>

        <div>
          <Button variant="dangerTonal" onClick={() => setConfirmDelete(true)}>
            <Trash2 className="w-4 h-4 mr-1.5" /> Delete my account
          </Button>
        </div>
      </Card>

      {/* Delete Account Modal */}
      <Modal
        open={confirmDelete}
        onOpenChange={(open) => {
          setConfirmDelete(open);
          if (!open) setDeletePassword('');
        }}
        title="Delete your account?"
        description="Your stories, and the comments and likes on them, go with it. This cannot be undone."
      >
        <form onSubmit={handleDeleteSubmit} className="flex flex-col gap-4">
          <Input
            label="Confirm your password"
            type="password"
            autoComplete="current-password"
            value={deletePassword}
            onChange={(event) => setDeletePassword(event.target.value)}
          />
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={() => setConfirmDelete(false)}>
              Keep my account
            </Button>
            <Button type="submit" variant="danger" disabled={isDeletePending}>
              {isDeletePending ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
}

