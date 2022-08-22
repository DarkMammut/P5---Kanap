const idProduct=window.location.search.split("?id=").join("");
console.log(idProduct)

let product = [];

const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`)
        .then((res) => res.json())
        .then((promise)=> {
            product = promise;
            console.log(product);

        }
    );
};

async function ProductDisplay() {
    await fetchProduct();

    document.querySelector('title').textContent = `${product.name}`;

    let image = `<img src="${product.imageUrl}" alt="${product.altTxt}"/>`;
    console.log(image);

    document.getElementsByClassName('item__img')[0].innerHTML = image;
    document.getElementById('title').innerHTML = `${product.name}`;
    document.getElementById('description').innerHTML = `${product.description}`;
    document.getElementById('price').innerHTML = `${product.price}`;

    console.log(product.colors)

    product.colors.forEach((color) => {
        let createOption = document.createElement("option");
        console.log(createOption);

        createOption.innerHTML = `${color}`;
        createOption.value = `${color}`;

        var select = document.getElementById('colors');
        select.appendChild(createOption);
    });

    
};

ProductDisplay();

