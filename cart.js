const buttons = document.querySelectorAll('.add-to-cart');
const cartBody = document.getElementById('cart-body');
const totalDisplay = document.getElementById('total');
const cartCount = document.getElementById('cart-count');
const checkoutBtn = document.getElementById('checkout-btn');
const popup = document.getElementById('popup');
const closePopup = document.getElementById('close-popup');

let total = 0;
let itemCount = 0;
let cart = {}; // lưu trữ sản phẩm trong giỏ

// Khi nhấn "Mua"
buttons.forEach(button => {
  button.addEventListener('click', e => {
    const product = e.target.parentElement;
    const name = product.querySelector('h2').innerText;
    const price = parseInt(product.querySelector('.price').dataset.price);
    const imgSrc = product.querySelector('img').src;

    if (!cart[name]) {
      cart[name] = { name, price, qty: 1, imgSrc };
      const row = document.createElement('tr');
      row.dataset.name = name;
      row.innerHTML = `
        <td><img src="${imgSrc}" alt="${name}" style="width:50px;height:50px;border-radius:5px;"></td>
        <td>${name}<br><small>${price.toLocaleString()}đ</small></td>
        <td>
          <button class="quantity-btn decrease">-</button>
          <span class="qty">1</span>
          <button class="quantity-btn increase">+</button>
        </td>
        <td class="subtotal">${price.toLocaleString()}đ</td>
      `;
      cartBody.appendChild(row);
      attachEvents(row, name);
    } else {
      cart[name].qty++;
      updateRow(name);
    }

    updateTotals();
  });
});

function attachEvents(row, name) {
  const decreaseBtn = row.querySelector('.decrease');
  const increaseBtn = row.querySelector('.increase');

  decreaseBtn.addEventListener('click', () => {
    if (cart[name].qty > 1) {
      cart[name].qty--;
      updateRow(name);
    } else {
      delete cart[name];
      row.remove();
    }
    updateTotals();
  });

  increaseBtn.addEventListener('click', () => {
    cart[name].qty++;
    updateRow(name);
    updateTotals();
  });
}

function updateRow(name) {
  const row = cartBody.querySelector(`[data-name="${name}"]`);
  if (!row) return;
  const qtyEl = row.querySelector('.qty');
  const subtotalEl = row.querySelector('.subtotal');
  const qty = cart[name].qty;
  const price = cart[name].price;
  qtyEl.innerText = qty;
  subtotalEl.innerText = (price * qty).toLocaleString() + 'đ';
}

function updateTotals() {
  total = 0;
  itemCount = 0;
  Object.values(cart).forEach(item => {
    total += item.price * item.qty;
    itemCount += item.qty;
  });
  totalDisplay.innerText = total.toLocaleString();
  cartCount.innerText = itemCount;
  checkoutBtn.disabled = itemCount === 0; // chỉ bật nút nếu có hàng
}

/// Xử lý nút "Thanh toán"
checkoutBtn.addEventListener('click', () => {
  if (itemCount > 0) {
    popup.style.display = 'flex'; // hiện popup cảm ơn

    // Sau khi hiển thị popup, reset giỏ hàng
    cart = {};                   // xóa dữ liệu trong bộ nhớ
    cartBody.innerHTML = '';     // xóa toàn bộ sản phẩm trên giao diện
    total = 0;
    itemCount = 0;
    totalDisplay.innerText = '0';
    cartCount.innerText = '0';
    checkoutBtn.disabled = true; // tắt lại nút thanh toán
  }
});

// Nút "Đóng" popup
closePopup.addEventListener('click', () => {
  popup.style.display = 'none';
});