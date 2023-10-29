const fs = require("fs");
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


exports.getAllTours = (req, res) => {
    console.log(req.requestTime);
    res.status(200).json({
        status: "success",
        reqTime: req.requestTime,
        data: { tours },
        results: tours.length
    })
};
exports.createTour = (req, res) => {
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
};
exports.updateTour = (req, res) => {
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
};
exports.deleteTour = (req, res) => {
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
}