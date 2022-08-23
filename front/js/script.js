let productData = []; /*création d'un array*/

/*récupération des données du serveur et intégration des données dans le array créé précédemment*/
const fetchProduct = async () => {
    await fetch("http://localhost:3000/api/products")
        .then((res) => res.json())
        .then((promise)=> {
            productData = promise;
            console.log(productData);
        }
    );
};

/*affichage des items sur le site*/

const productDisplay = async () => { 
    await fetchProduct();

    productData.forEach((product) => {
        var select = document.getElementById('items');

        var a = document.createElement("a");
        a.href = `./product.html?id=${product._id}`;

        var article = document.createElement("article");

        var img = document.createElement("img");
        img.src = product.imageUrl;
        img.alt = product.altTxt;

        var title = document.createElement("h3");
        title.className = "productName";
        title.innerText = product.name;

        var p = document.createElement("p");
        p.className = "productDescription";
        p.innerText = product.description;

        article.appendChild(img);
        article.appendChild(title);
        article.appendChild(p);
        a.appendChild(article);
        select.appendChild(a);
    });
};

productDisplay ();
