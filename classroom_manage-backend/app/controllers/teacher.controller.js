const ApiError = require("../api-error");
const TeacherService = require("../services/teacher.service");
const MongoDB = require("../utils/mongodb.util")
exports.create = async(req, res, next) => {
    if (!(req.body?. name)) {
        return next(new ApiError(400, "Name can not be Empty"));
    }
    try {
        const teacherService = new TeacherService(MongoDB.client);
        const document = await teacherService.create(req.body);
        return res.send(document);

    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while creating the teacher")
        );
    }
};
exports.findAll = async (req, res, next) => {
    let documents = [];
    try {
        const teacherService = new TeacherService(MongoDB.client);
        const { name } = req.query;
        if (name) {
            documents = await teacherService.findByName(name);
        } else {
            documents = await teacherService.find({});
        }
    } catch (error) {
        return next(
            new ApiError(500, "An error occured while retriesving teachers")
        );
    }
    return res.send(documents);
};
exports.findOne = async (req, res, next) => {
    try {
        const teacherService = new TeacherService(MongoDB.client);
        const document = await teacherService.findById(req.params.id)
        if(!document) {
            return next(new ApiError(404, "Teacher not found"));
        }
        return res.send(document);
    } catch (error) {
        return next(
            new ApiError(500, `Error retrieving teacher with id=${req.params.id}`)
        );
    }
};
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Data to update can not be empty"));
    }
    
    try {
        const teacherService = new TeacherService(MongoDB.client) ;
        const document = await teacherService.update(req.params.id, req.body);
        if (document==null) {
            return res.send({ message: "0" });
        }
        return res.send({ message: "1" });
    } catch (error) {
        return next(
            new ApiError(500, `Error updating teacher with id=${req.params.id}`)
        );
    }
};
exports.delete = async (req, res, next) => {
    try {
        const teacherService = new TeacherService(MongoDB.client) ;
        const document = await teacherService.delete(req.params.id) ;
    if (!document) {
        return next(new ApiError(404, "Teacher not found"));
    }
    return res.send({ message: "Teacher was deleted successfully" });
    } catch (error) {
        return next(
            new ApiError(
                500,
                `Could not delete teacher with id=${req.params.id}`
            )
        );
    } 
}  
    
exports.deleteAll = async (_req, res, next) => {
    try {
        const teacherService = new TeacherService(MongoDB.client);
        const deletedCount = await teacherService.deleteAll();
        return res.send({
            message: `${deletedCount} teachers were deleted successfully`,
        });
    } catch (error) {
        return next(
            new ApiError(500, "An error occurred while removing all teachers")
        );
    }
};

exports.findAllFavorite = async (_req, res, next) => {
    try {
        const teacherService = new TeacherService(MongoDB.client) ;
        const documents = await teacherService.findFavorite();
        return res.send(documents) ;
    } catch (error) {
        return next(
        new ApiError(
        500,
        "an error occurred while retrieving favorite teachers"
        )
        );
    }
};
