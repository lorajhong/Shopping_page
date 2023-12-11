
let orderData = [];
initOrder();

async function initOrder() {
    let data = await callAPI("GetOrderList", "", "");
    orderData = data.orders;
    renderOrderList(orderData);
    renderPieChart(orderData);
};


function renderOrderList(orderData) {
    let orderTable = document.querySelector(".orderPage-table");
    orderTable.innerHTML =
        `
    <thead>
                    <tr>
                        <th>訂單編號</th>
                        <th>聯絡人</th>
                        <th>聯絡地址</th>
                        <th>電子郵件</th>
                        <th>訂單品項</th>
                        <th>訂單日期</th>
                        <th>訂單狀態</th>
                        <th>操作</th>
                    </tr>
                </thead>`
    orderTable.innerHTML +=
        orderData.reduce((acc, curr) => {
            acc += templateOrderCard(curr.id, curr.user.name, curr.user.tel, curr.user.address,
                curr.user.email, curr.products, curr.createdAt, curr.paid)
            return acc;
        }, "");
    orderListEvent();
};

function templateOrderCard(id, name, tel, address, email, products, createdAt, paid) {

    let template = `
    <tr>
        <td>${id}</td>
        <td>
            <p>${name}</p>
            <p>${tel}</p>
        </td>
        <td>${address}</td>
        <td>${email}</td>
        <td>
        <ol>
        ${products.reduce((acc,curr) => acc+= '<li>'+curr.title+'</li>',"") }
        </ol>
        </td>
        <td>${formatTimestampToYYYYMMDD(createdAt)}</td>
        <td class="orderStatus">
            <a href="#" data-OrderId="${id}">${paid ? '已處理' : '未處理'}  </a>
        </td>
        <td>
            <input type="button" data-OrderId="${id}" class="delSingleOrder-Btn" value="刪除">
        </td>
    </tr>
    `;
    return template;
};

function formatTimestampToYYYYMMDD(unixTimestamp) {
    var date = new Date(parseInt(unixTimestamp) * 1000);
    var year = date.getFullYear();
    var month = ('0' + (date.getMonth() + 1)).slice(-2);
    var day = ('0' + date.getDate()).slice(-2);
    var formattedDate = year + '/' + month + '/' + day;
    return formattedDate;
};

function orderListEvent() {
    let orderStatusA = document.querySelectorAll(".orderStatus a");
    orderStatusA.forEach(it => it.addEventListener('click', handleOrderStatusA));
    let delSingleOrderBtn = document.querySelectorAll(".delSingleOrder-Btn");
    delSingleOrderBtn.forEach(it => it.addEventListener('click', handelOrderDelById));
    let discardAllBtn = document.querySelectorAll(".discardAllBtn")
    discardAllBtn.forEach(it => it.addEventListener('click', handeDiscardAllBtn));
};

async function handleOrderStatusA(e) {
    e.preventDefault();
    let data = await callAPI("UpdateOrder", {
        "data": {
            "id": e.target.getAttribute("data-OrderId"),
            "paid": true
        }
    }, "");
    orderData = data.orders;
    renderOrderList(orderData);
};
async function handelOrderDelById(e) {
    e.preventDefault();
    let data = await callAPI("DeleteOrderItemById", "", e.target.getAttribute("data-OrderId"));
    orderData = data.orders;
    renderOrderList(orderData);
};

async function handeDiscardAllBtn(e) {
    e.preventDefault();
    let data = await callAPI("DeleteAllOrderItem", "", "");
    orderData = data.orders;
    renderOrderList(orderData);
};

function renderPieChart(orderData) {
    let chartColumnsObj = {};
    if(orderData.length >0){
    orderData.forEach(it => {
        it.products.forEach(subit => {
            if (chartColumnsObj[subit.title] == undefined) {
                chartColumnsObj[subit.title] = 1;
            } else {
                chartColumnsObj[subit.title] += 1;
            }
        })
    })
    let chartColumns = []  //設定空陣列
    chartColumns = Object.entries(chartColumnsObj);
    let chart = c3.generate({
        bindto: '#chart', // HTML 元素綁定
        data: {
            type: "pie",
            columns: chartColumns,
            colors: {
                "Louvre 雙人床架": "#DACBFF",
                "Antony 雙人床架": "#9D7FEA",
                "Anty 雙人床架": "#5434A7",
                "其他": "#301E5F",
            }
        },
    });
    }
}