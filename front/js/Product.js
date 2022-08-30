/*get product-id in URL*/
const idProduct=window.location.search.split("?id=").join("");
console.log(idProduct)

let product = {}; //create an object//

/*fetch server 
get object (product) from idproduct*/
const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`)
        .then((res) => res.json())
        .then((promise)=> {
            product = promise;
            console.log(product);
        }
    );
};

/*
* add products in "cart" in localStorage 
* @param {object} cart
*/
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

/*
* get products in "cart" from localStorage and put result in an array
*/
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

const addCart = () => {
    let button = document.getElementById('addToCart');
    console.log(idProduct);
    button.addEventListener("click",() => {
        let quantity = Number(document.getElementById("quantity").value);
        let color = document.getElementById("colors").value;
        let cart = getCart();
        let key = idProduct + color;
        let findProduct = cart.find(p => p.key == key);

        console.log(color);

        if(color !== "") {
            if(quantity > 0) {
                if(findProduct !== undefined) {
                    console.log(findProduct);
                    findProduct.quantity = findProduct.quantity + quantity;
                } else if(cart.length == 0) {
                    let newProduct = Object.assign({}, cart, {
                        key: key,
                        _id: idProduct,
                        color: color,
                        quantity: quantity,
                    });
                    cart.push(newProduct);
                } else {
                    let newProduct = {
                        key: key,
                        _id: idProduct,
                        color: color,
                        quantity: quantity,
                    };
                    cart.push(newProduct);
                };
            }else {
                alert("Merci d'indiquer une quantité supérieur à 0")
            };
        } else {
            alert("Merci d'indiquer une couleur.")
        };
        saveCart(cart);

        console.log(cart);
    });
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