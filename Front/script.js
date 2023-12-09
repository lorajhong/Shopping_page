let productData = [];
let cartData = [];
initProduct();
initCart();
/* Product list */
async function initProduct() {
    const apiData = await callAPI("GetProductList", "", "");
    productData = apiData.products;
    let productSelect = document.querySelector('.productSelect');
    productSelect.addEventListener('change', handleProductSelct);
    renderProductList(productData);

}
function productListEvent() {
    let addCardBtns = document.querySelectorAll('.addCardBtn');
    addCardBtns.forEach(it => it.addEventListener('click', handleAddCardBtn));
}

function renderProductList(filtereddata) {
    document.querySelector(".productWrap").innerHTML =
        filtereddata.reduce((acc, curr) => {
            acc += templateProductCard(curr.images, curr.title, curr.origin_price, curr.price, curr.id)
            return acc;
        }, "");
    productListEvent();
}

function templateProductCard(images, title, origin_price, price, id) {

    let template = `
    <li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${images}" alt="">
                <a href="#" class="addCardBtn" id="${id}">加入購物車</a>
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
        renderProductList(productData);
    } else {
        const filteredData = productData.filter((it) => it.category === filterValue);
        renderProductList(filteredData);
    }
}


/* Cart list */
async function initCart() {
    renderCartList(cartData);
}

function cartListEvent() {
    let deleteBtns = document.querySelectorAll('.material-icons');
    deleteBtns.forEach(btn => {
        btn.addEventListener('click', handleDeletebtnClick);
    });
    let deleteAllBtns = document.querySelector('.discardAllBtn');
    deleteAllBtns.addEventListener('click', handleDeleteAllbtnClick);


}

async function renderCartList(cartData) {
    cartData = await callAPI("GetCartList", "", "");
    let cartList = document.querySelector(".shoppingCart-table");
    let total = 0;
    cartList.innerHTML = `
    <tr>
        <th width="40%">品項</th>
        <th width="15%">單價</th>
        <th width="15%">數量</th>
        <th width="15%">金額</th>
        <th width="15%"></th>
    </tr>`;
    if (cartData.carts.length > 0) {
        cartList.innerHTML +=
            cartData.carts.reduce((acc, curr) => {
                acc += templateCartCard(curr.product.images,
                    curr.product.title, curr.product.price, curr.quantity, curr.id)
                return acc;
            }, "");
        total = cartData.finalTotal;
    }


    cartList.innerHTML += `<tr>
        <td>
            <a href="#" class="discardAllBtn">刪除所有品項</a>
        </td>
        <td></td>
        <td></td>
        <td>
            <p>總金額</p>
        </td>
        <td>${'NT$' + total.toLocaleString('en-US')}</td>
    </tr>`;
    cartListEvent();
}

function templateCartCard(images, title, price, quantity, id) {
    let template = `
    <tr>
    <td>
        <div class="cardItem-title">
            <img src="${images}" alt="">
            <p>${title}</p>
        </div>
    </td>
    <td>${'NT$' + price.toLocaleString('en-US')}</td>
    <td>${quantity}</td>
    <td>${'NT$' + (price * quantity).toLocaleString('en-US')}</td>
    <td class="discardBtn">
        <a href="#" class="material-icons" id="${id}">
            clear
        </a>
    </td>
</tr>
`;
    return template;
}
async function handleAddCardBtn(e) {
    e.preventDefault();
    cartData = await callAPI("GetCartList", "", "");
    const alreadyInCart = cartData.carts.some(it => it.product.id === e.target.id);
    let body;
    if (alreadyInCart) {
        let existingCartItem = cartData.carts.find(it => it.product.id === e.target.id);

        body = {
            "data": {
                "id": existingCartItem.id,
                "quantity": existingCartItem.quantity + 1
            }
        }
        cartData = await callAPI("UpdateCartItem", body, "");
    } else {
        body = {
            "data": {
                "productId": e.target.id,
                "quantity": 1
            }
        }
        cartData = await callAPI("AddCartItem", body, "");
    }

    renderCartList(cartData);
}

async function handleDeletebtnClick(e) {
    e.preventDefault();
    cartData = await callAPI("DeleteCartItemById", "", e.target.id);
    renderCartList(cartData);
}

async function handleDeleteAllbtnClick(e) {
    e.preventDefault();
    cartData = await callAPI("DeleteAllCartItem", "", "");
    renderCartList(cartData);
}

/* Order request */
let orderInfoBtn = document.querySelector(".orderInfo-btn");
orderInfoBtn.addEventListener("click", handleOrderInfoBtn)
async function handleOrderInfoBtn(e) {
    e.preventDefault();
    const name = document.querySelector("#customerName");
    const phone = document.querySelector("#customerPhone");
    const email = document.querySelector("#customerEmail");
    const address = document.querySelector("#customerAddress");
    const tradeWay = document.querySelector("#tradeWay");

    //validate data
    let inputs = [name, phone, email, address];
    let isvalid = true;
    
    inputs.forEach((it) => {
        const formGroup = it.closest(".orderInfo-formGroup");
        if (!it.validity.valid) {
            let label = formGroup.querySelector("label").text;
            if(formGroup.querySelector(".orderInfo-inputWrap p") == undefined){
                formGroup.querySelector(".orderInfo-inputWrap").innerHTML +=
                `<p class="orderInfo-message" data-message="${label}">必填</p>`;
            }            
            isvalid = false;
        } else {
            if (formGroup.querySelector(".orderInfo-inputWrap p") != undefined) {
                formGroup.querySelector(".orderInfo-inputWrap p").remove();
            }
            
        }
    });
    if (isvalid) {
        const body = {
            "data": {
                "user": {
                    "name": name.value,
                    "tel": phone.value,
                    "email": email.value,
                    "address": address.value,
                    "payment": tradeWay.value
                }
            }
        }
        await callAPI("AddOrder", body, "");
        let orderForm = document.querySelector(".orderInfo-form");
        orderForm.reset();
        initCart();
    }
};
