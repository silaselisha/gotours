class ApiFeatures {
    constructor(query, queryObject) {
        this.query = query;
        this.queryObject = queryObject;
    }

    filtering() {
        const queryObj = {...this.queryObject};
        const reservedItems = ['fields', 'sort', 'limits', 'page'];

        reservedItems.forEach((item) => delete queryObj[item]);

        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, (item) => `$${item}`);

        this.query = this.query.find(JSON.parse(queryString));   
        return this;
    }

    sorting() {
        if(this.queryObject.sort) {
            const querySortBy = this.queryObject.sort.split(',').join(' ');
            
            this.query = this.query.sort(querySortBy);
            return this;
        }else {
            this.query = this.query.sort('-createdAt');
            return this;
        }
    }

    limitFields() {
        if(this.queryObject.fields) {
            const querySelectFields = this.queryObject.fields.split('.').join(' ');

            this.query = this.query.select(querySelectFields);
            return this;
        }else {
            this.query = this.query.select('-__v');
            return this;
        }
    }

    pagination() {
        const page =  parseInt(this.queryObject.page) || 1;
        const limit = parseInt(this.queryObject.limit) || 3;

        const skip = (page - 1) * limit;
       
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports =ApiFeatures;