

const sanitizeUser = user => ({
    fullName: user.userName,
    email: user.email,
    myId: user._id,
  });
  
  module.exports=sanitizeUser;