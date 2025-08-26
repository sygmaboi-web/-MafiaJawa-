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
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span>Pembayaran: <strong>${sale.paymentMethod.toUpperCase()}</strong></span>
                        <span style="color: #4CAF50; font-weight: bold; margin-left: 1rem;">Rp ${sale.total.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="downloadReceiptPDF(${JSON.stringify(sale).replace(/"/g, '&quot;')})" style="background: #FF9800; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                            📥 Download
                        </button>
                        <button onclick="shareReceipt(${JSON.stringify(sale).replace(/"/g, '&quot;')})" style="background: #9C27B0; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                            📤 Share
                        </button>
                    </div>
                </div>
            </div>
        `;
    });// Global Variables
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
        
        <div style="text-align: center; margin-top: 2rem; display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="printReceipt()" style="background: linear-gradient(45deg, #4CAF50, #2196F3); padding: 0.8rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; font-weight: bold;">
                🖨️ Print
            </button>
            <button onclick="downloadReceiptPDF(window.currentSale)" style="background: linear-gradient(45deg, #FF9800, #F44336); padding: 0.8rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; font-weight: bold;">
                📥 Download
            </button>
            <button onclick="shareReceipt(window.currentSale)" style="background: linear-gradient(45deg, #9C27B0, #E91E63); padding: 0.8rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; font-weight: bold;">
                📤 Share
            </button>
            <button onclick="copyToClipboard('🍭 MAFIA JAWA - STRUK #' + window.currentSale.id + '\\n' + window.currentSale.timestamp + '\\nTotal: Rp ' + window.currentSale.total.toLocaleString() + '\\nTerima kasih telah berbelanja!')" style="background: linear-gradient(45deg, #00BCD4, #009688); padding: 0.8rem 1.5rem; border: none; border-radius: 25px; color: white; cursor: pointer; font-weight: bold;">
                📋 Copy
            </button>
        </div>
    `;
    
    // Store current sale for easy access
    window.currentSale = sale;
    
    document.getElementById('receiptModal').style.display = 'block';
}

function printReceipt() {
    const printWindow = window.open('', '_blank');
    const receiptContent = document.querySelector('.receipt');
    
    printWindow.document.write(`
        <html>
            <head>
                <title>Struk Pembayaran - Mafia Jawa</title>
                <style>
                    body { font-family: 'Courier New', monospace; margin: 20px; background: white; }
                    .receipt { max-width: 300px; margin: 0 auto; }
                    .receipt-header { text-align: center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 10px; }
                    .receipt-item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .receipt-total { border-top: 1px solid #333; padding-top: 10px; margin-top: 10px; }
                </style>
            </head>
            <body>
                ${receiptContent.outerHTML}
            </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}

function downloadReceipt(sale) {
    // Create receipt text content
    let receiptText = `
🍭 MAFIA JAWA 🍭
NineFoosion
SMP Islam Plus Baitulmaal
Market Day Kelas 9
============================
${sale.timestamp}
No Transaksi: ${sale.id}
============================

DETAIL PEMBELIAN:
`;

    sale.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        receiptText += `${item.name} (${item.quantity}x)     Rp ${itemTotal.toLocaleString()}\n`;
    });

    receiptText += `
============================
TOTAL             Rp ${sale.total.toLocaleString()}
Pembayaran: ${sale.paymentMethod.toUpperCase()}
============================

Terima kasih telah berbelanja!
🎉 Mafia Jawa - NineFoosion 🎉
Sampai jumpa lagi! 😊

Alamat: SMP Islam Plus Baitulmaal
Event: Market Day Kelas 9
Kelompok: KELOMPOK1KEREN
`;

    // Create downloadable file
    const blob = new Blob([receiptText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struk_MafiaJawa_${sale.id}.txt`;
    
    // Add to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    window.URL.revokeObjectURL(url);
    
    showNotification('📥 Struk berhasil didownload!', 'success');
}

function downloadReceiptPDF(sale) {
    // Create a more detailed receipt content for sharing
    let receiptContent = `
═══════════════════════════════
🍭 MAFIA JAWA 🍭
NineFoosion
SMP Islam Plus Baitulmaal
Market Day Kelas 9
═══════════════════════════════

📅 Tanggal: ${sale.timestamp}
🧾 No Transaksi: ${sale.id}

═══════════════════════════════
📦 DETAIL PEMBELIAN:
═══════════════════════════════
`;

    sale.items.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const itemName = item.name.padEnd(20, ' ');
        const qty = `${item.quantity}x`.padStart(4, ' ');
        const price = `Rp ${itemTotal.toLocaleString()}`.padStart(12, ' ');
        receiptContent += `${itemName}${qty}${price}\n`;
    });

    receiptContent += `
═══════════════════════════════
💰 TOTAL PEMBAYARAN: Rp ${sale.total.toLocaleString()}
💳 Metode Pembayaran: ${sale.paymentMethod.toUpperCase()}
═══════════════════════════════

✨ Terima kasih telah berbelanja! ✨
🎉 Mafia Jawa - NineFoosion 🎉
😊 Sampai jumpa lagi! 😊

📧 Kelompok: KELOMPOK1KEREN
🏫 SMP Islam Plus Baitulmaal
🎪 Event: Market Day Kelas 9

═══════════════════════════════
📱 Untuk informasi lebih lanjut:
🌐 Website: sygmaboi-web.github.io/-MafiaJawa-/
═══════════════════════════════
`;

    // Create blob and download
    const blob = new Blob([receiptContent], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Struk_MafiaJawa_${new Date().toISOString().split('T')[0]}_${sale.id}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('📥 Struk berhasil didownload sebagai file TXT!', 'success');
}

function shareReceipt(sale) {
    // Create shareable text for mobile sharing
    const shareText = `🍭 MAFIA JAWA - STRUK PEMBELIAN 🍭

📅 ${sale.timestamp}
🧾 No: ${sale.id}

📦 PEMBELIAN:
${sale.items.map(item => `• ${item.name} (${item.quantity}x) - Rp ${(item.price * item.quantity).toLocaleString()}`).join('\n')}

💰 TOTAL: Rp ${sale.total.toLocaleString()}
💳 Pembayaran: ${sale.paymentMethod.toUpperCase()}

✨ Terima kasih telah berbelanja di Mafia Jawa! 
🎉 NineFoosion - Market Day Kelas 9 🎉`;

    // Check if Web Share API is supported
    if (navigator.share && navigator.canShare) {
        navigator.share({
            title: 'Struk Pembelian - Mafia Jawa',
            text: shareText,
        }).then(() => {
            showNotification('📤 Struk berhasil dibagikan!', 'success');
        }).catch((error) => {
            console.log('Error sharing:', error);
            copyToClipboard(shareText);
        });
    } else {
        // Fallback: copy to clipboard
        copyToClipboard(shareText);
    }
}

function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('📋 Struk berhasil disalin ke clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            showNotification('📋 Struk berhasil disalin ke clipboard!', 'success');
        } catch (err) {
            showNotification('❌ Gagal menyalin struk', 'error');
        }
        
        document.body.removeChild(textArea);
    }
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
    
    let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h3>📝 Riwayat Transaksi:</h3>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="exportSalesToCSV()" style="background: #4CAF50; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">
                    📊 Export CSV
                </button>
                <button onclick="generateSalesReport()" style="background: #2196F3; color: white; border: none; padding: 0.5rem 1rem; border-radius: 20px; cursor: pointer; font-size: 0.9rem;">
                    📋 Laporan
                </button>
            </div>
        </div>
    `;
    
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
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span>Pembayaran: <strong>${sale.paymentMethod.toUpperCase()}</strong></span>
                        <span style="color: #4CAF50; font-weight: bold; margin-left: 1rem;">Rp ${sale.total.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="downloadReceiptPDF(${JSON.stringify(sale).replace(/"/g, '&quot;')})" style="background: #FF9800; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                            📥 Download
                        </button>
                        <button onclick="shareReceipt(${JSON.stringify(sale).replace(/"/g, '&quot;')})" style="background: #9C27B0; color: white; border: none; padding: 0.3rem 0.8rem; border-radius: 15px; cursor: pointer; font-size: 0.8rem;">
                            📤 Share
                        </button>
                    </div>
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

// Export Functions
function exportSalesToCSV() {
    if (sales.length === 0) {
        alert('❌ Tidak ada data penjualan untuk diexport!');
        return;
    }

    // Create CSV header
    let csvContent = 'No Transaksi,Tanggal,Waktu,Produk,Quantity,Harga Satuan,Subtotal,Total,Metode Pembayaran\n';

    // Add sales data
    sales.forEach(sale => {
        const [date, time] = sale.timestamp.split(' ');
        sale.items.forEach(item => {
            csvContent += `${sale.id},"${date}","${time}","${item.name}",${item.quantity},${item.price},${item.price * item.quantity},${sale.total},"${sale.paymentMethod}"\n`;
        });
    });

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Data_Penjualan_MafiaJawa_${new Date().toISOString().split('T')[0]}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('📊 Data penjualan berhasil diexport ke CSV!', 'success');
}

function generateSalesReport() {
    if (sales.length === 0) {
        alert('❌ Tidak ada data untuk laporan!');
        return;
    }

    // Calculate statistics
    const productSales = {};
    const paymentMethods = {};
    let totalRevenue = 0;

    sales.forEach(sale => {
        totalRevenue += sale.total;
        
        // Count payment methods
        paymentMethods[sale.paymentMethod] = (paymentMethods[sale.paymentMethod] || 0) + 1;
        
        // Count product sales
        sale.items.forEach(item => {
            if (!productSales[item.name]) {
                productSales[item.name] = { quantity: 0, revenue: 0 };
            }
            productSales[item.name].quantity += item.quantity;
            productSales[item.name].revenue += item.price * item.quantity;
        });
    });

    // Generate report
    let reportText = `
═══════════════════════════════════════
📊 LAPORAN PENJUALAN MAFIA JAWA 📊
═══════════════════════════════════════
🏪 Toko: Mafia Jawa - NineFoosion
📅 Tanggal Generate: ${new Date().toLocaleString('id-ID')}
🎪 Event: Market Day Kelas 9
🏫 SMP Islam Plus Baitulmaal

═══════════════════════════════════════
💰 RINGKASAN KEUANGAN
═══════════════════════════════════════
Total Transaksi: ${sales.length} transaksi
Total Pendapatan: Rp ${totalRevenue.toLocaleString()}
Rata-rata per Transaksi: Rp ${Math.round(totalRevenue / sales.length).toLocaleString()}

═══════════════════════════════════════
📈 PENJUALAN PER PRODUK
═══════════════════════════════════════`;

    Object.entries(productSales).forEach(([product, data]) => {
        reportText += `\n${product}:`;
        reportText += `\n  • Terjual: ${data.quantity} pcs`;
        reportText += `\n  • Pendapatan: Rp ${data.revenue.toLocaleString()}`;
        reportText += `\n  • Kontribusi: ${((data.revenue / totalRevenue) * 100).toFixed(1)}%\n`;
    });

    reportText += `\n═══════════════════════════════════════
💳 METODE PEMBAYARAN
═══════════════════════════════════════`;

    Object.entries(paymentMethods).forEach(([method, count]) => {
        const percentage = ((count / sales.length) * 100).toFixed(1);
        reportText += `\n${method.toUpperCase()}: ${count} transaksi (${percentage}%)`;
    });

    reportText += `\n\n═══════════════════════════════════════
📋 DETAIL TRANSAKSI
═══════════════════════════════════════`;

    sales.forEach(sale => {
        reportText += `\n\n🧾 Transaksi #${sale.id} - ${sale.timestamp}`;
        reportText += `\n💳 Pembayaran: ${sale.paymentMethod.toUpperCase()}`;
        reportText += `\n📦 Items:`;
        sale.items.forEach(item => {
            reportText += `\n   • ${item.name} (${item.quantity}x) = Rp ${(item.price * item.quantity).toLocaleString()}`;
        });
        reportText += `\n💰 Total: Rp ${sale.total.toLocaleString()}`;
    });

    reportText += `\n\n═══════════════════════════════════════
📞 KONTAK & INFO
═══════════════════════════════════════
👥 Kelompok: KELOMPOK1KEREN
🌐 Website: sygmaboi-web.github.io/-MafiaJawa-/
🏫 Lokasi: SMP Islam Plus Baitulmaal

═══════════════════════════════════════
Laporan ini digenerate otomatis oleh
sistem Mafia Jawa - NineFoosion
═══════════════════════════════════════`;

    // Create and download file
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Laporan_Penjualan_MafiaJawa_${new Date().toISOString().split('T')[0]}.txt`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    showNotification('📋 Laporan penjualan berhasil didownload!', 'success');
}
