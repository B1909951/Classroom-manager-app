const { ObjectId } = require("mongodb");
class StudentService {
    constructor(client) {
        this.Student = client.db().collection("students");
        this.Classroom = client.db().collection("classrooms");
    }
    extractConactData(payload) {
        
        const student = { 
            name: payload.name,
            sex: payload.sex,
            birthday: payload.birthday,
            avatar: payload.avatar,
            pphone: payload.pphone,
            class_name: payload.class_name,
            id: payload.id
        };
        // Remove undefined fields
        Object.keys(student).forEach(
            (key) => student[key] === undefined && delete student[key]
        );
        return student;
    }
    async create(payload) {
        if(!payload.sex) payload.sex = "N/A"
        if(!payload.class_name) payload.class_name = "N/A"
        if(!payload.birthday) payload.birthday = "N/A"
        if(!payload.pphone) payload.pphone = "N/A"


        const student = this.extractConactData(payload);
        
        // var a=  await this.Student.find({
        //     name: payload.name
        // }).toArray();
       
        // if(a.length){
        //     return '0';
        // }else{
           
            const result = await this.Student.insertOne(student);
            var a = result.insertedId
            await this.Student.findOneAndUpdate({_id: new ObjectId(result.insertedId)},
                { $set: {
                    id:a.toString()
                } }
            ) 
            
            var b=  await this.Student.find({
                class_name: payload.class_name
            }).toArray();
            await this.Classroom.findOneAndUpdate({name: payload.class_name},
                { $set: {
                    current:b.length
                } }
            ) 
            return '1';
        // }
    }
    async find(filter) {
        const cursor = await this.Student.find(filter).sort({ name : 1  });
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Student.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
        
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };

        var b=  await this.Student.find({
                id: id
            }).toArray();
        var c=  await this.Student.find({
                class_name: b[0].class_name
            }).toArray();
            await this.Classroom.findOneAndUpdate({name: b[0].class_name},
                { $set: {
                    current:(c.length-1)
                } }
            ) 

        const update = this.extractConactData(payload);
        const result = await this.Student.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );
        var d=  await this.Student.find({
                class_name: payload.class_name
            }).toArray();
            await this.Classroom.findOneAndUpdate({name: payload.class_name},
                { $set: {
                    current:d.length
                } }
            ) 
        return result.value;
    }
    async delete(id) {
        var b=  await this.Student.find({
                id: id
            }).toArray();
        var c=  await this.Student.find({
                class_name: b[0].class_name
            }).toArray();
            await this.Classroom.findOneAndUpdate({name: b[0].class_name},
                { $set: {
                    current:(c.length-1)
                } }
            ) 
        const result = await this.Student.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll() {
        var b=  await this.Classroom.find().toArray();
        for (const x of b) {
            
            await this.Classroom.findOneAndUpdate({name: x.name},
                { $set: {
                    current:0
                } }
            ) 
        }
        
        const result = await this.Student.deleteMany({});
        return result.deletedCount;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }  
}
module.exports = StudentService;