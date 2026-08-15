import { Link } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';

import { PageHeader, Section } from '../../components/layout/PageShell';
import { Button, EmptyState } from '../../components/ui';

/**
 * Site settings are not built. There is no site-settings model and no endpoint behind this
 * page, so it says so and points at the settings that do exist, rather than rendering a
 * card captioned "coming soon" that looks like a panel someone forgot to fill in.
 */

export function AdminSettings() {
  return (
    <>
      <PageHeader title="Settings" subtitle="Site-wide configuration." />

      <Section>
        <EmptyState
          icon={SettingsIcon}
          title="Nothing to configure yet"
          actions={
            <Button as={Link} to="/settings" variant="secondary">
              Your account settings
            </Button>
          }
        >
          Site-wide settings have no model or endpoint behind them yet. When there is something an
          administrator can actually change, it will appear here.
        </EmptyState>
      </Section>
    </>
  );
}
