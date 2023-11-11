class APIFeatures {
    constructor(query, queryParams) {
        this.query = query;
        this.queryParams = queryParams
    }

    filter() {
        //! when the request queries from postman don´t match queries in mongoose

        //TODO ---> start <---
        const queryObj = { ...this.queryParams } // move queries into an object

        // TODO 2  START ---> sort, limit, page, fields actions <---
        //? for these actions those words should be removed from request query coming from postman


        const excludedQuery = ["sort", "limit", "page", "fields"]
        excludedQuery.forEach((excEl) => delete queryObj[excEl]);

        //!
        // TODO 2 END ---> sort, limit, page, fields actions <---

        let queryString = JSON.stringify(queryObj) //obj--> stiring in order to make changes
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (ope) => `$${ope}`
        )
        //! !!! DONOT FORGET TO PARSE STRING TO JSON FOR FIND !!!
        let queryStringToJson = JSON.parse(queryString)
        //TODO ---> end <---

        //! FILTERing queries
        //? more used method for queries
        this.query = this.query.find(queryStringToJson);
        /* 
        //! shoukd be known
        const tours = await Tour.find().where("duration").equals(5).where("difficulty").equals("easy"); */

        return this;
    };
    sort() {
        //!SORTing queries
        if (this.queryParams.sort) {
            const sortedByMany = this.queryParams.sort.split(",").join(" ")
            //formating postman query, removing comma joining with blank
            this.query = this.query.sort(sortedByMany)
        } else {
            this.query = this.query.sort("-createdAt")
        }
        return this
    };
    limit() {
        //!FIELD LIMITing
        //? EX:not all information on a detail page
        //TODO put - before field area
        if (this.queryParams.fields) {
            const selectedFields = this.queryParams.fields.split(",").join(" ");
            this.query = this.query.select(selectedFields)
            //! select --> istenilen alanlarini secilmsi icin
        } else {
            this.query = this.query.select("-__v")
        }
        return this
    };
    pagination() {
        //!PAGINATION skip and page
        //? skip--> how many will be skipped
        //? limit -->max document on page

        const page = this.queryParams.page * 1 || 1;
        const limit = this.queryParams.limit * 1 || 100;

        const skip = limit * (page - 1)
        this.query = this.query.skip(skip).limit(limit)

        return this
    };
}

module.exports = APIFeatures