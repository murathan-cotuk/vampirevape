'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';
import { getCart, getCartTotal } from '@/utils/cart';

function formatPrice(amount, currencyCode = 'EUR') {
  try {
    const value = Number(amount || 0);
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  } catch {
    return `${amount} EUR`;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [currentBonusPoints, setCurrentBonusPoints] = useState(100);
  const [bonusPointsToUse, setBonusPointsToUse] = useState(0);
  const [billingData, setBillingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'DE',
  });
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    address2: '',
    city: '',
    postalCode: '',
    country: 'DE',
    phone: '',
    billingSameAsShipping: true,
    paymentMethod: 'paypal',
    shippingMethod: 'dhl',
  });

  useEffect(() => {
    const cart = getCart();
    const total = getCartTotal();
    
    if (cart.length === 0) {
      router.push('/warenkorb');
      return;
    }
    
    setCartItems(cart);
    setCartTotal(total);
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cartItems,
          customerInfo: formData,
        }),
      });

      const data = await response.json();

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        throw new Error('Checkout URL not received');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Fehler beim Erstellen der Kasse. Bitte versuchen Sie es erneut.');
      setIsProcessing(false);
    }
  };

  // Calculate subtotal (prices are including tax)
  const subtotal = cartItems.reduce((total, item) => {
    const price = parseFloat(item.price?.amount || 0);
    return total + (price * item.quantity);
  }, 0);

  // Calculate bonus points (1 EUR = 1 point) - earned from this order
  const bonusPointsEarned = Math.floor(subtotal);
  
  // Calculate discount from bonus points (20 points = 1 EUR)
  const bonusDiscount = (bonusPointsToUse / 20);
  
  // Calculate net subtotal (excluding tax) - prices are including 19% tax
  const netSubtotal = subtotal / 1.19;
  const tax = subtotal - netSubtotal;
  
  const shippingCost = 5.99;
  const total = subtotal + shippingCost - bonusDiscount;
  const netTotal = netSubtotal + shippingCost;

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-t-[19px]">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  LIEFERADRESSE
                </label>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Vorname"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Nachname"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Straße und Hausnummer"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="text"
                    placeholder="Adresszusatz (optional)"
                    value={formData.address2}
                    onChange={(e) => setFormData({ ...formData, address2: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Postleitzahl"
                      required
                      value={formData.postalCode}
                      onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                    <input
                      type="text"
                      placeholder="Stadt"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                    />
                  </div>
                  <select
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  >
                    <option value="DE">Deutschland</option>
                    <option value="AT">Österreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                  <input
                    type="email"
                    placeholder="E-Mail-Adresse"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                  <input
                    type="tel"
                    placeholder="Telefonnummer"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div className="bg-[#fffbef] rounded-lg shadow-[0px_187px_75px_rgba(0,0,0,0.01),0px_105px_63px_rgba(0,0,0,0.05),0px_47px_47px_rgba(0,0,0,0.09),0px_12px_26px_rgba(0,0,0,0.1),0px_0px_0px_rgba(0,0,0,0.1)]">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  RECHNUNGSADRESSE
                </label>
                <div className="p-5">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.billingSameAsShipping}
                      onChange={(e) => setFormData({ ...formData, billingSameAsShipping: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">Entspricht der Lieferadresse</span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  ZAHLUNGSART
                </label>
                <div className="p-5 space-y-3">
                  <p className="text-xs text-gray-600 mb-4">Bitte gehe sicher, dass Du die richtige Zahlungsart ausgewählt hast.</p>
                  
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">PayPal</div>
                      <p className="text-xs text-gray-600">Bezahlung per PayPal - einfach, schnell und sicher.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="crypto"
                      checked={formData.paymentMethod === 'crypto'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">CoinGate Crypto</div>
                      <p className="text-xs text-gray-600">Bezahlung mit Krypto</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={formData.paymentMethod === 'card'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Kredit- oder Debitkarte</div>
                      <p className="text-xs text-gray-600">Bezahlung VISA oder Mastercard mit 3D-Secure.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="prepayment"
                      checked={formData.paymentMethod === 'prepayment'}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Vorkasse</div>
                      <p className="text-xs text-gray-600">Bitte überweise den Rechnungsbetrag auf das in der Bestellbestätigung angeg ...</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Shipping Method */}
              <div className="bg-white rounded-lg">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  VERSANDART
                </label>
                <div className="p-5 space-y-3">
                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="dhl"
                      checked={formData.shippingMethod === 'dhl'}
                      onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">DHL Paket</div>
                      <p className="text-xs text-gray-600">DHL Paketversand innerhalb Deutschlands. Kein Versand an Packstationen.</p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 p-3 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors">
                    <input
                      type="radio"
                      name="shipping"
                      value="pickup"
                      checked={formData.shippingMethod === 'pickup'}
                      onChange={(e) => setFormData({ ...formData, shippingMethod: e.target.value })}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Selbstabholer</div>
                      <p className="text-xs text-gray-600">Die Abholung erfolgt in unserem Lager in Neuss. Du bekommst eine Abholbenac ...</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Bonus Points */}
              <div className="bg-white rounded-lg">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  BONUS-PUNKTE
                </label>
                <div className="p-5 space-y-3">
                  <p className="text-sm">Aktueller Punktestand: <span className="font-bold">{currentBonusPoints}</span></p>
                  {currentBonusPoints >= 20 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold">Bonus-Punkte verwenden (20 Punkte = 1 EUR):</label>
                      <input
                        type="number"
                        min="0"
                        max={Math.min(currentBonusPoints, Math.floor(subtotal * 20))}
                        step="20"
                        value={bonusPointsToUse}
                        onChange={(e) => {
                          const points = parseInt(e.target.value) || 0;
                          const maxPoints = Math.min(currentBonusPoints, Math.floor(subtotal * 20));
                          setBonusPointsToUse(Math.max(0, Math.min(points, maxPoints)));
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                      />
                      {bonusPointsToUse > 0 && (
                        <p className="text-xs text-gray-600">
                          Rabatt: {formatPrice(bonusDiscount)} ({bonusPointsToUse} Punkte)
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs text-gray-600">
                    Du erhältst {bonusPointsEarned} Bonus-Punkte für diese Bestellung (1 EUR = 1 Punkt)
                  </p>
                </div>
              </div>

              {/* Terms */}
              <div className="bg-white rounded-lg">
                <div className="p-5 space-y-3">
                  <label className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      required
                      className="mt-1"
                    />
                    <span className="text-sm">Ich habe die <Link href="/agb" className="text-primary underline">AGB</Link> gelesen und bin mit ihnen einverstanden.</span>
                  </label>
                  <p className="text-sm text-gray-600">Mit Absenden der Bestellung erklärst Du Dich automatisch mit unserer <Link href="/widerrufsbelehrung" className="text-primary underline">Widerrufsbelehrung</Link> einverstanden.</p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg sticky top-24">
                <label className="w-full h-10 flex items-center px-5 border-b border-[rgba(16,86,82,0.75)] font-bold text-[11px] text-black">
                  PRODUKT
                </label>
                <div className="p-5 space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.variantId} className="border-b border-[rgba(16,86,82,0.75)] pb-4 last:border-0">
                      <div className="flex items-start gap-3">
                        {item.image && (
                          <div className="w-16 h-16 relative flex-shrink-0 bg-gray-100 rounded">
                            <Image
                              src={item.image}
                              alt={item.title || 'Produkt'}
                              fill
                              className="object-cover rounded"
                              sizes="64px"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm mb-1">{item.title}</p>
                          {item.variantTitle && (
                            <p className="text-xs text-gray-600 mb-1">{item.variantTitle}</p>
                          )}
                          <p className="text-xs text-gray-600">Produkt-Nr.: {item.variantId.slice(-6)}</p>
                          <p className="text-xs text-gray-600 mt-1">Anzahl: {item.quantity}</p>
                          <p className="text-primary font-bold text-sm mt-2">
                            {formatPrice(item.price?.amount, item.price?.currencyCode)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                <div className="px-5 pb-5 border-t border-[rgba(16,86,82,0.75)] pt-5">
                  <span className="text-[13px] font-semibold text-black mb-2 block">HAVE A PROMO CODE?</span>
                  <form className="grid grid-cols-[1fr_80px] gap-2" onSubmit={(e) => { e.preventDefault(); }}>
                    <input
                      type="text"
                      placeholder="Enter a Promo Code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="h-9 px-3 rounded-[5px] border border-[rgb(16,86,82)] bg-[rgb(251,243,228)] focus:outline-none focus:border-transparent focus:shadow-[0px_0px_0px_2px_rgb(251,243,228)] focus:bg-[rgb(201,193,178)] transition-all"
                    />
                    <button
                      type="button"
                      className="h-9 bg-[#a532b1] text-white text-[12px] font-semibold rounded-[5px] border-0 shadow-[0px_0.5px_0.5px_#a532b1,0px_1px_0.5px_rgba(239,239,239,0.5)]"
                    >
                      Apply
                    </button>
                  </form>
                </div>

                {/* Payment Summary */}
                <div className="px-5 pb-5 border-t border-[rgba(16,86,82,0.75)]">
                  <span className="text-[13px] font-semibold text-black mb-2 block">ZAHLUNG</span>
                  <div className="grid grid-cols-[10fr_1fr] gap-1">
                    <span className="text-[12px] font-semibold text-black">Zwischensumme:</span>
                    <span className="text-[13px] font-semibold text-black text-right">{formatPrice(subtotal)}</span>
                    {bonusPointsToUse > 0 && (
                      <>
                        <span className="text-[12px] font-semibold text-black">Bonus-Rabatt:</span>
                        <span className="text-[13px] font-semibold text-green-600 text-right">-{formatPrice(bonusDiscount)}</span>
                      </>
                    )}
                    <span className="text-[12px] font-semibold text-black">Versandkosten:</span>
                    <span className="text-[13px] font-semibold text-black text-right">{formatPrice(shippingCost)}</span>
                    <span className="text-[12px] font-semibold text-black">MwSt. (19%):</span>
                    <span className="text-[13px] font-semibold text-black text-right">{formatPrice(tax)}</span>
                  </div>
                </div>

                {/* Checkout Footer */}
                <div className="bg-[#d5abda] rounded-b-lg flex items-center justify-between px-5 py-3">
                  <label className="text-[22px] text-[#470d4e] font-black">
                    {formatPrice(total)}
                  </label>
                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className="w-[150px] h-9 bg-[#83208e] text-white text-[13px] font-semibold rounded-[7px] border border-[#9C2CA8] shadow-[0px_0.5px_0.5px_rgba(16,86,82,0.75),0px_1px_0.5px_rgba(16,86,82,0.75)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {isProcessing ? 'Wird verarbeitet...' : 'Checkout'}
                  </button>
                </div>

                <div className="px-5 py-3 text-xs text-gray-600 border-t border-[rgba(16,86,82,0.75)]">
                  <p>* Alle Preise inkl. gesetzl. Mehrwertsteuer zzgl. Versandkosten wenn nicht anders angegeben.</p>
                  <p className="mt-2">Gesamtnettosumme: {formatPrice(netTotal - bonusDiscount)}</p>
                  <p>zzgl. 19 % MwSt.: {formatPrice(tax)}</p>
                  <p className="mt-2 font-semibold">Neue Bonus-Punkte: +{bonusPointsEarned}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
