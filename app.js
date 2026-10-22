const form = document.getElementById('listingForm');
const rows = document.getElementById('listingRows');
const loading = document.getElementById('loading');
const emptyState = document.getElementById('emptyState');
const formStatus = document.getElementById('formStatus');
const voiceStatus = document.getElementById('voiceStatus');
const transcript = document.getElementById('transcript');
const voiceButton = document.getElementById('voiceButton');

async function loadListings() {
  loading.hidden = false;
  try {
    const response = await fetch('/api/listings');
    if (!response.ok) throw new Error('Server returned ' + response.status);
    const listings = await response.json();
    rows.replaceChildren();
    for (const item of listings) {
      const tr = document.createElement('tr');
      const values = [
        item.vegetable,
        '₹' + Number(item.pricePerKg).toLocaleString('en-IN', {maximumFractionDigits: 2}),
        Number(item.quantityKg).toLocaleString('en-IN', {maximumFractionDigits: 2}) + ' kg',
        item.sellerName
      ];
      values.forEach((value, index) => {
        const td = document.createElement('td');
        td.textContent = value;
        if (index === 1) td.className = 'price';
        tr.appendChild(td);
      });
      const statusTd = document.createElement('td');
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = item.available ? 'Available' : 'Unavailable';
      statusTd.appendChild(badge);
      tr.appendChild(statusTd);

      const actionTd = document.createElement('td');
      const del = document.createElement('button');
      del.className = 'delete';
      del.type = 'button';
      del.textContent = 'Delete';
      del.addEventListener('click', () => deleteListing(item.id));
      actionTd.appendChild(del);
      tr.appendChild(actionTd);
      rows.appendChild(tr);
    }
    emptyState.hidden = listings.length > 0;
    loading.hidden = true;
  } catch (error) {
    loading.textContent = 'Could not load listings. Is the Spring Boot server running?';
    console.error(error);
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  formStatus.textContent = 'Saving…';
  const listing = {
    vegetable: document.getElementById('vegetable').value.trim(),
    pricePerKg: Number(document.getElementById('pricePerKg').value),
    quantityKg: Number(document.getElementById('quantityKg').value),
    sellerName: document.getElementById('sellerName').value.trim(),
    available: true
  };
  try {
    const response = await fetch('/api/listings', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(listing)
    });
    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Save failed');
    }
    formStatus.textContent = 'Listing saved successfully.';
    document.getElementById('vegetable').value = '';
    document.getElementById('pricePerKg').value = '';
    document.getElementById('quantityKg').value = '';
    await loadListings();
  } catch (error) {
    formStatus.textContent = 'Could not save listing. Check that the backend is running.';
    console.error(error);
  }
});

async function deleteListing(id) {
  if (!confirm('Delete this listing?')) return;
  try {
    const response = await fetch('/api/listings/' + id, {method: 'DELETE'});
    if (!response.ok) throw new Error('Delete failed');
    await loadListings();
  } catch (error) {
    alert('Could not delete listing.');
    console.error(error);
  }
}

document.getElementById('refreshButton').addEventListener('click', loadListings);

// Voice recognition is browser-provided; this project does not send audio to an AI service.
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
if (!SpeechRecognition) {
  voiceButton.disabled = true;
  voiceButton.textContent = 'Voice input not supported';
  voiceStatus.textContent = 'Your browser does not expose Web Speech recognition. Try current Chrome or Edge, or enter details manually.';
} else {
  recognition = new SpeechRecognition();
  recognition.lang = 'en-IN';
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.onstart = () => {
    voiceButton.textContent = 'Listening…';
    voiceStatus.textContent = 'Speak now. Example: Tomato, price 40 rupees, quantity 5 kg.';
  };
  recognition.onresult = (event) => {
    transcript.value = event.results[0][0].transcript;
    voiceStatus.textContent = 'Speech captured. Click “Parse transcript into form”, review the fields, then confirm by saving.';
    parseTranscript();
  };
  recognition.onerror = (event) => {
    voiceStatus.textContent = 'Voice error: ' + event.error + '. Check microphone permission or use manual entry.';
  };
  recognition.onend = () => { voiceButton.textContent = 'Start voice input'; };
}
voiceButton.addEventListener('click', () => {
  if (!recognition) return;
  try { recognition.start(); }
  catch (error) { voiceStatus.textContent = 'Voice input is already starting. Please wait a moment.'; }
});

function parseTranscript() {
  const text = transcript.value.trim();
  if (!text) {
    voiceStatus.textContent = 'Say something first or type a transcript.';
    return;
  }
  // Basic rule-based parser, not a generative AI model. Always review before saving.
  const priceMatch = text.match(/(?:price(?:\s+is)?|at|rupees?|rs\.?|₹)\s*(\d+(?:\.\d+)?)/i)
    || text.match(/(\d+(?:\.\d+)?)\s*(?:rupees?|rs\.?|₹)(?!\w)/i);
  const quantityMatch = text.match(/(?:quantity|qty|stock|have)\s*(?:is|of)?\s*(\d+(?:\.\d+)?)\s*(?:kg|kilo(?:grams?)?)?/i)
    || text.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilos?|kilograms?)/i);
  const vegetableCandidates = [
    'tomato','tomatoes','potato','potatoes','onion','onions','carrot','carrots','beans','cabbage',
    'cauliflower','brinjal','eggplant','okra','ladies finger','spinach','cucumber','capsicum','chilli',
    'chillies','peas','garlic','ginger','pumpkin','radish','beetroot','coriander'
  ];
  const lower = text.toLowerCase();
  const found = vegetableCandidates.find(name => new RegExp('\\b' + name.replace(' ', '\\s+') + '\\b', 'i').test(lower));
  if (found) {
    const displayNames = {tomatoes:'Tomato',potatoes:'Potato',onions:'Onion',carrots:'Carrot',eggplant:'Brinjal',okra:'Okra','ladies finger':"Ladies' Finger",chillies:'Chilli'};
    document.getElementById('vegetable').value = displayNames[found] || found.replace(/\b\w/g, c => c.toUpperCase());
  } else {
    // Fallback: take the leading words before a price/quantity marker, but flag it for review.
    const guess = text.split(/,|\bprice\b|\bquantity\b|\bqty\b|\bstock\b|\brupees?\b|\bkg\b/i)[0].trim();
    if (guess) document.getElementById('vegetable').value = guess.replace(/[.!?]+$/, '');
  }
  if (priceMatch) document.getElementById('pricePerKg').value = priceMatch[1] || priceMatch[0];
  if (quantityMatch) document.getElementById('quantityKg').value = quantityMatch[1] || quantityMatch[0];
  const missing = [];
  if (!document.getElementById('vegetable').value) missing.push('vegetable');
  if (!priceMatch) missing.push('price');
  if (!quantityMatch) missing.push('quantity');
  voiceStatus.textContent = missing.length
    ? 'Parsed what was possible. Please fill/check: ' + missing.join(', ') + '. Nothing has been saved.'
    : 'Parsed fields are ready for review. Nothing has been saved yet.';
}
document.getElementById('parseButton').addEventListener('click', parseTranscript);

loadListings();
