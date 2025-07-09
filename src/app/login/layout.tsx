// Layout خاص لصفحة تسجيل الدخول (بدون هيدر وفوتر)
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      {children}
    </div>
  );
}
