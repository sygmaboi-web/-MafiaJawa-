// ==========================================
// 1. LOGIC BUKA/TUTUP PANEL (POPUP)
// ==========================================
function openPanel(panelId) {
    document.getElementById(panelId).classList.remove('hidden');
}

function closePanel(panelId) {
    document.getElementById(panelId).classList.add('hidden');
}

document.getElementById('openKasirBtn').addEventListener('click', () => openPanel('kasirContent'));
document.getElementById('openDataBtn').addEventListener('click', () => openPanel('dataContent'));


// ==========================================
// 2. LOGIC LOGIN (MENGUNCI MENU)
// ==========================================
// Login Kasir
document.getElementById('loginBtn').addEventListener('click', function() {
    const pin = document.getElementById('password').value;
    
    // Default PIN kasir adalah '1234'. Silakan diganti sesuai kebutuhan.
    if(pin === '1234') { 
        document.querySelector('#kasirContent .login').classList.add('hidden'); // Sembunyikan form login
        document.getElementById('kasirPanel').classList.remove('hidden'); // Tampilkan menu kasir
    } else {
        alert('PIN Kasir Salah! Akses Ditolak.');
    }
});

// Login Data Penjualan
document.getElementById('loginDataBtn').addEventListener('click', function() {
    const pin = document.getElementById('passwordData').value;
    
    // Default PIN admin adalah 'admin'.
    if(pin === 'admin') { 
        document.getElementById('loginData').classList.add('hidden');
        document.getElementById('dataPanel').classList.remove('hidden');
    } else {
        alert('PIN Admin Salah! Akses Ditolak.');
    }
});


// ==========================================
// 3. LOGIC KERANJANG (TAMBAH & KURANGI)
// ==========================================
let cart = []; // Array untuk menyimpan pesanan

function addItem(name, price) {
    // Cek apakah item sudah ada di keranjang
    const existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
        existingItem.qty += 1; // Jika ada, tambah jumlahnya
    } else {
        cart.push({ name: name, price: price, qty: 1 }); // Jika tidak, masukkan sebagai item baru
    }
    updateCartUI();
}

function removeItem(name) {
    // Cari item yang mau dikurangi
    const existingItem = cart.find(item => item.name === name);
    
    if(existingItem) {
        existingItem.qty -= 1; // Kurangi jumlahnya
        // Jika jumlahnya jadi 0, hapus dari keranjang sepenuhnya
        if(existingItem.qty <= 0) {
            cart = cart.filter(item => item.name !== name);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById('cartItems');
    const totalSpan = document.getElementById('total');
    
    cartList.innerHTML = ''; // Bersihkan list sebelum dirender ulang
    let total = 0;

    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;

        // Buat elemen list baru dengan tombol Kurangi
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span><strong>${item.name}</strong> (x${item.qty}) - Rp ${subtotal}</span>
            <button class="btn-remove" onclick="removeItem('${item.name}')">✖ Kurangi</button>
        `;
        cartList.appendChild(li);
    });

    totalSpan.innerText = total; // Update total harga
}


// ==========================================
// 4. LOGIC PEMBAYARAN
// ==========================================
function pay(method) {
    if(cart.length === 0) {
        alert('Keranjang masih kosong, Bos!');
        return;
    }
    
    if(method === 'QRIS') {
        document.getElementById('qrisContainer').style.display = 'block';
    } else {
        prosesPembayaran('Tunai');
    }
}

function confirmQrisPayment() {
    prosesPembayaran('QRIS');
    document.getElementById('qrisContainer').style.display = 'none';
}

function prosesPembayaran(metode) {
    alert(`Pembayaran menggunakan ${metode} berhasil! Total yang dibayar: Rp ${document.getElementById('total').innerText}`);
    
    // (Opsional) Nanti di sini bisa ditambahkan kode untuk push data ke Tabel Penjualan

    // Reset keranjang setelah dibayar
    cart = [];
    updateCartUI();
}
