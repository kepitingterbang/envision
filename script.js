
const product_triger = document.querySelector(".product_trigger");
const detail_trigger = document.querySelector(".detail");
const add_to_cart_trigger = document.querySelector(".greetings");
const checkout_trigger = document.querySelector(".checkout_trigger");
const complete_trigger = document.querySelector("#order-id");
let products = null;

fetch('products.json')
.then(response => response.json())
.then(data => {
    products = data;
    console.log(products);
    if(product_triger){
        addDataToHTML();
    }
    if(detail_trigger){
        showdetail();
    }
    if(add_to_cart_trigger){
        cartpage();
    }
    if(checkout_trigger){
        checkout()
    }
    if(complete_trigger){
        completePage();
}
})

let listproduct = document.querySelector('.listproduct');

function addDataToHTML(){
    products.forEach(product => {
        let newProduct = document.createElement('a');
        newProduct.href = '/detail.html?id=' + product.id;
        newProduct.classList.add('item');
        
        newProduct.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
        `;
        
        listproduct.appendChild(newProduct);
    })
}

function showdetail(){
    let detail = document.querySelector('.detail');
    let productId = new URLSearchParams(window.location.search).get('id');
    let thisproduct = products.filter(value => {
        return value.id == productId
    })[0];
    if(!thisproduct){
        window.location.href =  "/";
    }
    detail.querySelector('.image img').src = thisproduct.image;
    detail.querySelector('.name').innerText = thisproduct.name;
    detail.querySelector('.price').innerText = 'Rp ' + thisproduct.price;
    document.querySelector('.description').innerText = thisproduct.description;

    let listproduct = document.querySelector('.listproduct');
    (products.filter(value => value.id != productId))
    .forEach(product =>{
        let newProduct = document.createElement('a');
        newProduct.href = '/detail.html?id=' + product.id
        newProduct.classList.add('item');
        newProduct.innerHTML = `
            <img src="${product.image}">
            <h2>${product.name}</h2>
            <div class="price">${product.price}</div>
        `;
        listproduct.appendChild(newProduct);


    });

    document.querySelector('#addcart-btn').addEventListener('click', () =>{
    addToCart(thisproduct.id);
    alert('this product has been succesfully added to the cart')
    });

    document.querySelector('#checkout-btn').addEventListener('click', () => {
    addToCart(thisproduct.id);
    window.location.href = 'cart.html';
    });
}
function addToCart(id){
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(item => item.id == id);

    if(existing){
        existing.quantity += 1;
    }
    else{
        cart.push({id: id, quantity : 1});
    }

    localStorage.setItem('cart', JSON.stringify(cart));
}
const cartMobileQuery = window.matchMedia('(max-width: 590px)');

function cartpage(){ // belum jadi
    const CartItemsContainer = document.querySelector(".cart-items");
    const SubTotalEl = document.querySelector(".subtotal");
    const GrandTotalEL = document.querySelector(".grand-total");
    const CartHeaderEL = document.querySelector(".cart-header");

    const isMobile = cartMobileQuery.matches;

    CartHeaderEL.innerHTML = isMobile
    ?`
        <span>Products</span>
        <span class="space"></span>
        <span>Remove</span>
    `

    : `
        <span>Products</span>
        <span>Price</span>
        <span>Quantity</span>
        <span>Total</span>
        <span>Remove</span>
    `;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    CartItemsContainer.innerHTML = "";

    if (cart.length === 0) {
        CartItemsContainer.innerHTML = "<p>Keranjang belanja masih kosong.</p>";
        SubTotalEl.innerText = 0;
        GrandTotalEL.innerText = 0;
        return;
    }
    let subtotal = 0;

    cart.forEach(item => {
        let product = products.find(p => p.id == item.id);
        if(!product) return;
        console.log(product);

        let itemTotal =  product.price * item.quantity;
        subtotal += itemTotal;

        let cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = isMobile
        ?`
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-info">
                <p class="item-name">${product.name}</p>
                <span class="price">Rp ${product.price.toLocaleString('id-ID')}</span>
                <div class="quantity">
                    <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
                </div>
                <span class="total-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
            <button class="remove" data-id="${product.id}"><i class="ri-close-line"></i></button>
        `
        : `
            <div class="product">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-detail">
                    <p>${product.name}</p>
                </div>
            </div>
            <span class="price">Rp ${product.price.toLocaleString('id-ID')}</span>
            <div class="quantity">
                <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
            </div>
            <span class="total-price">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            <button class="remove" data-id="${product.id}"><i class="ri-close-line"></i></button>
        `
        ;

        CartItemsContainer.appendChild(cartItem);
    });

    SubTotalEl.innerHTML = `Rp ${subtotal.toLocaleString('id-ID')}`;
    GrandTotalEL.innerHTML = `Rp ${subtotal.toLocaleString('id-ID')}`;

    CartItemsContainer.querySelectorAll('.quantity input').forEach(input => {
        input.addEventListener('change', (e) => {
            let id = e.target.dataset.id;
            let qty = parseInt(e.target.value) || 1;
            if (qty < 1) qty = 1;

            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            let item = cart.find(c => c.id == id);
            if (item) item.quantity = qty;
            localStorage.setItem('cart', JSON.stringify(cart));
            cartpage(); 
        });
    });


    CartItemsContainer.querySelectorAll('.remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = e.currentTarget.dataset.id;
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            cart = cart.filter(c => c.id != id);
            localStorage.setItem('cart', JSON.stringify(cart));
            cartpage();
        });
    });
    console.log(localStorage);
};

cartMobileQuery.addEventListener('change', () => {
    if (add_to_cart_trigger) cartpage();
});


function checkout(){
    const CartItemsContainer = document.querySelector(".cart-items");
    const SubTotalEl = document.querySelector(".cek_subtotal");
    const GrandTotalEL = document.querySelector(".cek_grand-total");
    const QuantitytotalEL = document.querySelector(".quantity-total")

    let subtotal = 0;
    let quantityTotal = 0;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    CartItemsContainer.innerHTML = "";

    
    cart.forEach(item => {
        let product = products.find(p => p.id == item.id);
        if(!product) return;
        console.log(product);

        let itemTotal =  product.price * item.quantity;
        
        subtotal += itemTotal;
        quantityTotal += item.quantity;
        let cartItem = document.createElement('div');
        cartItem.classList.add('checkout-item');
        cartItem.innerHTML =`
            <div class="cek_product">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="item-info">
                <p class="cek_name">${product.name}</p>
                <span class="cek_price">Rp ${product.price.toLocaleString('id-ID')}</span>
                <div class="cek_quantity">
                    <input type="number" value="${item.quantity}" min="1" data-id="${product.id}">
                </div>
                <span class="cek_total">Rp ${itemTotal.toLocaleString('id-ID')}</span>
            </div>
        `;

        CartItemsContainer.appendChild(cartItem);
    });
    if(quantityTotal > 1){
        QuantitytotalEL.innerHTML= `Total Products : ${quantityTotal}`;
    }
    else if(quantityTotal = 1){
        QuantitytotalEL.innerHTML= `Total Product : 1`;
    }
    
    SubTotalEl.innerHTML = `Rp ${subtotal.toLocaleString('id-ID')}`;
    GrandTotalEL.innerHTML = `Rp ${subtotal.toLocaleString('id-ID')}`;

    const paymentSelect = document.querySelector('#payment-method');
    const cardSelection = document.querySelector('#card-payment-section')

    // buat on/off transfer page
    function toggle_transfer(){
        if(paymentSelect.value === 'transfer') {
            cardSelection.classList.remove('hidden');
        }
        else{
            cardSelection.classList.add('hidden');
        }
    }
    toggle_transfer()
    paymentSelect.addEventListener('change', toggle_transfer);


    // auto format card number

    function cardval(input){
        let raw = input.split('').filter(char => char >= '0' && char <= '9').join('');
        raw = raw.slice(0, 16);
        console.log(`testing`);
        console.log(typeof(raw));
        return raw;
    }
    const cardnumber = document.querySelector('#card-number');
    cardnumber.addEventListener('input', () =>{
        let raw = cardnumber.value;
        raw = cardval(raw);


        let formatted = '';
        for(let i = 0; i < raw.length; i++){
            if(i > 0 && i % 4 === 0){
                formatted += ' ';
            }
            formatted += raw[i];
        }
        cardnumber.value = formatted;
        console.log(cardnumber.value);
    });
    // auto format mm/yy
    const mmyy = document.querySelector("#card-expiry");
    mmyy.addEventListener('input', () =>{
        let raw = mmyy.value.split('').filter(char => char >= '0' && char <= '9').join('');
        raw = raw.slice(0, 4);

        let formatted ='';
        for(let i = 0; i < raw.length; i++){
            if(i == 2){
                formatted += '/';
            }
            formatted += raw[i];
        }
        mmyy.value = formatted;
        console.log(mmyy.value);
    });

    // auto format cvv
    const cvv = document.querySelector("#card-cvv");
    cvv.addEventListener('input', () =>{
        let raw = cvv.value.split('').filter(char => char >= '0' && char <= '9').join('');
        raw = raw.slice(0, 4);

        cvv.value = raw;
        console.log(cvv.value);
    });

    // validator
    const placeOrderBtn = document.querySelector('#place-order-btn');
    function showError(input, message){
        const errorEl = input.parentElement.querySelector('.error-message');
        input.classList.add('input-error');
        errorEl.innerHTML = message;
    }
    function clearError(input){
        const errorEl = input.parentElement.querySelector('.error-message');
        input.classList.remove('input-error');
        errorEl.innerText = '';
    }

    function validator(input){
        const inputval = input.value.trim('');
        console.log(`ini adalah valuenya ${inputval}`);

        switch(input.id){
            case 'form-name':
                if(inputval.length < 1){
                    showError(input, 'Nama minimal 1 karakter'); return false;
                }
                break;
            case 'form-email':
                const atindex = inputval.indexOf('@');
                const atindex1 = inputval.lastIndexOf('@')
                const dotindex = inputval.lastIndexOf('.');

                if(atindex > 0 && atindex == atindex1 && dotindex > atindex + 1 && dotindex < inputval.length - 1){
                    console.log('berhasil');
                }
                else{
                    showError(input, 'masukin email yang valid'); return false;
                    console.log('gagal');
                }
                break;
            case 'card-number':
                let card_raw = cardval(inputval);
                console.log(card_raw);
                // 4003600000000014
                let card_total_odd = 0;
                let card_total_even = 0;
                for(let i = 0; i < card_raw.length; i++){
                    let card_num = parseInt(card_raw[i])
                    console.log(` index ${i % 2}`);
                    if(i % 2 == 0){
                        card_num = card_num * 2;
                        if(card_num > 9){
                            card_total_odd += parseInt(card_num.toString()[0]);
                            console.log(`digit pertama ${card_num.toString()[0]}`);
                            card_total_odd += card_num % 10;
                            console.log(`digit kedua ${card_num % 10}`);
                            console.log(`ini subtotal odd ${card_total_odd}`);
                        }
                        else{
                            console.log(card_num)
                            card_total_odd += card_num;
                            console.log(`ini subtotal odd ${card_total_odd}`);
                        }
                    }
                    else{
                        console.log(card_num);
                        card_total_even += card_num;
                    }
                }

                if((card_total_odd + card_total_even) % 10 == 0){
                    console.log("kartunya real cuy")
                }
                else{
                    showError(input, 'Nomor kartu Invalid'); return false;
                }
                break;
            case 'card-expiry':
                let card_exp = inputval.split('').filter(char => char >= '0' && char <= '9').join('');
                console.log(card_exp);
                if(card_exp.length < 4){
                    showError(input, 'masukan bulan dan tanggal yang valid'); return false;
                    console.log("invalid");
                    break;
                }
                let year_exp = parseInt(card_exp.slice(2));
                let month_exp = parseInt(card_exp.slice(0, 2));
                
                if(month_exp > 12 || month_exp < 1){
                    console.log("bulan ga valid");
                    showError(input, 'Bulan Invalid'); return false;
                    break;
                }

                let now = new Date();
                let currentyear = now.getFullYear() % 100;
                let currentmonth = now.getMonth() + 1;
                
                let isExpired = (year_exp < currentyear ) || (year_exp === currentyear && month_exp < currentmonth);
                if(isExpired){
                    showError(input, 'kartu sudah expired'); return false;
                    console.log("invalid");
                }
                else{
                    console.log("valid");
                }
                break;
            case 'card-cvv':
                if(inputval.length < 3){
                    showError(input, 'CVV 3-4 digit'); return false;
                    console.log("masukin cvv yang benar");
                }
                break;
        }
        clearError(input);
        return true;
    };

    const allinput = document.querySelectorAll('#checkout-user-detail input, .card-payment-section input');
    console.log(allinput);
    allinput.forEach(input =>{
        input.addEventListener('blur', () => validator(input));
    });

    placeOrderBtn.addEventListener('click', () => {
        let fieldsToCheck = ['form-email', 'form-name'];
        if(paymentSelect.value === 'transfer'){
            fieldsToCheck = fieldsToCheck.concat(['card-number', 'card-expiry', 'card-cvv']);
        }

        let allValid = true;
        fieldsToCheck.forEach(id => {
            const input = document.querySelector('#' + id);
            if(!validator(input)) allValid = false;
        });

        if(allValid){
            alert('Order berhasil! (di sini nanti proses ke server / payment gateway)');
            window.location.href = 'complete.html';
        }
    })
};