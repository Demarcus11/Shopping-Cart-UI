export default class Cart {
  constructor() {
    this.cart = {};
    this.cartTotal = 0;
    this.cartAmount = 0;
  }

  async addItemToCart(name, price) {
    if (!this.cart[name]) {
      this.cart[name] = { price, quantity: 1 };
      this.createCartItem(name, price, document.querySelector(".cart-list"));
    } else {
      this.cart[name].quantity += 1;
      this.updateCartItem(name);
    }

    this.updateCart();
  }

  removeItemFromCart(name) {
    if (this.cart[name]) {
      delete this.cart[name];
      this.updateCart();
      this.resetProductCard(name);
    }
  }

  resetProductCard(name) {
    const cartItem = document.querySelector(`.item[data-name="${name}"]`);
    if (cartItem) cartItem.remove();

    const card = document.querySelector(`.product[data-name="${name}"]`);
    if (card) {
      const addToCartInput = card.querySelector(".add-to-cart");
      const addToCartLabel = card.querySelector(".add-to-cart-btn");
      const amountButton = card.querySelector(".amount-btn-container");
      const quantityEl = card.querySelector(".quantity");

      addToCartInput.checked = false;
      addToCartLabel.hidden = false;
      amountButton.setAttribute("hidden", "");

      quantityEl.textContent = "1";
    }
  }

  createCartItem(name, price, cartList) {
    const cartItem = document.createElement("li");
    cartItem.classList.add("item");
    cartItem.dataset.name = name;
    cartItem.innerHTML = [
      `<div>`,
      `<h3 class="title">${name}</h3>`,
      `<div class="flex">`,
      `<p class="amount">1x</p>`,
      `<div class="flex">`,
      `<p class="unit-price">@ $${price.toFixed(2)}</p>`,
      `<p class="price">$${price.toFixed(2)}</p>`,
      `</div>`,
      `</div>`,
      `</div>`,
      `<button class="delete-btn">`,
      `<img src="./assets/images/icon-remove-item.svg" alt="" />`,
      `</button>`,
    ].join("");

    cartList.append(cartItem);
    cartItem.querySelector(".delete-btn").addEventListener("click", () => {
      this.removeItemFromCart(name);
    });
  }

  updateCartItem(name) {
    const existingCartItem = document.querySelector(
      `.item[data-name="${name}"]`
    );
    const amountElement = existingCartItem.querySelector(".amount");
    const priceElement = existingCartItem.querySelector(".price");

    const quantity = this.cart[name].quantity;
    amountElement.textContent = `${quantity}x`;
    priceElement.textContent = `$${(this.cart[name].price * quantity).toFixed(
      2
    )}`;
  }

  handleAmountButtonClick(button) {
    const card = button.closest(".product");
    const name = card.dataset.name;
    const quantityEl = card.querySelector(".quantity");

    if (this.cart[name]) {
      if (button.classList.contains("increment")) {
        this.cart[name].quantity += 1;
      } else if (
        button.classList.contains("decrement") &&
        this.cart[name].quantity > 1
      ) {
        this.cart[name].quantity -= 1;
      }

      quantityEl.textContent = this.cart[name].quantity;
      this.updateCartQuantity(name);
      this.updateCart();
    }
  }

  updateCartQuantity(name) {
    const cartItem = document.querySelector(`.item[data-name="${name}"]`);
    const cartQuantityElem = cartItem.querySelector(".amount");
    const cartTotalPriceElem = cartItem.querySelector(".price");

    cartQuantityElem.textContent = `${this.cart[name].quantity}x`;
    const totalPrice = this.cart[name].price * this.cart[name].quantity;
    cartTotalPriceElem.textContent = `$${totalPrice.toFixed(2)}`;
  }

  updateCart() {
    this.updateCartAmount();
    this.updateTotal();
    this.checkCartStatus();
  }

  updateTotal() {
    const totalElement = document.querySelector(".total");

    this.cartTotal = Object.keys(this.cart).reduce((acc, key) => {
      return acc + this.cart[key].price * this.cart[key].quantity;
    }, 0);

    totalElement.textContent = `$${this.cartTotal.toFixed(2)}`;
  }

  updateCartAmount() {
    this.cartAmount = Object.keys(this.cart).reduce((acc, key) => {
      return acc + this.cart[key].quantity;
    }, 0);
    document.querySelector(
      ".your-cart .amount"
    ).textContent = `${this.cartAmount}`;
  }

  // used when adding or removing from the cart to update the empty cart img when necessary
  checkCartStatus() {
    const emptyCartImg = document.querySelector(".empty-cart-img");
    const orderTotalContainer = document.querySelector(".order-total");

    if (Object.keys(this.cart).length === 0) {
      if (!emptyCartImg.querySelector("img")) {
        const img = document.createElement("img");
        img.src = "./assets/images/illustration-empty-cart.svg";
        img.classList.add("empty-cart-img");
        emptyCartImg.append(img);
      }
      orderTotalContainer.setAttribute("hidden", "");
    } else {
      emptyCartImg.querySelector("img")?.remove();
      orderTotalContainer.removeAttribute("hidden");
    }
  }
}
