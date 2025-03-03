class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
         /****  making an hard copy of the request query  ******/
        // const queryObj = req.query   => this will not copy, it storing same reference to the queryObj, so need to use destructuring
        const queryObj = {...this.queryString} // creating a new query object
        const excludedFields = ['page', 'limit', 'sort', 'fields'];
        excludedFields.forEach(field => delete queryObj[field]);


        //Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); //replacing gt to $gt and so on
        
        
        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort () {
         //sorting
         if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy); //mongoose accept mutiple columns as sort and '-' is used to desc
        }else {
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields() {
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields); //mongoose accept mutiple columns as sort and '-' is used to desc
        }else {
            this.query = this.query.select('-__v');  //ignore __v field
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;  //*1 means casting to number
        const limit = this.queryString.limit * 1 || 10;
        const skip = (page - 1) * limit;
        console.log(skip, 'skip');
        
        this.query = this.query.skip(skip).limit(limit);

        return this;
        // if(this.queryString.page) {
        //     const totalTours = await Tour.countDocuments();
        //     if(skip >= totalTours) throw new Error('Page not available');
        // }
    }
}

module.exports = APIFeatures;