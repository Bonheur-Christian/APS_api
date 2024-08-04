const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const admin = require('./model/adminModel')
const Project = require('./model/ProjectModel')
const Service = require('./model/ServicesModel')
const Address = require('./model/AddressModel')
const CompletedProject = require('./model/completedProjectModel')
const app = express();
const port = 8800;

app.use(express.json())
app.use(cors())

const url = 'mongodb+srv://christian:Tj9BVKxgvfNJMZs7@backenddb.n44jszo.mongodb.net/APS?retryWrites=true&w=majority&appName=BackendDB';
mongoose.connect(url)
    .then(() => {
        app.listen(port, () => {
            console.log("Connected to DB. Port ", port);
        })
    })
    .catch((err) => {
        console.log("error in connecting to DB", err);
    })

app.post("/admin", async (req, res) => {
    var name = req.body.name
    var email = req.body.email
    var password = req.body.password

    try {
        const saltRounds = 10;
        hashedPassword = await bcrypt.hash(password, saltRounds)

        const Admin = new admin({
            name: name,
            email: email,
            password: hashedPassword
        })

        Admin.save()
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
                res.status(500).json({ message: "Error in saving the admin", err: err })
            })
    } catch (err) {
        console.log(err);
    }

})

app.post('/login', async (req, res) => {
    var email = req.body.email
    var password = req.body.password

    try {
        const adminData = await admin.findOne({ email })
        if (!adminData) {
            res.status(500).json({ message: "Invalid Email or Password" })
        }

        const isPasswordValid = await bcrypt.compare(password, adminData.password)
        if (!isPasswordValid) {
            res.status(500).json({ message: "Invalid Email or Password" })
        } else {
            const token = jwt.sign(
                { admin_id: adminData._id },
                'SECRET',
                { expiresIn: "1h" }
            )

            res.status(200).json({
                message: "Login successful", token: token, admin: {
                    admin_id: adminData._id,
                    email: email,

                }
            })
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in", err: err });
    }

})

// Project Api

app.post("/project", async (req, res) => {
    const { name } = req.body

    try {

        const NewProject = new Project({
            name: name
        })

        await NewProject.save()
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
                res.status(500).json({ message: "Error", err: err })
            })

    } catch (err) {
        res.status(500).json({ message: "Error", err: err })
    }
})

app.get("/allProjects", async (req, res) => {
    try {
        const Projects = await Project.find()
        res.status(200).json(Projects)
    } catch (err) {
        res.status(500).json({ message: "Error", err: err })
    }
})

// completed Project Api

app.post("/completedProject", async (req, res) => {
    const { date, name, description } = req.body
    try {

        const NewCompletedProject = new CompletedProject({
            date: date,
            name: name,
            description: description
        })

        await NewCompletedProject.save()
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
                res.status(500).json({ message: "Error In saving new completed project", err: err })
            })
    } catch (err) {
        res.status(500).json({ message: "Error Occured", err: err })
    }
})

app.get("/CompletedProjects", async (req, res) => {
    try {
        const completedProjectsList = await CompletedProject.find()
        res.status(200).json(completedProjectsList)

    } catch (err) {
        res.status(500).json({ message: "Error in getting completed Projects", err: err })
    }
})

//Services Api

app.post('/service', async (req, res) => {
    const { name, description } = req.body

    try {
        const NewService = new Service({
            name: name,
            description: description
        })

        await NewService.save()
            .then((response) => {
                res.status(200).json(response)
            })
            .catch((err) => {
                res.status(500).json({ message: "Error", err: err })
            })
    } catch (err) {
        res.status(500).json({ message: "Error", err: err })
    }
})


app.get("/allServices", async (req, res) => {
    try {
        const services = await Service.find()
        res.status(200).json(services)
    } catch (err) {
        res.status(500).json({ message: "Error in getting services" })
    }
})

//address Api

app.post("/address", async (req, res) => {
    const { tel, email, location } = req.body
    try {
        const newAddress = new Address({
            tel: tel,
            email: email,
            location: location
        })

        await newAddress.save()
            .then((response) => {
                res.status(300).json(response)
            })
            .catch((err) => {
                res.status(500).json({ message: "Error", err: err })
            })

    } catch (err) {
        res.status(500).json({ message: "Error", err: err })
    }
})

app.get("/allAddress", async (req, res) => {
    try {
        const address = await Address.find()
        res.status(200).json(address)
    } catch (err) {
        res.status(500).json({ message: "Error in getting address" })
    }
})

app.put("/updateAddress", async (req, res) => {
    const { _id, tel, email, location } = req.body;
    try {
        const updatedAddress = await Address.findByIdAndUpdate(
            _id,
            { tel, email, location },
            { new: true }
        );
        if (!updatedAddress) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.json(updatedAddress);
    } catch (err) {
        res.status(500).json({ message: "Error Occurred", err: err });
    }
});
