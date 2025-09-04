// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';

// import config from '../config';

// cloudinary.config({
//   cloud_name: config.cloudinary_cloud_name,
//   api_key: config.cloudinary_api_key,
//   api_secret: config.cloudinary_api_secret,
// });

// export const sendImageToCloudinary = (imageName: string, path: string) => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path,
//       { public_id: imageName.trim() },
//       function (error, result) {
//         if (error) {
//           reject(error);
//         }
//         resolve(result);
//         // delete a file asynchronously
//         fs.unlink(path, (err) => {
//           if (err) {
//             console.log(err);
//           } else {
//             console.log('File is deleted.');
//           }
//         });
//       },
//     );
//   });
// };
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import config from '../config';
import multer from 'multer';

cloudinary.config({
  cloud_name: config.cloudinary_cloud_name,
  api_key: config.cloudinary_api_key,
  api_secret: config.cloudinary_api_secret,
});

// export const sendImageToCloudinary = (
//   imageName: string,
//   path: string,
// ): Promise<UploadApiResponse> => {
//   return new Promise((resolve, reject) => {
//     cloudinary.uploader.upload(
//       path,
//       { public_id: imageName.trim() },
//       (error, result) => {
//         // ✅ Delete the file after upload attempt
//         fs.unlink(path, (err) => {
//           if (err) console.error('Error deleting file:', err);
//         });

//         if (error) {
//           return reject(error);
//         }

//         if (!result) {
//           return reject(new Error('Cloudinary upload failed.'));
//         }

//         resolve(result as UploadApiResponse);
//       },
//     );
//   });
// };
export const sendImageToCloudinary = (
  imageName: string,
  path: string,
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName.trim() },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result as UploadApiResponse); // ✅ type assertion
        fs.unlink(path, (err) => {
          if (err) console.log(err);
        });
      },
    );
  });
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
