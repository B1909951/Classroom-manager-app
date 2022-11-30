const ApiError = require("../api-error");
const StudentService = require("../services/student.service");
const MongoDB = require("../utils/mongodb.util")
exports.create = async(req, res, next) => {
    if (!(req.body?. name)) {
        return next(new ApiError(400, "Name can not be Empty"));
    }
    try {
        const studentService = new StudentService(MongoDB.client);
        const document = await studentService.create(req.body);
        return res.send(document);

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the student")
        );
    }
};
exports.uploadFile = async (req,res,next)=>{
        const file = req.files
           console.log('1')
        try {
        if (!file) {
            return next(new ApiError(400,'Contact not found'));
        }else{
            await file.file.mv(path.join('public/image/') + file.file.name)
                 return res.send('1');
            }
        }catch (err) {
            res.status(500).send(err);
        }
        
 }
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const studentService = new StudentService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await studentService.findByName(name);
        } else {
            documents = await studentService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while retriesving students")
        );
    }
    return res.send(documents);
};
exports.findOne = async (req, res, next) => {
    try {
        const studentService = new StudentService(MongoDB.client);
        const document = await studentService.findById(req.params.id)
        if(!document) {
            return next(new ApiError(404, "Student not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving student with id=${req.params.id}`)
        );
    }
};
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    
    try {
        const studentService = new StudentService(MongoDB.client) ;
        const document = await studentService.update(req.params.id, req.body);
        if (!document) {
            return next(new ApiError(404, "Student not found"));
        }
        return res.send({ message: "Student was updated successfully" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating student with id=${req.params.id}`)
        );
    }
};
exports.delete = async (req, res, next) => {
    try {
        const studentService = new StudentService(MongoDB.client) ;
        const document = await studentService.delete(req.params.id) ;
    if (!document) {
        return next(new ApiError(404, "Student not found"));
    }
    return res.send({ message: "Student was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete student with id=${req.params.id}`
            )
        );
    } 
}  
    
exports.deleteAll = async (_req, res, next) => {
    try {
        const studentService = new StudentService(MongoDB.client);
        const deletedCount = await studentService.deleteAll();
        return res.send({
            message: `${deletedCount} students were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all students")
        );
    }
};

exports.findAllFavorite = async (_req, res, next) => {
    try {
        const studentService = new StudentService(MongoDB.client) ;
        const documents = await studentService.findFavorite();
        return res.send(documents) ;
    } catch (error) {
        return next(
        new ApiError(
        500,
        "an error occurred while retrieving favorite students"
        )
        );
    }
};
