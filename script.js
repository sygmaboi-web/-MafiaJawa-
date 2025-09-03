let cart = [];
let total = 0;
let salesData = {};

function addItem(name, price){
  cart.push({name, price});
  total += price;
  updateCart();
}

function updateCart(){
  const cartItems = document.getElementById('cartItems');
  cartItems.innerHTML = '';
  cart.forEach(item=>{
    const li = document.createElement('li');
    li.textContent = `${item.name} - Rp ${item.price}`;
    cartItems.appendChild(li);
  });
  document.getElementById('total').textContent = total;
}

function pay(method) {
  if (cart.length === 0) return alert("Keranjang kosong!");

  if (method === 'QRIS') {
    // tampilkan QRIS tanpa langsung reset keranjang
    document.getElementById('qrisContainer').style.display = 'block';
    alert("Silakan scan QRIS untuk melanjutkan pembayaran.");
    return; // keluar dulu, jangan langsung reset cart
  }

  // kalau metode lain (Tunai)
  cart.forEach(item => {
    if (!salesData[item.name]) salesData[item.name] = { qty: 0, total: 0 };
    salesData[item.name].qty += 1;
    salesData[item.name].total += item.price;
  });

  alert(`Transaksi berhasil! Metode: ${method}`);

  cart = [];
  total = 0;
  updateCart();
  updateDataTable();
}

}

// Kasir login
document.getElementById('loginBtn').addEventListener('click', ()=>{
  const pass = document.getElementById('password').value;
  if(pass==="KELOMPOK1KEREN"){
    document.getElementById('kasirPanel').classList.remove('hidden');
    document.querySelector('#kasirContent .login').classList.add('hidden');
  }else{
    alert("Password salah!");
  }
});

// Data Penjualan login
document.getElementById('loginDataBtn').addEventListener('click', ()=>{
  const pass = document.getElementById('passwordData').value;
  if(pass==="KELOMPOK1KEREN"){
    document.getElementById('dataPanel').classList.remove('hidden');
    document.getElementById('loginData').classList.add('hidden');
    updateDataTable();
  }else{
    alert("Password salah!");
  }
});

function updateDataTable(){
  const tbody = document.getElementById('dataTable');
  tbody.innerHTML='';
  for(let product in salesData){
    const tr=document.createElement('tr');
    tr.innerHTML=`<td>${product}</td><td>${salesData[product].qty}</td><td>Rp ${salesData[product].total}</td>`;
    tbody.appendChild(tr);
  }
}

function clearData(){
  if(confirm("Hapus semua history penjualan?")){
    salesData={};
    updateDataTable();
  }
}

// Floating panel controls
document.getElementById('openKasirBtn').addEventListener('click', ()=>{
  document.getElementById('kasirContent').classList.remove('hidden');
});
document.getElementById('openDataBtn').addEventListener('click', ()=>{
  document.getElementById('dataContent').classList.remove('hidden');
});
function closePanel(id){
  document.getElementById(id).classList.add('hidden');
}




