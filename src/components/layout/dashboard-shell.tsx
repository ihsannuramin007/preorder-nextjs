import { cn } from "@/lib/utils/cn";

type DashboardShellProps = {
  children: React.ReactNode;
  className?: string;
};

export function DashboardShell({ children, className }: DashboardShellProps) {
  return (
    <main
      className={cn(
        "flex-1 md:ml-60 min-h-screen pb-24 md:pb-8",
        className
      )}
    >
      <div className="max-w-dashboard mx-auto px-4 py-6 md:px-8">
        {children}
      </div>
    </main>
  );
}
