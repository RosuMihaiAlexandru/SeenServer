

const sanitizeUser = user => ({
    fullName: user.userName,
    email: user.email,
    myId: user._id,
    profileImage: user.profileImage.media,
  });
  
  module.exports=sanitizeUser;