var User = require('../models/user')

module.exports.list = () => {
    return User.find()
                .sort({name: 1})
                .exec()
}

module.exports.lookUp = id => {
    return User.findOne({_id: id})
                .exec()
}

module.exports.lookUpEmail = email =>{
    return User.findOne({email: email})
                .exec()
}

module.exports.insert = user => {
    return User.collection.insertOne(user)
}

module.exports.update = (id, user) => {
    return User.updateOne({_id: id}, user)
                .exec()
}

module.exports.remove = id => {
    return User.deleteOne({_id: id})
}

module.exports.getUserType = email => {
    return User.findOne({ email: email }).then(user => user.type);
  };