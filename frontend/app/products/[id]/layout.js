// Satisfies Next.js static export requirement for dynamic routes
export function generateStaticParams() {
  // Returning a dummy param allows the build to succeed
  return [{ id: 'fallback' }];
}

export default function ProductDetailLayout({ children }) {
  return children;
}
