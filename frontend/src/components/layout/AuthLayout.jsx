import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[2rem] bg-sea px-10 py-12 text-white shadow-2xl shadow-teal-900/20 lg:flex lg:flex-col lg:justify-between">
          <div className="space-y-4">
            <span className="inline-flex rounded-full bg-white/15 px-4 py-1 text-sm font-semibold">
              Neuro-friendly learning
            </span>
            <h1 className="font-display text-4xl leading-tight">
              Dyslexia learning games with progress you can actually track.
            </h1>
            <p className="max-w-md text-base text-teal-50/90">
              This frontend is scaffolded for authentication, guided gameplay, results, and
              progress analytics.
            </p>
          </div>
          <div className="grid gap-4 text-sm text-teal-50/90">
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              Five supported game types
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
              Authenticated routes with API-ready Axios client
            </div>
          </div>
        </section>
        <section className="panel flex items-center justify-center p-6 sm:p-10">
          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default AuthLayout;
