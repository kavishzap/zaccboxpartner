// components/Footer.tsx
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-2 text-center text-sm text-gray-400">
      © {currentYear}. Zaccbox All rights reserved.
    </footer>
  );
}
