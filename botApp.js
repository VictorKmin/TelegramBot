//TODO Пофіксити пошук !!!!!!!!
//TODO розкидати все по хелпер класах
//TODO зробити валідації
//TODO написати коменти

// require my token, bot API, mongoose
const token = require('./token');
const taskSchema = require('./model/taskModel');
let dater = require('./service/dateSetter');
const telegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sPlanerBase');

//create new Bot with token and polling (socket.io analog (google write this ;) ))
const bot = new telegramBot(token.getToken, {polling: true});


// bot.on('message', function (msg, match) {
//
// let one = dater.dateSeter(msg.date, msg.date);
// bot.sendMessage(msg.chat.id, one + ' DATA')
//
// });

bot.onText(/\/start/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Ну шо ' + msg.chat.username + ' панєслась )');
});

bot.onText(/\/help/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Привіт. Це бот-нагадувалка. \n ' +
        'Працює за дуже простим принципом. \n ' +
        'ПРосто скажи йому коли і що нагадати, та він напише тобі про цю подію чітко в назначений час \n' +
        'Що б щось записати в календарик, просто напищи стрічку \n ' +
        '/save Опис події # Рік-Місяць-День Година:Хвилина. \n' +
        'Наприклад \n' +
        '\n' +
        '/save Винести мусор # 2018-07-18 15:30 \n' +
        '\n' +
        '\n' +
        '\n' +
        'Автор бота @victor_fzs. Спеціально для компанії UkrInSoft');
});

bot.onText(/\/save (.+)/, function (msg, match) {

    //thank google for this hack
    let fullMsg = match[1];

    // let chatId = msg.chat.id;
    let description = fullMsg.split('#')[0] ? fullMsg.split('#')[0] : '';
    let dateOfTask = fullMsg.split('#')[1] ? fullMsg.split('#')[1].trim() : Date.now().toLocaleString();


    if (description && dateOfTask) {
        dateOfTask = new Date(dateOfTask);
        dateOfTask.setUTCHours(dateOfTask.getUTCHours() - 2);

        let task = new taskSchema({
            chatId: msg.chat.id,
            dateOfTask: dateOfTask,
            description: description
        });
        task.save(function (err, taskToSave) {
            if (err) {
                bot.sendMessage( msg.chat.id, 'Якась помилка, краще введи /help.');
                console.log(err);
            } else {

                bot.sendMessage( msg.chat.id, 'Я все записав, босс');
            }
        })
    }
});

bot.onText(/\/find/, function (msg, match) {
    console.log('gfg');
});


(function () {

    let interval = setInterval(function () {
        let lteDate = new Date();
        // lteDate.setUTCHours(lteDate.getUTCHours() + 2);
        console.log(lteDate + '   ______LTE');

        let gteDate = new Date(lteDate.setUTCMinutes(lteDate.getUTCMinutes() - 3));
        // gteDate.setUTCMinutes(gteDate.getUTCMinutes() - 2);
        console.log(gteDate + '   ______GTE');

       let query = taskSchema.find({
            checked: false,
            dateOfTask: {
                // $gte: gteDate
                // ,
                $lte: lteDate
            }
        }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                for (let i = 0; i < 1; i++) {

                    // console.log(docs[i]);
                    docs[i].checked = true;
                    docs[i].save();
                    bot.sendMessage(docs[i].chatId, 'Хазяїн. Нагадую про \n' + docs[i].description);

                    console.log(docs[i].dateOfTask);
                    console.log('_______________________________________');
                }
            }
        });
    }, 3000)
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

