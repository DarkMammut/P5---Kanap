const idProduct=window.location.search.split("?id=").join("");
console.log(idProduct)

let product = {};
let msg = "";

const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`)
        .then((res) => res.json())
        .then((promise)=> {
            product = promise;
            console.log(product);

        }
    );
};

async function productDisplay() {
    await fetchProduct();

    document.querySelector('title').textContent = `${product.name}`;

    let createImg = document.createElement("img");
    createImg.src = product.imageUrl;
    createImg.alt = product.altTxt;
    document.getElementsByClassName('item__img')[0].appendChild(createImg);
    
    document.getElementById('title').innerText = product.name;
    document.getElementById('description').innerText = product.description;
    document.getElementById('price').innerText = product.price;

    console.log(product.colors)

    product.colors.forEach((color) => {
        let createOption = document.createElement("option");

        createOption.innerText = color;
        createOption.value = color;

        var select = document.getElementById('colors');
        select.appendChild(createOption);

    });

    addCart(product);

};

productDisplay();

const addCart = () => {
    let button = document.getElementById('addToCart');
    console.log(idProduct);
    button.addEventListener("click",() => {
        let select = document.getElementById('colors');
        let qty = document.getElementById('quantity');

        console.log(select.value);
        console.log(qty.value);

        console.log(productColor);

        if (Number(qty.value) > 0) {
                if (select.value !== '') {
                    const productColor = Object.assign({}, product, {
                        color: `${select.value}`,
                        quantity: Number(`${qty.value}`),
                    });
                    if (productArray == null) {
                        productArray = [];
                        productArray.push(productColor);
                        console.log(productArray);
                        localStorage.setItem('product',JSON.stringify(productArray));
                    } else {
                        productArray.push(productColor);
                        console.log(productArray);
                        localStorage.setItem('product',JSON.stringify(productArray));
                    };
                } else {
                    let msg = "La couleur renseignée est incorrecte !"
                    alert(msg);
                };
        } else {
            let msg = "La quantité renseignée est incorrecte !"
            alert(msg);
        };
    });
};

