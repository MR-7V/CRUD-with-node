const data = {
    teachers: require('../model/teachers.json'),
    setTeachers: function(data) {this.teachers = data}
}

const getAllTeachers = (req, res)=>{
    res.json(data.teachers);
}

const createNewTeacher = (req,res)=>{
    const newTeacher = {
        id: data.teachers[data.teachers.length-1].id+1 || 1,
        firstname: req.body.firstname,
        lastname: req.body.lastname
    }
    if(!newTeacher.firstname || !newTeacher.lastname){
        return res.status(400).json({'message': 'First and last names are required'});
    }
    data.setTeachers([...data.teachers, newTeacher]);
    res.send(201).json(data.teachers);
}

const updateTeacher = (req,res)=>{
    const teacher = data.teachers.find(teach => teach.id === parseInt(req.body.id));
    if(!teacher){
        return res.status(400).json({"message": `Teacher ID ${req.body.id} not found`});
    }
    if(req.body.firstname) teacher.firstname = req.body.firstname;
    if(req.body.lastname) teacher.lastname = req.body.lastname;
    const filteredArray = data.teachers.filter(teach => teach.id !== parseInt(req.body.id));
    const unsortedArray = [...filteredArray, teacher];
    data.setTeachers(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.teachers);
}

const deleteTeacher = (req,res)=>{
    const teacher = data.teachers.find(teach => teach.id !== parseInt(req.body.id));
    if(!teacher){
        return res.status(400).json({"message": `Teacher ID ${req.body.id} not found `});
    }
    const filteredArray = data.teachers.filter(teach=>teach.id !== parseInt(req.body.id));
    data.setTeachers([...filteredArray]);
    res.json(data.teachers);
}

const getTeacher = (req,res)=>{
    const teacher = data.teachers.find(teach => teach.id === parseInt(req.params.id));
    if(!teacher){
        return res.status(400).json({"message": `Teacher ID ${req.params.id} not found`});
    }
    res.json(teacher);
}

module.exports = {
    getAllTeachers,
    createNewTeacher,
    updateTeacher,
    deleteTeacher,
    getTeacher
}
