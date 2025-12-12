import Link from 'next/link';

export default function SocialLinks() {
  const socialLinks = [
    { name: 'Facebook', href: 'https://facebook.com/vampirevape', icon: 'facebook' },
    { name: 'Instagram', href: 'https://instagram.com/vampirevape', icon: 'instagram' },
    { name: 'YouTube', href: 'https://youtube.com/vampirevape', icon: 'youtube' },
    { name: 'Twitter', href: 'https://twitter.com/vampirevape', icon: 'twitter' },
  ];

  return (
    <div>
      <h4 className="text-sm font-semibold mb-3">Folgen Sie uns</h4>
      <div className="flex gap-4">
        {socialLinks.map((social) => (
          <Link
            key={social.name}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors"
            aria-label={social.name}
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2z" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}

