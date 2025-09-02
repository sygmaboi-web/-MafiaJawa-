const PASSWORD = "KELOMPOK1KEREN";

// Navigasi
const pages = document.querySelectorAll(".page");
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.dataset.target;

    if (target === "kasir" || target === "penjualan") {
      const pass = prompt("Masukkan password:");
      if (pass !== PASSWORD) { alert("Password salah!"); return; }
    }

    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// QRIS toggle
const pembayaranEl = document.getElementById("pembayaran");
const qrisDiv = document.getElementById("qrisDiv");
pembayaranEl.addEventListener("change", () => {
  qrisDiv.style.display = pembayaranEl.value === "QRIS" ? "block" : "none";
});

// Kasir
const kasirForm = document.getElementById("kasirForm");
let history = [];
let totalTerjual = {};
let totalUang = 0;

kasirForm.addEventListener("submit", e => {
  e.preventDefault();

  // Ambil semua checkbox yang dicentang
  const selectedCheckboxes = Array.from(document.querySelectorAll('input[name="produk"]:checked'));
  if (selectedCheckboxes.length === 0) {
    alert("Pilih produk dulu!");
    return;
  }

  let subtotal = 0;
  let itemsBought = [];

  selectedCheckboxes.forEach(cb => {
    const [name, price] = cb.value.split("-");
    const qtyInput = document.querySelector(`input[name="qty-${name}"]`);
    const qty = parseInt(qtyInput.value) || 1;

    subtotal += parseInt(price) * qty;

    // Update total terjual
    totalTerjual[name] = (totalTerjual[name] || 0) + qty;

    // Masukkan nama produk sesuai qty ke history
    for (let i=0; i<qty; i++) itemsBought.push(name);
  });

  totalUang += subtotal;

  // Tambah ke history
  history.push({
    items: itemsBought,
    subtotal,
    payment: pembayaranEl.value,
    date: new Date().toLocaleString()
  });

  alert(`Pembelian berhasil! Total: Rp${subtotal}`);
  kasirForm.reset();
  qrisDiv.style.display = "none";

  updatePenjualan();
});

// Fungsi update halaman penjualan
function updatePenjualan() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  history.forEach((entry, index) => {
    const li = document.createElement("li");
    li.innerHTML = `${entry.date} - ${entry.items.join(", ")} - Rp${entry.subtotal} (${entry.payment}) 
    <button onclick="hapusHistory(${index})">Hapus</button>`;
    historyList.appendChild(li);
  });

  const summary = document.getElementById("summary");
  let html = "<h3>Total Barang Terjual:</h3><ul>";
  for (const [name, qty] of Object.entries(totalTerjual)) html += `<li>${name}: ${qty}</li>`;
  html += `</ul><h3>Total Uang Terkumpul: Rp${totalUang}</h3>`;
  summary.innerHTML = html;
}

// Fungsi hapus transaksi
function hapusHistory(index) {
  const entry = history[index];
  entry.items.forEach(name => totalTerjual[name]--);
  totalUang -= entry.subtotal;
  history.splice(index, 1);
  updatePenjualan();
}


