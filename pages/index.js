/* -------------------------------------------------------------------------- */
/*                                  Elements                                  */
/* -------------------------------------------------------------------------- */
const addToCartButton = document.querySelector("#add-to-cart");
const ticketPriceDropdown = document.querySelector("#ticket-type");
const quantityDropdown = document.querySelector("#quantity");
const ticketsDescription = document.querySelector(".tickets__description");
const cartItemsList = document.querySelector(".tickets__list");
const ticketsTotal = document.querySelector(".tickets__total");
const checkoutButton = document.querySelector(".tickets__checkout-button");
const checkoutModal = document.querySelector("#modal-checkout");
const checkoutModalContainer = checkoutModal.querySelector(".modal__container");
const modalTotal = document.querySelector(".modal__total");
const ticketTemplate =
  document.querySelector("#ticket-template").content.firstElementChild;
const checkoutModalForm = checkoutModal.querySelector(".modal__form");
const checkoutModalSubmitButton = document.querySelector(
  ".modal__submit-button"
);
const modalLoadingContainer = checkoutModal.querySelector(
  ".modal__loading-container"
);
const modalPurchaseCompleteContainer = checkoutModal.querySelector(
  ".modal__purchase-complete-container"
);
/* -------------------------------------------------------------------------- */
/*                                  Functions                                 */
/* -------------------------------------------------------------------------- */
function handleCheckoutButtonState() {
  if (cartItemsList.textContent.trim() === "") {
    checkoutButton.disabled = true;
  } else {
    checkoutButton.disabled = false;
  }
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

function detectModalOverlayClick(event) {
  return (
    event.target === event.currentTarget ||
    event.target.classList.contains("modal__close-button")
  );
}

function resetCheckoutModalForm(e) {
  if (detectModalOverlayClick(e)) {
    checkoutModalForm.reset();
    modalPurchaseCompleteContainer.classList.remove(
      "modal__purchase-complete-container_opened"
    );
    //remove event listener to prevent memory leak
    checkoutModal.removeEventListener("mousedown", resetCheckoutModalForm);
  }
}

function addToCart() {
  const ticketName = ticketPriceDropdown.value;
  let ticketPrice;
  if (ticketName === "General Admission") {
    ticketPrice = 35;
    ticketsDescription.textContent =
      "General Admission access to the 13th Gate Haunted House and all attractions.";
  } else {
    ticketPrice = 75;
    ticketsDescription.textContent =
      "Immediate Access to the 13th Gate Haunted House. VIP allows you to skip Haunted House OUTSIDE line.";
  }

  const selectedQuantity = quantityDropdown.value;
  const price = ticketPrice * selectedQuantity;

  // Create a new cart item element
  const cartItem = ticketTemplate.cloneNode(true);
  const cartItemInfo = cartItem.querySelector(".ticket__info");
  cartItemInfo.textContent = `${ticketName} x${selectedQuantity} - Price: $${price.toFixed(
    2
  )}`;

  //remove ticket functionality
  const cartItemRemoveButton = cartItem.querySelector(".ticket__remove-button");
  cartItemRemoveButton.addEventListener("click", () => {
    cartItem.remove();
    updateTotal();
    handleCheckoutButtonState();
  });

  function updateTotal() {
    const total = calculateTotal();
    ticketsTotal.textContent = `Total: $${total.toFixed(2)}`;
  }

  // Add the item to the cart
  cartItemsList.appendChild(cartItem);
  const total = calculateTotal();
  updateTotal();

  handleCheckoutButtonState();
}

function calculateTotal() {
  const text = cartItemsList.textContent.trim();
  if (text === "") {
    return 0;
  }
  const nums = text.match(/(?<=\$)\d+/g).map(parseFloat);
  return nums.reduce((a, b) => a + b);
}

async function purchaseTickets() {
  try {
    console.log("Sending data to the server...");

    // Display loading animation
    modalLoadingContainer.classList.add("modal__loading-container_opened");

    // Simulate a delay using setTimeout
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log("Data received from the server");

    // Display thank you message
    modalLoadingContainer.classList.remove("modal__loading-container_opened");
    modalPurchaseCompleteContainer.classList.add(
      "modal__purchase-complete-container_opened"
    );

    // Listener to reset the form the next time it's closed
    checkoutModal.addEventListener("mousedown", resetCheckoutModalForm);

    // Simulate receiving a response
    const response = { message: "Tickets purchased successfully" };
    console.log("Response:", response);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
/* -------------------------------------------------------------------------- */
/*                               Event Listeners                              */
/* -------------------------------------------------------------------------- */
ticketPriceDropdown.addEventListener("change", () => {
  const ticketName = ticketPriceDropdown.value;
  if (ticketName === "General Admission") {
    ticketsDescription.textContent =
      "General Admission access to the 13th Gate Haunted House and all attractions.";
  } else {
    ticketsDescription.textContent =
      "Immediate Access to the 13th Gate Haunted House. VIP allows you to skip Haunted House OUTSIDE line.";
  }
});

addToCartButton.addEventListener("click", () => {
  addToCart("General Admission", 35);
});

checkoutButton.addEventListener("click", () => {
  modalTotal.textContent = `Total: $${calculateTotal().toFixed(2)}`;
  checkoutModal.classList.add("modal_opened");
});

checkoutModal.addEventListener("mousedown", (e) => {
  if (detectModalOverlayClick(e)) {
    closeModal(checkoutModal);
  }
});

checkoutModalForm.addEventListener("submit", (e) => {
  e.preventDefault();
  purchaseTickets();
});
