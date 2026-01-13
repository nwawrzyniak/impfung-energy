// Cart functionality
let cartCount = 0;
let cartTotal = 0;

const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCountElement = document.querySelector('.cart-count');
const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Toggle cart sidebar
cartBtn.addEventListener('click', () => {
  cartSidebar.classList.toggle('active');
});

closeCart.addEventListener('click', () => {
  cartSidebar.classList.remove('active');
});

// Add to cart
addToCartButtons.forEach(button => {
  button.addEventListener('click', function () {
    const product = this.dataset.product;
    const size = this.dataset.size;
    const price = parseFloat(this.dataset.price);

    cartCount++;
    cartTotal += price;

    cartCountElement.textContent = cartCount;
    document.getElementById('cartTotal').textContent = cartTotal.toFixed(2) + ' €';

    // Visual feedback
    this.innerHTML = '<i class="fas fa-check"></i> Hinzugefügt!';
    this.style.background = 'var(--primary)';
    this.style.color = 'var(--dark)';

    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-shopping-cart"></i> In den Warenkorb';
      this.style.background = '';
      this.style.color = '';
    }, 1500);

    // Show cart briefly
    cartSidebar.classList.add('active');
    setTimeout(() => {
      cartSidebar.classList.remove('active');
    }, 2000);
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href !== '#') {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  });
});
