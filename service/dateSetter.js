// File to transform UNIX TimeStamp to Date


module.exports.dateSeter = function dateSet(userDate) {
    let months_arr = ['01','02','03','04','05','06','07','08','09','10','11','12'];
    let date = new Date(userDate*1000);
    let year = date.getFullYear();
    let month = months_arr[date.getMonth()];
    let day = date.getDate();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let seconds = "0" + date.getSeconds();

// Display date time in MM-dd-yyyy h:m:s format
    let convdataTime = year+'-'+month+'-'+day+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

    let serverDate2 = new Date();
    serverDate2.setHours(serverDate2.getHours() + 2);


    console.log(serverDate2  + '    server');
    let uersDate =  new Date(convdataTime);
    uersDate.setHours(uersDate.getHours() + 3);
    console.log(uersDate + '    user');

    let normalDate = new Date(uersDate - (uersDate - serverDate2)).toISOString();

    console.log(normalDate + '               normal !!!');

    return normalDate;
};

