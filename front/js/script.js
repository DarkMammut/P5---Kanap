let productData = []; /*création d'un tableau*/

const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise)=> {
            productData = promise;
            console.log(productData);
        }
    );
};

fetchProduct()

/*affichage des items sur le site*/

const productDisplay = async () => { 
    await fetchProduct();

    /* boucle pour créer du HTML pour chaque produit*/
    document.getElementById("items").innerHTML = productData.map((product) => `
        <a href="./product.html?id=${product._id}">
            <article>
            <img src="${product.imageUrl}" alt="${product.altTxt}"/>
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
            </article>
        </a>
    `)
};

productDisplay ();
