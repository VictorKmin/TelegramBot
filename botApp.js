// require my token, bot API, mongoose
const token = require('./token');
const taskSchema = require('./model/taskModel');
const telegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');


mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/sPlanerBase');

//create new Bot with token and polling (socket.io analog (google write this ;) ))
const bot = new telegramBot(token.getToken, {polling: true});

bot.onText(/\/start/, function (msg, match) {
    bot.sendMessage(msg.chat.id, 'Ну шо ' + msg.chat.username + ' панєслась ;-)');
   let d = new Date();
   console.log(d);
});

bot.onText(/\/help/, function (msg, match) {
    bot.sendMessage(msg.chat.id,
        'Привіт. Це бот-нагадувалка. \n ' +
        'Працює за дуже простим принципом. \n ' +
        'Просто скажи йому коли і що нагадати, та він напише тобі про цю подію чітко в назначений час \n' +
        'Що б щось записати в календарик, просто напищи стрічку \n ' +
        '/save Опис події # Рік-Місяць-День Година:Хвилина. \n' +
        'Наприклад \n' +
        '\n' +
        '/save Винести мусор # 2018-07-18 15:30 \n' +
        '\n' +
        '\n' +
        'Що б знайти подію необхідно ввести /find Назва події\n' +
        'Наприклад\n' +
        '/find Винести мусор\n' +
        '\n' +
        '\n' +
        'Автор бота @victor_fzs. Спеціально для компанії UkrInSoft');
});

bot.onText(/\/save (.+)/, function (msg, match) {

    let fullMsg = match[1];

    let chatId = msg.chat.id;

    let description = fullMsg.split('#')[0] ? fullMsg.split('#')[0] : '';
    let dateOfTask = fullMsg.split('#')[1] ? fullMsg.split('#')[1].trim() : new Date();

    dateOfTask = new Date(dateOfTask);
    dateOfTask.setUTCHours(dateOfTask.getUTCHours() - 2);

    let now = new Date();
    now.setHours(now.getHours() + 2);


    if (now <= dateOfTask) {

        let task = new taskSchema({
            chatId: chatId,
            dateOfTask: dateOfTask,
            description: description
        });
        task.save(function (err, doc) {
            if (err) {
                bot.sendMessage(chatId, 'Якась помилка, краще введи /help');
                console.log(err);
            } else {
                bot.sendMessage(chatId, 'Я все записав, босс')
            }
        });
    } else {
        bot.sendMessage(chatId, 'Док, DeLorean зараз в ремонті. Ми не зможемо відправитись у минуле.')
    }
});


bot.onText(/\/find (.+)/, function (msg, match) {
    let whatFind = match[1];
    console.log(whatFind);

    if (whatFind.length < 2) {
        bot.sendMessage(msg.chat.id, 'Введіть мінімум 3 символи')
    } else {
        taskSchema.find({
            $text: {$search: whatFind}
        }, function (err, docs) {
            if (err) {
                console.log(err);
                bot.sendMessage(msg.chat.id, 'Не можу здійснити пошук :-(')
            } else {
                bot.sendMessage(msg.chat.id, 'Знайдені події: \n');
                for (let i = 0; i < docs.length; i++) {
                    bot.sendMessage(msg.chat.id, 'Завдання: ' + docs[i].description + '\n' +
                        'Час: ' + docs[i].dateOfTask.toLocaleString())
                }
            }
        })
    }
});

(function () {

    let interval = setInterval(function () {
        let lteDate = new Date();

        taskSchema.find({
            checked: false,
            dateOfTask: {
                $lte: lteDate
            }
        }, function (err, docs) {
            if (err) {
                console.log(err)
            } else {
                for (let i = 0; i < 1; i++) {
                    docs[i].checked = true;
                    docs[i].save();
                    bot.sendMessage(docs[i].chatId, 'Хазяїн. Нагадую про \n' + docs[i].description);
                }
            }
        });
    }, 1000 * 15)
})();

