const { default: mongoose } = require("mongoose");

const Schema = mongoose.Schema
const urlSchema = ({
    original_url: String,
    short_url: String
})

module.exports = mongoose.model("URL", urlSchema);
