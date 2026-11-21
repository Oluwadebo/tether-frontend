'use client';
import * as Dialog from '@radix-ui/react-dialog';
import ThreadLoader from './ThreadLoader';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  busy?: boolean;
};

/** The only kind of confirmation in the app. Never window.confirm. */
export default function ConfirmDialog({ open, onOpenChange, title, description, confirmLabel, onConfirm, busy }: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(26rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-flint bg-chalk p-6 shadow-xl outline-none">
          <Dialog.Title className="font-serif text-2xl">{title}</Dialog.Title>
          <Dialog.Description className="mt-2 text-ink/70">{description}</Dialog.Description>
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close className="rounded-lg px-4 py-2 hover:bg-limestone">Not yet</Dialog.Close>
            <button onClick={onConfirm} disabled={busy}
              className="flex min-w-28 items-center justify-center rounded-lg bg-persimmon px-4 py-2 font-medium text-chalk hover:bg-ink disabled:opacity-70">
              {busy ? <ThreadLoader className="w-8 text-chalk" label="Working" /> : confirmLabel}
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
