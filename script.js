// --- PENTING: Variabel Global dan Data Persistence ---
let keranjang = [];
let riwayatPenjualan = [];
let jumlahTerjual = {};
let currentPage = 'menu'; // Halaman default

// Fungsi untuk memuat data dari Local Storage saat aplikasi pertama kali dibuka
function loadDataFromStorage() {
    keranjang = JSON.parse(localStorage.getItem('keranjang')) || [];
    riwayatPenjualan = JSON.parse(localStorage.getItem('riwayatPenjualan')) || [];
    jumlahTerjual = JSON.parse(localStorage.getItem('jumlahTerjual')) || {};
}

// Fungsi untuk menyimpan semua data ke Local Storage
function saveDataToStorage() {
    localStorage.setItem('keranjang', JSON.stringify(keranjang));
    localStorage.setItem('riwayatPenjualan', JSON.stringify(riwayatPenjualan));
    localStorage.setItem('jumlahTerjual', JSON.stringify(jumlahTerjual));
}

// ====================== NAVIGASI + PASSWORD ======================
function showPage(page) {
  if (page === 'kasir' || page === 'penjualan') {
    let pass = prompt("Masukkan password:");
    if (pass !== "KELOMPOK1KEREN") { // Ganti password jika perlu
      alert("Password salah!");
      return;
    }
  }

  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
  document.getElementById(page).style.display = 'block';
  currentPage = page;

  if (page === 'kasir') renderKasir();
  if (page === 'penjualan') renderPenjualan();
}

// ====================== MESIN KASIR ======================
function tambahProduk(nama, harga) {
  keranjang.push({ nama, harga });
  saveDataToStorage(); // Simpan keranjang setiap kali ada penambahan
  alert(`'${nama}' berhasil ditambahkan ke kasir!`);
  
  if (currentPage === 'kasir') {
      renderKasir();
  }
}

function renderKasir() {
  if (currentPage !== 'kasir') return;

  let total = 0;
  let html = "<h3>Keranjang:</h3>";
  
  if (keranjang.length === 0) {
    html += "<p>Keranjang kosong.</p>";
  } else {
    keranjang.forEach((item, i) => {
      html += `<div class="keranjang-item">${item.nama} - ${formatRupiah(item.harga)}
        <button class="hapus-btn" onclick="hapusProduk(${i})">❌</button></div>`;
      total += item.harga;
    });
    html += `<hr><p class="total-text"><b>Total: ${formatRupiah(total)}</b></p>`;
    html += `<div class="checkout-buttons">
              <button onclick="checkout('Tunai')">Bayar Tunai</button>
              <button onclick="checkout('QRIS')">Bayar QRIS</button>
            </div>`;
    html += `<div id="qris-section" style="margin-top:15px; text-align:center; display:none;">
               <p>Silakan scan QRIS di bawah ini:</p>
               <img src="qris.png" alt="QRIS" width="200">
               <button onclick="finalisasiCheckout('QRIS')" style="margin-top:10px; background-color:#25d366;">Konfirmasi Pembayaran</button>
             </div>`;
  }
  document.getElementById("kasir-container").innerHTML = html;
}

function hapusProduk(i) {
  keranjang.splice(i, 1);
  saveDataToStorage();
  renderKasir();
}

// Langkah 1: Menampilkan Opsi Pembayaran
function checkout(metode) {
  if (keranjang.length === 0) return alert("Keranjang kosong!");
  
  if (metode === 'QRIS') {
    document.getElementById("qris-section").style.display = "block";
  } else if (metode === 'Tunai') {
    finalisasiCheckout('Tunai');
  }
}

// Langkah 2: Memproses Transaksi Setelah Dikonfirmasi
function finalisasiCheckout(metode) {
    if (keranjang.length === 0) return;

    keranjang.forEach(item => {
        riwayatPenjualan.push({ ...item, metode, waktu: new Date().toLocaleString('id-ID') });
        jumlahTerjual[item.nama] = (jumlahTerjual[item.nama] || 0) + 1;
    });

    alert("Transaksi berhasil via " + metode);
    
    keranjang = []; // Kosongkan keranjang
    saveDataToStorage(); // Simpan semua perubahan (riwayat, jumlah, keranjang kosong)
    renderKasir(); // Render ulang tampilan kasir
}

// ====================== DATA PENJUALAN ======================
function renderPenjualan() {
  let totalSemua = 0;
  let html = "<h3>Riwayat Transaksi:</h3>";
  
  if (riwayatPenjualan.length === 0) {
    html += "<p>Belum ada transaksi.</p>";
  } else {
    [...riwayatPenjualan].reverse().forEach(r => {
      html += `<div class="riwayat-item">${r.waktu} - ${r.nama} ${formatRupiah(r.harga)} (${r.metode})</div>`;
      totalSemua += r.harga;
    });
  }

  html += `<hr><p class="total-text"><b>Total Pendapatan: ${formatRupiah(totalSemua)}</b></p>`;
  html += "<h3>Jumlah Produk Terjual:</h3>";
  
  if (Object.keys(jumlahTerjual).length === 0) {
    html += "<p>Belum ada produk terjual.</p>"
  } else {
    for (let nama in jumlahTerjual) {
        html += `<div class="jumlah-item">${nama}: ${jumlahTerjual[nama]}x</div>`;
    }
  }
  document.getElementById("penjualan-container").innerHTML = html;
}

function hapusRiwayat() {
  if (confirm("Yakin mau hapus semua riwayat penjualan?")) {
    riwayatPenjualan = [];
    jumlahTerjual = {};
    keranjang = []; // Sebaiknya keranjang juga dikosongkan
    saveDataToStorage();
    renderPenjualan();
    renderKasir();
  }
}

// ====================== FUNGSI BANTUAN ======================
function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(angka);
}

// ====================== INISIALISASI APLIKASI ======================
document.addEventListener('DOMContentLoaded', () => {
    loadDataFromStorage();
    showPage('menu');
});


