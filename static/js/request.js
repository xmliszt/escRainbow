class Request{
    constructor(uid, skill){
        this.uid = uid;
        this.skill = skill;
    }

    getSkill(){
        return this.skill;
    }

    getUid(){
        return this.uid;
    }


    toString(){
        const skill = this.getSkill();
        const uid = this.getUid();

        const requestString = `[${uid}, ${skill}]`;
        return requestString;
    }

    
}

exports.Request = Request;