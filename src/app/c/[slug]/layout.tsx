export function generateStaticParams() {
  // Placeholder so static export builds; real cards load client-side by slug on Vercel
  return [{ slug: "_" }, { slug: "kelly-grayson" }, { slug: "alan-wang" }, { slug: "john-doe" }];
}

export default function CardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
