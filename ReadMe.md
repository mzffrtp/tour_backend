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
      -new stage --> $match
            - :id: {$ne:"easy"} // medium and diffucult ones

  - VScode
    - new route (tourRouter)
    - define function (Controller)
      - same as in mongodb
