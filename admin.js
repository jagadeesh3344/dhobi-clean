/**
 * Dhobiclean Executive Admin Dashboard Logic
 * Fully integrated with persistent LocalStorage data & live cross-tab sync.
 */

// Initial Seed Orders
const defaultOrders = [
  { id: '#DHB-9041', name: 'Rahul Sharma', phone: '9876543210', address: 'Banjara Hills, Hyderabad', slot: 'Today, Evening (4-8 PM)', hub: 'Jubilee Hills Hub', services: 'Wash & Iron (5 kg), Steam Press (2 pcs)', total: 340, status: 'in-wash' },
  { id: '#DHB-9042', name: 'Priya Verma', phone: '9812345678', address: 'Indiranagar 100ft Rd, Bangalore', slot: 'Tomorrow, Morning (8-12 PM)', hub: 'Indiranagar Store', services: 'Dry Cleaning (2 pcs - Blazer & Saree)', total: 240, status: 'pending' },
  { id: '#DHB-9043', name: 'Amitabh Patel', phone: '9765432109', address: 'Hill Road, Bandra West, Mumbai', slot: 'Today, Afternoon (12-4 PM)', hub: 'Bandra Care Hub', services: 'Shoe Cleaning (2 pairs), Wash & Fold (3 kg)', total: 548, status: 'delivery' },
  { id: '#DHB-9044', name: 'Sneha Reddy', phone: '9654321098', address: 'Anna Nagar, Chennai', slot: 'Yesterday, Evening (4-8 PM)', hub: 'Anna Nagar Hub', services: 'Curtains & Bedding (4 pcs)', total: 600, status: 'completed' },
  { id: '#DHB-9045', name: 'Vikram Malhotra', phone: '9543210987', address: 'Connaught Place, Delhi', slot: 'Today, Night (8-10 PM)', hub: 'Connaught Place Center', services: 'Premium Dry Cleaning (1 suit)', total: 299, status: 'in-wash' }
];

const defaultMessages = [
  { time: 'Today 10:14 AM', name: 'Kavita Menon', email: 'kavita@gmail.com', phone: '9845011223', snippet: 'Can you handle delicate silk sarees with zari work?', status: 'New' },
  { time: 'Today 09:30 AM', name: 'Deepak Joshi', email: 'deepak.j@yahoo.com', phone: '9711099887', snippet: 'Inquiring about monthly express subscription plans.', status: 'Replied' }
];

let ordersData = [];
let messagesData = [];

// Services Catalog
let servicesData = [
  { name: 'Wash & Iron', category: 'Everyday Care', rate: 60, unit: 'per kg', time: '24 Hours', status: 'Active' },
  { name: 'Dry Cleaning', category: 'Delicate Care', rate: 120, unit: 'per pc', time: '48 Hours', status: 'Active' },
  { name: 'Wash & Fold', category: 'Bulk Casuals', rate: 50, unit: 'per kg', time: '24 Hours', status: 'Active' },
  { name: 'Shoe Cleaning Spa', category: 'Footwear', rate: 199, unit: 'per pair', time: '48 Hours', status: 'Active' },
  { name: 'Steam Pressing', category: 'Quick Touchup', rate: 20, unit: 'per pc', time: '4 Hours', status: 'Active' },
  { name: 'Curtains & Bedding', category: 'Heavy Household', rate: 150, unit: 'per pc', time: '72 Hours', status: 'Active' }
];

// Drivers Fleet
let driversData = [
  { id: 'DRV-101', name: 'Mahesh Kumar', hub: 'Jubilee Hills Hub', vehicle: 'TS 09 EA 4412', activeJobs: 3, status: 'En-Route' },
  { id: 'DRV-102', name: 'Santhosh Gowda', hub: 'Indiranagar Store', vehicle: 'KA 01 MJ 8821', activeJobs: 2, status: 'At Customer' },
  { id: 'DRV-103', name: 'Rajesh Shinde', hub: 'Bandra Care Hub', vehicle: 'MH 02 FK 9011', activeJobs: 0, status: 'Available' }
];

// Promos
let promosData = [
  { code: 'FRESH20', discount: 20, minOrder: 300, uses: 124, status: 'Active' },
  { code: 'WELCOME50', discount: 50, minOrder: 500, uses: 89, status: 'Active' },
  { code: 'MONSOON30', discount: 30, minOrder: 400, uses: 45, status: 'Active' }
];

/**
 * Load Orders & Messages from LocalStorage
 */
function loadDataFromStorage() {
  try {
    const storedOrders = localStorage.getItem('dhobi_orders');
    if (storedOrders) {
      ordersData = JSON.parse(storedOrders);
    } else {
      ordersData = [...defaultOrders];
      localStorage.setItem('dhobi_orders', JSON.stringify(ordersData));
    }

    const storedMsgs = localStorage.getItem('dhobi_messages');
    if (storedMsgs) {
      messagesData = JSON.parse(storedMsgs);
    } else {
      messagesData = [...defaultMessages];
      localStorage.setItem('dhobi_messages', JSON.stringify(messagesData));
    }
  } catch (err) {
    console.warn('LocalStorage load error:', err);
    ordersData = [...defaultOrders];
    messagesData = [...defaultMessages];
  }

  updateKPICards();
  renderOrdersTable();
  renderMessagesTable();
}

function saveDataToStorage() {
  try {
    localStorage.setItem('dhobi_orders', JSON.stringify(ordersData));
    localStorage.setItem('dhobi_messages', JSON.stringify(messagesData));
  } catch (err) {
    console.warn('LocalStorage save error:', err);
  }
}

/**
 * Update Executive KPI Metrics Cards
 */
function updateKPICards() {
  const kpiTotalOrders = document.getElementById('kpi-total-orders');
  const kpiTotalRevenue = document.getElementById('kpi-total-revenue');
  const kpiGarmentsCount = document.getElementById('kpi-garments-count');

  if (kpiTotalOrders) {
    kpiTotalOrders.textContent = ordersData.length;
  }

  if (kpiTotalRevenue) {
    const totalRev = ordersData.reduce((acc, curr) => acc + (parseInt(curr.total, 10) || 0), 0);
    kpiTotalRevenue.textContent = `₹${totalRev.toLocaleString('en-IN')}`;
  }

  if (kpiGarmentsCount) {
    const estGarments = ordersData.length * 12 + 420;
    kpiGarmentsCount.textContent = `${estGarments.toLocaleString('en-IN')} pcs`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkAdminAuth();
  loadDataFromStorage();
  renderServicesTable();
  renderDriversTable();
  renderPromosTable();

  // Cross-Tab Sync via Storage Event & Auto-Polling
  window.addEventListener('storage', () => {
    loadDataFromStorage();
  });

  // Auto-refresh live feed every 2 seconds
  setInterval(() => {
    if (sessionStorage.getItem('dhobi_admin_auth') === 'true') {
      loadDataFromStorage();
    }
  }, 2000);
});

/**
 * Retrieve persistent Admin Credentials from LocalStorage (or fallback defaults)
 */
function getAdminCredentials() {
  try {
    const stored = localStorage.getItem('dhobi_admin_creds');
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.username && parsed.password) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Credentials read error:', err);
  }
  return { username: 'admin', password: 'admin123' };
}

/**
 * Check Admin Authentication Status
 */
function checkAdminAuth() {
  const isAuth = sessionStorage.getItem('dhobi_admin_auth') === 'true';
  const loginModal = document.getElementById('admin-login-modal');
  const mainWrapper = document.querySelector('.admin-main-wrapper');
  const logoutBtn = document.getElementById('btn-admin-logout');

  if (isAuth) {
    if (loginModal) loginModal.classList.remove('show');
    if (mainWrapper) {
      mainWrapper.style.filter = 'none';
      mainWrapper.style.pointerEvents = 'auto';
    }
    if (logoutBtn) logoutBtn.style.display = 'inline-flex';
  } else {
    if (loginModal) loginModal.classList.add('show');
    if (mainWrapper) {
      mainWrapper.style.filter = 'blur(16px)';
      mainWrapper.style.pointerEvents = 'none';
    }
    if (logoutBtn) logoutBtn.style.display = 'none';
  }
}

/**
 * Handle Admin Login Submission against persistent credentials
 */
function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById('admin-username').value.trim();
  const pass = document.getElementById('admin-password').value.trim();
  const errorMsg = document.getElementById('login-error-msg');
  const activeCreds = getAdminCredentials();

  if (user === activeCreds.username && pass === activeCreds.password) {
    sessionStorage.setItem('dhobi_admin_auth', 'true');
    if (errorMsg) errorMsg.style.display = 'none';
    checkAdminAuth();
  } else {
    if (errorMsg) {
      errorMsg.textContent = '❌ Invalid Username or Password!';
      errorMsg.style.display = 'block';
    }
  }
}

/**
 * Handle Changing Admin Username & Password
 */
function handleChangeCredentialsSubmit(e) {
  e.preventDefault();

  const currentPass = document.getElementById('settings-current-pass').value.trim();
  const newUser = document.getElementById('settings-new-user').value.trim();
  const newPass = document.getElementById('settings-new-pass').value.trim();
  const confirmPass = document.getElementById('settings-confirm-pass').value.trim();
  const statusMsg = document.getElementById('settings-status-msg');

  const activeCreds = getAdminCredentials();

  // Verify current password
  if (currentPass !== activeCreds.password) {
    showSettingsStatus('❌ Incorrect Current Password. Access denied.', 'error');
    return;
  }

  // Verify password confirmation
  if (newPass !== confirmPass) {
    showSettingsStatus('❌ New Password and Confirm Password do not match!', 'error');
    return;
  }

  if (newPass.length < 4) {
    showSettingsStatus('❌ New Password must be at least 4 characters long!', 'error');
    return;
  }

  // Save new credentials to LocalStorage
  const updatedCreds = { username: newUser, password: newPass };
  try {
    localStorage.setItem('dhobi_admin_creds', JSON.stringify(updatedCreds));
    showSettingsStatus(`✅ Credentials updated successfully! New Username: "${newUser}". Use your new password on next login.`, 'success');

    // Reset inputs
    document.getElementById('settings-current-pass').value = '';
    document.getElementById('settings-new-user').value = '';
    document.getElementById('settings-new-pass').value = '';
    document.getElementById('settings-confirm-pass').value = '';
  } catch (err) {
    showSettingsStatus('❌ Failed to save new credentials in storage.', 'error');
  }
}

function showSettingsStatus(msg, type) {
  const statusMsg = document.getElementById('settings-status-msg');
  if (!statusMsg) return;

  statusMsg.textContent = msg;
  statusMsg.style.display = 'block';

  if (type === 'error') {
    statusMsg.style.background = 'rgba(239, 68, 68, 0.18)';
    statusMsg.style.border = '1px solid rgba(239, 68, 68, 0.4)';
    statusMsg.style.color = '#f87171';
  } else {
    statusMsg.style.background = 'rgba(16, 185, 129, 0.18)';
    statusMsg.style.border = '1px solid rgba(52, 211, 153, 0.4)';
    statusMsg.style.color = '#34d399';
  }
}

/**
 * Handle Admin Logout
 */
function handleAdminLogout() {
  if (confirm('Are you sure you want to log out of the Executive Admin Panel?')) {
    sessionStorage.removeItem('dhobi_admin_auth');
    checkAdminAuth();
  }
}

window.getAdminCredentials = getAdminCredentials;
window.checkAdminAuth = checkAdminAuth;
window.handleAdminLogin = handleAdminLogin;
window.handleChangeCredentialsSubmit = handleChangeCredentialsSubmit;
window.handleAdminLogout = handleAdminLogout;



/**
 * Tab Switching
 */
function switchAdminTab(tabKey) {
  document.querySelectorAll('.admin-tab-btn').forEach(btn => btn.classList.remove('active'));
  document.querySelectorAll('.admin-tab-content').forEach(content => content.classList.remove('active'));

  const activeBtn = document.querySelector(`.admin-tab-btn[onclick*="${tabKey}"]`);
  const activeContent = document.getElementById(`tab-${tabKey}`);

  if (activeBtn) activeBtn.classList.add('active');
  if (activeContent) activeContent.classList.add('active');
}

/**
 * Render Orders Table
 */
function renderOrdersTable(dataToRender = ordersData) {
  const tbody = document.getElementById('admin-orders-tbody');
  if (!tbody) return;

  if (dataToRender.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #94a3b8; padding: 32px; font-weight: 600;">No live orders found. Click "+ New Manual Order" to dispatch one.</td></tr>`;
    return;
  }

  tbody.innerHTML = dataToRender.map((ord, idx) => `
    <tr>
      <td class="order-id-badge">${ord.id}</td>
      <td><strong style="color: #ffffff; font-size: 14px;">${ord.name}</strong><br><span style="font-size: 11.5px; color: #94a3b8;">${ord.address || 'Address provided'}</span></td>
      <td><span style="font-family: monospace; color: #cbd5e1;">${ord.phone}</span></td>
      <td><span style="font-size: 12.5px; color: #e2e8f0;">${ord.slot}</span></td>
      <td><span class="store-type-tag" style="font-size: 11px;">${ord.hub}</span></td>
      <td><span style="font-size: 12.5px; color: #cbd5e1;">${ord.services}</span></td>
      <td><strong style="color: #34d399; font-size: 14.5px;">₹${ord.total}</strong></td>
      <td>
        <select class="table-status-select" onchange="updateOrderStatus(${idx}, this.value)">
          <option value="pending" ${ord.status === 'pending' ? 'selected' : ''}>⏳ Pending Pickup</option>
          <option value="in-wash" ${ord.status === 'in-wash' ? 'selected' : ''}>🧼 In Wash</option>
          <option value="delivery" ${ord.status === 'delivery' ? 'selected' : ''}>🚚 Out For Delivery</option>
          <option value="completed" ${ord.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
        </select>
      </td>
      <td>
        <button onclick="deleteOrder(${idx})" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 12px; font-weight: 700; transition: all 0.2s ease;">Cancel</button>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(idx, newStatus) {
  ordersData[idx].status = newStatus;
  saveDataToStorage();
  updateKPICards();
}

function deleteOrder(idx) {
  if (confirm(`Are you sure you want to cancel order ${ordersData[idx].id}?`)) {
    ordersData.splice(idx, 1);
    saveDataToStorage();
    renderOrdersTable();
    updateKPICards();
  }
}

function filterOrdersTable(query) {
  const q = query.toLowerCase();
  const filtered = ordersData.filter(ord => 
    ord.name.toLowerCase().includes(q) || 
    ord.id.toLowerCase().includes(q) ||
    ord.phone.includes(q) ||
    (ord.address && ord.address.toLowerCase().includes(q))
  );
  renderOrdersTable(filtered);
}

/**
 * Render Services Table
 */
function renderServicesTable() {
  const tbody = document.getElementById('admin-services-tbody');
  if (!tbody) return;

  tbody.innerHTML = servicesData.map((s, idx) => `
    <tr>
      <td><strong style="color: #ffffff; font-size: 14px;">${s.name}</strong></td>
      <td><span style="color: #38bdf8; font-weight: 700;">${s.category}</span></td>
      <td>
        <input type="number" value="${s.rate}" onchange="updateServiceRate(${idx}, this.value)" style="width: 80px; background: rgba(15, 23, 42, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); color: #ffffff; padding: 5px 10px; border-radius: 8px; font-weight: 800; font-size: 13px;">
      </td>
      <td><span style="color: #94a3b8;">${s.unit}</span></td>
      <td><span style="color: #e2e8f0;">${s.time}</span></td>
      <td><span class="status-pill completed">${s.status}</span></td>
      <td>
        <button onclick="alert('Price saved successfully!')" class="btn-admin-action" style="padding: 6px 14px; font-size: 12px;">Save</button>
      </td>
    </tr>
  `).join('');
}

function updateServiceRate(idx, val) {
  servicesData[idx].rate = parseInt(val, 10) || 0;
}

function addNewServicePrompt() {
  const name = prompt('Enter New Service Name:');
  const rate = prompt('Enter Price (₹):');
  if (name && rate) {
    servicesData.push({ name, category: 'Custom Care', rate: parseInt(rate, 10), unit: 'per pc', time: '24 Hours', status: 'Active' });
    renderServicesTable();
  }
}

/**
 * Render Messages Table
 */
function renderMessagesTable() {
  const tbody = document.getElementById('admin-messages-tbody');
  if (!tbody) return;

  if (messagesData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #94a3b8; padding: 32px; font-weight: 600;">No support messages yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = messagesData.map((m) => `
    <tr>
      <td style="color: #94a3b8; font-size: 12px; font-weight: 600;">${m.time}</td>
      <td><strong style="color: #ffffff;">${m.name}</strong></td>
      <td><span style="color: #38bdf8;">${m.email}</span></td>
      <td><span style="font-family: monospace;">${m.phone}</span></td>
      <td><em style="color: #cbd5e1;">"${m.snippet}"</em></td>
      <td><span class="status-pill ${m.status === 'New' ? 'pending' : 'completed'}">${m.status}</span></td>
      <td>
        <a href="mailto:${m.email}" style="background: rgba(56, 189, 248, 0.2); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.4); text-decoration: none; padding: 6px 14px; border-radius: 8px; font-size: 12px; font-weight: 800; display: inline-block;">Reply</a>
      </td>
    </tr>
  `).join('');
}

/**
 * Render Drivers Table
 */
function renderDriversTable() {
  const tbody = document.getElementById('admin-drivers-tbody');
  if (!tbody) return;

  tbody.innerHTML = driversData.map(d => `
    <tr>
      <td class="order-id-badge">${d.id}</td>
      <td><strong style="color: #ffffff;">${d.name}</strong></td>
      <td><span class="store-type-tag">${d.hub}</span></td>
      <td><code style="color: #38bdf8; background: rgba(255,255,255,0.06); padding: 4px 8px; border-radius: 6px;">${d.vehicle}</code></td>
      <td><strong style="color: #34d399;">${d.activeJobs} Pickups</strong></td>
      <td><span class="status-pill ${d.status === 'Available' ? 'completed' : 'in-wash'}">${d.status}</span></td>
      <td>
        <button onclick="alert('Dispatching SMS alert to driver ${d.name}')" class="btn-admin-action secondary" style="padding: 5px 12px; font-size: 11.5px;">Ping Driver</button>
      </td>
    </tr>
  `).join('');
}

/**
 * Render Promos Table
 */
function renderPromosTable() {
  const tbody = document.getElementById('admin-promos-tbody');
  if (!tbody) return;

  tbody.innerHTML = promosData.map((p, idx) => `
    <tr>
      <td><strong style="color: #f43f5e; font-family: monospace; font-size: 14px; letter-spacing: 0.08em; background: rgba(244,63,94,0.12); padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(244,63,94,0.3);">${p.code}</strong></td>
      <td><strong style="color: #34d399; font-size: 14px;">${p.discount}% OFF</strong></td>
      <td><span style="color: #cbd5e1;">₹${p.minOrder}</span></td>
      <td><span style="color: #94a3b8;">${p.uses} redeemed</span></td>
      <td><span class="status-pill completed">${p.status}</span></td>
      <td>
        <button onclick="promosData.splice(${idx},1); renderPromosTable();" style="background: rgba(239, 68, 68, 0.18); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); padding: 5px 12px; border-radius: 8px; cursor: pointer; font-size: 11.5px; font-weight: 700;">Delete</button>
      </td>
    </tr>
  `).join('');
}


function createPromoPrompt() {
  const code = prompt('Enter New Promo Code (e.g. FESTIVE25):');
  const discount = prompt('Enter Discount Percentage (e.g. 25):');
  if (code && discount) {
    promosData.push({ code: code.toUpperCase(), discount: parseInt(discount, 10), minOrder: 300, uses: 0, status: 'Active' });
    renderPromosTable();
  }
}

/**
 * New Order Modal & Submissions
 */
function openNewOrderModal() {
  const modal = document.getElementById('new-order-modal');
  if (modal) modal.classList.add('show');
  setupStrictPhoneValidation(
    document.getElementById('manual-phone'),
    document.getElementById('manual-phone-hint')
  );
}

function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

/**
 * Setup strict 10-digit mobile number rules
 */
function setupStrictPhoneValidation(inputEl, hintEl) {
  if (!inputEl || inputEl.dataset.strictInit) return;
  inputEl.dataset.strictInit = 'true';

  function updateHint(val) {
    if (!hintEl) return;
    if (val.length === 0) {
      hintEl.textContent = 'Enter 10-digit number starting with 6, 7, 8, or 9';
      hintEl.className = 'phone-validation-hint';
      inputEl.classList.remove('phone-valid', 'phone-invalid');
    } else if (val.length < 10) {
      hintEl.textContent = `${val.length}/10 digits (${10 - val.length} more needed)`;
      hintEl.className = 'phone-validation-hint typing';
      inputEl.classList.remove('phone-valid');
      inputEl.classList.add('phone-invalid');
    } else if (val.length === 10 && /^[6-9]\d{9}$/.test(val)) {
      hintEl.textContent = '✓ Valid 10-digit mobile number';
      hintEl.className = 'phone-validation-hint valid';
      inputEl.classList.remove('phone-invalid');
      inputEl.classList.add('phone-valid');
    } else {
      hintEl.textContent = '❌ Must be 10 digits starting with 6, 7, 8, or 9';
      hintEl.className = 'phone-validation-hint error';
      inputEl.classList.remove('phone-valid');
      inputEl.classList.add('phone-invalid');
    }
  }

  inputEl.addEventListener('keydown', (e) => {
    if (
      ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(e.key) ||
      (e.ctrlKey || e.metaKey)
    ) {
      return;
    }

    if (!/^[0-9]$/.test(e.key)) {
      e.preventDefault();
      return;
    }

    const value = inputEl.value;
    const isReplacingAll = inputEl.selectionStart === 0 && inputEl.selectionEnd === value.length;

    if ((value.length === 0 || isReplacingAll) && !/^[6-9]$/.test(e.key)) {
      e.preventDefault();
      if (hintEl) {
        hintEl.textContent = '❌ Mobile number must start with 6, 7, 8, or 9';
        hintEl.className = 'phone-validation-hint error';
      }
      inputEl.classList.add('phone-error-shake');
      setTimeout(() => inputEl.classList.remove('phone-error-shake'), 400);
      return;
    }

    if (value.length >= 10 && inputEl.selectionStart === inputEl.selectionEnd) {
      e.preventDefault();
      if (hintEl) {
        hintEl.textContent = '⚠️ Maximum 10 digits reached';
        setTimeout(() => updateHint(inputEl.value), 1200);
      }
    }
  });

  inputEl.addEventListener('input', () => {
    let val = inputEl.value.replace(/\D/g, '');

    if (val.length > 10) {
      if (val.startsWith('91') && /^[6-9]/.test(val.slice(2))) {
        val = val.slice(2);
      } else if (val.startsWith('0') && /^[6-9]/.test(val.slice(1))) {
        val = val.slice(1);
      }
    }

    while (val.length > 0 && !/^[6-9]/.test(val)) {
      val = val.slice(1);
    }

    if (val.length > 10) {
      val = val.slice(0, 10);
    }

    inputEl.value = val;
    updateHint(val);
  });

  inputEl.addEventListener('blur', () => {
    updateHint(inputEl.value);
  });

  if (inputEl.value) {
    let val = inputEl.value.replace(/\D/g, '');
    if (val.length > 10) val = val.slice(0, 10);
    inputEl.value = val;
    updateHint(val);
  }
}

function handleManualOrderSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('manual-name');
  const phoneInput = document.getElementById('manual-phone');
  const addressInput = document.getElementById('manual-address');
  const hubInput = document.getElementById('manual-hub');
  const serviceInput = document.getElementById('manual-service');

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();
  const address = addressInput.value.trim();
  const hub = hubInput.value;
  const service = serviceInput.value;

  // Strict 10-digit mobile number validation
  const phoneRegex = /^[6-9]\d{9}$/;
  if (!phoneRegex.test(phone)) {
    alert('Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.');
    phoneInput.focus();
    phoneInput.classList.add('phone-error-shake');
    const hint = document.getElementById('manual-phone-hint');
    if (hint) {
      hint.textContent = '❌ Must be exactly 10 digits starting with 6, 7, 8, or 9';
      hint.className = 'phone-validation-hint error';
    }
    setTimeout(() => phoneInput.classList.remove('phone-error-shake'), 400);
    return;
  }

  const newId = `#DHB-${Math.floor(100000 + Math.random() * 900000)}`;

  ordersData.unshift({
    id: newId,
    name,
    phone,
    address,
    slot: 'Today, Immediate Express',
    hub,
    services: service,
    total: 350,
    status: 'pending',
    timestamp: new Date().toISOString()
  });

  saveDataToStorage();
  updateKPICards();
  renderOrdersTable();
  closeAdminModal('new-order-modal');
  alert(`Order ${newId} created successfully for ${name}!`);
}


/**
 * Export Orders to CSV
 */
function exportOrdersCSV() {
  let csvContent = 'data:text/csv;charset=utf-8,Order ID,Customer Name,Phone,Address,Slot,Hub,Services,Total,Status\n';
  ordersData.forEach(o => {
    csvContent += `"${o.id}","${o.name}","${o.phone}","${o.address || ''}","${o.slot}","${o.hub}","${o.services}",${o.total},"${o.status}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Dhobiclean_Orders_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
