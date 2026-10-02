/**
 * Dhobiclean Executive Admin Dashboard Logic
 */

// Initial Mock Live Orders Dataset
let ordersData = [
  { id: '#DHB-9041', name: 'Rahul Sharma', phone: '9876543210', slot: 'Today, Evening (4-8 PM)', hub: 'Jubilee Hills Hub', services: 'Wash & Iron (5 kg), Steam Press (2 pcs)', total: 340, status: 'in-wash' },
  { id: '#DHB-9042', name: 'Priya Verma', phone: '9812345678', slot: 'Tomorrow, Morning (8-12 PM)', hub: 'Indiranagar Store', services: 'Dry Cleaning (2 pcs - Blazer & Saree)', total: 240, status: 'pending' },
  { id: '#DHB-9043', name: 'Amitabh Patel', phone: '9765432109', slot: 'Today, Afternoon (12-4 PM)', hub: 'Bandra Care Hub', services: 'Shoe Cleaning (2 pairs), Wash & Fold (3 kg)', total: 548, status: 'delivery' },
  { id: '#DHB-9044', name: 'Sneha Reddy', phone: '9654321098', slot: 'Yesterday, Evening (4-8 PM)', hub: 'Anna Nagar Hub', services: 'Curtains & Bedding (4 pcs)', total: 600, status: 'completed' },
  { id: '#DHB-9045', name: 'Vikram Malhotra', phone: '9543210987', slot: 'Today, Night (8-10 PM)', hub: 'Connaught Place Center', services: 'Premium Dry Cleaning (1 suit)', total: 299, status: 'in-wash' }
];

// Services Catalog
let servicesData = [
  { name: 'Wash & Iron', category: 'Everyday Care', rate: 60, unit: 'per kg', time: '24 Hours', status: 'Active' },
  { name: 'Dry Cleaning', category: 'Delicate Care', rate: 120, unit: 'per pc', time: '48 Hours', status: 'Active' },
  { name: 'Wash & Fold', category: 'Bulk Casuals', rate: 50, unit: 'per kg', time: '24 Hours', status: 'Active' },
  { name: 'Shoe Cleaning Spa', category: 'Footwear', rate: 199, unit: 'per pair', time: '48 Hours', status: 'Active' },
  { name: 'Steam Pressing', category: 'Quick Touchup', rate: 20, unit: 'per pc', time: '4 Hours', status: 'Active' },
  { name: 'Curtains & Bedding', category: 'Heavy Household', rate: 150, unit: 'per pc', time: '72 Hours', status: 'Active' }
];

// Customer Messages
let messagesData = [
  { time: 'Today 10:14 AM', name: 'Kavita Menon', email: 'kavita@gmail.com', phone: '9845011223', snippet: 'Can you handle silk sarees with zari work?', status: 'New' },
  { time: 'Today 09:30 AM', name: 'Deepak Joshi', email: 'deepak.j@yahoo.com', phone: '9711099887', snippet: 'Inquiring about monthly subscription plans.', status: 'Replied' },
  { time: 'Yesterday 04:45 PM', name: 'Sunita Rao', email: 'sunita.rao@outlook.com', phone: '9988776655', snippet: 'Great service on the suit dry cleaning!', status: 'Resolved' }
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

document.addEventListener('DOMContentLoaded', () => {
  renderOrdersTable();
  renderServicesTable();
  renderMessagesTable();
  renderDriversTable();
  renderPromosTable();
});

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

  tbody.innerHTML = dataToRender.map((ord, idx) => `
    <tr>
      <td class="order-id-badge">${ord.id}</td>
      <td><strong>${ord.name}</strong></td>
      <td>${ord.phone}</td>
      <td>${ord.slot}</td>
      <td>${ord.hub}</td>
      <td><span style="font-size: 12px; color: #cbd5e1;">${ord.services}</span></td>
      <td><strong>₹${ord.total}</strong></td>
      <td>
        <select onchange="updateOrderStatus(${idx}, this.value)" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; border-radius: 8px; padding: 4px 8px; font-size: 11px; font-weight: 700;">
          <option value="pending" ${ord.status === 'pending' ? 'selected' : ''}>⏳ Pending Pickup</option>
          <option value="in-wash" ${ord.status === 'in-wash' ? 'selected' : ''}>🧼 In Wash</option>
          <option value="delivery" ${ord.status === 'delivery' ? 'selected' : ''}>🚚 Out For Delivery</option>
          <option value="completed" ${ord.status === 'completed' ? 'selected' : ''}>✅ Completed</option>
        </select>
      </td>
      <td>
        <button onclick="deleteOrder(${idx})" style="background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">Cancel</button>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(idx, newStatus) {
  ordersData[idx].status = newStatus;
}

function deleteOrder(idx) {
  if (confirm(`Are you sure you want to cancel order ${ordersData[idx].id}?`)) {
    ordersData.splice(idx, 1);
    renderOrdersTable();
  }
}

function filterOrdersTable(query) {
  const q = query.toLowerCase();
  const filtered = ordersData.filter(ord => 
    ord.name.toLowerCase().includes(q) || 
    ord.id.toLowerCase().includes(q) ||
    ord.phone.includes(q)
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
      <td><strong>${s.name}</strong></td>
      <td><span style="color: #38bdf8;">${s.category}</span></td>
      <td>
        <input type="number" value="${s.rate}" onchange="updateServiceRate(${idx}, this.value)" style="width: 70px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 4px 8px; border-radius: 6px; font-weight: 700;">
      </td>
      <td>${s.unit}</td>
      <td>${s.time}</td>
      <td><span class="status-pill completed">${s.status}</span></td>
      <td>
        <button onclick="alert('Price updated to ₹' + servicesData[${idx}].rate)" style="background: #0284c7; color: white; border: none; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">Save</button>
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

  tbody.innerHTML = messagesData.map((m) => `
    <tr>
      <td style="color: #94a3b8; font-size: 12px;">${m.time}</td>
      <td><strong>${m.name}</strong></td>
      <td>${m.email}</td>
      <td>${m.phone}</td>
      <td><em>"${m.snippet}"</em></td>
      <td><span class="status-pill ${m.status === 'New' ? 'pending' : 'completed'}">${m.status}</span></td>
      <td>
        <a href="mailto:${m.email}" style="background: rgba(56,189,248,0.2); color: #38bdf8; text-decoration: none; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700;">Reply</a>
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
      <td><strong>${d.name}</strong></td>
      <td>${d.hub}</td>
      <td><code>${d.vehicle}</code></td>
      <td><strong>${d.activeJobs} Pickups</strong></td>
      <td><span class="status-pill ${d.status === 'Available' ? 'completed' : 'in-wash'}">${d.status}</span></td>
      <td>
        <button onclick="alert('Dispatching SMS alert to driver ${d.name}')" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">Ping Driver</button>
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
      <td><strong style="color: #f43f5e; letter-spacing: 0.05em;">${p.code}</strong></td>
      <td><strong>${p.discount}% OFF</strong></td>
      <td>₹${p.minOrder}</td>
      <td>${p.uses} redeemed</td>
      <td><span class="status-pill completed">${p.status}</span></td>
      <td>
        <button onclick="promosData.splice(${idx},1); renderPromosTable();" style="background: rgba(239,68,68,0.2); color: #f87171; border: 1px solid rgba(239,68,68,0.4); padding: 4px 8px; border-radius: 6px; cursor: pointer; font-size: 11px;">Delete</button>
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
}

function closeAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('show');
}

function handleManualOrderSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('manual-name').value.trim();
  const phone = document.getElementById('manual-phone').value.trim();
  const address = document.getElementById('manual-address').value.trim();
  const hub = document.getElementById('manual-hub').value;
  const service = document.getElementById('manual-service').value;

  const newId = `#DHB-${Math.floor(1000 + Math.random() * 9000)}`;

  ordersData.unshift({
    id: newId,
    name,
    phone,
    slot: 'Today, Immediate Express',
    hub,
    services: service,
    total: 350,
    status: 'pending'
  });

  renderOrdersTable();
  closeAdminModal('new-order-modal');
  alert(`Order ${newId} created successfully for ${name}!`);
}

/**
 * Export Orders to CSV
 */
function exportOrdersCSV() {
  let csvContent = 'data:text/csv;charset=utf-8,Order ID,Customer Name,Phone,Slot,Hub,Services,Total,Status\n';
  ordersData.forEach(o => {
    csvContent += `"${o.id}","${o.name}","${o.phone}","${o.slot}","${o.hub}","${o.services}",${o.total},"${o.status}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Dhobiclean_Orders_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
