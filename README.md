# VegMap AI — TerraTech (Dev Hack 2026, AgriTech)

A beginner-friendly prototype for listing vegetables and letting nearby buyers view prices and availability.

## Included in this ZIP
- Java 17 + Spring Boot REST backend
- H2 in-memory database (data resets when the app stops)
- Plain HTML/CSS/JavaScript frontend
- Seller listing form and buyer listing table
- Voice input using the browser Web Speech API, where supported
- Voice parser for English-style commands such as: "Tomatoes, price 40 rupees, quantity 5 kg"
- Confirmation step before a voice-filled listing is saved

## Important limitations
- This is a prototype, not a production marketplace.
- Browser speech recognition availability varies. Chrome/Edge are the best first choices; some browsers may require internet access for recognition.
- Kannada voice recognition is **not claimed as implemented or tested**. The code requests English (`en-IN`) for now. Kannada can be added and tested later by changing the language and validating real examples.
- Nearby search, seller authentication, image uploads, deployment, and real-time stock synchronization are not included.
- H2 is in-memory: listings disappear when the backend restarts.

## Requirements
1. Install JDK 17 or newer.
2. Install Maven 3.9+ (or use an IDE with Maven support).
3. Install VS Code and the Extension Pack for Java (recommended).
4. Use Microsoft Edge or Google Chrome.

Check installations in Command Prompt:
```bat
java -version
mvn -version
```

## Run on Windows
1. Extract the ZIP.
2. Open the extracted `VegMap_AI` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:
   ```bat
   mvn spring-boot:run
   ```
5. Wait until the terminal says the application has started.
6. Open this address in Edge or Chrome:
   http://localhost:8080

If `mvn` is not recognized, Maven is not installed or its `bin` directory is not on PATH. Install Maven or use the Maven wrapper if one is added to this project later.

## Step-by-step test
### Test 1 — page loads
Open `http://localhost:8080`. You should see VegMap AI and a listing form.

### Test 2 — create a listing manually
Enter:
- Vegetable: Tomato
- Price (₹ per kg): 40
- Quantity (kg): 5
- Seller/stall: Green Fresh Stall
Click **Save listing**. The listing should appear in the table.

### Test 3 — API health
Open `http://localhost:8080/api/listings` in your browser. It should return JSON.

### Test 4 — voice flow (only if supported by your browser)
1. Click **Start voice input** and allow microphone access.
2. Say a simple phrase like: "Tomato, price 40 rupees, quantity 5 kg".
3. Check the transcript and parsed fields.
4. Review or correct the fields.
5. Click **Confirm and save voice listing**. Nothing is saved until you confirm.

Voice recognition/parser are convenience features, not guaranteed to understand every accent or phrasing. If voice recognition is unavailable, manual listing still works.

## API endpoints
- `GET /api/listings` — list all listings
- `POST /api/listings` — create a listing
- `DELETE /api/listings/{id}` — delete a listing

## Troubleshooting
- Port 8080 already in use: stop the other application or change `server.port` in `src/main/resources/application.properties`.
- Java/Maven missing: install a JDK and Maven, then close and reopen VS Code.
- Voice button unsupported: use Edge/Chrome and verify microphone permission. Manual entry remains available.
- Backend fails to start: confirm `java -version` is 17+ and `mvn -version` works.

## AgriTech framing
VegMap AI supports local food supply access by helping buyers compare listed vegetable prices and quantities before visiting sellers. It can reduce wasted trips and improve price visibility for local stalls.
