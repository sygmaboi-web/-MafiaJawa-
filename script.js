const PASSWORD = "KELOMPOK1KEREN";

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

// QRIS show/hide
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
  const produkSelect = document.getElementById("produk");
  const payment = pembayaranEl.value;

  const selected = Array.from(produkSelect.selectedOptions).map(opt => {
    const [name, price] = opt.value.split("-");
    return { name, price: parseInt(price) };
  });

  if (selected.length === 0) { alert("Pilih produk dulu!"); return; }

  let subtotal = 0;
  selected.forEach(item => {
    subtotal += item.price;
    totalTerjual[item.name] = (totalTerjual[item.name] || 0) + 1;
  });

  totalUang += subtotal;

  history.push({
    items: selected.map(i => i.name),
    subtotal,
    payment,
    date: new Date().toLocaleString()
  });

  alert(`Pembelian berhasil! Total: Rp${subtotal}`);
  kasirForm.reset();
  qrisDiv.style.display = "none";

  updatePenjualan();
});

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

function hapusHistory(index) {
  const entry = history[index];
  // kurangi totalTerjual
  entry.items.forEach(name => totalTerjual[name]--);
  totalUang -= entry.subtotal;
  history.splice(index, 1);
  updatePenjualan();
}

