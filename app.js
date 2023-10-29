const express = require("express")
const fs = require("fs")

const app = express();
app.use(express.json())
const port = 5173;

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get("/api/v1/tours", (req, res) => {
    res.status(200).json({
        status: "success",
        data: { tours },
        results: tours.length
    })
});

app.post("/api/v1/tours", (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour)
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                sstatus: "success",
                data: {
                    tour: newTour
                }
            })
        }
    )
})

app.get("/api/v1/tours/:id", (req, res) => {
    const idInNUmber = Number(req.params.id)
    if (idInNUmber > tours.length) {
        return res.status(404).json({
            status: "failed",
            message: "invalid ID"
        })
    }

    const tour = tours.find((i) => i.id === idInNUmber);
    res.status(200).json({
        status: "success",
        data: {
            tour
        },
    });
});

app.delete("/api/v1/tours/:id", (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "failed",
            message: "invalid ID"
        })
    }

    res.status(200).json({
        status: "deleted successfully",
        //todo silinme islemi serverdada olmasi lazim
        data: {
            tour: null
        },
    });
});

app.listen(port, () => {
    console.log(`server listening on port ${port}`);
});