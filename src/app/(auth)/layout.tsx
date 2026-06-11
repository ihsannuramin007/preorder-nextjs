export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex flex-col items-center gap-3 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-[#FFD400] border-2 border-[#0D0D0D] shadow-sticker flex items-center justify-center">
              <span className="text-[#111111] font-extrabold text-xl">P</span>
            </div>
            <span className="font-extrabold text-3xl text-[#111111] tracking-tight">POHub</span>
          </div>
          <p className="text-sm text-[#9A9A9A] font-medium mt-1">
            Platform Pre-Order untuk UMKM Rumahan
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
