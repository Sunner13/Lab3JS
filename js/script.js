document.addEventListener('DOMContentLoaded', () => {
    const productsListContainer = document.querySelector('.products-list');
    const categoryFilter = document.getElementById('category-filter');
    const priceSort = document.getElementById('price-sort');
    const applyFiltersBtn = document.getElementById('apply-filters-btn');

    const partsData = [
        {
            id: 1,
            name: "Двигун V6 Turbo",
            image: "images/Engine.jpg",
            description: "Потужний та надійний турбований V-подібний двигун об'ємом 3.0л. Підходить для спортивних автомобілів та позашляховиків.",
            category: "engine",
            price: 25000
        },
        {
            id: 2,
            name: "Гальмівні колодки керамічні",
            image: "images/tormoznye-kolodki-logo.jpg",
            description: "Високоякісні керамічні гальмівні колодки для передньої осі. Забезпечують відмінне гальмування та довгий термін служби.",
            category: "brakes",
            price: 1200
        },
        {
            id: 3,
            name: "Амортизатор газомасляний",
            image: "images/amortizator.jpg",
            description: "Газомасляний амортизатор для покращеної стійкості та комфорту на дорозі. Підходить для більшості легкових автомобілів.",
            category: "suspension",
            price: 1800
        },
        {
            id: 4,
            name: "Фільтр масляний",
            image: "images/MIW-OIL-FILTER-H1005.jpg",
            description: "Оригінальний масляний фільтр. Забезпечує чистоту масла та захист двигуна від зносу.",
            category: "filters",
            price: 350
        },
        {
            id: 5,
            name: "Фільтр повітряний",
            image: "images/filtr_povitryanij.jpg",
            description: "Високоефективний повітряний фільтр. Затримує пил та бруд, забезпечуючи чисте повітря для двигуна.",
            category: "filters",
            price: 450
        },
        {
            id: 6,
            name: "Комплект ГРМ",
            image: "images/komplekt_grm.jpg",
            description: "Повний комплект для заміни ременя ГРМ, включаючи ролики та натягувач. Для двигунів 1.6 MPI.",
            category: "engine",
            price: 3200
        },
        {
            id: 7,
            name: "Гальмівні диски вентильовані",
            image: "images/diski.jpg",
            description: "Передні вентильовані гальмівні диски. Покращене охолодження та ефективність гальмування.",
            category: "brakes",
            price: 2200
        }
    ];

    // --- Логіка кошика ---
    let cart = JSON.parse(localStorage.getItem('shoppingCartAutoDrive')) || [];
    const cartIconBtn = document.getElementById('cart-icon-btn');
    const cartModalOverlay = document.getElementById('cart-modal-overlay');
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceEl = document.getElementById('cart-total-price');
    const cartItemCountBadge = document.getElementById('cart-item-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    const cartSortSelect = document.getElementById('cart-sort');
    const cartPriceMinInput = document.getElementById('cart-price-min');
    const cartPriceMaxInput = document.getElementById('cart-price-max');
    const cartApplyFiltersBtn = document.getElementById('cart-apply-filters-btn');


    function findProductById(productId) {
        return partsData.find(p => p.id === parseInt(productId));
    }

    function addToCart(productId) {
        const product = findProductById(productId);
        if (!product) return;

        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        saveCart();
        renderCart();
        updateCartIcon();
    }

    function updateQuantityInCart(productId, newQuantity) {
        const itemInCart = cart.find(item => item.id === parseInt(productId));
        if (itemInCart) {
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else {
                itemInCart.quantity = newQuantity;
            }
        }
        saveCart();
        renderCart();
        updateCartIcon();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== parseInt(productId));
        saveCart();
        renderCart();
        updateCartIcon();
    }

    function calculateTotalPrice() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    
    function saveCart() {
        localStorage.setItem('shoppingCartAutoDrive', JSON.stringify(cart));
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let filteredAndSortedCart = [...cart];

        // Фільтрація за ціною в кошику
        const minPrice = parseFloat(cartPriceMinInput.value) || 0;
        const maxPrice = parseFloat(cartPriceMaxInput.value) || Infinity;

        filteredAndSortedCart = filteredAndSortedCart.filter(item => {
            const itemPrice = item.price;
            return itemPrice >= minPrice && itemPrice <= maxPrice;
        });

        // Сортування в кошику
        const sortValue = cartSortSelect.value;
        switch (sortValue) {
            case 'name-asc':
                filteredAndSortedCart.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'name-desc':
                filteredAndSortedCart.sort((a, b) => b.name.localeCompare(a.name));
                break;
            case 'price-asc':
                filteredAndSortedCart.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredAndSortedCart.sort((a, b) => b.price - a.price);
                break;
        }


        if (filteredAndSortedCart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="cart-empty-message">Ваш кошик порожній або не знайдено товарів за фільтрами.</p>';
        } else {
            filteredAndSortedCart.forEach(item => {
                const cartItemDiv = document.createElement('div');
                cartItemDiv.classList.add('cart-item');
                cartItemDiv.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>Ціна: ${item.price.toLocaleString()} грн</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-change" data-id="${item.id}" data-change="-1">-</button>
                        <input type="number" value="${item.quantity}" min="1" data-id="${item.id}" class="quantity-input">
                        <button class="quantity-change" data-id="${item.id}" data-change="1">+</button>
                    </div>
                    <p class="cart-item-price">${(item.price * item.quantity).toLocaleString()} грн</p>
                    <button class="cart-item-remove-btn" data-id="${item.id}">×</button>
                `;
                cartItemsContainer.appendChild(cartItemDiv);
            });
        }

        const total = calculateTotalPrice();
        cartTotalPriceEl.textContent = total.toLocaleString();
        checkoutBtn.disabled = cart.length === 0;
        cartItemsContainer.querySelectorAll('.quantity-change').forEach(button => {
            button.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const change = parseInt(e.target.dataset.change);
                const item = cart.find(i => i.id === parseInt(id));
                if (item) {
                    updateQuantityInCart(id, item.quantity + change);
                }
            });
        });
        cartItemsContainer.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const newQuantity = parseInt(e.target.value);
                if (!isNaN(newQuantity)) {
                     updateQuantityInCart(id, newQuantity);
                }
            });
        });
        cartItemsContainer.querySelectorAll('.cart-item-remove-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                removeFromCart(e.target.dataset.id);
            });
        });
    }

    function updateCartIcon() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartItemCountBadge) cartItemCountBadge.textContent = totalItems;
        if (cartItemCountBadge) cartItemCountBadge.style.display = totalItems > 0 ? 'flex' : 'none';
    }

    if (cartIconBtn) {
        cartIconBtn.addEventListener('click', () => {
            if (cartModalOverlay) cartModalOverlay.classList.remove('hidden');
            renderCart(); 
        });
    }
    if (cartCloseBtn) {
        cartCloseBtn.addEventListener('click', () => {
            if (cartModalOverlay) cartModalOverlay.classList.add('hidden');
        });
    }
    if (cartModalOverlay) {
        cartModalOverlay.addEventListener('click', (e) => {
            if (e.target === cartModalOverlay) {
                cartModalOverlay.classList.add('hidden');
            }
        });
    }
    if (cartApplyFiltersBtn) {
        cartApplyFiltersBtn.addEventListener('click', renderCart);
    }
     if (cartSortSelect) cartSortSelect.addEventListener('change', renderCart);


    // --- Функція для відображення карток товарів на головній сторінці ---
    function renderProducts(productsToRender) {
        productsListContainer.innerHTML = '';
        if (productsToRender.length === 0) {
            productsListContainer.innerHTML = '<p>Товарів за вашим запитом не знайдено.</p>';
            return;
        }

        productsToRender.forEach(part => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <img src="${part.image}" alt="${part.name}">
                <h3>${part.name}</h3>
                <p class="price">${part.price.toLocaleString()} грн</p>
                <button class="description-toggle" data-id="${part.id}">Розгорнути опис</button>
                <div class="description-content" id="desc-${part.id}">
                    <p>${part.description}</p>
                </div>
                <button class="add-to-cart-btn" data-id="${part.id}">Додати до кошика</button>
            `;
            productsListContainer.appendChild(card);
        });

        document.querySelectorAll('.description-toggle').forEach(button => {
            button.addEventListener('click', toggleDescription);
        });

        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                addToCart(e.target.dataset.id);
                e.target.textContent = 'Додано!';
                e.target.disabled = true;
                setTimeout(() => {
                    e.target.textContent = 'Додати до кошика';
                    e.target.disabled = false;
                }, 1500);
            });
        });
    }


    function toggleDescription(event) {
        const button = event.target;
        const partId = button.dataset.id;
        const descriptionContent = document.getElementById(`desc-${partId}`);
        
        descriptionContent.classList.toggle('expanded');
        button.textContent = descriptionContent.classList.contains('expanded') ? 'Згорнути опис' : 'Розгорнути опис';
    }

    function filterAndSortProducts() {
        let filteredProducts = [...partsData]; 

        const selectedCategory = categoryFilter.value;
        if (selectedCategory !== 'all') {
            filteredProducts = filteredProducts.filter(part => part.category === selectedCategory);
        }

        const sortOrder = priceSort.value;
        if (sortOrder === 'asc') {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sortOrder === 'desc') {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        
        renderProducts(filteredProducts);
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', filterAndSortProducts);
    }
    
    renderProducts(partsData);
    updateCartIcon();


    const subscriptionPopup = document.getElementById('subscription-popup');
    const subscribeAcceptBtn = document.getElementById('subscribe-accept-btn');
    const subscribeDeclineBtn = document.getElementById('subscribe-decline-btn');
    const thankYouMessage = document.getElementById('thank-you-message');

    const isSubscribed = localStorage.getItem('isSubscribedToAutoDrive');
    if (!isSubscribed && subscriptionPopup) { 
        setTimeout(() => {
            subscriptionPopup.classList.remove('hidden');
        }, 5000);
    }

    if (subscribeAcceptBtn) {
        subscribeAcceptBtn.addEventListener('click', () => {
            if (subscriptionPopup) subscriptionPopup.classList.add('hidden');
            localStorage.setItem('isSubscribedToAutoDrive', 'true');
            if (thankYouMessage) {
                thankYouMessage.classList.remove('hidden');
                setTimeout(() => {
                     thankYouMessage.classList.add('hidden');
                }, 3000);
            }
        });
    }

    if (subscribeDeclineBtn) {
        subscribeDeclineBtn.addEventListener('click', () => {
            if (subscriptionPopup) subscriptionPopup.classList.add('hidden');
        });
    }

    const adModalOverlay = document.getElementById('ad-modal-overlay');
    const adModal = document.getElementById('ad-modal'); 
    const adCloseBtn = document.getElementById('ad-close-btn');
    const adCloseTimerSpan = document.getElementById('ad-close-timer');
    let adCloseTimerInterval;
    let adShown = sessionStorage.getItem('adModalShown') === 'true'; 

    function showAdModal() {
        if (adShown || !adModalOverlay || !adModal) return; 
        
        adModalOverlay.classList.remove('hidden');
        adModal.classList.remove('hidden');
        sessionStorage.setItem('adModalShown', 'true');
        adShown = true;

        let countdown = 5; 
        if (adCloseBtn) adCloseBtn.disabled = true;
        if (adCloseTimerSpan) adCloseTimerSpan.textContent = `(${countdown})`;

        adCloseTimerInterval = setInterval(() => {
            countdown--;
            if (adCloseTimerSpan) adCloseTimerSpan.textContent = `(${countdown})`;
            if (countdown <= 0) {
                clearInterval(adCloseTimerInterval);
                if (adCloseBtn) {
                    adCloseBtn.disabled = false;
                    adCloseBtn.textContent = 'Закрити'; 
                }
                 if (adCloseTimerSpan) adCloseTimerSpan.textContent = '';
            }
        }, 1000);
    }

    setTimeout(showAdModal, 5000);

    if (adCloseBtn) {
        adCloseBtn.addEventListener('click', () => {
            if (adModalOverlay) adModalOverlay.classList.add('hidden');
            clearInterval(adCloseTimerInterval); 
        });
    }

    const scrollToTopBtn = document.getElementById('scroll-to-top-btn');

    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > (document.documentElement.scrollHeight - window.innerHeight) * (2/3) || window.scrollY > window.innerHeight * 1.5 ) { // Альтернативна умова, якщо сторінка не дуже довга
                scrollToTopBtn.classList.remove('hidden');
            } else {
                scrollToTopBtn.classList.add('hidden');
            }
        });

        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});
