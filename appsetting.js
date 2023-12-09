const config = {
    "Hexshcool": {
        "Host": "https://livejs-api.hexschool.io",
        "Api_path": "lora",
        "APi_key": "HiHwiQc6ohQ5QFDktFPoLgzWOBB2",
        "API": {
            "GetProductList": {
                "Method": "get",
                "Url": "/api/livejs/v1/customer/{{api_path}}/products"
            },
            "GetCartList": {
                "Method": "get",
                "Url": "/api/livejs/v1/customer/{{api_path}}/carts"
            },
            "AddCartItem": {
                "Method": "post",
                "Url": "/api/livejs/v1/customer/{{api_path}}/carts"
            },
            "UpdateCartItem": {
                "Method": "patch",
                "Url": "/api/livejs/v1/customer/{{api_path}}/carts"
            },
            "DeleteCartItemById": {
                "Method": "delete",
                "Url": "/api/livejs/v1/customer/{{api_path}}/carts/{{Id}}"
            },
            "DeleteAllCartItem": {
                "Method": "delete",
                "Url": "/api/livejs/v1/customer/{{api_path}}/carts"
            },
            "GetOrderList": {
                "NeedKey": true,
                "Method": "get",
                "Url": "/api/livejs/v1/admin/{{api_path}}/orders"
            },
            "UpdateOrder": {
                "NeedKey": true,
                "Method": "post",
                "Url": "/api/livejs/v1/admin/{{api_path}}/orders"
            },
            "DeleteOrderItemById": {
                "NeedKey": true,
                "Method": "delete",
                "Url": "/api/livejs/v1/admin/{{api_path}}/orders/{{Id}}"
            },
            "DeleteAllOrderItem": {
                "NeedKey": true,
                "Method": "delete",
                "Url": "/api/livejs/v1/admin/{{api_path}}/orders"
            }
        }
    }
}

async function callAPI(apiName, body, id) {
    const hexschool = config.Hexshcool;
    const apiPath = hexschool.Api_path;
    const apikey = hexschool.APi_key;
    const api = hexschool.API[apiName];
    const method = api.Method;
    let url = hexschool.Host + api.Url.replace("{{api_path}}", apiPath);
    url = id ? url.replace("{{Id}}", id) : url;
    console.log(url);
    const headers = api.NeedKey ? { 'Authorization': apikey } : {};
    try {
        const response = await axios({
            method: method,
            url: url,
            headers: headers,
            data: body,
        });
        console.log(response)
        return response.data;
    } catch (error) {
        throw error;
    }
}