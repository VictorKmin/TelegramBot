//TODO Пофіксити пошук !!!!!!!!
//TODO розкидати все по хелпер класах
//TODO зробити валідації
//TODO зробити нормальний опис /help.
//TODO написати коменти

// require my token, bot API, mongoose
let token = require('./token');
let taskSchema = require('./model/taskModel');
let telegramBot = require('node-telegram-bot-api');
let mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sPlanerBase');

//create new Bot with token and polling (socket.io analog (google write this ;) ))
let bot = new telegramBot(token.getToken, {polling: true});


bot.onText(/\/start/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Ну шо ' + msg.chat.username + ' панєслась )');
});

bot.onText(/\/help/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'В церкві поможуть');
});

bot.onText(/\/save (.+)/, function (msg, match) {
    // let description = msg.text;

    //thank google for this hack
    let fullMsg = match[1];

    let chatId = msg.chat.id;
    let description = fullMsg.split('#')[0] ? fullMsg.split('#')[0] : '';
    let date = fullMsg.split('#')[1] ? fullMsg.split('#')[1].trim() : '';

    date = new Date(date);
    date.setHours(date.getHours() - 2);

    if (description && date) {

        let task = new taskSchema({
            chatId: chatId,
            dateOfTask: date,
            description: description
        });
        task.save(function (err, taskToSave) {
            if (err) {
                bot.sendMessage(chatId, 'Якась помилка, краще введи /help.')
                console.log(err);
            } else {

                bot.sendMessage(chatId, 'Я все зробив, босс');
                bot.sendMessage(chatId, description + '    опис');
                bot.sendMessage(chatId, fullMsg.split('#')[1].trim() + '    тіпа дата');
            }
        })
    }

    console.log(chatId);
    console.log(description);
    console.log(date);
});

bot.onText(/\/find/, function (msg, match) {
    console.log('gfg');
});


// TODO тимчасовий код. Пофіксити і забрати
(function () {
    let now = new Date();
    now.setHours(now.getHours() + 2);
    console.log(now);
        let tasks = taskSchema.find({
            checked: false,
            data: {
                $lte: now
            }
        });
        console.log(tasks)
    }
)();
//TODO Кінцеь тимчасового

(function () {
    // noinspection JSAnnotator
    let interval = setInterval(function () {
        let now = new Date();
        now.setHours(now.getHours() + 2);
        console.log(now);
        try {
            let tasks = taskSchema.find({
                checked: false,
                data: {
                    $lte: now
                }
            });


            // console.log(tasks);

            Array.prototype.forEach.call(tasks, task => {
                console.log(task);
                task.checked = true;
                task.save();
                bot.sendMessage(task.chatId, 'Хазяїн. Нагадую про ' + task.description + task.data);
            });

            // tasks.for(function (task) {
            //     task.checked = true;
            //     task.save();
            //     bot.sendMessage(task.chatId, 'Хазяїн. Нагадую про ' + task.description + task.data);
            // })

        } catch (e) {
            console.log(e);
            // bot.sendMessage(task, 'Cant find tasks')
        }

    }, 1000)
})();

// { '0':
//     { message_id: 48,
//         from:
//         { id: 190470656,
//             is_bot: false,
//             first_name: 'Viktor',
//             last_name: 'Fazer',
//             username: 'victor_fzs',
//             language_code: 'ru-RU' },
//         chat:
//         { id: 190470656,
//             first_name: 'Viktor',
//             last_name: 'Fazer',
//             username: 'victor_fzs',
//             type: 'private' },
//         date: 1531924473,
//             text: 'f' },
//     '1': { type: 'text' } }

