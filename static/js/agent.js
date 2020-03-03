class Agent{
    constructor(id, email, skillsets, firstName, lastName){
        this.id = id;
        this.email = email;
        this.skillsets = skillsets;
        this.firstName = firstName;
        this.lastName = lastName;
    }
    getFirstName(){
        return this.firstName;
    }
    getLastName(){
        return this.lastName;
    }
    getEmail(){
        return this.email;
    }
    getSkills(){
        return this.skillsets;
    }
    getId(){
        return this.id;
    }
    /**
     * add skill to the existing skillsets
     * @param {int} skill skill code describing the skill
     */
    addSkill(skill){
        this.skillsets.push(skill);
        return 1;
    }
    /**
     * delete the given skill from the skillsets
     * @param {int} skill skill code describing the skill
     * return 1 if success. return 0 if skill cannot be found
     */
    deleteSkill(skill){
        if(this.skillsets.includes(skill)){
            this.skillsets.splice(this.skillsets.indexOf(skill), 1);
            return 1;
        } else{
            return 0;
        }
    }
}