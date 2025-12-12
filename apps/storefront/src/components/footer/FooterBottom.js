import Link from 'next/link';

export default function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-gray-800 pt-8 mt-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-gray-400 text-sm">
          © {currentYear} Vampire Vape. Alle Rechte vorbehalten.
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="/impressum" className="text-gray-400 hover:text-white transition-colors">
            Impressum
          </Link>
          <Link href="/datenschutz" className="text-gray-400 hover:text-white transition-colors">
            Datenschutz
          </Link>
          <Link href="/agb" className="text-gray-400 hover:text-white transition-colors">
            AGB
          </Link>
        </div>
      </div>
    </div>
  );
}

