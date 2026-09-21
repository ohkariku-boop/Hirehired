export function generateStaticParams() {
  // Placeholder so static export builds; real cards load client-side by slug on Vercel
  return [{ slug: "_" }];
}

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
