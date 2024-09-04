import multer from "multer"


// uploading file to localstorage
const storage = multer.diskStorage({     //to store file in given location
    destination: function (req, file, cb) {
      cb(null, './public/temp')    // callback first arg is error:null and second is location to store filw
    },

    filename: function (req, file, cb) {      
        console.log("this is file",file);
      cb(null, file.originalname)      // by what name file should be store
    }
  })
  
export const upload = multer({ storage: storage })