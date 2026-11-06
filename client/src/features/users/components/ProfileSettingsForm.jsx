import { ImagePlus } from 'lucide-react';
import { Button, Input, TextArea, Avatar, Card } from '../../../components/ui';

export function ProfileSettingsForm({
  form,
  setForm,
  profileDetails,
  setProfileDetails,
  avatarUrl,
  avatarFile,
  avatarPreview,
  handleAvatarPick,
  clearAvatarPick,
  onSubmit,
  isPending,
}) {
  return (
    <Card tone="low" radius="xl" padding="2xl" className="flex flex-col gap-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Profile</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Your name and bio appear on your public page and beside everything you publish.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {/* Avatar row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border/40">
          <Avatar src={avatarPreview || avatarUrl} name={form.username} size="xl" />
          <div className="flex flex-col gap-2 min-w-0">
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP or GIF, up to 2 MB. Square images look best.
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-secondary text-secondary-foreground border border-border text-xs font-medium hover:bg-muted transition-colors select-none">
                  <ImagePlus className="w-3.5 h-3.5" />
                  {avatarUrl || avatarFile ? 'Replace' : 'Upload'}
                </span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) => handleAvatarPick(event.target.files?.[0])}
                  className="sr-only"
                />
              </label>
              {avatarFile && (
                <Button type="button" variant="ghost" size="sm" onClick={clearAvatarPick}>
                  Cancel
                </Button>
              )}
            </div>
            {avatarFile && (
              <p className="text-xs text-amber-500 font-medium">
                Not saved yet — press Save changes below.
              </p>
            )}
          </div>
        </div>

        {/* Inputs grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Username"
            value={form.username}
            onChange={(event) => setForm({ ...form, username: event.target.value })}
            placeholder="Your name"
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="you@example.com"
          />
          <div className="sm:col-span-2">
            <TextArea
              label="Bio"
              value={form.bio}
              onChange={(event) => setForm({ ...form, bio: event.target.value })}
              placeholder="A sentence or two about what you write."
              rows={4}
              hint="Shown on your public profile."
            />
          </div>

          <Input
            label="Display name"
            value={profileDetails.fullName}
            onChange={(event) =>
              setProfileDetails({ ...profileDetails, fullName: event.target.value })
            }
            placeholder="How you'd like to be credited"
            hint="Optional. Shown beneath your username."
          />
          <Input
            label="Location"
            value={profileDetails.location}
            onChange={(event) =>
              setProfileDetails({ ...profileDetails, location: event.target.value })
            }
            placeholder="City, country"
          />
          <div className="sm:col-span-2">
            <Input
              label="Website"
              type="url"
              value={profileDetails.website}
              onChange={(event) =>
                setProfileDetails({ ...profileDetails, website: event.target.value })
              }
              placeholder="https://example.com"
              hint="Must start with http:// or https://"
            />
          </div>

          <Input
            label="GitHub"
            value={profileDetails.socialLinks.github}
            onChange={(event) =>
              setProfileDetails({
                ...profileDetails,
                socialLinks: {
                  ...profileDetails.socialLinks,
                  github: event.target.value,
                },
              })
            }
            placeholder="username"
          />
          <Input
            label="X / Twitter"
            value={profileDetails.socialLinks.twitter}
            onChange={(event) =>
              setProfileDetails({
                ...profileDetails,
                socialLinks: {
                  ...profileDetails.socialLinks,
                  twitter: event.target.value,
                },
              })
            }
            placeholder="username"
          />
          <div className="sm:col-span-2">
            <Input
              label="LinkedIn"
              value={profileDetails.socialLinks.linkedin}
              onChange={(event) =>
                setProfileDetails({
                  ...profileDetails,
                  socialLinks: {
                    ...profileDetails.socialLinks,
                    linkedin: event.target.value,
                  },
                })
              }
              placeholder="username"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isPending}>
            Save changes
          </Button>
        </div>
      </form>
    </Card>
  );
}
