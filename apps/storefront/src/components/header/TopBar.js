export default function TopBar() {
  return (
    <div className="bg-gray-100 border-b border-gray-200">
      <div className="container-custom">
        <div className="flex justify-center items-center py-3.5 text-sm">
          <div className="flex gap-10 items-center flex-wrap justify-center">
            <a href="/liquidrechner" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" className="w-4 h-4" fill="#9C2CA8">
                <path d="M384 64L224 64C206.3 64 192 78.3 192 96C192 113.7 206.3 128 224 128L224 279.5L103.5 490.3C98.6 499 96 508.7 96 518.7C96 550.4 121.6 576 153.3 576L486.7 576C518.3 576 544 550.4 544 518.7C544 508.7 541.4 498.9 536.5 490.3L416 279.5L416 128C433.7 128 448 113.7 448 96C448 78.3 433.7 64 416 64L384 64zM288 279.5L288 128L352 128L352 279.5C352 290.6 354.9 301.6 360.4 311.3L402 384L238 384L279.6 311.3C285.1 301.6 288 290.7 288 279.5z"/>
              </svg>
              LIQUIDRECHNER
            </a>
            <a href="/" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" className="w-4 h-4" fill="#9C2CA8">
                <path d="M287.9 0c9.2 0 17.6 5.2 21.6 13.5l68.6 141.3 153.2 22.6c9 1.3 16.5 7.6 19.3 16.3s.5 18.1-5.9 24.5L433.6 328.4l26.2 155.6c1.5 9-2.2 18.1-9.6 23.5s-17.3 6-25.3 1.7l-137-73.2L151 509.1c-8.1 4.3-17.9 3.7-25.3-1.7s-11.2-14.5-9.7-23.5l26.2-155.6L31.1 218.2c-6.5-6.4-8.7-15.9-5.9-24.5s10.3-14.9 19.3-16.3l153.2-22.6L266.3 13.5C270.4 5.2 278.7 0 287.9 0zm0 79L235.4 187.2c-3.5 7.1-10.2 12.1-18.1 13.3L99 217.9 184.9 303c5.5 5.5 8.1 13.3 6.8 21L171.4 443.7l105.2-56.2c7.1-3.8 15.6-3.8 22.6 0l105.2 56.2L401.2 324.1c-1.3-7.7 1.2-15.5 6.8-21L494.9 237.2 360.6 200.5c-7.8-1.1-14.6-6.1-18.1-13.3L287.9 79z"/>
              </svg>
              100 TREUEPUNKTE BEI REGISTRIERUNG
            </a>
            <a href="/" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" className="w-4 h-4" fill="#9C2CA8">
                <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 288V64H576V288H64zM96 400a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm352-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
              </svg>
              GRATIS VERSAND AB 50€
            </a>
            <a href="/" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4" fill="#9C2CA8">
                <path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z"/>
              </svg>
              5% RABATT BEI NEWSLETTERANMELDUNG
            </a>
            <a href="/kontakt" className="hover:text-primary transition-colors flex items-center gap-2 font-bold">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-4 h-4" fill="#9C2CA8">
                <path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/>
              </svg>
              KONTAKT
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

