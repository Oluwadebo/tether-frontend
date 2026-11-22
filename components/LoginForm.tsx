'use client';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, TriangleAlert } from 'lucide-react';
import { ApiError, login, register } from '@/lib/api';
import ThreadLoader from './ThreadLoader';

type Mode = 'login' | 'register';
type Field = 'name' | 'email' | 'password';
const base =
  'w-full rounded-lg border bg-white px-3.5 py-2.5 text-base outline-offset-2 focus:outline-2 focus:outline-ultramarine';

export default function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [badField, setBadField] = useState<Field | ''>('');
  const [busy, setBusy] = useState(false);

  // Shows the message, marks the input that caused it, and moves focus there.
  function fail(message: string, field?: string) {
    setError(message);
    const f = (['name', 'email', 'password'] as const).find((x) => x === field) ?? '';
    setBadField(f);
    if (f) document.getElementById(f)?.focus();
  }
  function clearFor(f: Field) {
    if (badField === f) { setBadField(''); setError(''); }
  }
  const cls = (f: Field, extra = '') =>
    `${base} ${extra} ${badField === f ? 'border-straw ring-2 ring-straw' : 'border-flint'}`;

  function switchMode(m: Mode) {
    setMode(m);
    setError('');
    setBadField('');
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setBadField('');
    if (mode === 'register' && !name.trim()) return fail('Tell us your name.', 'name');
    if (!/^\S+@\S+\.\S+$/.test(email)) return fail('Enter a valid email address.', 'email');
    if (!password) return fail('Enter your password.', 'password');
    if (mode === 'register' && password.length < 8) return fail('Use at least 8 characters for your password.', 'password');
    setBusy(true);
    try {
      if (mode === 'login') await login(email, password);
      else await register(name.trim(), email, password);
      router.replace('/floor');
    } catch (err) {
      setBusy(false);
      if (err instanceof ApiError) fail(err.message, err.field);
      else fail('Something went wrong. Try again.');
    }
  }

  return (
    <section className="grid place-items-center p-4 sm:p-6 lg:p-14">
      <div className="w-full max-w-md rounded-2xl border border-flint bg-chalk p-7 shadow-sm lg:p-9">
        <div role="tablist" aria-label="Account" className="mb-7 grid grid-cols-2 rounded-xl bg-limestone p-1 text-sm font-medium">
          {([['login', 'Sign in'], ['register', 'Create account']] as const).map(([m, label]) => (
            <button key={m} role="tab" type="button" aria-selected={mode === m} onClick={() => switchMode(m)}
              className={`rounded-lg px-3 py-2 transition ${mode === m ? 'bg-chalk shadow-sm' : 'text-ink/60 hover:text-ink'}`}>
              {label}
            </button>
          ))}
        </div>

        <h2 className="font-serif text-3xl">{mode === 'login' ? 'Welcome back' : 'Join the floor'}</h2>
        <p className="mt-1 text-ink/60">{mode === 'login' ? 'Sign in to pick up your threads.' : 'Create an account to start.'}</p>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          {mode === 'register' && (
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
              <input id="name" autoComplete="name" value={name} aria-invalid={badField === 'name'}
                onChange={(e) => { setName(e.target.value); clearFor('name'); }} className={cls('name')} />
            </div>
          )}
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
            <input id="email" type="email" autoComplete="email" value={email} aria-invalid={badField === 'email'}
              onChange={(e) => { setEmail(e.target.value); clearFor('email'); }} className={cls('email')} />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium">Password</label>
            <div className="relative">
              <input id="password" type={show ? 'text' : 'password'} value={password} aria-invalid={badField === 'password'}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                onChange={(e) => { setPassword(e.target.value); clearFor('password'); }} className={cls('password', 'pr-11')} />
              <button type="button" onClick={() => setShow((s) => !s)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}
                className="absolute inset-y-0 right-0 grid w-11 place-items-center text-ink/60 hover:text-ink">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {mode === 'register' && <p className="mt-1.5 text-xs text-ink/50">At least 8 characters.</p>}
          </div>

          <div aria-live="polite">
            {error && (
              <p role="alert" className="flex items-start gap-2 rounded-lg bg-straw/25 px-3 py-2.5 text-sm">
                <TriangleAlert size={16} className="mt-0.5 shrink-0" aria-hidden />
                {error}
              </p>
            )}
          </div>

          <button disabled={busy}
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-ink px-4 py-3 font-medium text-chalk transition hover:bg-ultramarine disabled:opacity-70">
            {busy ? <ThreadLoader className="w-10 text-chalk" label={mode === 'login' ? 'Signing in' : 'Creating account'} />
                  : mode === 'login' ? 'Sign in' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}
