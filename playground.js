const bcrypt = require('bcryptjs');

const password = 'pass123';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
  })
})

var hashedPassword = '$2a$10$occ/g3dqs0zSoc/3F.C1eOh7thNt0Jk5zu2DPNHt2T/z77Lx8a142';

bcrypt.compare(password, hashedPassword, (err, res) => {
  if (res){
    console.log("password correct")
  }
})