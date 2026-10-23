# VegMap AI Seller Security — beginner guide

## Do not overwrite your old project
1. Download and extract this ZIP to a new folder named `VegMap_AI_Seller_Security`.
2. Install Java 17+ and Maven.
3. Open that new folder in VS Code.
4. Open Terminal → New Terminal and run `mvn spring-boot:run`.
5. Visit `http://localhost:8080`, then click Seller login / verification.

## Voice and location features
- Choose English, Kannada, Malayalam, Hindi, or experimental Tulu from the seller page.
- Microphone buttons dictate name, phone and village/market into text fields. Review dictated text before submitting.
- The browser's speech recognition and installed spoken voices determine which languages actually work. Tulu support is not guaranteed; manual typing is always available.
- Passwords are deliberately manual. GPS is requested only after the seller taps the location button. If GPS is denied, the seller can enter map coordinates manually; those coordinates are not GPS-verified.

## Demo verification flow
1. Register with a test phone number, seller name, village/market and password (8+ characters).
2. Click Generate demo OTP. It is shown on screen because no SMS provider is connected.
3. Enter the OTP and verify.
4. Tap Use my device location and allow permission, or expand the manual coordinates option, then submit the declared location.
5. The seller remains pending until admin review.
6. In the Demo Admin Panel, load applications and approve the phone-verified seller.
7. Approved sellers can publish through the API only with their login token. Delete endpoint checks listing ownership.

## Honest limitations — do not deploy publicly as-is
- OTP is displayed in the response, not sent by SMS. Production needs a real SMS/OTP provider, attempt limits, resend cooldown, rate limiting and monitoring.
- Admin review endpoints are open for local judging and have NO admin login. Add admin authentication and role authorization before hosting publicly.
- Accounts, OTPs, sessions and listings are stored in memory and reset on server restart.
- GPS coordinates can be spoofed; they do not prove farm/shop ownership. Admin must independently verify evidence/location.
- CSRF is disabled and API authorization is prototype-level. Production needs HTTPS, secure session handling, CSRF/CORS hardening, database persistence, validation and logging.
- Passwords are BCrypt-hashed. Do not use real personal data in this demo.
- The seller registration/login page is a prototype workflow; the existing buyer site is read-only. Listing creation is available through the protected API after approval.
