document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const toast = document.getElementById('toast');
    const loginModal = document.getElementById('loginModal');
    const loginBtn = document.getElementById('loginBtn');
    const myOrdersBtn = document.getElementById('myOrdersBtn');
    const closeBtn = document.querySelector('.close-btn');
    const otpForm = document.getElementById('otpForm');
    const verifyOtpForm = document.getElementById('verifyOtpForm');
    const loginMsg = document.getElementById('loginMsg');
    const cartCount = document.getElementById('cart-count');
    
    // UI Behaviors
    let toastTimer;
    window.showToast = function(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('show');
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
    };

    window.updateCartCount = function() {
        if (!cartCount) return;
        fetch('/api/cart')
        .then(r => r.json())
        .then(data => {
            cartCount.textContent = data.count || 0;
        });
    };
    updateCartCount();

    window.addToCart = function(e) {
        const foodId = e.target.dataset.foodId;
        fetch('/api/cart/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 'food_id': foodId, 'quantity': 1 })
        }).then(response => response.json())
        .then(data => {
            showToast(data.message);
            updateCartCount();
            if (typeof syncCartDrawer === 'function') {
                syncCartDrawer();
            }
        }).catch(() => {
            showToast("Failed to add to cart.");
        });
    };

    // Attach listener nicely to generated product cards
    document.body.addEventListener('click', (e) => {
        if(e.target && e.target.classList.contains('add-to-cart-btn')) {
            addToCart(e);
        }
    });

    function checkLoginStatus() {
        fetch('/api/auth/status')
        .then(response => response.json())
        .then(data => {
            if (data.logged_in) {
                if(loginBtn) loginBtn.style.display = 'none';
                if(document.getElementById('logoutBtn')) document.getElementById('logoutBtn').style.display = 'block';
                
                if(data.role === 'employee') {
                    if(document.getElementById('adminPortalBtn')) document.getElementById('adminPortalBtn').style.display = 'block';
                    if(myOrdersBtn) myOrdersBtn.style.display = 'none';
                } else {
                    if(document.getElementById('adminPortalBtn')) document.getElementById('adminPortalBtn').style.display = 'none';
                    if(myOrdersBtn) myOrdersBtn.style.display = 'block';
                }
            } else {
                if(loginBtn) loginBtn.style.display = 'block';
                if(myOrdersBtn) myOrdersBtn.style.display = 'none';
                if(document.getElementById('adminPortalBtn')) document.getElementById('adminPortalBtn').style.display = 'none';
                if(document.getElementById('logoutBtn')) document.getElementById('logoutBtn').style.display = 'none';
            }
        });
    }
    checkLoginStatus();

    // Modals
    if(loginBtn) {
        loginBtn.onclick = () => loginModal.style.display = "block";
    }
    if(closeBtn) {
        closeBtn.onclick = () => {
          loginModal.style.display = "none";
          loginMsg.textContent = "";
          otpForm.style.display = 'block';
          verifyOtpForm.style.display = 'none';
        }
    }
    window.onclick = function(event) {
      if (event.target == loginModal) {
        loginModal.style.display = "none";
        loginMsg.textContent = "";
        otpForm.style.display = 'block';
        verifyOtpForm.style.display = 'none';
      }
    }

    if(otpForm) {
        otpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email_otp').value;
            const roleSelect = document.getElementById('login_role');
            const role = roleSelect ? roleSelect.value : 'customer';
            // Use login endpoint nicely
            fetch('/api/auth/send_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email, role: role })
            }).then(response => response.json())
            .then(json => {
                if (json.success) {
                    loginMsg.style.color = 'green';
                    loginMsg.textContent = json.message;
                    otpForm.style.display = 'none';
                    verifyOtpForm.style.display = 'block';
                } else {
                    loginMsg.style.color = 'red';
                    loginMsg.textContent = json.message;
                }
            });
        });
    }

    if(verifyOtpForm) {
        verifyOtpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email_otp').value;
            const otp = document.getElementById('otp').value;
            fetch('/api/auth/verify_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp })
            }).then(response => response.json())
            .then(json => {
                if (json.success) {
                    loginMsg.style.color = 'green';
                    loginMsg.textContent = "Login successful!";
                    checkLoginStatus();
                    setTimeout(() => { 
                        loginModal.style.display = "none"; 
                        window.location.reload(); 
                    }, 1000);
                } else {
                    loginMsg.style.color = 'red';
                    loginMsg.textContent = json.message;
                }
            });
        });
    }
    // Legacy auto populate code has been stripped so Jinja renders correctly.
    
    // Side Drawer Logic
    const cartDrawer = document.getElementById('cartDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const closeCartDrawer = document.getElementById('closeCartDrawer');
    const drawerCartItems = document.getElementById('drawerCartItems');
    const drawerCartTotal = document.getElementById('drawerCartTotal');

    // Make Cart buttons open the drawer instead of redirecting
    const cartNavBtn = document.querySelector('a[href="/cart"].btn');
    if (cartNavBtn) {
        cartNavBtn.addEventListener('click', (e) => {
            // Only hijacking if we are on pages that aren't the checkout itself
            if (window.location.pathname !== '/cart') {
                e.preventDefault();
                openCartDrawer();
            }
        });
    }

    if (closeCartDrawer) {
        closeCartDrawer.addEventListener('click', closeCartDrawerFn);
    }
    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeCartDrawerFn);
    }

    function openCartDrawer() {
        if (!cartDrawer) return;
        syncCartDrawer();
        cartDrawer.classList.add('open');
        drawerOverlay.classList.add('open');
    }

    function closeCartDrawerFn() {
        if (!cartDrawer) return;
        cartDrawer.classList.remove('open');
        drawerOverlay.classList.remove('open');
    }

    window.syncCartDrawer = function() {
        if (!cartDrawer) return;
        fetch('/cart') // this returns HTML of full cart, wait, we need an API endpoint for cart items.
        // Let's implement a better fetch endpoint for JSON cart.
        // For now, reload window or rely on the HTML checkout page for full summary.
        // Let's write a targeted DOM sync for the drawer.
        // Actually, we can just fetch /api/cart_details if we had one. Let's redirect to /cart to be safe if no API exists.
        // We will implement an ad-hoc fetch that hits /cart and parses the table.
        fetch('/cart')
            .then(r => r.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const table = doc.querySelector('.checkout-summary table');
                const h3Total = doc.querySelector('.checkout-summary h3');

                if (!table) {
                    drawerCartItems.innerHTML = '<p>Your cart is empty.</p>';
                    drawerCartTotal.textContent = '₹0.00';
                } else {
                    let itemsHtml = '';
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const cells = row.querySelectorAll('td');
                        const imgSrc = cells[1].querySelector('img') ? cells[1].querySelector('img').src : '';
                        itemsHtml += `
                            <div class="item-row" style="display:flex; gap: 12px; margin-bottom:15px; border-bottom:1px solid #eee; padding-bottom:10px; align-items:center;">
                                ${imgSrc ? `<img src="${imgSrc}" style="width: 45px; height: 45px; border-radius: 6px; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">` : ''}
                                <div style="flex:1;">
                                    <div style="font-weight:bold; font-size:13px;">${cells[0].textContent}</div>
                                    <div style="color:#666; font-size:11px;">Qty: ${cells[2].textContent}</div>
                                </div>
                                <strong style="color:var(--accent);">${cells[4].textContent}</strong>
                            </div>
                        `;
                    });
                    drawerCartItems.innerHTML = itemsHtml;
                    drawerCartTotal.textContent = h3Total ? h3Total.textContent.replace('Total: ', '') : '₹0.00';
                }
            });
    }
});
