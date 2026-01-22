'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/header/Header';
import Footer from '@/components/footer/Footer';

const GERMAN_STATES = [
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen',
];

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    firstName: '',
    lastName: '',
    anrede: '',
    geburtsdatum: '',
    telefonnummer: '',
    strasse: '',
    plz: '',
    ort: '',
    adresszusatz: '',
    land: 'Deutschland',
    bundesland: '',
    differentShipping: false,
    shippingStrasse: '',
    shippingPlz: '',
    shippingOrt: '',
    shippingAdresszusatz: '',
    shippingBundesland: '',
    newsletter: false,
    datenschutz: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    let firstErrorField = null;

    if (!formData.email.trim()) {
      errors.email = 'E-Mail-Adresse ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'email';
    }
    if (!formData.password) {
      errors.password = 'Passwort ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'password';
    } else if (formData.password.length < 8) {
      errors.password = 'Passwort muss mindestens 8 Zeichen lang sein.';
      if (!firstErrorField) firstErrorField = 'password';
    }
    if (!formData.passwordConfirm) {
      errors.passwordConfirm = 'Passwort-Bestätigung ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'passwordConfirm';
    } else if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = 'Die Passwörter stimmen nicht überein.';
      if (!firstErrorField) firstErrorField = 'passwordConfirm';
    }
    if (!formData.firstName.trim()) {
      errors.firstName = 'Vorname ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'firstName';
    }
    if (!formData.lastName.trim()) {
      errors.lastName = 'Nachname ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'lastName';
    }
    if (!formData.anrede) {
      errors.anrede = 'Bitte wählen Sie eine Anrede aus.';
      if (!firstErrorField) firstErrorField = 'anrede';
    }
    if (!formData.geburtsdatum) {
      errors.geburtsdatum = 'Geburtsdatum ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'geburtsdatum';
    }
    if (!formData.strasse.trim()) {
      errors.strasse = 'Straße und Hausnummer ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'strasse';
    }
    if (!formData.plz.trim()) {
      errors.plz = 'PLZ ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'plz';
    }
    if (!formData.ort.trim()) {
      errors.ort = 'Ort ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'ort';
    }
    if (!formData.land) {
      errors.land = 'Land ist ein Pflichtfeld.';
      if (!firstErrorField) firstErrorField = 'land';
    }
    if (formData.differentShipping) {
      if (!formData.shippingStrasse.trim()) {
        errors.shippingStrasse = 'Lieferadresse: Straße und Hausnummer ist ein Pflichtfeld.';
        if (!firstErrorField) firstErrorField = 'shippingStrasse';
      }
      if (!formData.shippingPlz.trim()) {
        errors.shippingPlz = 'Lieferadresse: PLZ ist ein Pflichtfeld.';
        if (!firstErrorField) firstErrorField = 'shippingPlz';
      }
      if (!formData.shippingOrt.trim()) {
        errors.shippingOrt = 'Lieferadresse: Ort ist ein Pflichtfeld.';
        if (!firstErrorField) firstErrorField = 'shippingOrt';
      }
    }
    if (!formData.datenschutz) {
      errors.datenschutz = 'Sie müssen den Datenschutzbestimmungen und AGB zustimmen.';
      if (!firstErrorField) firstErrorField = 'datenschutz';
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      setError('Bitte füllen Sie alle Pflichtfelder aus.');
      
      // Scroll to first error field
      if (firstErrorField) {
        setTimeout(() => {
          let element = null;
          // Special handling for checkbox fields
          if (firstErrorField === 'datenschutz') {
            element = document.getElementById('datenschutz-checkbox');
          } else {
            element = document.querySelector(`[name="${firstErrorField}"]`);
          }
          
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Only focus if it's not a checkbox (checkboxes can't be focused directly)
            if (firstErrorField !== 'datenschutz') {
              element.focus();
            }
          }
        }, 100);
      }
      
      return false;
    }

    setFieldErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setFieldErrors({});

    const isValid = validateForm();
    if (!isValid) {
      return;
    }


    setIsLoading(true);

    try {
      const response = await fetch('/api/shopify/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registrierung fehlgeschlagen');
      }

      // Save customer ID to localStorage
      if (data.customerId) {
        localStorage.setItem('shopify_customer_id', data.customerId);
        window.dispatchEvent(new Event('authChange'));
      }

      router.push('/konto');
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="container-custom py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-primary mb-4">Registrieren</h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                  {error}
                </div>
              )}

              {/* 1. Anrede* | Geburtsdatum* */}
              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Anrede <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="anrede"
                    value={formData.anrede}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.anrede ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  >
                    <option value="">Bitte wählen</option>
                    <option value="Herr">Herr</option>
                    <option value="Frau">Frau</option>
                    <option value="Divers">Divers</option>
                  </select>
                  {fieldErrors.anrede && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.anrede}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Geburtsdatum <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="geburtsdatum"
                    value={formData.geburtsdatum}
                    onChange={handleChange}
                    required
                    placeholder="TT.MM.JJJJ"
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.geburtsdatum ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.geburtsdatum && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.geburtsdatum}</p>
                  )}
                </div>
              </div>

              {/* 2. Vorname* | Nachname* */}
              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Vorname <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Vorname"
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.firstName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.firstName}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Nachname <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Nachname"
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.lastName ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.lastName}</p>
                  )}
                </div>
              </div>

              {/* 3. E-Mail Adresse* | Telefonnummer */}
              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    E-Mail-Adresse <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="E-Mail-Adresse"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.email ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.email && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
                  )}
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Telefonnummer
                  </label>
                  <input
                    placeholder="Telefonnummer"
                    type="tel"
                    name="telefonnummer"
                    value={formData.telefonnummer}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                  />
                </div>
              </div>

              {/* 4. Passwort* | Passwort-Bestätigung* */}
              <div className="flex space-x-3 mb-3">
                <div className="relative w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Passwort <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Passwort"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full pr-10 focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.password ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.53 3.19 1.43 4.443m-2.14 1.557a10.05 10.05 0 01-1.29-5.5c0-4.478 2.943-8.268 7-9.543m11.086 9.543c-.5 1.5-1.5 2.8-2.8 3.7m-2.3 2.3c-1.5.5-3.1.8-4.9.8-4.478 0-8.268-2.943-9.543-7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {fieldErrors.password && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                  )}
                </div>
                <div className="relative w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Passwort-Bestätigung <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Passwort bestätigen"
                    type={showPasswordConfirm ? 'text' : 'password'}
                    name="passwordConfirm"
                    value={formData.passwordConfirm}
                    onChange={handleChange}
                    required
                    minLength={8}
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full pr-10 focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.passwordConfirm ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                    className="absolute right-2 top-9 text-gray-500 hover:text-gray-700"
                  >
                    {showPasswordConfirm ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.29 3.29m0 0A9.97 9.97 0 015 12c0 1.657.53 3.19 1.43 4.443m-2.14 1.557a10.05 10.05 0 01-1.29-5.5c0-4.478 2.943-8.268 7-9.543m11.086 9.543c-.5 1.5-1.5 2.8-2.8 3.7m-2.3 2.3c-1.5.5-3.1.8-4.9.8-4.478 0-8.268-2.943-9.543-7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                  {fieldErrors.passwordConfirm && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.passwordConfirm}</p>
                  )}
                </div>
              </div>

              {/* 5. Straße und Hausnummer* | PLZ* | Ort* */}
              <div className="flex space-x-3 mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Straße und Hausnummer <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Straße und Hausnummer"
                    type="text"
                    name="strasse"
                    value={formData.strasse}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.strasse ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.strasse && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.strasse}</p>
                  )}
                </div>
                <div className="w-24">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    PLZ <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="PLZ"
                    type="text"
                    name="plz"
                    value={formData.plz}
                    onChange={handleChange}
                    required
                    pattern="[0-9]{5}"
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.plz ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.plz && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.plz}</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Ort <span className="text-red-500">*</span>
                  </label>
                  <input
                    placeholder="Ort"
                    type="text"
                    name="ort"
                    value={formData.ort}
                    onChange={handleChange}
                    required
                    className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                      fieldErrors.ort ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                    }`}
                  />
                  {fieldErrors.ort && (
                    <p className="text-red-500 text-xs mt-1">{fieldErrors.ort}</p>
                  )}
                </div>
              </div>

              {/* 6. Adresszusatz */}
              <div className="mb-3">
                <label className="block text-sm font-semibold mb-1 text-gray-700">
                  Adresszusatz
                </label>
                <input
                  placeholder="Adresszusatz (hier NICHT Hausnummer und KEIN Versand an Packstationen)"
                  type="text"
                  name="adresszusatz"
                  value={formData.adresszusatz}
                  onChange={handleChange}
                  className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                />
              </div>

              {/* 7. Land* | Bundesland */}
              <div className="flex space-x-3 mb-3">
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Land <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="land"
                    value={formData.land}
                    required
                    disabled
                    className="bg-gray-100 text-gray-600 border-0 rounded-md p-2 w-full cursor-not-allowed"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    Bundesland
                  </label>
                  <select
                    name="bundesland"
                    value={formData.bundesland}
                    onChange={handleChange}
                    className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                  >
                    <option value="">Bitte wählen</option>
                    {GERMAN_STATES.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 8. Lieferadresse weicht von Rechnungsadresse ab */}
              <div className="mb-3">
                <label className="flex items-center text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="differentShipping"
                    checked={formData.differentShipping}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span>Lieferadresse weicht von Rechnungsadresse ab</span>
                </label>
              </div>

              {formData.differentShipping && (
                <>
                  <div className="flex space-x-3 mb-3">
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Lieferadresse: Straße und Hausnummer <span className="text-red-500">*</span>
                      </label>
                      <input
                        placeholder="Straße und Hausnummer"
                        type="text"
                        name="shippingStrasse"
                        value={formData.shippingStrasse}
                        onChange={handleChange}
                        required={formData.differentShipping}
                        className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                          fieldErrors.shippingStrasse ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                        }`}
                      />
                      {fieldErrors.shippingStrasse && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.shippingStrasse}</p>
                      )}
                    </div>
                    <div className="w-24">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        PLZ <span className="text-red-500">*</span>
                      </label>
                      <input
                        placeholder="PLZ"
                        type="text"
                        name="shippingPlz"
                        value={formData.shippingPlz}
                        onChange={handleChange}
                        required={formData.differentShipping}
                        pattern="[0-9]{5}"
                        className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                          fieldErrors.shippingPlz ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                        }`}
                      />
                      {fieldErrors.shippingPlz && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.shippingPlz}</p>
                      )}
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-semibold mb-1 text-gray-700">
                        Ort <span className="text-red-500">*</span>
                      </label>
                      <input
                        placeholder="Ort"
                        type="text"
                        name="shippingOrt"
                        value={formData.shippingOrt}
                        onChange={handleChange}
                        required={formData.differentShipping}
                        className={`bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 transition ease-in-out duration-150 ${
                          fieldErrors.shippingOrt ? 'border-2 border-red-500 focus:ring-red-500' : 'focus:ring-primary'
                        }`}
                      />
                      {fieldErrors.shippingOrt && (
                        <p className="text-red-500 text-xs mt-1">{fieldErrors.shippingOrt}</p>
                      )}
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Lieferadresse: Adresszusatz
                    </label>
                    <input
                      placeholder="Adresszusatz (optional)"
                      type="text"
                      name="shippingAdresszusatz"
                      value={formData.shippingAdresszusatz}
                      onChange={handleChange}
                      className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="block text-sm font-semibold mb-1 text-gray-700">
                      Lieferadresse: Bundesland
                    </label>
                    <select
                      name="shippingBundesland"
                      value={formData.shippingBundesland}
                      onChange={handleChange}
                      className="bg-gray-50 text-gray-900 border-0 rounded-md p-2 w-full focus:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary transition ease-in-out duration-150"
                    >
                      <option value="">Bitte wählen</option>
                      {GERMAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* 9. Newsletter */}
              <div className="mb-3 flex items-center">
                <div className="checkbox-wrapper">
                  <input
                    id="newsletter-checkbox"
                    type="checkbox"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleChange}
                  />
                  <label htmlFor="newsletter-checkbox">
                    <div className="tick_mark"></div>
                  </label>
                </div>
                <span className="ml-3 text-sm text-gray-700">
                  Möchten Sie unseren Newsletter erhalten?
                </span>
              </div>

              {/* 10. Datenschutz */}
              <div className="mb-3">
                <div className="flex items-center">
                  <div className="checkbox-wrapper">
                    <input
                      id="datenschutz-checkbox"
                      type="checkbox"
                      name="datenschutz"
                      checked={formData.datenschutz}
                      onChange={handleChange}
                    />
                    <label htmlFor="datenschutz-checkbox">
                      <div className="tick_mark"></div>
                    </label>
                  </div>
                  <span className="ml-3 text-sm text-gray-700">
                    Ich habe die <Link href="/datenschutz" className="text-primary hover:underline">Datenschutzbestimmungen</Link> zur Kenntnis genommen und die <Link href="/agb" className="text-primary hover:underline">AGB</Link> gelesen und bin mit ihnen einverstanden. <span className="text-red-500">*</span>
                  </span>
                </div>
                {fieldErrors.datenschutz && (
                  <p className="text-red-500 text-xs mt-1 ml-9">{fieldErrors.datenschutz}</p>
                )}
              </div>

              <p className="text-xs text-gray-500 mb-3">
                Die mit einem Stern (*) markierten Felder sind Pflichtfelder.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-primary text-white font-semibold py-2 px-4 rounded-md mt-2 hover:bg-primary-dark transition ease-in-out duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Wird registriert...' : 'Weiter'}
              </button>

              <p className="text-gray-600 text-sm mt-4 text-center">
                Bereits ein Konto?{' '}
                <Link href="/anmelden" className="text-primary hover:underline">
                  Jetzt anmelden
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
