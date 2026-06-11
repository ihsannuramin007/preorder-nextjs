export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-bold text-xl text-foreground">POHub</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Platform Pre-Order untuk UMKM Rumahan
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
