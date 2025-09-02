let cart = [];
let total = 0;
let sales = [];

// Password untuk kasir
function loginKasir() {
  let pass = prompt("Masukkan password untuk masuk ke Kasir:");
  if (pass === "KELOMPOK1KEREN") {
    document.getElementById("kasir").classList.remove("hidden");
  } else {
    alert("Password salah!");
  }
}

// Password untuk hasil penjualan
function loginPenjualan() {
  let pass = prompt("Masukkan password untuk melihat Penjualan:");
  if (pass === "KELOMPOK1KEREN") {
    document.getElementById("penjualan").classList.remove("hidden");
    updateSales();
  } else {
    alert("Password salah!");
  }
}

// Tambah ke keranjang
function addToCart(nama, harga) {
  cart.push({ nama, harga });
  total += harga;
  updateCart();
}

function updateCart() {
  let cartList = document.getElementById("cart");
  cartList.innerHTML = "";
  cart.forEach((item, i) => {
    let li = document.createElement("li");
    li.textContent = item.nama + " - Rp" + item.harga;
    cartList.appendChild(li);
  });
  document.getElementById("total").textContent = total;
}

// Checkout
function checkout() {
  if (cart.length === 0) {
    alert("Keranjang kosong!");
    return;
  }
  let payment = document.getElementById("payment").value;
  if (payment === "QRIS") {
    document.querySelector(".qris").style.display = "block";
  }
  // Simpan ke penjualan
  sales.push({ items: [...cart], total, payment });

  // Struk
  let receipt = document.getElementById("receipt");
  receipt.innerHTML = "<h3>Struk Pembelian</h3>";
  cart.forEach(item => {
    receipt.innerHTML += `<p>${item.nama} - Rp${item.harga}</p>`;
  });
  receipt.innerHTML += `<hr><p><b>Total:</b> Rp${total}</p>`;
  receipt.innerHTML += `<p><b>Pembayaran:</b> ${payment}</p>`;
  receipt.innerHTML += `<p>Terima kasih telah membeli di Mafia Jawa!</p>`;

  // Reset keranjang
  cart = [];
  total = 0;
  updateCart();
  updateSales(); // update history otomatis
}

// Update hasil penjualan
function updateSales() {
  let salesList = document.getElementById("sales-data");
  salesList.innerHTML = "";
  sales.forEach((s, i) => {
    let li = document.createElement("li");

    let itemsText = s.items.map(it => it.nama).join(", ");
    li.innerHTML = `Transaksi ${i+1}: ${itemsText} | Rp${s.total} (${s.payment})`;

    // Tombol hapus per transaksi
    let btn = document.createElement("button");
    btn.textContent = "❌";
    btn.style.marginLeft = "10px";
    btn.onclick = () => {
      sales.splice(i, 1); // hapus transaksi ke-i
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




