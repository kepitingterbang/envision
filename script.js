let products = null;
fetch('products.json')
.then(response => response.json())
.then(data => {
    products = data;
    console.log(products);
    addDataToHTML();
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