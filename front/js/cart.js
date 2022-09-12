async function fetchProduct(idProduct) {
    let productData = {}; //create an object//

    /*fetch server 
    get object (productData) from idproduct*/
    const fetchProductData = async () => {
        await fetch(`http://localhost:3000/api/products/${idProduct}`)
            .then((res) => res.json())
            .then((promise)=> {
                productData = promise;
            }
        );
    };
    await fetchProductData();
    return productData
};

/*get products in "cart" from localStorage and put result in an array*/
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return {};
    } else {
        return JSON.parse(cart);
    }
}

/*
* add products in "cart" in localStorage 
* @param {object} cart
*/
function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart))
}

/*
* delete products in "cart" in localStorage 
* @param {string} key
* @param {string} divDelete (HTML)
*/
function deleteItem(divDelete,key) {
    let cart = getCart();
    divDelete.addEventListener("click",() => {
        if (Object.keys(cart).length > 1) {
            delete cart[key];
            saveCart(cart);
        } else {
            localStorage.clear();
        };
        let removeHTML = divDelete.closest('article');
        removeHTML.remove();
        calculateTotal(cart);
    });
}

/*
* change quantity products in "cart" in localStorage 
* @param {string} key
* @param {string} input (HTML)
*/
function changeQuantity(input,key) {
    input.addEventListener("change",function(event) {
        let cart = getCart();
            if (event.target.value > 0 && event.target.value <101) {
            cart[key].quantity = Number(event.target.value);
            saveCart(cart);
            calculateTotal(cart);
            } else { 
                event.target.value = cart[key].quantity;
                alert("veuillez renseigner une valur comprise entre 1 et 100");
            }
    });
}

/*
* change total quantity and total amount in HTML
* @param {array} cart
* @param {object} productData
*/
async function calculateTotal(cart) {
    let totalQuantity = 0;
    let totalAmount = 0;

    for (const [key, value] of Object.entries(cart)) { //add quantity and amount for each product in cart
        let findProduct = await fetchProduct(value._id);
        totalQuantity += Number(value.quantity);
        let price = Number(findProduct.price);
        let amount = Number(value.quantity) * price;
        totalAmount += amount;
    };

    document.getElementById("totalQuantity").innerText = totalQuantity;
    document.getElementById("totalPrice").innerText = totalAmount;
}

/*
* add HTML in <section id="cart__items">...</section>
* @param {object} findProduct
* @param {array} cartProduct
*/
function writeHTML(findProduct,product,productKey) {
    var select = document.getElementById('cart__items');

    var article = document.createElement("article");
    article.className = "cart__item";
    article.dataset.id = product._id;
    article.dataset.color = product.color;

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
    p1.innerText = product.color;

    var p2 = document.createElement("p");
    p2.innerText = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(findProduct.price);

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
    input.value= product.quantity;

    changeQuantity(input,productKey);

    var divDelete = document.createElement("div");
    divDelete.className = "cart__item__content__settings__delete";

    deleteItem(divDelete,productKey);

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

/*
* validate RegEx for names
* @param {string} name
*/
function validateNames(name) {
    var reg = /^[a-zA-Z\u0080-\u024F ,.'-]+$/;
  
    if (!reg.test(name)) {
      return false;
    };
}

/*
* validate RegEx for address
* @param {string} address
*/
function validateAddress(address) {
    var reg = /^[\w ,'-]+$/;
  
    if (!reg.test(address)) {
      return false;
    };
}

/*
* validate RegEx for city
* @param {string} city
*/
function validateCity(city) {
    var reg = /^([a-zA-Z\u0080-\u024F]+(-' ))*[a-zA-Z\u0080-\u024F]+$/;
  
    if (!reg.test(city)) {
      return false;
    };
}

/*
* validate RegEx for email
* @param {string} email
*/
function validateEmail(email) {
    var reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if(!reg.test(email)) {
        return false;
    };
}

const cartDisplay = async () => {
    let cart = getCart();

    for (const [key, value] of Object.entries(cart)) { //for each product in cart: find it in server and add HTML
        let findProduct = await fetchProduct(value._id);
        writeHTML(findProduct,value,key);
    };

    calculateTotal(cart);
};

const validateForm = async () => {
    const contact = { //add object {contact}
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        email: "",
    };

    document.getElementById("firstName").addEventListener("change",function(event) { //when value of input changes validate RegEX
        let firstName = String(event.target.value);
        if (firstName.length > 1) {
            if(validateNames(firstName) == false) {
                document.getElementById("firstNameErrorMsg").innerText = "Merci de renseigner votre prénom sans chiffres et sans caractères spéciaux";
                contact.firstName = "";
            } else {
                document.getElementById("firstNameErrorMsg").innerText = "";
                contact.firstName = firstName;
            };
        } else {
            document.getElementById("firstNameErrorMsg").innerText = "Votre prénom doit contenir au moins 2 caractères";
            contact.firstName = "";
        };
    });

    document.getElementById("lastName").addEventListener("change",function(event) { //when value of input changes validate RegEX
        let lastName = String(event.target.value);
        if (lastName.length > 1) {
            if(validateNames(lastName) == false) {
                document.getElementById("lastNameErrorMsg").innerText = "Merci de renseigner votre nom sans chiffres et sans caractères spéciaux";
                contact.lastName = "";
            } else {
                document.getElementById("lastNameErrorMsg").innerText = "";
                contact.lastName = lastName;
            };
        } else {
            document.getElementById("lastNameErrorMsg").innerText = "Votre nom doit contenir au moins 2 caractères";
            contact.lastName = "";
        };
    });

    document.getElementById("address").addEventListener("change",function(event) { //when value of input changes validate RegEX
        let address = String(event.target.value);
        if (address.length > 1) {
            if(validateAddress(address) == false) {
                document.getElementById("addressErrorMsg").innerText = "Merci de renseigner une adresse valide";
                contact.address = "";
            } else {
                document.getElementById("addressErrorMsg").innerText = "";
                contact.address = address;
            };
        } else {
            document.getElementById("addressErrorMsg").innerText = "Merci de renseigner une adresse complète";
            contact.address = "";
        };
    });

    document.getElementById("city").addEventListener("change",function(event) { //when value of input changes validate RegEX
        let city = String(event.target.value);
        if (city.length > 1) {
            if(validateNames(city) == false) {
                document.getElementById("cityErrorMsg").innerText = "Merci de renseigner une ville valide";
                contact.city = "";
            } else {
                document.getElementById("cityErrorMsg").innerText = "";
                contact.city = city;
            };
        } else {
            document.getElementById("cityErrorMsg").innerText = "Votre ville doit contenir au moins 2 caractères";
            contact.city = "";
        };
    });

    document.getElementById("email").addEventListener("change",function(event) { //when value of input changes validate RegEX
        let email = String(event.target.value);
        if (email.length > 5) {
            if(validateEmail(email) == false) {
                document.getElementById("emailErrorMsg").innerText = "Merci de renseigner une adresse email valide";
                contact.email = "";
            } else {
                document.getElementById("emailErrorMsg").innerText = "";
                contact.email = email;
            };
        } else {
            document.getElementById("emailErrorMsg").innerText = "merci de renseigner une adresse email";
            contact.email = "";
        };
    });

    document.getElementById("order").addEventListener("click", async function(event) {
        event.preventDefault(); //do not allow to change URL
        let cart = getCart();
        if (Object.keys(cart).length > 0) {
            if(contact.firstName !== "" && contact.lastName !== "" && contact.address !== "" && contact.city !== "" && contact.email !== "") {
                
                let orderProducts = [];

                for (const [key, value] of Object.entries(cart)) { //add quantity and amount for each product in cart
                    orderProducts.push(value._id);
                };

                let clientOrder = {
                    contact: contact,
                    products: orderProducts,
                };

                let res = await fetch("http://localhost:3000/api/products/order", {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clientOrder)
                })

                let order = await res.json() //get response of server and keep result in order

                if(order) {
                    localStorage.clear();
                    url = `./confirmation.html?order=${order.orderId}`;
                    window.location.href = url;
                } else {
                    alert("Une erreur est survenue. Veuillez réessayer ultérieurement.");
                };

            } else { alert("merci de remplir le formulaire de contact"); };
        } else { alert("votre panier est vide"); }
    });   
};

cartDisplay(); //call const cartDisplay
validateForm(); //call const validateForm
