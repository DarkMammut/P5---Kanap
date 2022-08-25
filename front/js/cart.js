let productData = []; /*création d'un array*/
/*récupération des données du serveur et intégration des données dans le array créé précédemment*/
const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise)=> {
            productData = promise;
        }
    );
};

function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
    } else {
        return JSON.parse(cart);
    }
}

function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

function deleteItem(key,divDelete) {
    let cart = getCart();
    let findProduct = cart.find(product => product.key === key);
    divDelete.addEventListener("click",() => {
        localStorage.clear();
        calculateTotal(cart,productData);
    });
}

function changeQuantity(input,key) {
    input.addEventListener("change",function(event) {
        let cart = getCart();
        let findProduct = cart.find(product => product.key === key);
        findProduct.quantity = event.target.value;
        saveCart(cart);
        calculateTotal(cart,productData);
    });
}

function calculateTotal(cart,productData) {
    let totalQuantity = 0;
    let price = 0;
    let amount = 0;
    let totalAmount = 0;
    cart.forEach((cartProduct) => {
        totalQuantity += Number(cartProduct.quantity);
        let findProduct = productData.find(product => product._id === cartProduct._id);
        price = Number(findProduct.price);
        amount = Number(cartProduct.quantity) * price;
        totalAmount += amount;
    });
    document.getElementById("totalQuantity").innerText = totalQuantity;
    document.getElementById("totalPrice").innerText = totalAmount;
}

function writeHTML(findProduct,cartProduct) {
    var select = document.getElementById('cart__items');

    var article = document.createElement("article");
    article.className = "cart__item";
    article.dataset.id = cartProduct._id;
    article.dataset.color = cartProduct.color;

    var divImg = document.createElement("div");
    divImg.className = "cart__item__img";

    var img = document.createElement("img");
    img.src = findProduct.imageUrl;
    img.alt = findProduct.altTxt;

    var divContent = document.createElement("div");
    divContent.className = "cart__item__content";

    var divDescription = document.createElement("div");
    divDescription.className = "cart__item__content__description";

    var title = document.createElement("h2");
    title.innerText = findProduct.name;

    var p1 = document.createElement("p");
    p1.innerText = cartProduct.color;

    var p2 = document.createElement("p");
    p2.innerText = findProduct.price;

    var divSettings = document.createElement("div");
    divSettings.className = "cart__item__content__settings";

    var divQuantity = document.createElement("div");
    divQuantity.className = "cart__item__content__settings__quantity";

    var p3 = document.createElement("p");
    p3.innerText = "Qté :";

    var input = document.createElement("input");
    input.type = "number";
    input.className = "itemQuantity";
    input.name= "itemQuantity";
    input.min= "1";
    input.max= "100";
    input.value= cartProduct.quantity;

    changeQuantity(input,cartProduct.key);

    var divDelete = document.createElement("div");
    divDelete.className = "cart__item__content__settings__delete";

    deleteItem(cartProduct.key,divDelete);

    var p4 = document.createElement("p");
    p4.className = "deleteItem";
    p4.innerText = "Supprimer";

    divDelete.appendChild(p4);

    divQuantity.appendChild(p3);
    divQuantity.appendChild(input);

    divSettings.appendChild(divQuantity);
    divSettings.appendChild(divDelete);

    divDescription.appendChild(title);
    divDescription.appendChild(p1);
    divDescription.appendChild(p2);

    divContent.appendChild(divDescription);

    divImg.appendChild(img);

    article.appendChild(divImg);
    article.appendChild(divContent);
    article.appendChild(divSettings);

    select.appendChild(article);
}

const cartDisplay = async () => {
    let cart = getCart();

    await fetchProduct();
    
    console.log(cart);

    cart.forEach((cartProduct) => {
        let findProduct = productData.find(product => product._id === cartProduct._id);
        
        console.log(productData)
        console.log(cartProduct._id);
        console.log(findProduct);

        writeHTML(findProduct,cartProduct);
    });

    calculateTotal(cart,productData);
};

cartDisplay();