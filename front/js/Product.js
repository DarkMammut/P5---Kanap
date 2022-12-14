/*get product-id in URL*/
const idProduct=window.location.search.split("?id=").join("");

let product = {}; //create an object//

/*fetch server 
get object (product) from idproduct*/
const fetchProduct = async () => {
    await fetch(`http://localhost:3000/api/products/${idProduct}`)
        .then((res) => res.json())
        .then((promise)=> {
            product = promise;
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
        return {};
    } else {
        return JSON.parse(cart);
    }
}

const addCart = () => {
    let button = document.getElementById('addToCart');
    button.addEventListener("click",() => {
        let quantity = Number(document.getElementById("quantity").value);
        let color = document.getElementById("colors").value;
        let cart = getCart();
        let key = idProduct + color;
        let findProduct = cart[key];

        if(color !== "") {
            if(quantity > 0 && quantity < 101) {
                if(!cart) {cart={}};
                if(findProduct) {
                    cart[key].quantity += quantity;
                } else {
                    cart[key] = {
                        _id: idProduct,
                        color: color,
                        quantity: quantity,
                    };
                };
            }else {
                alert("Merci d'indiquer une quantité entre 1 et 100.")
            };
        } else {
            alert("Merci d'indiquer une couleur.")
        };
        saveCart(cart);
        alert("L'article a été ajouté à votre panier.")
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