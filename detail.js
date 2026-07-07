let products = null;
fetch('products.json')
.then(response => response.json())
.then(data => {
    products = data;
    showdetail();
})


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
    })
}