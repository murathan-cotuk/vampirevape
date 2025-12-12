export default function PaymentMethods() {
  const paymentMethods = [
    { name: 'Klarna', icon: 'klarna' },
    { name: 'PayPal', icon: 'paypal' },
    { name: 'Stripe', icon: 'stripe' },
    { name: 'Apple Pay', icon: 'apple-pay' },
    { name: 'Google Pay', icon: 'google-pay' },
  ];

  return (
    <section className="bg-gray-100 py-12">
      <div className="container-custom">
        <h2 className="text-3xl font-bold mb-8 text-center">Zahlungsarten</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          {paymentMethods.map((method) => (
            <div
              key={method.name}
              className="bg-white p-6 rounded-lg shadow-md flex items-center justify-center"
            >
              <span className="text-gray-600 font-semibold">{method.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

