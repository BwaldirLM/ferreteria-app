
module.exports = {
    dateFormat : require('handlebars-dateformat'),
    moneyFormat: function (value) {
        formato = '';
        if(value % 1 == 0)
            formato = 'S/. '+String(value)+'.00';
        
        return formato
        
    },
    isEqual: function (value1, value2, options) {
        return value1 === value2 ? options.fn(this) : options.inverse(this)
    }
}