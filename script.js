// Password untuk masuk ke kasir & penjualan
const PASSWORD = "KELOMPOK1KEREN";

// Pages
const pages = document.querySelectorAll(".page");
document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const target = link.dataset.target;

    if (target === "kasir" || target === "penjualan") {
      const pass = prompt("Masukkan password:");
      if (pass !== PASSWORD) {
        alert("Password salah!");
        return;
      }
    }

    pages.forEach(p => p.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});

// Kasir
const kasirForm = document.getElementById("kasirForm");
const totalHargaEl = document.getElementById("totalHarga");
let history = [];
let totalTerjual = {};
let totalUang = 0;

kasirForm.addEventListener("submit", e => {
  e.preventDefault();
  const produkSelect = document.getElementById("produk");
  const pembayaran = document.getElementById("pembayaran").value;

  const selected = Array.from(produkSelect.selectedOptions).map(opt => {
    const [name, price] = opt.value.split("-");
    return { name, price: parseInt(price) };
  });

  if (selected.length === 0) {
    alert("Pilih produk dulu!");
    return;
  }

  let subtotal = 0;
  selected.forEach(item => {
    subtotal += item.price;
    // Update total barang
    if (!totalTerjual[item.name]) totalTerjual[item.name] = 0;
    totalTerjual[item.name]++;
  });

  totalUang += subtotal;

  // Tambahkan ke history
  history.push({
    items: selected.map(i => i.name),
    subtotal,
    payment: pembayaran,
    date: new Date().toLocaleString()
  });

  alert(`Pembelian berhasil! Total: Rp${subtotal}`);
  totalHargaEl.textContent = "";
  kasirForm.reset();

  updateHistory();
});

// Update history
function updateHistory() {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";
  history.forEach((entry, i) => {
    const li = document.createElement("li");
    li.textContent = `${entry.date} - ${entry.items.join(", ")} - Rp${entry.subtotal} (${entry.payment})`;
    historyList.appendChild(li);
  });

  // Update total penjualan
  const penjualanSection = document.getElementById("penjualan");
  let html = "<h3>Total Barang Terjual:</h3><ul>";
  for (const [name, qty] of Object.entries(totalTerjual)) {
    html += `<li>${name}: ${qty}</li>`;
  }
  html += `</ul><h3>Total Uang Terkumpul: Rp${totalUang}</h3>`;
  penjualanSection.innerHTML = `<h2>📊 History Penjualan</h2><ul id="historyList"></ul>${html}`;
  updateHistory();
}


