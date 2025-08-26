// Global Variables
let cart = [];
let sales = [];
let inventory = {
    'corndog-small': 50,
    'corndog-big': 30,
    'redpoison
        // Global Variables
let cart = [];
let sales = [];
let inventory = {
    'corndog-small': 50,
    'corndog-big': 30,
    'redpoison': 40
};
let totalSales = 0;
let totalTransactions = 0;
let currentPaymentMethod = '';

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Remove loading screen after 3 seconds
    setTimeout(() => {
        document.getElementById('loading-screen').style.display = 'none';
    }, 3000);
    
    // Show home section by default
    showSection('home');
    updateStockDisplay();
    loadSalesData();
});

// Navigation Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
}

// Password Modal Functions
function showPasswordModal() {
    document.getElementById('passwordModal').style.display = 'block';
    document.getElementById('passwordInput').focus();
}

function checkPassword() {
    const password = document.getElementById('passwordInput').value;
    if (password === 'KELOMPOK1KEREN') {
        closeModal('passwordModal');
        showSection('cashier');
        document.getElementById('passwordInput').value = '';
    } else {
        alert('❌ Password salah! Coba lagi.');
        document.getElementById('passwordInput').value = '';
        document.getElementById('passwordInput').focus();
    }
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function showSalesModal() {
    const password = prompt('🔐 Masukkan password untuk melihat data penjualan:');
    if (password === 'KELOMPOK1KEREN') {
        updateSalesDisplay();
        document.getElementById('salesModal').style.display = 'block';
    } else {
        alert('❌ Password salah!');
    }
}

// Cart Functions
function addToCart(productId, productName, price) {
    // Check inventory
    if (inventory[productId] <= 0) {
        alert('❌ Maaf, stok ' + productName + ' sudah habis!');
        return;
    }
    
    // Check if item already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < inventory[productId]) {
            existingItem.quantity += 1;
        } else {
            alert('❌ Tidak bisa menambah lagi. Stok terbatas!');
            return;
        }
    } else {
        cart.push({
            id: productId,
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showCartAnimation();
}

function removeFromCart(productId) {
    const itemIndex = cart.findIndex(item => item.id === productId);
    if (itemIndex > -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">🛒 Keranjang masih kosong</p>';
        cartTotal.textContent = '0';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>Rp ${item.price.toLocaleString()} x ${item.quantity}</small>
                </div>
                <div>
                    <button onclick="removeFromCart('${item.id}')" style="background: #f44336; padding: 0.3rem 0.6rem; font-size: 0.8rem;">➖</button>
                    <span style="margin: 0 0.5rem; font-weight: bold;">Rp ${itemTotal.toLocaleString()}</span>
                    <button onclick="addToCart('${item.id}', '${item.name}', ${item.price})" style="background: #4caf50; padding: 0.3rem 0.6rem; font-size: 0.8rem;">➕</button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = html;
    cartTotal.textContent = total.toLocaleString();
}

function showCartAnimation() {
    // Add a simple animation effect when item is added to cart
    const cartSection = document.querySelector('.cart-section');
    cartSection.style.transform = 'scale(1.05)';
    cartSection.style.transition = 'transform 0.2s ease';
    
    setTimeout(() => {
        cartSection.style.transform = 'scale(1)';
    }, 200);
}

// Payment Functions
function processPayment(method) {
    currentPaymentMethod = method;
    
    if (method === 'qris') {
        alert('📱 Silahkan scan QRIS code yang tersedia untuk pembayaran.');
    } else {
        alert('💵 Pembayaran dengan cash. Pastikan uang pas atau siapkan kembalian.');
    }
    
    // Update button styles
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.style.background = 'linear-gradient(45deg, #4CAF50, #2196F3)';
    });
    
    event.target.style.background = 'linear-gradient(45deg, #FF9800, #F44336)';
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        alert('❌ Keranjang masih kosong!');
        return;
    }
    
    if (!currentPaymentMethod) {
        alert('❌ Pilih metode pembayaran terlebih dahulu!');
        return;
    }
    
    // Calculate total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update inventory
    cart.forEach(item => {
        inventory[item.id] -= item.quantity;
    });
    
    // Create sale record
    const sale = {
        id: Date.now(),
        items: [...cart],
        total: total,
        paymentMethod: currentPaymentMethod,
        timestamp: new Date().toLocaleString('id-ID')
    };
    
    sales.push(sale);
    totalSales += total;
    totalTransactions += 1;
    
    // Generate receipt
    generateReceipt(sale);
    
    // Clear cart
    cart = [];
    currentPaymentMethod = '';
    
    // Update displays
    updateCartDisplay();
    updateStockDisplay();
    saveSalesData();
    
    // Reset payment buttons
    document.querySelectorAll('.payment-btn').forEach(btn => {
        btn.style.background = 'linear-gradient(45deg, #4CAF50, #2196F3)';
    });
    
    alert('✅ Transaksi berhasil! Terima kasih sudah berbelanja di Mafia Jawa! 🎉');
}

// Receipt Functions
function generateReceipt(sale) {
    const receiptContent = document.getElementById('receipt-content');
    
    let itemsHTML = '';
    sale.items.forEach(item => {
        itemsHTML += `
            <div class="receipt-item">
                <span>${item.name} (${item.quantity}x)</span>
                <span>Rp ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `;
    });
    
    receiptContent.innerHTML = `
        <div class="receipt">
            <div class="receipt-header">
                <h2>🍭 MAFIA JAWA 🍭</h2>
                <p>NineFoosion</p>
                <p>SMP Islam Plus Baitulmaal</p>
                <p>Market Day Kelas 9</p>
                <p>========================</p>
                <p>${sale.timestamp}</p>
                <p>No: ${sale.id}</p>
            </div>
            
            <div class="receipt-items">
                ${itemsHTML}
            </div>
            
            <div class="receipt-total">
                <p>========================</p>
                <div class="receipt-item">
                    <span><strong>TOTAL</strong></span>
                    <span><strong>Rp ${sale.total.toLocaleString()}</strong></span>
                </div>
                <p>Pembayaran: ${sale.paymentMethod.toUpperCase()}</p>
                <p>========================</p>
                <p style="text-align: center; margin-top: 1rem;">
                    Terima kasih telah berbelanja!<br>
                    🎉 Mafia Jawa - NineFoosion 🎉<br>
                    Sampai jumpa lagi! 😊
                </p>
            </div>
        </div>
    `;
    
    document.getElementById('receiptModal').style.display = 'block';
}

function printReceipt() {
    const receiptContent = document.getElementById('receipt-content').innerHTML;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Struk Pembayaran - Mafia Jawa</title>
                <style>
                    body { font-family: monospace; margin: 20px; }
                    .receipt { max-width: 300px; margin: 0 auto; }
                    .receipt-header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .receipt-total { border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; }
                </style>
            </head>
            <body>
                ${receiptContent}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

// Inventory Functions
function updateStockDisplay() {
    document.getElementById('corndog-small-stock').textContent = inventory['corndog-small'];
    document.getElementById('corndog-big-stock').textContent = inventory['corndog-big'];
    document.getElementById('redpoison-stock').textContent = inventory['redpoison'];
}

// Sales Data Functions
function updateSalesDisplay() {
    document.getElementById('total-sales').textContent = totalSales.toLocaleString();
    document.getElementById('total-transactions').textContent = totalTransactions;
    
    const salesHistory = document.getElementById('sales-history');
    
    if (sales.length === 0) {
        salesHistory.innerHTML = '<p style="text-align: center; color: #999; padding: 2rem;">📊 Belum ada transaksi</p>';
        return;
    }
    
    let html = '<h3>📝 Riwayat Transaksi:</h3>';
    
    // Show latest sales first
    const sortedSales = [...sales].reverse();
    
    sortedSales.forEach(sale => {
        html += `
            <div style="background: #f8f9fa; padding: 1rem; margin: 1rem 0; border-radius: 10px; border-left: 4px solid #4CAF50;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                    <strong>Transaksi #${sale.id}</strong>
                    <span style="color: #666;">${sale.timestamp}</span>
                </div>
                <div style="margin-bottom: 0.5rem;">
                    ${sale.items.map(item => `${item.name} (${item.quantity}x)`).join(', ')}
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Pembayaran: <strong>${sale.paymentMethod.toUpperCase()}</strong></span>
                    <span style="color: #4CAF50; font-weight: bold;">Rp ${sale.total.toLocaleString()}</span>
                </div>
            </div>
        `;
    });
    
    salesHistory.innerHTML = html;
}

// Data Persistence Functions (using memory storage for GitHub)
function saveSalesData() {
    // In a real implementation, this would save to a database
    // For GitHub pages, we'll just keep data in memory during session
    console.log('Sales data saved to memory:', { sales, totalSales, totalTransactions, inventory });
}

function loadSalesData() {
    // In a real implementation, this would load from a database
    // For GitHub pages, data will reset on page reload
    console.log('Loading sales data from memory...');
}

// Keyboard Event Listeners
document.addEventListener('keydown', function(event) {
    // Close modals with Escape key
    if (event.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.style.display = 'none';
        });
    }
    
    // Enter key for password input
    if (event.key === 'Enter' && document.getElementById('passwordInput') === document.activeElement) {
        checkPassword();
    }
});

// Click outside modal to close
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Animation Functions
function addGlowEffect(element) {
    element.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.6)';
    setTimeout(() => {
        element.style.boxShadow = '';
    }, 1000);
}

// Utility Functions
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Initialize tooltips and enhanced interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects for product images
    document.querySelectorAll('.product-img, .poster-img').forEach(img => {
        img.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        img.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
    
    // Add click sound effect (visual feedback)
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        });
    });
});

console.log('🎉 Mafia Jawa System Loaded Successfully! 🍭');
