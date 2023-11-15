## MVC

- ALIAS with top five best

  - new route
    - get (toptours, alltours)
  - tour controller
    - middleware --> next()
    - (limit, sort, fields)

---

- AGGREGATION, PIPELIME, for statistics

  - group by stage

    - ex: which products sold today
      : how many stats did products got during day
      : who logged in today?

  - mongo db compass

    - second tab --> aggregarions
    - add stage --> $sort
            - _id: "$difficulty" - tourCount: {$sum:1} --> how many add one by one
            - avgRating: {$avg: "ratingsAvarage"} - avgPrice: {$avg: "$price"}
      -new stage --> $match --> filters the documents passed to the next stage
            - :id: {$ne:"easy"} // medium and diffucult ones

  - VScode
    - new route (tourRouter)
    - define function (Controller)
      - same as in mongodb
        - $unwind: "$startDates" --> divide arrays
        - tourNames: { $push: "$name" } --> push --> to add fields X $project: { \_id: 0 } project --> to remove
        - $addFields: { month: "$\_id" } --> to add a field to document

---

- VIRTUAL PROPERTY
  - other information by frontend, but not needed held in our backend server
    - model--> schema update - xSchema.virtual("virtualPropertyName).get(function(){return this.duration/7})
    - update schema - {toJson: {virtual:true}}

---

- DOCUMNET MIDDELEWAREs
  - model
    - updtae schema
      - pre
      - post
    - next --> donot forget this as this is middlewarre
    - query middleware exemple --> ex:secret tours shown just for admins
    - aggregation middleware --> ex:secret tours for monthly plan

---

- VALIDATION

  - model

    - schema update

  - BUILT IN validator

    - name: minLenght[], maxLength[]
    - difficulty enum: {
      values: [],
      message:""
      }

  - CUSTOM validator

    - import validator
    - pricediscount < price

  - THIRD Party validations
    - validator library

---

---

## USER MANAGEMENT

---

- HASHing and SALTing PASSWORDS:

  - userModel uupdate
    - bcryptjs library
    - pre middleware before saving --> userSchema.pre
    - passwordConfirm --> undefined // dont save to db.

- JWT

---

- GLOBAL ERROR MANAGEMENT

---

-ROLE MANAGEMENT
