import Cart from "./Cart.js";

const productsContainer = document.querySelector(".products");

const cart = new Cart();

let products = [];

const initApp = async () => {
  try {
    await asyncAppendCards();
    handleSelectItemChange();
    handleAmountButtonClick();
  } catch (err) {
    console.log(err);
  }
};

initApp();

async function asyncAppendCards() {
  products = await asyncFetchProducts();
  products.forEach((product, index) => {
    let productCardContainer = document.createElement("li");
    let productCard = document.createElement("div");
    productCard.classList.add("product");
    productCard.classList.add("stacked");
    productCard.dataset.name = product.name;
    productCard.dataset.price = product.price;

    productCard.innerHTML = [
      `<img class="product-image" src="${product.image.desktop}" alt="${product.name}" />`,
      `<div class="radio-group">`,
      `<input class="radio__input add-to-cart" type="checkbox" name="option" id="option-${index}" />`,
      `<label class="button radio__label add-to-cart-btn" for="option-${index}">`,
      `<span><img src="./assets/images/icon-add-to-cart.svg" alt="" /></span>`,
      `Add to Cart`,
      `</label>`,
      `<div class="button amount-btn-container" hidden>`,
      `<button class="amount-btn decrement"><img src="./assets/images/icon-decrement-quantity.svg" alt="" /></button>`,
      `<span class="quantity">1</span>`,
      `<button class="amount-btn increment"><img src="./assets/images/icon-increment-quantity.svg" alt="" /></button>`,
      `</div>`,
      `</div>`,
      `<div class="product-content">`,
      `<p class="category">${product.category}</p>`,
      `<p class="title">${product.name}</p>`,
      `<p class="price">$${product.price.toFixed(2)}</p>`,
      `</div>`,
      `</div>`,
    ].join("");

    productCardContainer.append(productCard);
    productsContainer.append(productCardContainer);
  });
}

async function handleSelectItemChange() {
  const addToCartInputs = document.querySelectorAll(".add-to-cart");

  addToCartInputs.forEach((button) => {
    button.addEventListener("change", (e) => {
      const clickedInput = e.currentTarget;
      const addToCartLabel = clickedInput
        .closest(".radio-group")
        .querySelector(".add-to-cart-btn");
      const amountButton = clickedInput
        .closest(".radio-group")
        .querySelector(".amount-btn-container");

      amountButton.toggleAttribute("hidden");
      addToCartLabel.toggleAttribute("hidden");

      const productCard = clickedInput.closest(".product");
      const name = productCard.dataset.name;
      const price = parseFloat(productCard.dataset.price);

      cart.addItemToCart(name, price);
    });
  });
}

function handleAmountButtonClick() {
  const amountButtons = document.querySelectorAll(".amount-btn");
  amountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cart.handleAmountButtonClick(button);
    });
  });
}

async function asyncFetchProducts() {
  try {
    const response = await fetch("./data.json");

    if (!response.ok) {
      console.log(response.statusText);
    }

    return await response.json();
  } catch (error) {
    console.log(error);
  }
}
