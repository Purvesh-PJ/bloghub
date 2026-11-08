import { RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '../../../components/ui';

export function DraftRecoveryBanner({ recovered, onRestore, onDiscard }) {
  if (!recovered) return null;

  return (
    <div
      role="status"
      className="flex items-center gap-3 flex-wrap p-4 px-6 mb-6 rounded-2xl bg-warning/10 border border-warning/30 text-warning text-sm"
    >
      <RotateCcw className="w-4 h-4 shrink-0" />
      <span className="mr-auto">
        Unsaved work from {formatDistanceToNow(new Date(recovered.savedAt), { addSuffix: true })}{' '}
        was found on this device.
      </span>
      <Button size="sm" variant="tonal" onClick={onRestore}>
        Restore it
      </Button>
      <Button size="sm" variant="ghost" onClick={onDiscard}>
        Discard
      </Button>
    </div>
  );
}
