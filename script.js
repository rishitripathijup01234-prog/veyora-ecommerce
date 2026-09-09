/* ================= DATA ================= */

let cart = [];


/* ================= ELEMENTS ================= */

const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");

const emptyCart = document.getElementById("emptyCart");

const menuBtn = document.getElementById("menuBtn");
const navbar = document.getElementById("navbar");

const searchToggle = document.getElementById("searchToggle");
const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");

const productGrid = document.getElementById("productGrid");
const noResults = document.getElementById("noResults");


/* ================= MOBILE MENU ================= */

menuBtn.addEventListener("click", () => {
    navbar.classList.toggle("active");
});


document.querySelectorAll(".navbar a").forEach(link => {
    link.addEventListener("click", () => {
        navbar.classList.remove("active");
    });
});


/* ================= SEARCH ================= */

searchToggle.addEventListener("click", () => {
    searchBox.classList.toggle("active");

    if (searchBox.classList.contains("active")) {
        searchInput.focus();
    }
});


searchInput.addEventListener("input", () => {

    const searchValue = searchInput.value
        .toLowerCase()
        .trim();

    const products = document.querySelectorAll(".product-card");

    let visibleProducts = 0;

    products.forEach(product => {

        const productName = product
            .querySelector("h3")
            .textContent
            .toLowerCase();

        const productCategory = product
            .dataset
            .category
            .toLowerCase();

        if (
            productName.includes(searchValue) ||
            productCategory.includes(searchValue)
        ) {
            product.style.display = "";
            visibleProducts++;
        } else {
            product.style.display = "none";
        }

    });

    noResults.style.display =
        visibleProducts === 0 ? "block" : "none";
});


/* ================= PRODUCT FILTER ================= */

const filterButtons =
    document.querySelectorAll(".filter-btn");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        const filter = button.dataset.filter;

        const products =
            document.querySelectorAll(".product-card");

        let visibleProducts = 0;

        products.forEach(product => {

            const category = product.dataset.category;

            if (
                filter === "all" ||
                category === filter
            ) {
                product.style.display = "";
                visibleProducts++;
            } else {
                product.style.display = "none";
            }

        });

        noResults.style.display =
            visibleProducts === 0 ? "block" : "none";

    });

});


/* ================= CATEGORY CLICK ================= */

document.querySelectorAll(".category-card").forEach(card => {

    card.addEventListener("click", () => {

        const category = card.dataset.category;

        const filterButton =
            document.querySelector(
                `.filter-btn[data-filter="${category}"]`
            );

        if (filterButton) {
            filterButton.click();
        }

        document
            .getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });
    });

});


/* ================= CART OPEN ================= */

function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

    document.body.style.overflow = "hidden";
}


function closeCartSidebar() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

    document.body.style.overflow = "";
}


cartBtn.addEventListener("click", openCart);

closeCart.addEventListener(
    "click",
    closeCartSidebar
);

cartOverlay.addEventListener(
    "click",
    closeCartSidebar
);


/* ================= ADD TO CART ================= */

document.querySelectorAll(".add-cart").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.dataset.name;
        const price = Number(button.dataset.price);
        const image = button.dataset.image;

        const existingProduct =
            cart.find(item => item.name === name);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {

            cart.push({
                name: name,
                price: price,
                image: image,
                quantity: 1
            });

        }

        updateCart();

        showToast(`${name} added to cart.`);

    });

});


/* ================= UPDATE CART ================= */

function updateCart() {

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.appendChild(emptyCart);

        emptyCart.style.display = "flex";

    } else {

        cart.forEach((item, index) => {

            const cartItem =
                document.createElement("div");

            cartItem.className = "cart-item";

            cartItem.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}"
                >

                <div>

                    <h4>${item.name}</h4>

                    <div class="cart-item-price">
                        ₹${item.price.toLocaleString("en-IN")}
                    </div>

                    <div class="quantity">

                        <button
                            class="quantity-minus"
                            data-index="${index}">
                            −
                        </button>

                        <span>${item.quantity}</span>

                        <button
                            class="quantity-plus"
                            data-index="${index}">
                            +
                        </button>

                    </div>

                </div>

                <button
                    class="remove-item"
                    data-index="${index}">
                    Remove
                </button>
            `;

            cartItems.appendChild(cartItem);

        });

    }


    updateCartTotal();

    addCartControls();

}


/* ================= CART TOTAL ================= */

function updateCartTotal() {

    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const totalPrice = cart.reduce(
        (total, item) =>
            total + item.price * item.quantity,
        0
    );

    cartCount.textContent = totalQuantity;

    cartTotal.textContent =
        `₹${totalPrice.toLocaleString("en-IN")}`;

}


/* ================= CART CONTROLS ================= */

function addCartControls() {

    document
        .querySelectorAll(".quantity-minus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                }

                updateCart();

            });

        });


    document
        .querySelectorAll(".quantity-plus")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                cart[index].quantity++;

                updateCart();

            });

        });


    document
        .querySelectorAll(".remove-item")
        .forEach(button => {

            button.addEventListener("click", () => {

                const index =
                    Number(button.dataset.index);

                const removedProduct = cart[index];

                cart.splice(index, 1);

                updateCart();

                showToast(
                    `${removedProduct.name} removed.`
                );

            });

        });

}


/* ================= CONTINUE SHOPPING ================= */

document.addEventListener("click", event => {

    if (event.target.id === "continueShopping") {
        closeCartSidebar();
    }

});


/* ================= WISHLIST ================= */

document
    .querySelectorAll(".product-wishlist")
    .forEach(button => {

        button.addEventListener("click", () => {

            button.classList.toggle("active");

            if (button.classList.contains("active")) {

                button.textContent = "♥";

                showToast(
                    "Added to wishlist."
                );

            } else {

                button.textContent = "♡";

                showToast(
                    "Removed from wishlist."
                );

            }

        });

    });


/* ================= MAIN WISHLIST BUTTON ================= */

document
    .getElementById("wishlistBtn")
    .addEventListener("click", () => {

        const wishlistItems =
            document.querySelectorAll(
                ".product-wishlist.active"
            );

        if (wishlistItems.length === 0) {

            showToast(
                "Your wishlist is empty."
            );

        } else {

            showToast(
                `${wishlistItems.length} item(s) in wishlist.`
            );

        }

    });


/* ================= NEWSLETTER ================= */

const newsletterForm =
    document.getElementById("newsletterForm");

newsletterForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();

        const email =
            document
                .getElementById("emailInput")
                .value
                .trim();

        if (email) {

            showToast(
                "Thanks for subscribing!"
            );

            newsletterForm.reset();

        }

    }
);


/* ================= CHECKOUT ================= */

document
    .getElementById("checkoutBtn")
    .addEventListener("click", () => {

        if (cart.length === 0) {

            showToast(
                "Your cart is empty."
            );

            return;
        }

        showToast(
            "Checkout is ready for integration."
        );

    });


/* ================= TOAST ================= */

let toastTimer;

function showToast(message) {

    toastMessage.textContent = message;

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2500);

}


/* ================= INITIAL CART ================= */

updateCart();