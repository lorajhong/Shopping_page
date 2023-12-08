renderProductList();

async function renderProductList() {
    const data = await callAPI("GetProductList", "", "");
    document.querySelector(".productWrap").innerHTML =
        data.products.reduce((acc, curr) => {
            acc += templateProductCard(curr.images, curr.title, curr.origin_price, curr.price)
            return acc;
        }, "")
}

function templateProductCard(images, title, origin_price, price) {

    let template = `
    <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${images}" alt="">
                <a href="#" class="addCardBtn">加入購物車</a>
                <h3>${title}</h3>
                <del class="originPrice">${'NT$' + origin_price.toLocaleString('en-US')}</del>
                <p class="nowPrice">${'NT$' + price.toLocaleString('en-US')}</p>
            </li>
    `;
    return template
}

