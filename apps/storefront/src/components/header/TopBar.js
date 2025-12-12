export default function TopBar() {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-between items-center py-2 text-sm">
          <div className="flex gap-6">
            <a href="/versand" className="hover:text-primary transition-colors">
              Versand & Lieferung
            </a>
            <a href="/zahlungsarten" className="hover:text-primary transition-colors">
              Zahlungsarten
            </a>
            <a href="/ueber-uns" className="hover:text-primary transition-colors">
              Über uns
            </a>
            <a href="/kontakt" className="hover:text-primary transition-colors">
              Kontakt
            </a>
            <a href="/faq" className="hover:text-primary transition-colors">
              FAQ
            </a>
          </div>
          <div className="text-gray-600">
            <span>Hotline: </span>
            <a href="tel:+49123456789" className="font-semibold hover:text-primary">
              +49 123 456 789
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

