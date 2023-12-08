let data = [];
initProductList();

async function initProductList() {
    const apiData = await callAPI("GetProductList", "", "");
    data = apiData.products;
    renderProductList(data);
    let productSelect = document.querySelector('.productSelect');
    productSelect.addEventListener('change', handleProductSelct);
}

async function renderProductList(filtereddata) {
    document.querySelector(".productWrap").innerHTML =
        filtereddata.reduce((acc, curr) => {
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
    return template;
}

function handleProductSelct(e) {
    const filterValue = e.target.value;
    if (filterValue === "全部") {
        renderProductList(data);
    } else {
        const filteredData = data.filter((it) => it.category === filterValue);
        renderProductList(filteredData);
    }
}
