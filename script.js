const items = [
  {
    id: 1, name: "Linen Oversized Shirt",
    category: "Clothing", price: 1599,
    image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2, name: "Sage Midi Dress",
    category: "Dresses", price: 2199,
    image: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3, name: "Woven Crossbody Bag",
    category: "Accessories", price: 1299,
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4, name: "Striped Knit Set",
    category: "Clothing", price: 1899,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5, name: "Wide Leg Jumpsuit",
    category: "Dresses", price: 2399,
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6, name: "Everyday Sandals",
    category: "Shoes", price: 999,
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=500&q=80"
  }
];

let cart = [];
let favourites = new Set();
let selectedCategory = "All";

const products = document.getElementById("products");
const searchInput = document.getElementById("searchInput");

function renderProducts() {
  const query = searchInput.value.toLowerCase();

  const filtered = items.filter(item => {
    const categoryMatch =
      selectedCategory === "All" ||
      (selectedCategory === "Sale"
        ? item.price < 1500
        : selectedCategory === "Accessories"
          ? item.category === "Accessories"
          : selectedCategory === "Shoes"
            ? item.category === "Shoes"
            : selectedCategory === "Dresses"
              ? item.category === "Dresses"
              : item.category === selectedCategory);

    return categoryMatch &&
      item.name.toLowerCase().includes(query);
  });

  products.innerHTML = filtered.map(item => `
    <article class="product-card">
      <div class="product-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
      </div>
      <div class="product-info">
        <p class="category">${item.category}</p>
        <h3>${item.name}</h3>
        <p>₹${item.price.toLocaleString("en-IN")}</p>
        <div class="product-actions">
          <button data-add="${item.id}">ADD TO BAG +</button>
          <button class="favourite ${favourites.has(item.id) ? "liked" : ""}"
            data-fav="${item.id}" aria-label="Toggle favourite">
            ${favourites.has(item.id) ? "♥" : "♡"}
          </button>
        </div>
      </div>
    </article>
  `).join("");

  document.getElementById("emptyMessage").hidden = filtered.length > 0;
}

function renderCart() {
  document.getElementById("cartCount").textContent =
    cart.reduce((total, item) => total + item.qty, 0);

  document.getElementById("cartItems").innerHTML = cart.length
    ? cart.map(entry => {
        const item = items.find(p => p.id === entry.id);
        return `
          <div class="cart-row">
            <b>${item.name}</b><br>
            ₹${(item.price * entry.qty).toLocaleString("en-IN")}<br>
            <button data-minus="${item.id}">−</button>
            ${entry.qty}
            <button data-plus="${item.id}">+</button>
            <button data-remove="${item.id}">Remove</button>
          </div>`;
      }).join("")
    : "<p>Your bag is empty.</p>";

  const total = cart.reduce((sum, entry) => {
    return sum + items.find(p => p.id === entry.id).price * entry.qty;
  }, 0);

  document.getElementById("subtotal").textContent =
    total.toLocaleString("en-IN");
}

products.addEventListener("click", event => {
  const add = event.target.closest("[data-add]");
  const fav = event.target.closest("[data-fav]");

  if (add) {
    const id = Number(add.dataset.add);
    const existing = cart.find(item => item.id === id);

    if (existing) existing.qty++;
    else cart.push({id, qty: 1});

    renderCart();
    add.textContent = "ADDED ✓";
    setTimeout(() => renderProducts(), 700);
  }

  if (fav) {
    const id = Number(fav.dataset.fav);
    if (favourites.has(id)) favourites.delete(id);
    else favourites.add(id);
    renderProducts();
  }
});

document.getElementById("cartItems").addEventListener("click", event => {
  const plus = event.target.closest("[data-plus]");
  const minus = event.target.closest("[data-minus]");
  const remove = event.target.closest("[data-remove]");

  if (plus) {
    cart.find(p => p.id === Number(plus.dataset.plus)).qty++;
  }

  if (minus) {
    const id = Number(minus.dataset.minus);
    const entry = cart.find(p => p.id === id);
    entry.qty--;
    if (entry.qty <= 0) cart = cart.filter(p => p.id !== id);
  }

  if (remove) {
    cart = cart.filter(p => p.id !== Number(remove.dataset.remove));
  }

  renderCart();
});

document.querySelectorAll("[data-filter]").forEach(link => {
  link.addEventListener("click", () => {
    selectedCategory = link.dataset.filter;
    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

document.getElementById("searchToggle").addEventListener("click", () => {
  const panel = document.getElementById("searchPanel");
  panel.hidden = !panel.hidden;
  if (!panel.hidden) searchInput.focus();
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.getElementById("navigation").classList.toggle("open");
});

document.getElementById("cartToggle").addEventListener("click", () => {
  document.getElementById("cartPanel").hidden = false;
});

document.getElementById("closeCart").addEventListener("click", () => {
  document.getElementById("cartPanel").hidden = true;
});

document.getElementById("checkout").addEventListener("click", () => {
  document.getElementById("checkoutMessage").textContent =
    cart.length
      ? "Demo only. Connect a payment provider for real checkout."
      : "Add a product to your bag before checkout.";
});

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  document.getElementById("newsletterMessage").textContent =
    "Thank you for subscribing! This demo doesn't store emails.";
  event.target.reset();
});

renderProducts();
renderCart();