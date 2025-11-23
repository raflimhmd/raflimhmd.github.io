/* app.js
   - Logic untuk membuka modal, membuat pesan WA, dan membuka link wa.me.
   - Ubah nomor WhatsApp di TOPUP_WA (format +62XXXXXXXX).
   - Untuk menambah/ubah produk: edit array PRODUCTS di bawah.
*/

/* ========== KONFIGURASI ========== */
/* Ganti nomor WhatsApp di sini (termasuk kode negara).
   Contoh: const TOPUP_WA = '+6281234567890'; */
const TOPUP_WA = '+6281234567890'; // <-- GANTI NOMOR INI

/* ========== DATA PRODUK ========== */
/* Struktur: {id, category, name, desc, price, icon}
   category harus salah satu: 'coin', 'ikan', 'tumbal' */
const PRODUCTS = [
  {id:'c100', category:'coin', name:'Coin Pack 100', desc:'Paket 100 coin untuk permainan', price:'Rp 9.000', icon:'💎'},
  {id:'c500', category:'coin', name:'Coin Pack 500', desc:'Lebih hemat, cocok farm', price:'Rp 40.000', icon:'🪙'},
  {id:'c1200', category:'coin', name:'Coin Pack 1200', desc:'Paket besar, bonus coin', price:'Rp 90.000', icon:'🎁'},
  {id:'i1', category:'ikan', name:'Ikan Emas', desc:'Ikan koleksi langka', price:'Rp 75.000', icon:'🐟'},
  {id:'i2', category:'ikan', name:'Ikan Patah Kaki', desc:'Ikan unik event', price:'Rp 35.000', icon:'🐠'},
  {id:'i3', category:'ikan', name:'Ikan Langka', desc:'Chance drop tinggi', price:'Rp 120.000', icon:'🪼'},
  {id:'t1', category:'tumbal', name:'Tumbal Basic', desc:'Tumbal untuk quest awal', price:'Rp 12.000', icon:'⚓'},
  {id:'t2', category:'tumbal', name:'Tumbal Rare', desc:'Tumbal kualitas tinggi', price:'Rp 55.000', icon:'🪝'},
  {id:'t3', category:'tumbal', name:'Tumbal Mega', desc:'Tumbal terbaik untuk boss', price:'Rp 180.000', icon:'🦑'}
];

/* Map category ke container ID */
const CATEGORY_MAP = {
  'coin': 'coinSection',
  'ikan': 'ikanSection',
  'tumbal': 'tumbalSection'
};

/* ========== HELPERS & RENDERING ========== */
function renderProducts(filterText = '') {
  Object.values(CATEGORY_MAP).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });

  const q = filterText.trim().toLowerCase();

  PRODUCTS.forEach(prod => {
    if (q && !(prod.name.toLowerCase().includes(q) || prod.desc.toLowerCase().includes(q))) return;

    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role','article');
    card.setAttribute('aria-label', prod.name);

    const icon = document.createElement('div');
    icon.className = 'icon';
    icon.innerHTML = `<div style="font-size:20px">${prod.icon || '🎮'}</div>`;

    const meta = document.createElement('div');
    meta.style.flex = '1';

    const title = document.createElement('h3');
    title.textContent = prod.name;

    const desc = document.createElement('p');
    desc.className = 'desc';
    desc.textContent = prod.desc;

    const small = document.createElement('div');
    small.className = 'meta';
    small.textContent = `ID: ${prod.id}`;

    meta.appendChild(title);
    meta.appendChild(desc);
    meta.appendChild(small);

    const priceWrap = document.createElement('div');
    priceWrap.className = 'price';
    priceWrap.innerHTML = `<div class="amount">${prod.price}</div>
      <button class="btn-buy" data-prod='${JSON.stringify(prod)}' aria-label="Beli ${prod.name} via WhatsApp">Beli via WhatsApp</button>`;

    card.appendChild(icon);
    card.appendChild(meta);
    card.appendChild(priceWrap);

    const containerId = CATEGORY_MAP[prod.category];
    const container = document.getElementById(containerId);
    if (container) container.appendChild(card);
  });

  Object.keys(CATEGORY_MAP).forEach(cat => {
    const id = CATEGORY_MAP[cat];
    const el = document.getElementById(id);
    if (el && el.children.length === 0) {
      el.innerHTML = `<div class="panel">Belum ada item di kategori ini.</div>`;
    }
  });
}

/* Initial render */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  document.getElementById('waNumberDisplay').textContent = TOPUP_WA;
  document.getElementById('year').textContent = new Date().getFullYear();
});

/* ========== SEARCH ========== */
document.getElementById('searchInput').addEventListener('input', (e) => {
  renderProducts(e.target.value);
});

/* ========== NAV / SCROLL HIGHLIGHT ========== */
const navButtons = document.querySelectorAll('.nav-btn');
navButtons.forEach(btn => {
  btn.addEventListener('click', (ev) => {
    const targetId = btn.getAttribute('data-target');
    if (targetId) {
      document.getElementById(targetId).scrollIntoView({behavior:'smooth',block:'start'});
      setActiveNav(btn);
    }
  });
});
function setActiveNav(activeBtn){
  navButtons.forEach(b => b.classList.remove('active'));
  if(activeBtn) activeBtn.classList.add('active');
}
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      const btn = Array.from(navButtons).find(b => b.dataset.target && b.dataset.target.toLowerCase().includes(id.replace('Section','')));
      if (btn) setActiveNav(btn);
    }
  });
}, {root: null, rootMargin: '-20% 0px -60% 0px', threshold: 0});
['coinSection','ikanSection','tumbalSection','kontakSection','paymentSection'].forEach(sid=>{
  const el = document.getElementById(sid);
  if(el) sectionObserver.observe(el);
});

/* ========== MOBILE DRAWER ========== */
const hamburgerBtn = document.getElementById('hamburgerBtn');
const mobileDrawer = document.getElementById('mobileDrawer');
const drawerClose = document.getElementById('drawerClose');
hamburgerBtn.addEventListener('click', () => {
  mobileDrawer.classList.add('open');
  mobileDrawer.setAttribute('aria-hidden','false');
  hamburgerBtn.setAttribute('aria-expanded','true');
});
drawerClose.addEventListener('click', () => {
  mobileDrawer.classList.remove('open');
  mobileDrawer.setAttribute('aria-hidden','true');
  hamburgerBtn.setAttribute('aria-expanded','false');
});
mobileDrawer.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden','true');
    hamburgerBtn.setAttribute('aria-expanded','false');
  }
});

/* ========== WHATSAPP & MODAL ========== */
const modalBackdrop = document.getElementById('modalBackdrop');
const modalCancel = document.getElementById('modalCancel');
const modalSend = document.getElementById('modalSend');
const modalItemLabel = document.getElementById('modalItemLabel');
const inputName = document.getElementById('inputName');
const inputUsername = document.getElementById('inputUsername');
const inputQty = document.getElementById('inputQty');
const inputNote = document.getElementById('inputNote');
const qtyError = document.getElementById('qtyError');

let SELECTED_PRODUCT = null;

document.body.addEventListener('click', (e) => {
  const buyBtn = e.target.closest('.btn-buy');
  if (buyBtn) {
    const prod = JSON.parse(buyBtn.getAttribute('data-prod'));
    openBuyModal(prod);
  }
});
document.getElementById('contactWaBtn').addEventListener('click', () => {
  const message = `Halo, saya mau tanya mengenai produk.`;
  openWhatsApp(TOPUP_WA, message);
});
document.getElementById('confirmPaymentBtn').addEventListener('click', () => {
  const today = new Date().toLocaleDateString('id-ID');
  const template = `Halo, saya sudah transfer {NOMINAL} untuk {NAMA_ITEM}. Rek: {NOMOR_REKENING}, Tgl: ${today}. Mohon konfirmasi.`;
  openWhatsApp(TOPUP_WA, template);
});

function openBuyModal(prod){
  SELECTED_PRODUCT = prod;
  modalItemLabel.textContent = `${prod.name} — ${prod.price}`;
  inputQty.value = 1;
  inputName.value = '';
  inputUsername.value = '';
  inputNote.value = '';
  qtyError.style.display = 'none';
  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden','false');
  setTimeout(()=> inputName.focus(), 50);
}
modalCancel.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
  if (e.target === modalBackdrop) closeModal();
});
function closeModal(){
  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden','true');
  SELECTED_PRODUCT = null;
}

function validateModal(){
  const qty = Number(inputQty.value || 0);
  if (!Number.isFinite(qty) || qty < 1) {
    qtyError.style.display = 'block';
    inputQty.focus();
    return false;
  }
  qtyError.style.display = 'none';
  return true;
}

modalSend.addEventListener('click', () => {
  if (!validateModal()) return;
  const name = inputName.value.trim();
  const uname = inputUsername.value.trim();
  const qty = Number(inputQty.value || 1);
  const note = inputNote.value.trim();

  if (!SELECTED_PRODUCT) {
    alert('Terjadi kesalahan: produk tidak dipilih.');
    closeModal();
    return;
  }

  const message = `Halo, saya mau pesan: ${SELECTED_PRODUCT.name} — Harga ${SELECTED_PRODUCT.price} — Qty ${qty}. Username Roblox: ${uname || '-'}${ name ? ' — Nama: ' + name : '' }${ note ? ' — Catatan: ' + note : '' }. Mohon proses ya.`;
  openWhatsApp(TOPUP_WA, message);
  closeModal();
});

/* openWhatsApp: gunakan wa.me link (works mobile + web) */
function openWhatsApp(number, text){
  const encoded = encodeURIComponent(text);
  const cleanNumber = number.replace(/[^0-9+]/g,'');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encoded}`;
  const opened = window.open(waUrl, '_blank');
  if (!opened) {
    const msg = `Tidak dapat membuka tab baru. Silakan salin pesan berikut dan kirim ke ${number}:\n\n${text}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(()=> {
        alert('Pesan disalin ke clipboard. Buka WhatsApp dan paste pesan ke CS kami.');
      }).catch(()=> {
        alert(msg);
      });
    } else {
      alert(msg);
    }
  }
}

/* Keyboard accessibility */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (modalBackdrop.style.display === 'flex') closeModal();
    if (mobileDrawer.classList.contains('open')) {
      mobileDrawer.classList.remove('open');
      mobileDrawer.setAttribute('aria-hidden','true');
      hamburgerBtn.setAttribute('aria-expanded','false');
    }
  }
});
document.body.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    const activeEl = document.activeElement;
    if (activeEl && activeEl.classList.contains('btn-buy')) {
      activeEl.click();
    }
  }
});

/* ========== TODO / NOTES ==========
 - TODO: Integrasi analytics: panggil analytics saat user klik 'Beli' (mis: analytics.track('beli', {...}))
 - TODO: Integrasi backend: simpan order sementara jika diperlukan.
 - Snippet encodeURIComponent: const url = `https://wa.me/${TOPUP_WA}?text=${encodeURIComponent(message)}`;
 - Jangan sertakan pembayaran otomatis di website — gunakan konfirmasi manual via WA.
================================== */
