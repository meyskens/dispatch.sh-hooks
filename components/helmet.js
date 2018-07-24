import rest from "restler"

export class HelmetController {
    url = ""
    key = ""
    constructor(url, key) {
        this.url = url;
        this.key = key
    }

    create = (name, values = {}) => new Promise((resolve, reject) => {
        rest.putJson(`${this.url}/deployment/${name}`, {
            values,
        }, {
            timeout: 60000,
            headers: {
                "Authorization": `Bearer ${this.key}`,
            },
        }).on("complete", function (returnData) {
            if (returnData instanceof Error || returnData.result !== "success") {
                reject(returnData)
                return
            }
            resolve(returnData);
        }).on("timeout", function () {
            reject(new Error("Timeout"))
        })
    })

    destroy = (name, values = {}) => new Promise((resolve, reject) => {
        rest.del(`${this.url}/deployment/${name}`, {
            timeout: 30000,
            headers: {
                "Authorization": `Bearer ${this.key}`,
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ values }),
        }).on("complete", function (returnData) {
            if (returnData instanceof Error) {
                reject(returnData)
                return
            }
            resolve(returnData);
        }).on("timeout", function () {
            reject(new Error("Timeout"))
        })
    })
}