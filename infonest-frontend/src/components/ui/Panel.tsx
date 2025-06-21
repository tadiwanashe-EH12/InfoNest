export default function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-md">
      {children}
    </div>
  );
}