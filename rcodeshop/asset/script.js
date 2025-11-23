// ==================== Nomor WhatsApp ==================== 
// GANTI DENGAN NOMOR WHATSAPP ANDA SENDIRI (Gunakan format: 62812xxxxxxxx)
const WHATSAPP_NUMBER = '6285157806996'; // Contoh: 62812345678900

// ==================== Hamburger Menu ==================== 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close menu ketika link diklik
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// ==================== Modal Functions ==================== 
const modal = document.getElementById('orderModal');
let currentProduct = '';
let currentPrice = 0;

function openOrderForm(productName, price) {
    currentProduct = productName;
    currentPrice = price;
    
    document.getElementById('productName').value = productName;
    document.getElementById('price').value = `Rp ${price.toLocaleString('id-ID')}`;
    document.getElementById('username').value = '';
    document.getElementById('whatsapp').value = '';
    document.getElementById('quantity').value = 1;
    document.getElementById('paymentMethod').value = '';
    document.getElementById('notes').value = '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeOrderForm() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Close modal ketika klik di luar modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        closeOrderForm();
    }
});

// ==================== Form Submission ==================== 
function submitOrder(event) {
    event.preventDefault();
    
    const productName = document.getElementById('productName').value;
    const price = currentPrice;
    const username = document.getElementById('username').value.trim();
    const whatsapp = document.getElementById('whatsapp').value.trim();
    const quantity = parseInt(document.getElementById('quantity').value);
    const paymentMethod = document.getElementById('paymentMethod').value;
    const notes = document.getElementById('notes').value.trim();
    
    // Validasi
    if (!username || !whatsapp || !paymentMethod) {
        alert('⚠️ Harap isi semua field yang wajib!');
        return;
    }
    
    // Validasi nomor WhatsApp (harus angka dan minimal 11 digit)
    if (!/^\d{11,}$/.test(whatsapp.replace(/\D/g, ''))) {
        alert('⚠️ Format nomor WhatsApp tidak valid!');
        return;
    }
    
    // Hitung total harga
    const totalPrice = price * quantity;
    
    // Format pesan untuk WhatsApp
    const message = formatWhatsAppMessage(productName, price, totalPrice, quantity, username, whatsapp, paymentMethod, notes);
    
    // Kirim ke WhatsApp
    sendToWhatsApp(message);
}

function formatWhatsAppMessage(productName, price, totalPrice, quantity, username, whatsapp, paymentMethod, notes) {
    const message = `
*PESANAN DARI RCODE STORE* 

*DETAIL PRODUK*
Produk: ${productName}
Harga Satuan: Rp ${price.toLocaleString('id-ID')}
Jumlah: ${quantity}
*Total: Rp ${totalPrice.toLocaleString('id-ID')}*

*DATA PEMBELI*
Username Roblox: ${username}
WhatsApp: ${whatsapp}

*METODE PEMBAYARAN*
${paymentMethod}

*CATATAN*
${notes || 'Tidak ada catatan tambahan'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
Terimakasih telah berbelanja di RCODE Store!
Tunggu konfirmasi dari admin.
`.trim();

    return message;
}

function sendToWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    // Close modal setelah mengirim
    setTimeout(() => {
        closeOrderForm();
        alert('✅ Pesan Anda sedang dikirim ke WhatsApp. Tunggu konfirmasi dari admin!');
    }, 500);
}

// ==================== Contact WhatsApp ==================== 
function contactWhatsApp() {
    const message = encodeURIComponent('Halo! Saya ingin mengetahui informasi lebih lanjut tentang produk RCODE Store. 🐟');
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappURL, '_blank');
}

// ==================== Scroll to Section ==================== 
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// ==================== Smooth Scroll Navigation ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ==================== Active Navigation Link ==================== 
window.addEventListener('scroll', () => {
    let current = '';
    
    document.querySelectorAll('.product-section, .payment-section, .contact-section').forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// ==================== Format Currency ==================== 
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

// ==================== Quantity Live Price Update ==================== 
const quantityInput = document.getElementById('quantity');
if (quantityInput) {
    quantityInput.addEventListener('change', () => {
        if (currentPrice > 0) {
            const newTotal = currentPrice * parseInt(quantityInput.value);
            document.getElementById('price').value = `Rp ${newTotal.toLocaleString('id-ID')}`;
        }
    });
}

// ==================== Form Input Validation ==================== 
const usernameInput = document.getElementById('username');
const whatsappInput = document.getElementById('whatsapp');

if (usernameInput) {
    usernameInput.addEventListener('input', (e) => {
        // Hanya alfanumerik, underscore, dan titik
        e.target.value = e.target.value.replace(/[^a-zA-Z0-9_.]/g, '');
    });
}

if (whatsappInput) {
    whatsappInput.addEventListener('input', (e) => {
        // Hanya angka
        e.target.value = e.target.value.replace(/\D/g, '');
    });
}

// ==================== Page Load Animation ==================== 
window.addEventListener('load', () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach((card, index) => {
        card.style.animation = `slideIn 0.5s ease ${index * 0.1}s forwards`;
        card.style.opacity = '0';
    });
});

// ==================== Intersection Observer untuk Lazy Loading ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.5s ease forwards';
            entry.target.style.opacity = '1';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card').forEach(card => {
    observer.observe(card);
});