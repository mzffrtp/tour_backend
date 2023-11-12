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
        - $addFields: { month: "$\_id" } documente alan eklem

---

- JWT

---

- GLOBAL ERROR MANAGEMENT

---

-ROLE MANAGEMENT
