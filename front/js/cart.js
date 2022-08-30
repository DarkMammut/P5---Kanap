let productData = []; //create an array//

/*fetch server 
get array (productData) of all products*/
const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise)=> {
            productData = promise;
        }
    );
};

/*get products in "cart" from localStorage and put result in an array*/
function getCart() {
    let cart = localStorage.getItem("cart");
    if (cart == null) {
        return [];
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
function deleteItem(key,divDelete) {
    let cart = getCart();
    divDelete.addEventListener("click",() => {
        let findProduct = cart.find(product => product.key === key);
        let removeIndex = cart.indexOf(findProduct);
        if (cart.lenght > 1) {
            if (removeIndex !== -1) {
                cart.splice(removeIndex, 1);
                saveCart(cart);
            };
        } else {
            cart.splice(removeIndex, 1);
            localStorage.clear();
        };
        let removeHTML = divDelete.closest('article');
        removeHTML.remove();
        calculateTotal(cart,productData);
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
        let findProduct = cart.find(product => product.key === key);
        findProduct.quantity = event.target.value;
        saveCart(cart);
        calculateTotal(cart,productData);
    });
}

/*
* change total quantity and total amount in HTML
* @param {array} cart
* @param {array} productData
*/
function calculateTotal(cart,productData) {
    let totalQuantity = 0;
    let price = 0;
    let amount = 0;
    let totalAmount = 0;
    cart.forEach((cartProduct) => { //add quantity and amount for each product in cart
        totalQuantity += Number(cartProduct.quantity);
        let findProduct = productData.find(product => product._id === cartProduct._id);
        price = Number(findProduct.price);
        amount = Number(cartProduct.quantity) * price;
        totalAmount += amount;
    });
    document.getElementById("totalQuantity").innerText = totalQuantity;
    document.getElementById("totalPrice").innerText = totalAmount;
}

/*
* add HTML in <section id="cart__items">...</section>
* @param {object} findProduct
* @param {array} cartProduct
*/
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

/*
* validate RegEx for names
* @param {string} name
*/
function validateNames(name) {
    var reg = /^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u;
  
    if (!reg.test(name)) {
      return false;
    };
}

/*
* validate RegEx for address
* @param {string} address
*/
function validateAddress(address) {
    var reg = /^[a-zA-Z0-9\s,'-]*$/;
  
    if (!reg.test(address)) {
      return false;
    };
}

/*
* validate RegEx for city
* @param {string} city
*/
function validateCity(city) {
    var reg = /^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$/;
  
    if (!reg.test(city)) {
      return false;
    };
}

/*
* validate RegEx for email
* @param {string} email
*/
function validateEmail(email) {
    var reg = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    if(!reg.test(email)) {
        return false;
    };
}

const cartDisplay = async () => {
    let cart = getCart();

    await fetchProduct();
    
    console.log(cart);

    cart.forEach((cartProduct) => { //for each product in product find it in server and add HTML
        let findProduct = productData.find(product => product._id === cartProduct._id);
        writeHTML(findProduct,cartProduct);
    });

    calculateTotal(cart,productData);
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
                console.log(contact);
            };
        } else {
            document.getElementById("emailErrorMsg").innerText = "merci de renseigner une adresse email";
            contact.email = "";
        };
    });

    document.getElementById("order").addEventListener("click", function(event) {
        event.preventDefault(); //do not allow to change URL
        let cart = getCart();
        if (cart.length > 0) {
            if(contact.firstName !== "" && contact.lastName !== "" && contact.address !== "" && contact.city !== "" && contact.email !== "") {
                let orderProducts = [];
                cart.forEach((product) => {
                    orderProducts.push(product._id);
                });
                let clientOrder = {
                    contact: contact,
                    products: orderProducts,
                };

                console.log(clientOrder);

                const res = async () => {
                    await fetch("http://localhost:3000/api/products/order", {
                        method: "POST",
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(clientOrder)
                    });
                ;}
                console.log("la requête cart.js est opérationelle.");

                const serverValue = async () => {
                    await res.json();
                }

                console.log(serverValue)

                if(serverValue) {
                    sessionStorage.setItem('orderId', serverValue.orderId);
                    console.log(sessionStorage.getItem('orderID'));
                } else {
                    alert("Une erreur est survenue. Veuillez réessayer ultérieurement.");
                }

                console.log(sessionStorage.getItem('orderId'));

                //document.location.href = "./confirmation.html";

            } else {
                alert("merci de remplir le formulaire de contact");
            }
        } else {
            alert("votre panier est vide")
        }
    });
}

cartDisplay();
validateForm();