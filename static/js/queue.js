class Queue{
    constructor(){
        this.data = [];
    }
    /**
     * Add an element to the back of the queue
     * @param {obj} element 
     */
    enqueue(element){
        this.data.push(element);
        return 1;
    }
    /**
     * remove one element from the front of the queue
     * @param {obj} element 
     * return 0 if queue is empty. return 1 if success
     */
    dequeue(element){
        if (this.isEmpty())
            return 0;
        return this.data.shift();
    }
    /**
     * Get the first item in the queue
     */
    front(){
        if(this.isEmpty())
            return 0;
        return this.data[0];
    }
    /**
     * check if queue if empty
     */
    isEmpty(){
        return this.data.length == 0;
    }
    /**
     * get the string repr of the queue
     */
    toString(){
        var str = "";
        for (var i=0; i<this.data.length; i++){
            str += this.data[i] + " ";
        }
        return str;
    }
}