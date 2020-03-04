class User{
    /**
     * 
     * @param {string} id user id in rainbow
     * @param {string} firstName first name
     * @param {string} lastName last name
     * @param {Object} credentials credentials object return when created user on Rainbow
     */
    constructor(id, firstName, lastName, credentials){
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.query = null;
        this.credentials = credentials;
    }
    getId(){
        return this.id;
    }
    getFirstName(){
        return this.firstName;
    }
    getLastName(){
        return this.lastName;
    }
    getCredentials(){
        return this.credentials;
    }
    /**
     * set query type
     * see queries.js
     * @param {int} query query code representing the area of interest
     */
    setQuery(query){
        this.query = query;
        return 1;
    }
    getQuery(){
        return this.query;
    }
}

exports = User;