/* ============ STATE ============ */
let cameraStream = null;
let cameraReady = false;
let facingMode = 'user';
let photoCount = 4;
let selectedBgTemplate = 'neon-lime';
let selectedScreenTemplate = 'minimal-dark';
let selectedFilter = 'original';
let soundEnabled = true;
let isCapturing = false;
let capturedPhotos = [];
let currentPhoto = 0;
let galleryData = [];
let lightboxId = null;
let characterImages = {};

/* ============ PHOTO STRIP TEMPLATES ============ */
const bgTemplates = [
  { id:'classic-white', name:'Classic White', cat:'Default', bg:'#ffffff', accent:'#000000', text:'#000000', deco:'none', header:'PHOTOBOOTH', footer:'2026' },
  { id:'minimal-black', name:'Minimal Black', cat:'Default', bg:'#1a1a1a', accent:'#ffffff', text:'#ffffff', deco:'none', header:'PHOTOBOOTH', footer:'2026' },
  { id:'elegant-gold', name:'Elegant Gold', cat:'Default', bg:'#1a1a1a', accent:'#d4af37', text:'#d4af37', deco:'none', header:'PHOTOBOOTH', footer:'2026' },
  { id:'neon-lime', name:'Neon Lime', cat:'Default', bg:'#1a1a1a', accent:'#C8FF00', text:'#C8FF00', deco:'none', header:'PHOTOBOOTH', footer:'2026' },
  { id:'y2k-pink', name:'Y2K Pink', cat:'Aesthetic', bg:'#FF69B4', accent:'#ffffff', text:'#ffffff', deco:'stars', header:'PHOTOBOOTH', footer:'2026' },
  { id:'film-vintage', name:'Film Vintage', cat:'Aesthetic', bg:'#F5F0E1', accent:'#3E2723', text:'#3E2723', deco:'filmstrip', header:'PHOTOBOOTH', footer:'2026' },
  { id:'polaroid', name:'Polaroid Classic', cat:'Aesthetic', bg:'#ffffff', accent:'#333333', text:'#333333', deco:'polaroid', header:'PHOTOBOOTH', footer:'2026' },
  { id:'neon-dark', name:'Neon Dark', cat:'Aesthetic', bg:'#0A0A0A', accent:'#00f0ff', text:'#00f0ff', deco:'neon', header:'PHOTOBOOTH', footer:'2026' },
  { id:'pastel-dream', name:'Pastel Dream', cat:'Aesthetic', bg:'#E8D5F5', accent:'#9C27B0', text:'#7B1FA2', deco:'clouds', header:'PHOTOBOOTH', footer:'2026' },
  { id:'retro-sunset', name:'Retro Sunset', cat:'Aesthetic', bg:'#FF6B35', accent:'#ffffff', text:'#ffffff', deco:'mountains', header:'PHOTOBOOTH', footer:'2026' },
  { id:'grid-minimal', name:'Grid Minimal', cat:'Aesthetic', bg:'#FAFAFA', accent:'#333333', text:'#333333', deco:'grid', header:'PHOTOBOOTH', footer:'2026' },
  { id:'glitch-art', name:'Glitch Art', cat:'Aesthetic', bg:'#000000', accent:'#ff0040', text:'#00ff88', deco:'glitch', header:'PHOTOBOOTH', footer:'2026' },
  { id:'toy-story', name:'Toy Story', cat:'Franchise', bg:'#87CEEB', accent:'#FFD54F', text:'#C62828', deco:'toy-story', header:'TOY STORY', subheader:"ANDY'S CREW", footer:'FRIENDS FOREVER', characters:['assets/templates/toy-story/t 1.png','assets/templates/toy-story/t 2.png'] },
  { id:'one-piece', name:'One Piece', cat:'Franchise', bg:'#1A0A00', accent:'#FFD700', text:'#FFD700', deco:'one-piece', header:'ONE PIECE', subheader:'WANTED', footer:'THE GRAND ADVENTURE', characters:['assets/templates/one-piece/on 1.png','assets/templates/one-piece/on 2.png'] },
  { id:'naruto', name:'Naruto Shippuden', cat:'Franchise', bg:'#FF8C00', accent:'#1A237E', text:'#ffffff', deco:'naruto', header:'NARUTO SHIPPUDEN', subheader:'KONOHA', footer:'SHINOBI MEMORIES', characters:['assets/templates/naruto/Naruto 1.png','assets/templates/naruto/n 2.png'] },
  { id:'demon-slayer', name:'Demon Slayer', cat:'Franchise', bg:'#1A0A2E', accent:'#00E676', text:'#ffffff', deco:'demon-slayer', header:'DEMON SLAYER', subheader:'KIMETSU NO YAIBA', footer:'CORPS PHOTO', characters:['assets/templates/demon-slayer/d 1.png','assets/templates/demon-slayer/d 2.png'] },
  { id:'black-clover', name:'Black Clover', cat:'Franchise', bg:'#0D0D2B', accent:'#FFD700', text:'#E0E0FF', deco:'black-clover', header:'BLACK CLOVER', subheader:'MAGIC KNIGHTS', footer:'GRIMOIRE PHOTO', characters:['assets/templates/black-clover/b 1.png','assets/templates/black-clover/b 2.png'] },
];

/* ============ SCREEN TEMPLATES ============ */
const screenTemplates = [
  { id:'minimal-dark', name:'Minimal Dark', bg:'linear-gradient(180deg,#0a0a0a,#111)', card:'rgba(20,20,20,0.8)', accent:'#C8FF00', text:'#ffffff' },
  { id:'y2k-chrome', name:'Y2K Chrome', bg:'linear-gradient(180deg,#C0C0C0,#E8E8E8,#A0A0A0)', card:'rgba(0,0,0,0.15)', accent:'#7B1FA2', text:'#1a1a1a' },
  { id:'kawaii-pastel', name:'Kawaii Pastel', bg:'linear-gradient(180deg,#FFE5EC,#E8D5F5,#D5F5E3)', card:'rgba(255,255,255,0.7)', accent:'#FF69B4', text:'#333' },
  { id:'magazine', name:'Magazine Editorial', bg:'linear-gradient(180deg,#ffffff,#f5f5f5)', card:'rgba(0,0,0,0.05)', accent:'#E63946', text:'#000' },
  { id:'retro-terminal', name:'Retro Terminal', bg:'linear-gradient(180deg,#0D0208,#0a1a0a)', card:'rgba(0,255,65,0.08)', accent:'#00FF41', text:'#00FF41' },
  { id:'gradient-mesh', name:'Gradient Mesh', bg:'linear-gradient(135deg,#667EEA,#764BA2,#F093FB,#F5576C)', card:'rgba(255,255,255,0.1)', accent:'#ffffff', text:'#ffffff' },
  { id:'screen-toy-story', name:'Toy Story', bg:'linear-gradient(180deg,#87CEEB,#B3E5FC,#E3F2FD)', card:'rgba(255,255,255,0.25)', accent:'#FFD54F', text:'#C62828' },
  { id:'screen-one-piece', name:'One Piece', bg:'linear-gradient(180deg,#1A0A00,#3E1A00,#5D2A00)', card:'rgba(255,215,0,0.12)', accent:'#FFD700', text:'#FFD700' },
  { id:'screen-naruto', name:'Naruto Shippuden', bg:'linear-gradient(180deg,#FF8C00,#E65100,#BF360C)', card:'rgba(255,255,255,0.12)', accent:'#1A237E', text:'#ffffff' },
  { id:'screen-demon-slayer', name:'Demon Slayer', bg:'linear-gradient(180deg,#1A0A2E,#2D1B4E,#3D1A5E)', card:'rgba(0,230,118,0.08)', accent:'#00E676', text:'#ffffff' },
  { id:'screen-black-clover', name:'Black Clover', bg:'linear-gradient(180deg,#0D0D2B,#1A1A4E,#2E1065)', card:'rgba(255,215,0,0.08)', accent:'#FFD700', text:'#E0E0FF' },
];

/* ============ FILTERS ============ */
const filters = {
  original:'none', bw:'grayscale(100%)',
  vintage:'sepia(50%) contrast(110%) brightness(90%)',
  warm:'sepia(30%) saturate(140%) brightness(100%)',
  cool:'saturate(80%) hue-rotate(20deg) brightness(105%)',
  sepia:'sepia(100%)', contrast:'contrast(150%) saturate(120%)',
  dramatic:'contrast(130%) brightness(90%) saturate(80%)',
};

/* ============ PAGE NAVIGATION ============ */
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  window.scrollTo(0, 0);
  if (page === 'templates') renderTemplates();
  if (page === 'gallery') renderGallery();
  if (page === 'photobooth') { buildFranchiseCards(); updateCameraOverlay(); }
}

/* ============ SCREEN TEMPLATE ============ */
function applyScreenTemplate(id) {
  selectedScreenTemplate = id;
  const tpl = screenTemplates.find(t => t.id === id) || screenTemplates[0];
  document.documentElement.style.setProperty('--screen-bg', tpl.bg);
  document.documentElement.style.setProperty('--screen-card', tpl.card);
  document.documentElement.style.setProperty('--screen-accent', tpl.accent);
  document.documentElement.style.setProperty('--screen-text', tpl.text);
  localStorage.setItem('photobooth-screen-template', id);
}

function selectScreenTemplate(id) {
  applyScreenTemplate(id);
}

/* ============ CAMERA ============ */
async function startCamera() {
  try {
    if (cameraStream) cameraStream.getTracks().forEach(t => t.stop());
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode, width: { ideal: 1280 }, height: { ideal: 960 } }, audio: false
    });
    cameraStream = stream;
    const video = document.getElementById('camera-video');
    video.srcObject = stream;
    video.style.transform = facingMode === 'user' ? 'scaleX(-1)' : 'none';
    await video.play();
    cameraReady = true;
    document.getElementById('camera-error').style.display = 'none';
    document.getElementById('camera-badge').style.display = 'flex';
    document.getElementById('btn-flip').style.display = 'flex';
    const btn = document.getElementById('btn-start');
    btn.disabled = false; btn.textContent = 'START';
  } catch (err) {
    cameraReady = false;
    document.getElementById('camera-error').style.display = 'flex';
    document.getElementById('camera-badge').style.display = 'none';
    document.getElementById('btn-flip').style.display = 'none';
    const btn = document.getElementById('btn-start');
    btn.disabled = true; btn.textContent = 'LOADING CAMERA...';
    const msg = err.name === 'NotAllowedError' ? 'Camera permission denied.'
      : err.name === 'NotFoundError' ? 'Camera not found.' : 'Failed to access camera.';
    document.getElementById('camera-error-msg').textContent = msg;
  }
}

function flipCamera() { facingMode = facingMode === 'user' ? 'environment' : 'user'; startCamera(); }

/* ============ CONTROLS ============ */
function setPhotoCount(count) {
  photoCount = count;
  document.querySelectorAll('.seg-btn').forEach(b => b.classList.toggle('active', parseInt(b.dataset.count) === count));
}

function selectBgTemplate(id) {
  selectedBgTemplate = id;
  localStorage.setItem('photobooth-bg-template', id);
  const sel = document.getElementById('select-bg-template');
  if (sel) sel.value = id;
  updateCameraOverlay();
  updateFranchiseCards();
}

function updateFranchiseCards() {
  document.querySelectorAll('.franchise-card').forEach(c => {
    c.classList.toggle('active', c.dataset.id === selectedBgTemplate);
  });
}

function updateCameraOverlay() {
  const tpl = bgTemplates.find(t => t.id === selectedBgTemplate);
  const container = document.getElementById('camera-characters');
  const topImg = document.getElementById('cam-char-top');
  const bottomImg = document.getElementById('cam-char-bottom');
  if (!tpl || !tpl.characters || !characterImages[tpl.id] || characterImages[tpl.id].length === 0) {
    container.classList.add('hidden');
    topImg.src = '';
    bottomImg.src = '';
    return;
  }
  container.classList.remove('hidden');
  const chars = characterImages[tpl.id];
  if (chars[0]) topImg.src = chars[0].src;
  else topImg.src = '';
  if (chars[1]) bottomImg.src = chars[1].src;
  else bottomImg.src = '';
}

function buildFranchiseCards() {
  const container = document.getElementById('franchise-cards');
  if (!container) return;
  container.innerHTML = '';
  const franchiseTemplates = bgTemplates.filter(t => t.cat === 'Franchise');
  franchiseTemplates.forEach(tpl => {
    const card = document.createElement('div');
    card.className = 'franchise-card' + (tpl.id === selectedBgTemplate ? ' active' : '');
    card.dataset.id = tpl.id;
    card.onclick = () => { selectBgTemplate(tpl.id); };
    const imgSrc = tpl.characters && tpl.characters[0] ? tpl.characters[0] : '';
    card.innerHTML = `<img src="${imgSrc}" alt="${tpl.name}" onerror="this.style.background='${tpl.accent}';this.style.opacity='0.5'"><span>${tpl.name}</span>`;
    container.appendChild(card);
  });
}
function selectFilter(id) { selectedFilter = id; }

function toggleSound() {
  soundEnabled = !soundEnabled;
  document.getElementById('icon-sound').innerHTML = soundEnabled
    ? '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>'
    : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>';
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function playBeep(freq, vol) {
  if (!soundEnabled) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = freq; osc.type = 'sine';
    gain.gain.setValueAtTime(vol || 0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15);
  } catch(e) {}
}

/* ============ CAPTURE ============ */
function capturePhoto() {
  const video = document.getElementById('camera-video');
  const canvas = document.getElementById('capture-canvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (facingMode === 'user') { ctx.translate(canvas.width, 0); ctx.scale(-1, 1); }
  ctx.filter = filters[selectedFilter] || 'none';
  ctx.drawImage(video, 0, 0);
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  return dataUrl;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

/* ============ SESSION ============ */
async function startSession() {
  if (!cameraReady || isCapturing) return;
  isCapturing = true;
  capturedPhotos = [];
  currentPhoto = 0;
  const btn = document.getElementById('btn-start');
  btn.textContent = 'CAPTURING...'; btn.disabled = true;
  document.getElementById('camera-progress').style.display = 'block';

  const dotsEl = document.getElementById('progress-dots');
  dotsEl.innerHTML = '';
  for (let i = 0; i < photoCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'progress-dot';
    dotsEl.appendChild(dot);
  }

  for (let i = 0; i < photoCount; i++) {
    currentPhoto = i + 1;
    document.getElementById('progress-current').textContent = currentPhoto;
    document.getElementById('progress-total').textContent = photoCount;
    dotsEl.querySelectorAll('.progress-dot').forEach((d, idx) => d.classList.toggle('active', idx < currentPhoto));

    for (let c = 3; c >= 1; c--) {
      showCountdown(c); playBeep(600, 0.2); await sleep(1000);
    }
    showCountdown('SMILE!'); await sleep(500); hideCountdown();

    const photo = capturePhoto();
    capturedPhotos.push(photo);
    playBeep(800, 0.3);

    const flash = document.getElementById('flash-overlay');
    flash.classList.add('active');
    setTimeout(() => flash.classList.remove('active'), 300);

    if (i < photoCount - 1) await sleep(1500);
  }

  hideCountdown();
  document.getElementById('camera-progress').style.display = 'none';
  isCapturing = false;

  await generatePhotostrip();
  showPage('result');
  saveToGallery();
  resetSession();
}

function showCountdown(val) {
  document.getElementById('countdown-overlay').style.display = 'flex';
  document.getElementById('countdown-number').textContent = val;
}
function hideCountdown() { document.getElementById('countdown-overlay').style.display = 'none'; }

function resetSession() {
  capturedPhotos = []; currentPhoto = 0;
  const btn = document.getElementById('btn-start');
  btn.textContent = 'START'; btn.disabled = false;
}

/* ============ PHOTOSTRIP GENERATION ============ */
function drawDecorations(ctx, tpl, sw, sh) {
  const deco = tpl.deco;
  ctx.save();

  if (deco === 'toy-story') {
    const grad = ctx.createLinearGradient(0, 0, 0, sh);
    grad.addColorStop(0, '#87CEEB'); grad.addColorStop(0.4, '#B3E5FC');
    grad.addColorStop(0.75, '#E8F5E9'); grad.addColorStop(1, '#A5D6A7');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, sw, sh);
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    drawCloud(ctx, sw * 0.15, 18, 14); drawCloud(ctx, sw * 0.7, 12, 11);
    drawCloud(ctx, sw * 0.85, 28, 13);
    drawWoodPlanks(ctx, 0, sh - 60, sw, 60);
    drawRope(ctx, 6, 4, 6, sh - 60, '#8B4513');
    drawRope(ctx, sw - 6, 4, sw - 6, sh - 60, '#8B4513');
    ctx.fillStyle = tpl.accent;
    drawSheriffStar(ctx, 16, 14, 9, 5); drawSheriffStar(ctx, sw - 16, 14, 9, 5);
    drawSheriffStar(ctx, 16, sh - 74, 7, 5); drawSheriffStar(ctx, sw - 16, sh - 74, 7, 5);
    ctx.font = 'bold 9px sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = '#E53935'; ctx.fillRect(sw - 38, sh * 0.2, 15, 15);
    ctx.fillStyle = '#fff'; ctx.fillText('A', sw - 30, sh * 0.2 + 11);
    ctx.fillStyle = '#1E88E5'; ctx.fillRect(sw - 38, sh * 0.2 + 19, 15, 15);
    ctx.fillStyle = '#fff'; ctx.fillText('B', sw - 30, sh * 0.2 + 30);
    ctx.fillStyle = '#43A047'; ctx.fillRect(sw - 38, sh * 0.2 + 38, 15, 15);
    ctx.fillStyle = '#fff'; ctx.fillText('C', sw - 30, sh * 0.2 + 49);
    ctx.fillStyle = tpl.accent; ctx.globalAlpha = 0.3;
    for (let i = 0; i < 6; i++) drawSheriffStar(ctx, 10 + Math.random() * (sw - 20), 5 + Math.random() * 20, 2 + Math.random() * 3, 5);
    ctx.globalAlpha = 1; ctx.fillStyle = '#C62828'; ctx.fillRect(0, 0, sw, 3);

  } else if (deco === 'one-piece') {
    drawWoodPlanks(ctx, 0, 0, sw, sh);
    ctx.fillStyle = 'rgba(26,10,0,0.65)'; ctx.fillRect(0, 0, sw, sh);
    ctx.strokeStyle = 'rgba(30,100,200,0.25)'; ctx.lineWidth = 2;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath(); const wy = sh - 55 + i * 12;
      for (let wx = 0; wx <= sw; wx += 3) ctx.lineTo(wx, wy + Math.sin(wx * 0.06 + i * 2) * 5);
      ctx.stroke();
    }
    drawRope(ctx, 5, 3, 5, sh - 60, '#D4A04A');
    drawRope(ctx, sw - 5, 3, sw - 5, sh - 60, '#D4A04A');
    drawRope(ctx, 5, 3, sw - 5, 3, '#D4A04A');
    ctx.fillStyle = tpl.accent; ctx.globalAlpha = 0.15;
    drawCrossBone(ctx, sw / 2, sh * 0.1, 22);
    ctx.font = 'bold 28px serif'; ctx.textAlign = 'center';
    ctx.fillText('\u2620', sw / 2, sh * 0.12); ctx.globalAlpha = 1;
    ctx.fillStyle = tpl.accent; ctx.globalAlpha = 0.2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath(); ctx.arc(10 + Math.random() * (sw - 20), 5 + Math.random() * 15, 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = 1; ctx.globalAlpha = 0.35;
    const compassX = sw - 25, compassY = 18;
    ctx.beginPath(); ctx.arc(compassX, compassY, 10, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(compassX, compassY - 10); ctx.lineTo(compassX, compassY + 10); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(compassX - 10, compassY); ctx.lineTo(compassX + 10, compassY); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#8B0000'; ctx.beginPath(); ctx.arc(sw / 2, sh - 68, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 10px serif'; ctx.textAlign = 'center'; ctx.fillText('W', sw / 2, sh - 64);

  } else if (deco === 'naruto') {
    const grad = ctx.createLinearGradient(0, 0, sw, sh);
    grad.addColorStop(0, '#FF8C00'); grad.addColorStop(0.5, '#E65100'); grad.addColorStop(1, '#BF360C');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, sw, sh);
    ctx.strokeStyle = 'rgba(26,35,126,0.2)'; ctx.lineWidth = 1;
    for (let py = 0; py < sh; py += 20) for (let px = 0; px < sw; px += 20) {
      ctx.beginPath(); ctx.moveTo(px + 10, py); ctx.lineTo(px + 20, py + 10);
      ctx.lineTo(px + 10, py + 20); ctx.lineTo(px, py + 10); ctx.closePath(); ctx.stroke();
    }
    ctx.fillStyle = 'rgba(26,35,126,0.12)'; ctx.font = 'bold 40px serif'; ctx.textAlign = 'center';
    ctx.fillText('\u6728', sw / 2, sh * 0.12);
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    drawKunai(ctx, sw * 0.1, sh * 0.3, 14); drawKunai(ctx, sw * 0.88, sh * 0.25, 12);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    drawShuriken(ctx, sw * 0.15, sh * 0.5, 10); drawShuriken(ctx, sw * 0.85, sh * 0.45, 8);
    ctx.fillStyle = 'rgba(100,200,80,0.15)';
    for (let i = 0; i < 5; i++) drawLeaf(ctx, 10 + Math.random() * (sw - 20), 10 + Math.random() * (sh - 20), 5 + Math.random() * 5);
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = 3; ctx.globalAlpha = 0.4; ctx.strokeRect(4, 4, sw - 8, sh - 8); ctx.globalAlpha = 1;

  } else if (deco === 'demon-slayer') {
    const grad = ctx.createLinearGradient(0, 0, 0, sh);
    grad.addColorStop(0, '#1A0A2E'); grad.addColorStop(0.5, '#2D1B4E'); grad.addColorStop(1, '#0D0D2B');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, sw, sh);
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      ctx.beginPath(); const wy = sh - 65 + i * 10;
      for (let wx = 0; wx <= sw; wx += 2) ctx.lineTo(wx, wy + Math.sin(wx * 0.08 + i * 1.5) * (4 + i * 1.5));
      ctx.stroke();
    }
    ctx.fillStyle = 'rgba(180,100,220,0.2)';
    drawWisteria(ctx, sw * 0.12, 8, 16); drawWisteria(ctx, sw * 0.5, 5, 14); drawWisteria(ctx, sw * 0.88, 10, 16);
    ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.beginPath(); ctx.arc(sw * 0.85, sh * 0.08, 12, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#1A0A2E'; ctx.beginPath(); ctx.arc(sw * 0.85 + 4, sh * 0.08 - 3, 10, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.2;
    ctx.beginPath(); ctx.moveTo(0, sh * 0.3); ctx.lineTo(sw, sh * 0.1); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, sh * 0.32); ctx.lineTo(sw, sh * 0.12); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = 'rgba(0,230,118,0.1)';
    for (let i = 0; i < 4; i++) drawFlame(ctx, sw * 0.15 + i * (sw * 0.23), sh - 68, 8 + Math.random() * 6);
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = 1; ctx.globalAlpha = 0.15; ctx.strokeRect(8, 8, sw - 16, sh - 16); ctx.globalAlpha = 1;

  } else if (deco === 'black-clover') {
    const grad = ctx.createLinearGradient(0, 0, sw, sh);
    grad.addColorStop(0, '#0D0D2B'); grad.addColorStop(0.5, '#1A1A4E'); grad.addColorStop(1, '#2E1065');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, sw, sh);
    ctx.strokeStyle = tpl.accent; drawMagicCircle(ctx, sw / 2, sh * 0.45, 45);
    ctx.fillStyle = tpl.accent; ctx.globalAlpha = 0.12;
    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      ctx.beginPath(); ctx.arc(sw / 2 + Math.cos(angle) * 18, sh * 0.45 + Math.sin(angle) * 18, 8, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1; ctx.globalAlpha = 0.25;
    for (let i = 0; i < 12; i++) drawStar(ctx, Math.random() * sw, Math.random() * sh, 1 + Math.random() * 3);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = 'rgba(255,215,0,0.12)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(sw * 0.1, 5); ctx.lineTo(sw * 0.12, 18); ctx.lineTo(sw * 0.08, 22); ctx.lineTo(sw * 0.14, 40); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(sw * 0.88, 8); ctx.lineTo(sw * 0.9, 20); ctx.lineTo(sw * 0.86, 25); ctx.lineTo(sw * 0.92, 42); ctx.stroke();
    ctx.strokeStyle = tpl.accent; ctx.lineWidth = 2; ctx.globalAlpha = 0.2;
    ctx.shadowColor = tpl.accent; ctx.shadowBlur = 10; ctx.strokeRect(4, 4, sw - 8, sh - 8);
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;

  } else if (deco === 'stars') {
    ctx.fillStyle = tpl.accent;
    for (let i = 0; i < 15; i++) { ctx.globalAlpha = 0.3 + Math.random() * 0.4; drawStar(ctx, Math.random() * sw, Math.random() * sh, Math.random() * 4 + 2); }
  } else if (deco === 'filmstrip') {
    ctx.fillStyle = tpl.accent;
    for (let y = 0; y < sh; y += 30) { ctx.fillRect(5, y, 8, 12); ctx.fillRect(sw - 13, y, 8, 12); }
  } else if (deco === 'neon') {
    ctx.shadowColor = tpl.accent; ctx.shadowBlur = 15; ctx.strokeStyle = tpl.accent; ctx.lineWidth = 2;
    ctx.strokeRect(6, 6, sw - 12, sh - 12); ctx.shadowBlur = 0;
  } else if (deco === 'clouds') {
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    for (let i = 0; i < 5; i++) drawCloud(ctx, Math.random() * sw, Math.random() * sh, 20 + Math.random() * 20);
  } else if (deco === 'mountains') {
    ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.beginPath(); ctx.moveTo(0, sh);
    ctx.lineTo(sw * 0.2, sh - 60); ctx.lineTo(sw * 0.4, sh - 30); ctx.lineTo(sw * 0.6, sh - 70);
    ctx.lineTo(sw * 0.8, sh - 40); ctx.lineTo(sw, sh - 55); ctx.lineTo(sw, sh); ctx.closePath(); ctx.fill();
  } else if (deco === 'grid') {
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1;
    for (let x = 0; x < sw; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, sh); ctx.stroke(); }
    for (let y = 0; y < sh; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(sw, y); ctx.stroke(); }
  } else if (deco === 'glitch') {
    ctx.fillStyle = 'rgba(255,0,64,0.08)';
    for (let i = 0; i < 8; i++) ctx.fillRect(0, Math.random() * sh, sw, 2 + Math.random() * 4);
  }
  ctx.restore();
}

function drawStar(ctx, cx, cy, r) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const x = cx + r * Math.cos(a);
    const y = cy + r * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill();
}

function drawCloud(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.6, 0, Math.PI * 2);
  ctx.arc(cx - r * 0.5, cy + r * 0.1, r * 0.45, 0, Math.PI * 2);
  ctx.arc(cx + r * 0.5, cy + r * 0.1, r * 0.45, 0, Math.PI * 2);
  ctx.fill();
}

function drawFlame(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.moveTo(cx, cy + r);
  ctx.quadraticCurveTo(cx - r * 0.6, cy, cx, cy - r);
  ctx.quadraticCurveTo(cx + r * 0.6, cy, cx, cy + r);
  ctx.fill();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawSheriffStar(ctx, cx, cy, r, points) {
  points = points || 5;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const a = (i * Math.PI) / points - Math.PI / 2;
    const rad = i % 2 === 0 ? r : r * 0.45;
    const x = cx + rad * Math.cos(a);
    const y = cy + rad * Math.sin(a);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.fill();
}

function drawWoodPlanks(ctx, x, y, w, h) {
  ctx.save();
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = '#6B4F12';
  ctx.lineWidth = 1;
  const plankH = 20;
  for (let py = y; py < y + h; py += plankH) {
    ctx.beginPath(); ctx.moveTo(x, py); ctx.lineTo(x + w, py); ctx.stroke();
    const offset = x + w * (0.3 + (py % 7) * 0.1);
    ctx.beginPath(); ctx.moveTo(offset, py); ctx.lineTo(offset, py + plankH); ctx.stroke();
  }
  ctx.restore();
}

function drawRope(ctx, x1, y1, x2, y2, color) {
  ctx.save();
  ctx.strokeStyle = color || '#8B4513';
  ctx.lineWidth = 3;
  ctx.setLineDash([6, 4]);
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawLeaf(ctx, cx, cy, s) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, s);
  ctx.bezierCurveTo(-s * 0.8, 0, -s * 0.3, -s, 0, -s);
  ctx.bezierCurveTo(s * 0.3, -s, s * 0.8, 0, 0, s);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(0, s * 0.8); ctx.lineTo(0, -s * 0.7); ctx.stroke();
  ctx.restore();
}

function drawKunai(ctx, cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.beginPath();
  ctx.moveTo(0, -s); ctx.lineTo(s * 0.2, s * 0.1);
  ctx.lineTo(s * 0.15, s * 0.3); ctx.lineTo(0, s * 0.15);
  ctx.lineTo(-s * 0.15, s * 0.3); ctx.lineTo(-s * 0.2, s * 0.1);
  ctx.closePath(); ctx.fill();
  ctx.fillRect(-s * 0.04, s * 0.3, s * 0.08, s * 0.5);
  ctx.restore();
}

function drawWisteria(ctx, cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy);
  for (let i = 0; i < 5; i++) {
    const y = i * s * 0.28;
    const w = s * (1 - i * 0.15);
    ctx.beginPath();
    ctx.ellipse(0, y, w * 0.4, s * 0.12, 0, 0, Math.PI * 2);
    ctx.globalAlpha = 0.5 - i * 0.08;
    ctx.fill();
  }
  ctx.restore();
}

function drawMagicCircle(ctx, cx, cy, r) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.globalAlpha = 0.12;
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 0, r * 0.65, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    ctx.beginPath();
    ctx.moveTo(r * 0.65 * Math.cos(a), r * 0.65 * Math.sin(a));
    ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
    ctx.stroke();
  }
  ctx.beginPath(); ctx.moveTo(0, -r * 0.65); ctx.lineTo(0, r * 0.65); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r * 0.56, -r * 0.33); ctx.lineTo(r * 0.56, r * 0.33); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r * 0.56, r * 0.33); ctx.lineTo(r * 0.56, -r * 0.33); ctx.stroke();
  ctx.restore();
}

function drawCrossBone(ctx, cx, cy, s) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.lineWidth = s * 0.12;
  ctx.beginPath(); ctx.moveTo(-s * 0.6, -s * 0.6); ctx.lineTo(s * 0.6, s * 0.6); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(s * 0.6, -s * 0.6); ctx.lineTo(-s * 0.6, s * 0.6); ctx.stroke();
  ctx.fillStyle = 'inherit';
  ctx.beginPath(); ctx.arc(-s * 0.55, -s * 0.55, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.55, s * 0.55, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(s * 0.55, -s * 0.55, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(-s * 0.55, s * 0.55, s * 0.15, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawShuriken(ctx, cx, cy, r) {
  ctx.save(); ctx.translate(cx, cy);
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2;
    const a2 = a + Math.PI / 8;
    ctx.lineTo(r * Math.cos(a), r * Math.sin(a));
    ctx.lineTo(r * 0.3 * Math.cos(a2), r * 0.3 * Math.sin(a2));
  }
  ctx.closePath(); ctx.fill(); ctx.restore();
}

async function generatePhotostrip() {
  const tpl = bgTemplates.find(t => t.id === selectedBgTemplate) || bgTemplates[3];
  const canvas = document.getElementById('photostrip-canvas');
  const pw = 400, ph = 300, pad = 24;
  const numPhotos = capturedPhotos.length;
  const chars = characterImages[tpl.id] || [];
  const hasChars = chars.length >= 2;

  const thumbW = hasChars ? 100 : 0;
  const headerH = 70;
  const footerH = 60;
  const sw = pw + pad * 2 + thumbW * 2 + 24;
  const sh = ph * numPhotos + pad * (numPhotos + 1) + headerH + footerH;
  const photoX = pad + thumbW + 12;

  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');

  // 1. Background
  ctx.fillStyle = tpl.bg;
  ctx.fillRect(0, 0, sw, sh);

  // 2. Character as faint background
  if (hasChars) {
    ctx.save();
    ctx.globalAlpha = 0.12;
    const bgImg = chars[0];
    const bgAspect = bgImg.width / bgImg.height;
    const stripAspect = sw / sh;
    let bgW, bgH, bgX, bgY;
    if (bgAspect > stripAspect) {
      bgH = sh; bgW = sh * bgAspect; bgX = (sw - bgW) / 2; bgY = 0;
    } else {
      bgW = sw; bgH = sw / bgAspect; bgX = 0; bgY = (sh - bgH) / 2;
    }
    ctx.drawImage(bgImg, bgX, bgY, bgW, bgH);
    ctx.restore();
    ctx.save();
    ctx.globalAlpha = 0.45;
    ctx.fillStyle = tpl.bg;
    ctx.fillRect(0, 0, sw, sh);
    ctx.restore();
  }

  // 3. Decorations
  drawDecorations(ctx, tpl, sw, sh);

  // 4. Header
  ctx.save();
  const hGrad = ctx.createLinearGradient(0, 0, sw, 0);
  hGrad.addColorStop(0, 'transparent');
  hGrad.addColorStop(0.3, tpl.accent + '30');
  hGrad.addColorStop(0.7, tpl.accent + '30');
  hGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = hGrad;
  ctx.fillRect(0, 0, sw, headerH);
  ctx.restore();
  ctx.strokeStyle = tpl.accent;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(40, headerH - 2);
  ctx.lineTo(sw - 40, headerH - 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = tpl.text || tpl.accent;
  ctx.textAlign = 'center';
  if (tpl.header) {
    ctx.font = 'bold 26px Anton, Impact, sans-serif';
    ctx.fillText(tpl.header, sw / 2, 32);
  }
  if (tpl.subheader) {
    ctx.font = '600 13px Inter, sans-serif';
    ctx.globalAlpha = 0.65;
    ctx.fillText(tpl.subheader, sw / 2, 54);
    ctx.globalAlpha = 1;
  }

  // 5. Footer
  ctx.save();
  const fGrad = ctx.createLinearGradient(0, 0, sw, 0);
  fGrad.addColorStop(0, 'transparent');
  fGrad.addColorStop(0.3, tpl.accent + '30');
  fGrad.addColorStop(0.7, tpl.accent + '30');
  fGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = fGrad;
  ctx.fillRect(0, sh - footerH, sw, footerH);
  ctx.restore();
  ctx.strokeStyle = tpl.accent;
  ctx.lineWidth = 2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(40, sh - footerH + 2);
  ctx.lineTo(sw - 40, sh - footerH + 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = tpl.text || tpl.accent;
  ctx.textAlign = 'center';
  ctx.font = 'bold 15px Anton, Impact, sans-serif';
  ctx.fillText(tpl.footer || '2026', sw / 2, sh - footerH / 2 + 7);

  // 6. Photos + character thumbnails
  for (let i = 0; i < numPhotos; i++) {
    const img = await loadImage(capturedPhotos[i]);
    const y = headerH + pad + i * (ph + pad);
    const centerY = y + ph / 2;
    const thumbH = ph * 0.75;
    const thumbAreaW = thumbW - 8;
    const thumbR = 8;

    // LEFT thumbnail
    if (hasChars) {
      const charImgL = chars[i % 2];
      const cxL = pad + thumbW / 2;
      const tLX = cxL - thumbAreaW / 2;
      const tLY = centerY - thumbH / 2;

      // Background rect
      ctx.save();
      ctx.fillStyle = tpl.accent + '18';
      ctx.beginPath();
      ctx.roundRect(tLX, tLY, thumbAreaW, thumbH, thumbR);
      ctx.fill();
      ctx.restore();

      // Clipped character image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(tLX, tLY, thumbAreaW, thumbH, thumbR);
      ctx.clip();
      const imgAspectL = charImgL.width / charImgL.height;
      let drawWL, drawHL;
      if (imgAspectL > thumbAreaW / thumbH) {
        drawHL = thumbH;
        drawWL = thumbH * imgAspectL;
      } else {
        drawWL = thumbAreaW;
        drawHL = thumbAreaW / imgAspectL;
      }
      ctx.drawImage(charImgL, cxL - drawWL / 2, centerY - drawHL / 2, drawWL, drawHL);
      ctx.restore();

      // Border
      ctx.save();
      ctx.strokeStyle = tpl.accent;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.roundRect(tLX, tLY, thumbAreaW, thumbH, thumbR);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Photo shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.4)';
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 4;
    ctx.fillStyle = '#111';
    ctx.beginPath();
    ctx.roundRect(photoX, y, pw, ph, 6);
    ctx.fill();
    ctx.restore();

    // Photo background
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.roundRect(photoX, y, pw, ph, 6);
    ctx.fill();

    // Aspect ratio
    const imgAspect = img.width / img.height;
    const phAspect = pw / ph;
    let dw = pw, dh = ph, dx = photoX, dy = y;
    if (imgAspect > phAspect) {
      dh = pw / imgAspect;
      dy = y + (ph - dh) / 2;
    } else {
      dw = ph * imgAspect;
      dx = photoX + (pw - dw) / 2;
    }

    // Draw photo with clip
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, y, pw, ph, 6);
    ctx.clip();
    if (selectedFilter !== 'original') ctx.filter = filters[selectedFilter] || 'none';
    ctx.drawImage(img, dx, dy, dw, dh);
    ctx.restore();

    // Photo top accent line
    ctx.save();
    ctx.strokeStyle = tpl.accent;
    ctx.lineWidth = 3;
    ctx.globalAlpha = 0.7;
    ctx.beginPath();
    ctx.moveTo(photoX + 20, y);
    ctx.lineTo(photoX + pw - 20, y);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();

    // Photo number badge
    ctx.save();
    ctx.fillStyle = tpl.accent;
    ctx.beginPath();
    ctx.arc(photoX + pw - 16, y + 16, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = tpl.bg;
    ctx.font = 'bold 11px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(i + 1, photoX + pw - 16, y + 16);
    ctx.restore();

    // RIGHT thumbnail (identical to left)
    if (hasChars) {
      const charImgR = chars[i % 2];
      const cxR = sw - pad - thumbW / 2;
      const tRX = cxR - thumbAreaW / 2;
      const tRY = centerY - thumbH / 2;

      // Background rect
      ctx.save();
      ctx.fillStyle = tpl.accent + '18';
      ctx.beginPath();
      ctx.roundRect(tRX, tRY, thumbAreaW, thumbH, thumbR);
      ctx.fill();
      ctx.restore();

      // Clipped character image
      ctx.save();
      ctx.beginPath();
      ctx.roundRect(tRX, tRY, thumbAreaW, thumbH, thumbR);
      ctx.clip();
      const imgAspectR = charImgR.width / charImgR.height;
      let drawWR, drawHR;
      if (imgAspectR > thumbAreaW / thumbH) {
        drawHR = thumbH;
        drawWR = thumbH * imgAspectR;
      } else {
        drawWR = thumbAreaW;
        drawHR = thumbAreaW / imgAspectR;
      }
      ctx.drawImage(charImgR, cxR - drawWR / 2, centerY - drawHR / 2, drawWR, drawHR);
      ctx.restore();

      // Border
      ctx.save();
      ctx.strokeStyle = tpl.accent;
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.roundRect(tRX, tRY, thumbAreaW, thumbH, thumbR);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
  }

  // 7. Side accent strips
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = tpl.accent;
  ctx.fillRect(0, headerH, 4, sh - headerH - footerH);
  ctx.fillRect(sw - 4, headerH, 4, sh - headerH - footerH);
  // Inner strips near photos
  ctx.globalAlpha = 0.1;
  ctx.fillRect(thumbW + 6, headerH, 2, sh - headerH - footerH);
  ctx.fillRect(sw - thumbW - 8, headerH, 2, sh - headerH - footerH);
  ctx.restore();

  document.getElementById('result-image').src = canvas.toDataURL('image/png');
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load: ' + src));
    img.src = src;
  });
}

/* ============ DOWNLOAD ============ */
function downloadPhoto() {
  const img = document.getElementById('result-image');
  if (!img.src) return;
  const link = document.createElement('a');
  link.download = 'photobooth-' + new Date().toISOString().split('T')[0] + '.png';
  link.href = img.src; link.click();
}

/* ============ GALLERY ============ */
function loadGallery() {
  try { galleryData = JSON.parse(localStorage.getItem('photobooth-gallery') || '[]'); }
  catch(e) { galleryData = []; }
}

function saveToGallery() {
  loadGallery();
  const img = document.getElementById('result-image');
  if (!img.src) return;
  galleryData.push({
    id: Date.now(), url: img.src, template: selectedBgTemplate,
    filter: selectedFilter, date: new Date().toISOString(), photoCount,
  });
  if (galleryData.length > 20) galleryData.shift();
  localStorage.setItem('photobooth-gallery', JSON.stringify(galleryData));
}

function renderGallery() {
  loadGallery();
  const grid = document.getElementById('gallery-grid');
  const empty = document.getElementById('gallery-empty');
  grid.innerHTML = '';
  if (galleryData.length === 0) { empty.style.display = 'block'; return; }
  empty.style.display = 'none';
  galleryData.slice().reverse().forEach(item => {
    const d = new Date(item.date).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
    const div = document.createElement('div');
    div.className = 'gallery-item';
    div.innerHTML = `
      <img src="${item.url}" alt="Photostrip">
      <div class="gallery-item-overlay">
        <button onclick="openLightbox(${item.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
        <button onclick="downloadGalleryItem(${item.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg></button>
        <button class="gi-del" onclick="deleteGalleryItem(${item.id})"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
      </div>
      <div class="gallery-item-info"><p>${d}</p></div>`;
    grid.appendChild(div);
  });
}

function deleteGalleryItem(id) {
  galleryData = galleryData.filter(g => g.id !== id);
  localStorage.setItem('photobooth-gallery', JSON.stringify(galleryData));
  renderGallery();
}

function downloadGalleryItem(id) {
  const item = galleryData.find(g => g.id === id);
  if (!item) return;
  const link = document.createElement('a');
  link.download = 'photobooth-' + new Date(item.date).toISOString().split('T')[0] + '-' + item.id + '.png';
  link.href = item.url; link.click();
}

/* ============ LIGHTBOX ============ */
function openLightbox(id) {
  lightboxId = id;
  const item = galleryData.find(g => g.id === id);
  if (!item) return;
  document.getElementById('lightbox-img').src = item.url;
  document.getElementById('lightbox').style.display = 'flex';
}
function closeLightbox() { document.getElementById('lightbox').style.display = 'none'; lightboxId = null; }
function downloadLightbox() { if (lightboxId) downloadGalleryItem(lightboxId); closeLightbox(); }
function deleteLightbox() { if (lightboxId) { deleteGalleryItem(lightboxId); closeLightbox(); } }

/* ============ TEMPLATES PAGE ============ */
function renderTemplates() {
  const grid = document.getElementById('templates-grid');
  grid.innerHTML = '';
  const categories = ['Default', 'Aesthetic', 'Franchise'];
  categories.forEach(cat => {
    const catTpl = bgTemplates.filter(t => t.cat === cat);
    if (catTpl.length === 0) return;
    const header = document.createElement('div');
    header.style.cssText = 'grid-column:1/-1;font-size:13px;font-weight:600;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:2px;margin-top:8px;margin-bottom:-4px;';
    header.textContent = cat;
    grid.appendChild(header);
    catTpl.forEach(tpl => {
      const card = document.createElement('div');
      card.className = 'tpl-card';
      card.onclick = () => {
        selectedBgTemplate = tpl.id;
        const sel = document.getElementById('select-bg-template');
        if (sel) sel.value = tpl.id;
        showPage('photobooth');
      };
      const slots = [1,2,3,4].map(() => `<div class="tpl-slot" style="background:${tpl.accent}30"></div>`).join('');
      const sub = tpl.subheader ? `<div style="color:${tpl.accent};font-size:7px;text-align:center;margin-top:2px;opacity:0.7">${tpl.subheader}</div>` : '';
      card.innerHTML = `
        <div class="tpl-preview" style="background:${tpl.bg};border:2px solid ${tpl.accent}">${slots}
          <div style="color:${tpl.accent};font-size:8px;text-align:center;margin-top:4px;font-weight:bold">${tpl.header || 'PHOTOBOOTH'}</div>
          ${sub}
        </div>
        <h3>${tpl.name}</h3>
        <div class="tpl-colors">
          <div class="tpl-color" style="background:${tpl.bg}"></div>
          <div class="tpl-color" style="background:${tpl.accent}"></div>
        </div>`;
      grid.appendChild(card);
    });
  });
}

/* ============ PRELOAD CHARACTER IMAGES ============ */
async function preloadCharacterImages() {
  const franchiseTemplates = bgTemplates.filter(t => t.characters);
  const loadPromises = franchiseTemplates.map(tpl =>
    Promise.all(tpl.characters.map(src =>
      loadImage(src).catch(() => null)
    )).then(imgs => { characterImages[tpl.id] = imgs.filter(Boolean); })
  );
  await Promise.all(loadPromises);
}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded', async () => {
  loadGallery();
  startCamera();
  const savedScreen = localStorage.getItem('photobooth-screen-template');
  if (savedScreen) applyScreenTemplate(savedScreen);
  const savedBg = localStorage.getItem('photobooth-bg-template');
  if (savedBg) { selectedBgTemplate = savedBg; const sel = document.getElementById('select-bg-template'); if (sel) sel.value = savedBg; }
  await preloadCharacterImages();
  buildFranchiseCards();
  updateCameraOverlay();
});
