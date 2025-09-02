let cart = [];
let total = 0;
let sales = [];

// ============================
// LOGIN
// ============================

// Login Kasir
function loginKasir() {
  let pass = prompt("Masukkan password untuk masuk ke Kasir:");
  if (pass === "KELOMPOK1KEREN") {
    const kasirEl = document.getElementById("kasir");
    kasirEl.classList.remove("hidden");
    kasirEl.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Password salah!");
  }
}

// Login Penjualan
function loginPenjualan() {
  let pass = prompt("Masukkan password untuk melihat Penjualan:");
  if (pass === "KELOMPOK1KEREN") {
    const penjualanEl = document.getElementById("penjualan");
    penjualanEl.classList.remove("hidden");
    penjualanEl.scrollIntoView({ behavior: "smooth" });
    updateSales();
  } else {
    alert("Password salah!");
  }
}

// ============================
// KERANJANG
// ============================

// Tambah ke keranjang
function addToCart(nama, harga) {
  cart.push({ nama, harga });
  total += harga;
  updateCart();
}

function updateCart() {
  let cartList = document.getElementById("cart");
  cartList.innerHTML = "";

  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.nama} - Rp${item.harga}`;
    cartList.appendChild(li);
  });

  document.getElementById("total").textContent = total;
}

// ============================
// CHECKOUT
// ============================

function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }

  let payment = document.getElementById("payment").value;

  if (payment === "QRIS") {
    document.querySelector(".qris").style.display = "block";
  } else {
    document.querySelector(".qris").style.display = "none";
  }

  // Simpan ke penjualan
  sales.push({ items: [...cart], total, payment });

  // Tampilkan struk
  let receipt = document.getElementById("receipt");
  receipt.innerHTML = `<h3>Struk Pembelian</h3>`;
  cart.forEach(item => {
    receipt.innerHTML += `<p>${item.nama} - Rp${item.harga}</p>`;
  });
  receipt.innerHTML += `
    <hr><p><b>Total:</b> Rp${total}</p>
    <p><b>Pembayaran:</b> ${payment}</p>
    <p>Terima kasih telah membeli di Mafia Jawa!</p>
  `;

  // Reset keranjang
  cart = [];
  total = 0;
  updateCart();
  updateSales();
}

// ============================
// DATA PENJUALAN
// ============================

function updateSales() {
  let salesList = document.getElementById("sales-data");
  salesList.innerHTML = "";

  sales.forEach((s, i) => {
    let li = document.createElement("li");

    let itemsText = s.items.map(it => it.nama).join(", ");
    li.innerHTML = `Transaksi ${i + 1}: ${itemsText} | Rp${s.total} (${s.payment})`;

    // Tombol hapus per transaksi
    let btn = document.createElement("button");
    btn.textContent = "❌";
    btn.className = "delete-btn";
    btn.onclick = () => {
      sales.splice(i, 1);
      updateSales();
    };

    li.appendChild(btn);
    salesList.appendChild(li);
  });
}

// Hapus semua penjualan
function clearSales() {
  if (confirm("Hapus semua data penjualan?")) {
    sales = [];
    updateSales();
  }
}
