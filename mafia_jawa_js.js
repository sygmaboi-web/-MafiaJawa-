document.addEventListener('DOMContentLoaded', () => {

    // --- DATA UTAMA ---
    const products = [
        { id: 1, name: 'Corndog Besar', price: 7000, stock: 50 },
        { id: 2, name: 'Corndog Kecil', price: 4000, stock: 100 },
        { id: 3, name: 'Red Poison', price: 4000, stock: 75 }
    ];
    let cart = [];
    let sales = [];
    const PASSWORD = 'KELOMPOK1KEREN';

    // --- ELEMEN DOM ---
    const navLinks = document.querySelectorAll('.nav-link');
    const pages = document.querySelectorAll('.page');
    const passwordModal = document.getElementById('password-modal');
    const passwordInput = document.getElementById('password-input');
    const passwordSubmit = document.getElementById('password-submit');
    const passwordError = document.getElementById('password-error');
    const strukModal = document.getElementById('struk-modal');
    const closeStrukBtn = document.getElementById('close-struk-btn');

    // Kasir
    const productButtonsContainer = document.getElementById('product-buttons');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalEl = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Penjualan
    const totalRevenueEl = document.getElementById('total-revenue');
    const totalTransactionsEl = document.getElementById('total-transactions');
    const totalItemsSoldEl = document.getElementById('total-items-sold');
    const stockTableContainer = document.getElementById('stock-table');
    const salesHistoryBody = document.querySelector('#sales-history tbody');

    let targetPage = '';

    // --- FUNGSI UTAMA ---

    // Inisialisasi Aplikasi
    function initialize() {
        setupEventListeners();
        renderProductButtons();
        updateStockTable();
        showPage('deskripsi');
    }

    // Menyiapkan semua event listener
    function setupEventListeners() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('href').substring(1);
                if (link.dataset.private) {
                    targetPage = pageId;
                    showPasswordModal();
                } else {
                    showPage(pageId);
                }
            });
        });

        passwordSubmit.addEventListener('click', handlePasswordSubmit);
        passwordInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handlePasswordSubmit();
        });

        checkoutBtn.addEventListener('click', processCheckout);
        closeStrukBtn.addEventListener('click', () => strukModal.classList.remove('visible'));
    }

    // Menampilkan halaman yang dipilih
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        document.getElementById(pageId)?.classList.add('active');

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${pageId}`);
        });

        if (pageId === 'penjualan') {
            updateSalesDisplay();
        }
    }

    // Logika Password
    function showPasswordModal() {
        passwordInput.value = '';
        passwordError.textContent = '';
        passwordModal.classList.add('visible');
        passwordInput.focus();
    }

    function handlePasswordSubmit() {
        if (passwordInput.value === PASSWORD) {
            passwordModal.classList.remove('visible');
            showPage(targetPage);
        } else {
            passwordError.textContent = 'Kata sandi salah!';
            passwordInput.value = '';
        }
    }

    // --- LOGIKA KASIR ---

    // Membuat tombol produk di kasir
    function renderProductButtons() {
        productButtonsContainer.innerHTML = '';
        products.forEach(product => {
            const btn = document.createElement('button');
            btn.className = 'product-btn';
            btn.innerHTML = `${product.name} <small>Rp${product.price.toLocaleString('id-ID')}</small>`;
            btn.onclick = () => addToCart(product.id);
            productButtonsContainer.appendChild(btn);
        });
    }

    // Menambah produk ke keranjang
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product.stock <= 0) {
            alert(`Stok ${product.name} habis!`);
            return;
        }

        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (cartItem.quantity < product.stock) {
                cartItem.quantity++;
            } else {
                alert(`Stok ${product.name} tidak mencukupi!`);
            }
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartDisplay();
    }

    // Mengubah jumlah item di keranjang
    function updateCartQuantity(productId, change) {
        const cartItem = cart.find(item => item.id === productId);
        if (!cartItem) return;
        
        const product = products.find(p => p.id === productId);
        const newQuantity = cartItem.quantity + change;

        if (newQuantity > 0 && newQuantity <= product.stock) {
            cartItem.quantity = newQuantity;
        } else if (newQuantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        } else {
            alert(`Stok ${product.name} tidak mencukupi!`);
        }
        updateCartDisplay();
    }

    // Memperbarui tampilan keranjang
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang masih kosong.</p>';
            cartTotalEl.textContent = 'Rp0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `
                <span>${item.name}</span>
                <div class="cart-item-controls">
                    <button onclick="window.updateCartQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="window.updateCartQuantity(${item.id}, 1)">+</button>
                </div>
                <span>Rp${(item.price * item.quantity).toLocaleString('id-ID')}</span>
            `;
            cartItemsContainer.appendChild(itemEl);
            total += item.price * item.quantity;
        });
        cartTotalEl.textContent = `Rp${total.toLocaleString('id-ID')}`;
    }

    // Memproses pembayaran
    function processCheckout() {
        if (cart.length === 0) {
            alert('Keranjang kosong, tidak ada yang bisa dibayar.');
            return;
        }

        const paymentType = document.getElementById('payment-type').value;
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        
        const transaction = {
            id: Date.now(),
            items: JSON.parse(JSON.stringify(cart)), // Deep copy
            total,
            paymentType,
            timestamp: new Date()
        };

        sales.push(transaction);

        // Kurangi stok
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                product.stock -= cartItem.quantity;
            }
        });
        
        generateReceipt(transaction);
        
        // Reset keranjang
        cart = [];
        updateCartDisplay();
        updateStockTable(); // Update stok di halaman penjualan
    }

    // Membuat struk
    function generateReceipt(transaction) {
        const strukBody = document.getElementById('struk-body');
        let itemsText = '';
        transaction.items.forEach(item => {
            const itemTotal = (item.price * item.quantity).toLocaleString('id-ID');
            itemsText += `${item.name}\n`;
            itemsText += `${item.quantity} x Rp${item.price.toLocaleString('id-ID')} ...... Rp${itemTotal}\n`;
        });

        strukBody.innerHTML = `
            <h3>*** Mafia Jawa ***</h3>
            <h4>Ninefoodsion Market Day</h4>
            <pre>--------------------------------</pre>
            <pre>ID: ${transaction.id}</pre>
            <pre>Tgl: ${transaction.timestamp.toLocaleString('id-ID')}</pre>
            <pre>--------------------------------</pre>
            <pre>${itemsText}</pre>
            <pre>--------------------------------</pre>
            <h4>Total: Rp${transaction.total.toLocaleString('id-ID')}</h4>
            <h4>Metode: ${transaction.paymentType}</h4>
            <pre>--------------------------------</pre>
            <h3>Terima Kasih!</h3>
        `;
        strukModal.classList.add('visible');
    }

    // --- LOGIKA LAPORAN PENJUALAN ---
    
    // Update semua data di halaman penjualan
    function updateSalesDisplay() {
        const totalRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalItems = sales.reduce((sum, sale) => sum + sale.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
        
        totalRevenueEl.textContent = `Rp${totalRevenue.toLocaleString('id-ID')}`;
        totalTransactionsEl.textContent = sales.length;
        totalItemsSoldEl.textContent = totalItems;
        
        // Update riwayat
        salesHistoryBody.innerHTML = '';
        sales.slice().reverse().forEach(sale => { // Tampilkan dari yang terbaru
            const row = salesHistoryBody.insertRow();
            const itemsSummary = sale.items.map(i => `${i.name} (x${i.quantity})`).join(', ');
            row.innerHTML = `
                <td>${sale.id}</td>
                <td>${sale.timestamp.toLocaleTimeString('id-ID')}</td>
                <td>${itemsSummary}</td>
                <td>Rp${sale.total.toLocaleString('id-ID')}</td>
                <td>${sale.paymentType}</td>
            `;
        });
    }
    
    // Update tabel stok
    function updateStockTable() {
        let tableHTML = `
            <table>
                <thead>
                    <tr><th>Produk</th><th>Stok Awal</th><th>Terjual</th><th>Sisa Stok</th></tr>
                </thead>
                <tbody>
        `;
        const initialStock = [
            { id: 1, stock: 50 },
            { id: 2, stock: 100 },
            { id: 3, stock: 75 }
        ];

        products.forEach(product => 
            {
            const initial = initialStock.find(p => p.id === product.id).stock;
            const sold = initial - product.stock;
            tableHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>${initial}</td>
                    <td>${sold}</td>
                    <td><strong>${product.stock}</strong></td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        stockTableContainer.innerHTML = tableHTML;
    }

    // --- INISIALISASI ---
    initialize();

    // Expose fungsi ke window agar bisa dipanggil dari HTML (onclick)
    window.updateCartQuantity = updateCartQuantity;
});
