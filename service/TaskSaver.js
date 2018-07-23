const taskSchema = require('../model/taskModel');

module.exports.taskSaver = function saveTask (description, dateOfTask, chatId) {

    if (description && dateOfTask) {
        dateOfTask = new Date(dateOfTask);
        dateOfTask.setUTCHours(dateOfTask.getUTCHours() - 2);

        let task = new taskSchema({
            chatId: chatId,
            dateOfTask: dateOfTask,
            description: description
        });

        let isSave;

        task.save(function (err, doc) {
            if (err) {
                isSave = false;
                console.log(err);
            }
        });
    }
    return isSave;

};

