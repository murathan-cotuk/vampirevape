# Shopify Email Template - Customer Welcome Email

## Düzeltilmiş Template

```liquid
{% capture email_title %}Sehr geehrte/r{% if customer.metafields.custom.anrede %} {{ customer.metafields.custom.anrede }}{% endif %} {{ customer.first_name }} {{ customer.last_name }},{% endcapture %}
{% capture email_body %}<p>vielen Dank für Ihre Anmeldung in unserem Shop.</p>
<p>Sie erhalten Zugriff über Ihre E-Mail-Adresse {{ customer.email }} und dem von Ihnen gewählten Kennwort.</p>
<p>Sie können Ihr Kennwort jederzeit nachträglich ändern.</p>
<p>&nbsp;</p>
<p>Wenn Du ein Konto angelegt hast, kannst Du den aktuellen Status Deiner Bestellung auch jederzeit auf unserer Webseite im Bereich "Mein Konto" - "Meine Bestellungen" abrufen, oder einfach <a href="https://www.vampirevape.de/konto">HIER</a> klicken.</p>
<p>&nbsp;</p>
<p>Für Rückfragen stehen wir Dir jederzeit gerne per E-Mail unter</p>
<p><a href="mailto:info@vampirevape.de">info@vampirevape.de</a></p>
<p>oder per Telefon unter</p>
<p><a href="tel:+4921317399361">02131 7399 361</a></p>
<p>zur Verfügung.</p>
<p>&nbsp;</p>
<p>Freundliche Grüße<br>Dein Vampire Vape Team</p>{% endcapture %}

<!DOCTYPE html>
<html lang="de">
  <head>
    <title>{{ email_title }}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width">
    <link rel="stylesheet" type="text/css" href="/assets/notifications/styles.css">
    <style>
      .button__cell { background: {{ shop.email_accent_color }}; }
      a, a:hover, a:active, a:visited { color: {{ shop.email_accent_color }}; }
      .footer-links { margin: 20px 0; }
      .footer-links a { 
        color: #666; 
        text-decoration: none; 
        margin: 0 10px;
        font-size: 12px;
      }
      .footer-links a:hover { 
        color: {{ shop.email_accent_color }}; 
        text-decoration: underline;
      }
      .footer-info {
        font-size: 11px;
        color: #999;
        line-height: 1.6;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
      }
      .footer-social {
        margin: 15px 0;
      }
      .footer-social a {
        display: inline-block;
        margin: 0 8px;
        color: #666;
        text-decoration: none;
      }
    </style>
  </head>

  <body>
    <table class="body">
      <tr>
        <td>
          <table class="header row">
            <tr>
              <td class="header__cell">
                <center>
                  <table class="container">
                    <tr>
                      <td>
                        <table class="row">
                          <tr>
                            <td class="shop-name__cell">
                              {%- if shop.email_logo_url %}
                                <a href="https://www.vampirevape.de/">
                                  <img src="{{shop.email_logo_url}}" alt="{{ shop.name }}" width="{{ shop.email_logo_width }}">
                                </a>
                              {%- else %}
                                <h1 class="shop-name__text">
                                  <a href="https://www.vampirevape.de/">{{ shop.name }}</a>
                                </h1>
                              {%- endif %}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>

          <table class="row content">
            <tr>
              <td class="content__cell">
                <center>
                  <table class="container">
                    <tr>
                      <td>
                        <h2>{{ email_title }}</h2>
                        <div>{{ email_body }}</div>
                        {% if shop.url %}
                          <table class="row actions">
                            <tr>
                              <td class="actions__cell">
                                <table class="button main-action-cell">
                                  <tr>
                                    <td class="button__cell"><a href="https://www.vampirevape.de/" class="button__text">Zu unserem Shop</a></td>
                                  </tr>
                                </table>
                              </td>
                            </tr>
                          </table>
                        {% endif %}
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>

          <table class="row footer">
            <tr>
              <td class="footer__cell">
                <center>
                  <table class="container">
                    <tr>
                      <td>
                        <div class="footer-links">
                          <a href="https://www.vampirevape.de/">Startseite</a> |
                          <a href="https://www.vampirevape.de/agb">AGB</a> |
                          <a href="https://www.vampirevape.de/datenschutz">Datenschutz</a> |
                          <a href="https://www.vampirevape.de/impressum">Impressum</a> |
                          <a href="https://www.vampirevape.de/widerrufsrecht">Widerrufsrecht</a> |
                          <a href="https://www.vampirevape.de/kontakt">Kontakt</a>
                        </div>
                        
                        <div class="footer-info">
                          <p><strong>Vampire Vape</strong></p>
                          <p>Vape Shop – günstige E-Liquids online bestellen</p>
                          <p>&nbsp;</p>
                          <p><strong>Kontakt:</strong></p>
                          <p>E-Mail: <a href="mailto:info@vampirevape.de">info@vampirevape.de</a></p>
                          <p>Telefon: <a href="tel:+4921317399361">02131 7399 361</a></p>
                          <p>&nbsp;</p>
                          <p><strong>Service:</strong></p>
                          <p>• Gratis Versand ab 50€</p>
                          <p>• 100 Treuepunkte bei Registrierung</p>
                          <p>• 5% Rabatt bei Newsletteranmeldung</p>
                          <p>• Trusted Shop zertifiziert</p>
                          <p>&nbsp;</p>
                          <p style="font-size: 10px; color: #999;">
                            * Alle Preise inkl. gesetzl. Mehrwertsteuer zzgl. Versandkosten und ggf. Nachnahmegebühren, wenn nicht anders angegeben.
                          </p>
                          <p style="font-size: 10px; color: #999;">
                            © {{ "now" | date: "%Y" }} Vampire Vape - Alle Rechte vorbehalten.
                          </p>
                        </div>
                      </td>
                    </tr>
                  </table>
                </center>
              </td>
            </tr>
          </table>

          <img src="{{ 'notifications/spacer.png' | shopify_asset_url }}" class="spacer" height="1" />
        </td>
      </tr>
    </table>
  </body>
</html>
```

## Yapılan Değişiklikler

1. **Logo ve Buton Linkleri:**
   - Logo linki: `https://www.vampirevape.de/`
   - Shop butonu: `https://www.vampirevape.de/`

2. **Footer Eklendi:**
   - Footer linkler (AGB, Datenschutz, Impressum, etc.)
   - İletişim bilgileri
   - Service özellikleri
   - Copyright bilgisi

3. **Email Body Düzenlendi:**
   - HTML paragraf tag'leri düzgün kapatıldı
   - Linkler eklendi (mailto, tel, konto linki)
   - Boşluklar için `&nbsp;` kullanıldı

## Kullanım

1. Shopify Admin → **Settings** → **Notifications**
2. **Customer welcome** email'ini bulun
3. **Edit** butonuna tıklayın
4. Yukarıdaki template'i yapıştırın
5. **Save** edin

## Test

Yeni bir müşteri kaydı oluşturarak email'in doğru şekilde gönderildiğini test edin.
