import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="inline-flex flex-col items-center gap-3 mb-2">
            <Image src="/full-logo.png" alt="POHub" width={150} height={150} />
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
