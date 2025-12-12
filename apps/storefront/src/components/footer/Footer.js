import FooterLinks from './FooterLinks';
import FooterBottom from './FooterBottom';
import NewsletterSignup from './NewsletterSignup';
import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <FooterLinks
            title="Kunden-Service"
            links={[
              { name: 'Kontakt', href: '/kontakt' },
              { name: 'Versand & Lieferung', href: '/versand' },
              { name: 'Zahlungsarten', href: '/zahlungsarten' },
              { name: 'Rückgabe & Umtausch', href: '/rueckgabe' },
              { name: 'FAQ', href: '/faq' },
              { name: 'Widerrufsrecht', href: '/widerruf' },
            ]}
          />
          <FooterLinks
            title="Über Uns"
            links={[
              { name: 'Unternehmen', href: '/ueber-uns' },
              { name: 'Karriere', href: '/karriere' },
              { name: 'Presse', href: '/presse' },
              { name: 'Partner', href: '/partner' },
              { name: 'Impressum', href: '/impressum' },
              { name: 'AGB', href: '/agb' },
            ]}
          />
          <FooterLinks
            title="Rechtliches"
            links={[
              { name: 'Datenschutz', href: '/datenschutz' },
              { name: 'Cookie-Richtlinie', href: '/cookies' },
              { name: 'Altersprüfung', href: '/alterspruefung' },
              { name: 'Widerrufsbelehrung', href: '/widerrufsbelehrung' },
              { name: 'Zahlungsinformationen', href: '/zahlungsinformationen' },
            ]}
          />
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <NewsletterSignup />
            <SocialLinks />
          </div>
        </div>
        <FooterBottom />
      </div>
    </footer>
  );
}

