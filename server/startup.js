//Проверяем наличие токена и времени его жизни в базе
if(Settings.find().count() == 0) {
  Settings.insert({
    _id : 'settings',
    lifetime : new Date().getTime() - 600000,
    token : "",
    companies : []
  });
}
