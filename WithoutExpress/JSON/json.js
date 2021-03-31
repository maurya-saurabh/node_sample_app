// JSON --> Objects
function fromJSON(data) {
    const obj_data = JSON.parse(data)
    return obj_data
}

// Objects --> JSON
function toJSON(data) {
    const json_data = JSON.stringify(data)
    return json_data
}

module.exports = {fromJSON, toJSON}