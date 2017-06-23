// var util = require('util');
// var Promise = require('promise');
// var DB = require('../DB');
// var orderDB = DB.getConnection('', 'order');
// var productDB = DB.getConnection('', 'product');
// var goodsDB = DB.getConnection('', 'goods');
// var ownProductDB = DB.getConnection('', 'own_product');

// exports.addProduct = function (product) {
//     if(false === ['service','name','summary','pics','content'].every(function(elem){
//         if(util.isNullOrUndefined(product[elem])){
//             return false;
//         }
//         return true;
//     })){
//         return Promise.reject(new Error('数据格式错误'));
//     }
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').create(product, function (err, result) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(result);
//         });
//     });
// };

// exports.updateProduct = function (id, update) {
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').findByIdAndUpdate(id, update, { new: true }, function (err, result) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(result);
//         });
//     });
// };

// exports.removeProduct = function (id) {
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').remove({ _id: id }, function (err) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve();
//         });
//     });
// };

// exports.getProducts = function () {
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').find({}, function (err, results) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(results);
//         });
//     });
// };

// exports.getProduct = function (id) {
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').findById(id, function (err, result) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(result);
//         });
//     });
// };

// exports.findProducts = function (condition) {
//     return new Promise(function (resolve, reject) {
//         DB.getConnection('', 'product').find(condition, function (err, results) {
//             if (err) {
//                 return reject(err);
//             }
//             return resolve(results);
//         });
//     });
// };