const mongoose = require('mongoose')


const CompletedProjectSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true }
})

const CompletedProject = mongoose.model("CompletedProject", CompletedProjectSchema)

module.exports = CompletedProject;