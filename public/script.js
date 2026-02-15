// ----------------------------
// Sample Products
// ----------------------------
const products = [
  { name: "Smartphone Model A", price: 15000, img: "images/phone1.jpg" },
  { name: "Smartphone Model B", price: 20000, img: "images/phone2.jpg" },
  { name: "Smartphone Model C", price: 25000, img: "images/phone3.jpg" },
  { name: "Laptop Model X", price: 45000, img: "images/laptop1.jpg" },
  { name: "Laptop Model Y", price: 47000, img: "images/laptop2.jpg" },
  { name: "Laptop Model Z", price: 48000, img: "images/laptop3.jpg" },
  { name: "Headphone A", price: 3000, img: "images/headphone1.jpg" },
  { name: "Headphone B", price: 3500, img: "images/headphone3.jpg" },
  { name: "Watch A", price: 5000, img: "images/watch1.jpg" },
  { name: "Watch B", price: 5500, img: "images/watch2.jpg" },
  { name: "Watch C", price: 6000, img: "images/watch3.jpg" },
];

// ----------------------------
// Load Cart
// ----------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ----------------------------
// Render Products
// ----------------------------
function renderProducts(productList, containerSelector = ".product-grid") {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.innerHTML = "";

  if (productList.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  productList.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    const img = document.createElement("img");
    img.src = product.img || "images/default-product.jpg";
    img.alt = product.name;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = `₹${product.price.toLocaleString("en-IN")}`;

    const btn = document.createElement("button");
    btn.textContent = "Add to Cart";
    btn.onclick = () => addToCart(product);

    card.append(img, name, price, btn);
    container.appendChild(card);
  });
}

// ----------------------------
// Add to Cart
// ----------------------------
function addToCart(product) {
  cart.push(product);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  renderCheckout();
  alert(`${product.name} added to cart!`);
}

// ----------------------------
// Render Cart (Homepage)
// ----------------------------
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  if (!cartItems) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = "<li>Your cart is empty</li>";
    return;
  }

  cart.forEach((item, index) => {
    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = item.img || "images/default-product.jpg";
    img.alt = item.name;
    img.className = "cart-img";
    img.style.width = "50px";
    img.style.height = "50px";
    img.style.objectFit = "cover";
    img.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = `${item.name} - ₹${item.price.toLocaleString("en-IN")}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeFromCart(index);

    li.append(img, span, removeBtn);
    cartItems.appendChild(li);
  });
}

// ----------------------------
// Render Checkout
// ----------------------------
function renderCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  if (!checkoutItems) return;

  checkoutItems.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    checkoutItems.innerHTML = "<li>Your cart is empty</li>";
    if (checkoutTotal) checkoutTotal.innerText = "";
    return;
  }

  cart.forEach((item, index) => {
    total += item.price;

    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = item.img || "images/default-product.jpg";
    img.alt = item.name;
    img.className = "checkout-img";
    img.style.width = "60px";
    img.style.height = "60px";
    img.style.objectFit = "cover";
    img.style.marginRight = "10px";

    const span = document.createElement("span");
    span.textContent = `${item.name} - ₹${item.price.toLocaleString("en-IN")}`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeFromCart(index);

    li.append(img, span, removeBtn);
    checkoutItems.appendChild(li);
  });

  if (checkoutTotal) checkoutTotal.innerHTML = `<strong>Total: ₹${total.toLocaleString("en-IN")}</strong>`;
}

// ----------------------------
// Remove from Cart
// ----------------------------
function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
  renderCheckout();
}

// ----------------------------
// Update Cart Count
// ----------------------------
function updateCartCount() {
  const countElem = document.getElementById("cart-count");
  if (countElem) countElem.innerText = cart.length;
}

// ----------------------------
// Clear Cart After Payment
// ----------------------------
function clearCartAfterPayment() {
  cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  renderCheckout();
  updateCartCount();

  const qr = document.getElementById("gpay-qr");
  if (qr) qr.innerHTML = "";

  const bankForm = document.getElementById("bank-form");
  if (bankForm) bankForm.style.display = "none";
}

// ----------------------------
// Handle Payment
// ----------------------------
function handlePayment(method) {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
  const qrContainer = document.getElementById("gpay-qr");
  const bankForm = document.getElementById("bank-form");
  if (qrContainer) qrContainer.innerHTML = "";
  if (bankForm) bankForm.style.display = "none";

  switch (method) {
    case "gpay": {
      const upiId = "merchant@upi";
      const payeeName = "RJ ElectronicHub";
      const upiLink = `upi://pay?pa=${encodeURIComponent(
        upiId
      )}&pn=${encodeURIComponent(payeeName)}&am=${totalAmount}&cu=INR`;

      if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
        window.location.href = upiLink;
      } else if (qrContainer) {
        new QRCode(qrContainer, { text: upiLink, width: 200, height: 200 });
        alert(
          `Scan the QR code with Google Pay or any UPI app to pay ₹${totalAmount.toLocaleString(
            "en-IN"
          )}`
        );
      }
      break;
    }

    case "paypal": {
      // Open PayPal simulation form (desktop/mobile)
      if (!document.getElementById("paypal-form")) {
        alert(
          `Redirecting to PayPal...\nTotal Amount: ₹${totalAmount.toLocaleString(
            "en-IN"
          )}\n(For demo, PayPal form not implemented)`
        );
      }
      clearCartAfterPayment();
      break;
    }

    case "bank":
      if (bankForm) bankForm.style.display = "block";
      break;

    case "cod": {
      const address = prompt("Enter your delivery address for Cash on Delivery:");
      if (!address) return alert("Address is required for COD!");
      alert(
        `Order placed successfully!\nTotal Amount: ₹${totalAmount.toLocaleString(
          "en-IN"
        )}\nDelivery Address: ${address}`
      );
      clearCartAfterPayment();
      break;
    }
  }
}

// ----------------------------
// Confirm Bank Transfer
// ----------------------------
function confirmBankTransfer() {
  const name = document.getElementById("customer-name")?.value.trim();
  const txnId = document.getElementById("transaction-id")?.value.trim();

  if (!name || !txnId) {
    alert("Please fill all bank details!");
    return;
  }

  alert("Bank transfer details submitted successfully!\nWe will verify and confirm your order.");
  clearCartAfterPayment();
}

// ----------------------------
// Search Products
// ----------------------------
function handleSearch(event) {
  const query = event.target.value.toLowerCase();
  const filtered = products.filter((p) => p.name.toLowerCase().includes(query));
  renderProducts(filtered);
}

// ----------------------------
// Initialize
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();
  renderCheckout();
  renderProducts(products);

  document.getElementById("gpay")?.addEventListener("click", () => handlePayment("gpay"));
  document.getElementById("paypal")?.addEventListener("click", () => handlePayment("paypal"));
  document.getElementById("bank")?.addEventListener("click", () => handlePayment("bank"));
  document.getElementById("cod")?.addEventListener("click", () => handlePayment("cod"));

  const submitBankBtn = document.querySelector("#bank-form button");
  if (submitBankBtn) submitBankBtn.addEventListener("click", confirmBankTransfer);

  const searchInput = document.getElementById("search-input");
  if (searchInput) searchInput.addEventListener("input", handleSearch);
});
