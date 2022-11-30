const { ObjectId } = require("mongodb");
class ClassroomService {
    constructor(client) {
        this.Classroom = client.db().collection("classrooms");
        this.Student = client.db().collection("students");
        this.Teacher = client.db().collection("teachers");

    }
    extractConactData(payload) {
        
        const classroom = { 
            name: payload.name,
            max: payload.max,
            current: payload.current,
            teacher: payload.teacher,
            phone: payload.phone,
            id: payload.id
        };
        // Remove undefined fields
        Object.keys(classroom).forEach(
            (key) => classroom[key] === undefined && delete classroom[key]
        );
        return classroom;
    }
    async create(payload) {
        
        const classroom = this.extractConactData(payload);
        
        var a=  await this.Classroom.find({
            name: payload.name
        }).toArray();
        
        if(a.length){
            return '0';
        }else{
            classroom.current = 0
            var b=  await this.Teacher.find({
                name: payload.teacher
            }).toArray();
            if(!payload.teacher) {
                classroom.teacher = "N/A";
                classroom.phone = "N/A";

            }else{
            classroom.phone = b[0].phone
            }
            const result = await this.Classroom.insertOne(classroom);
            var a = result.insertedId
            await this.Classroom.findOneAndUpdate({_id: new ObjectId(result.insertedId)},
                { $set: {
                    id:a.toString()
                } }
            ) 
            return '1';
        }
    }
    async find(filter) {
        const cursor = await this.Classroom.find(filter).sort({ name : 1  });
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Classroom.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
            var c=  await this.Classroom.find({ 
                id: id
            }).toArray();
            var d=  await this.Student.find({ 
                class_name: c[0].name
            }).toArray();
            for (const x of d) {
            
            await this.Student.findOneAndUpdate({class_name: c[0].name},
                { $set: {
                    class_name: payload.name
                } }
            ) 
            }
            
        var a=  await this.Classroom.find({
            name: payload.name
        }).toArray();
        var b=  await this.Classroom.find({
            id: id
        }).toArray();
        if((a.length==0) || ((b[0].name == payload.name) && (b.length == 1))){
            const filter = {
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            };
            if(!payload.teacher) {
                payload.teacher='N/A';
                payload.phone = 'N/A'
            }
            const update = this.extractConactData(payload);
            const result = await this.Classroom.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );
            //update teacher
            
            
                var teacH=  await this.Teacher.find({ 
                    name: payload.teacher
                }).toArray(); 

                await this.Classroom.findOneAndUpdate({id: id},
                    { $set: {
                        phone: teacH[0].phone
                    } }
                )
            
             return result.value;
            
            
        }else{
            return null;
        }
      
        
    }
    async delete(id) {
        var b=  await this.Classroom.find({
                id: id
            }).toArray();
        var c=  await this.Student.find({
                class_name: b[0].name
            }).toArray();
        for (const x of c) {
            
            await this.Student.findOneAndUpdate({class_name: x.class_name},
                { $set: {
                    class_name:"N/A"
                } }
            ) 
        }
        const result = await this.Classroom.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll() {
        var c=  await this.Student.find({
            }).toArray();
        for (const x of c) {
            await this.Student.findOneAndUpdate({class_name: x.class_name},
                { $set: {
                    class_name:"N/A"
                } }
            ) 
        }
        const result = await this.Classroom.deleteMany({});
        return result.deletedCount;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }  
}
module.exports = ClassroomService;