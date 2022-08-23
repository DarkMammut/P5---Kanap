const idProduct=window.location.search.split("?id=").join("");
console.log(idProduct)

let product = [];
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

    addBasket(product);

};

ProductDisplay();

const addBasket = () => {
    let buton = document.getElementById('addToCart')
    console.log(buton)
    console.log(idProduct);
    buton.addEventListener("click",() => {
        let productArray = JSON.parse(localStorage.getItem('product'));
        let select = document.getElementById('colors');
        let qty = document.getElementById('quantity');

        console.log(select.value);
        console.log(qty.value);

        const productColor = Object.assign({}, product, {
            color: `${select.value}`,
            quantity: Number(`${qty.value}`),
        });

        console.log(productColor);

        if (Number(qty.value) > 0) {
            console.log("OK")
            for(let i=0; i<product.colors.length; i++) {
                if (select.value === product.colors[i]) {
                    console.log("OK")
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
                    break
                } else {
                    let msg = "La couleur renseignée est incorrecte !"
                    alert(msg);
                    console.log(msg)
                };
            };
        } else {
            let msg = "La quantité renseignée est incorrecte !"
            alert(msg);
            console.log(msg)
        };

        
    });
};

