const { ObjectId } = require("mongodb");
class TeacherService {
    constructor(client) {
        this.Teacher = client.db().collection("teachers");
        this.Classroom = client.db().collection("classrooms");

    }
    extractConactData(payload) {
        
        const teacher = { 
            name: payload.name,
            sex: payload.sex,
            birthday: payload.birthday,
            avatar: payload.avatar,
            phone: payload.phone,
            address: payload.address,
            id: payload.id
        };
        // Remove undefined fields
        Object.keys(teacher).forEach(
            (key) => teacher[key] === undefined && delete teacher[key]
        );
        return teacher;
    }
    async create(payload) {
        
        const teacher = this.extractConactData(payload);
        
        var a=  await this.Teacher.find({
            name: payload.name
        }).toArray();
        
        if(a.length){
            return '0';
        }else{
            const result = await this.Teacher.insertOne(teacher);
            var a = result.insertedId
            await this.Teacher.findOneAndUpdate({_id: new ObjectId(result.insertedId)},
                { $set: {
                    id:a.toString()
                } }
            ) 
            return '1';
        }
    }
    async find(filter) {
        const cursor = await this.Teacher.find(filter).sort({ name : 1  });
        return await cursor.toArray();
    }
    async findByName(name) {
        return await this.find({
        name: { $regex: new RegExp(name), $options: "i" },
        });
    }
    async findById(id) {
        return await this.Teacher.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
    }
    async update(id, payload) {
            var c=  await this.Teacher.find({ 
                id: id
            }).toArray();
            var d=  await this.Classroom.find({ 
                teacher: c[0].name
            }).toArray();
            for (const x of d) {
            
            await this.Classroom.findOneAndUpdate({teacher: c[0].name},
                { $set: {
                    teacher: payload.name,
                } }
            ) 
            await this.Classroom.findOneAndUpdate({phone: c[0].phone},
                { $set: {
                    phone: payload.phone,
                } }
            ) 
         }
        
        var a=  await this.Teacher.find({
            name: payload.name
        }).toArray();
        var b=  await this.Teacher.find({
            id: id
        }).toArray();
        if((a.length==0) || ((b[0].name == payload.name) && (b.length == 1))){
            const filter = {
                _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
            };
            const update = this.extractConactData(payload);
            const result = await this.Teacher.findOneAndUpdate(
                filter,
                { $set: update },
                { returnDocument: "after" }
            );
             return result.value;
        }else{
            return null;
        }
      
        
    }
    async delete(id) {
        var b=  await this.Teacher.find({
                id: id
            }).toArray();
        var c=  await this.Classroom.find({
                teacher: b[0].name
            }).toArray();
        for (const x of c) {
            
            await this.Classroom.findOneAndUpdate({teacher: x.teacher},
                { $set: {
                    teacher:"N/A",
                    phone:"N/A"
                } }
            ) 
        }
        const result = await this.Teacher.findOneAndDelete({
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        });
        return result.value;
    }
    async deleteAll() {
        var c=  await this.Classroom.find({
            }).toArray();
        for (const x of c) {
            await this.Classroom.findOneAndUpdate({teacher: x.teacher},
                { $set: {
                    teacher:"N/A",
                    phone:"N/A"
                } }
            ) 
        }
        const result = await this.Teacher.deleteMany({});
        return result.deletedCount;
    }
    async findFavorite() {
        return await this.find({ favorite: true });
    }  
}
module.exports = TeacherService;