import Link from 'next/link';

export default function FooterBottom() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="border-t border-gray-800 pt-8 mt-8">
      <div className="flex flex-col md:flex-row justify-center text-center items-center gap-4">
        <p className="text-gray-400 text-sm">
          * Alle Preise inkl. gesetzl. Mehrwertsteuer zzgl. Versandkosten und ggf. Nachnahmegebühren, wenn nicht anders angegeben.
          <br />© {currentYear} Vampire Vape - Alle Rechte vorbehalten.
        </p>
        
      </div>
    </div>
  );
}

