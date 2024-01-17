const bcrypt = require('bcrypt')

const helpers = {}

helpers.encryptPassword = async(password) => {
   let salto = await bcrypt.genSalt(7)
   let hash = await bcrypt.hash(password, salto)
   return hash
}

helpers.matchPassword = async (password, savedPassword) =>{
   try {
      return await bcrypt.compare(password, savedPassword)
   } catch (e) {
      console.log(e)
   }
}

module.exports = helpers