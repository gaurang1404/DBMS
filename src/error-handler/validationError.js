export default class ValidationError extends Error{
    constructor(arr){
        super("Validation error");
        this.array = arr;
        this.code = 403;
    }
}