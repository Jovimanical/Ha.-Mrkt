import { Injectable } from '@angular/core';
// import * as AWS from 'aws-sdk/global';
// import * as S3 from 'aws-sdk/clients/s3';


const AWS_S3_BUCKET = "house-africa-file-storage"
const AWS_SECRET_KEY = "H5cQWHW2o0/xLQV4OioMS+x+3Re/KqMHGvIGvL1O"
const AWS_ACCESS_KEY = "AKIAYT2QLRHTBZOS7BTU"
const AWS_REGION_ID = "us-west-2"
const AWS_CLOUD_FRONT_URL = "https://d2lclgssmv7z3f.cloudfront.net/"


@Injectable({
  providedIn: 'root'
})
export class HAFileUploadService {


  public FOLDER = '/';
  constructor() { }

  uploadFile(file: any) {
    // const contentType = file.type;
    // const bucket = new S3(
    //   {
    //     accessKeyId: AWS_ACCESS_KEY,
    //     secretAccessKey: AWS_SECRET_KEY,
    //     region: AWS_REGION_ID
    //   }
    // );

    // const params = {
    //   Bucket: AWS_S3_BUCKET,
    //   Key: this.FOLDER + file.name,
    //   Body: file,
    //   ACL: 'public-read',
    //   ContentType: contentType
    // };

    // bucket.upload(params, (err: any, data: any) => {
    //   if (err) {
    //     console.log('There was an error uploading your file: ', err);
    //     return false;
    //   }
    //   console.log('Successfully uploaded file.', data);
    //   // replace parameters here and send to backend

    //   return true;
    // });

    //for upload progress   
    /*bucket.upload(params).on('httpUploadProgress', function (evt) {
              console.log(evt.loaded + ' of ' + evt.total + ' Bytes');
          }).send(function (err, data) {
              if (err) {
                  console.log('There was an error uploading your file: ', err);
                  return false;
              }
              console.log('Successfully uploaded file.', data);
              return true;
          });*/
  }


  deleteFile(fileName: any) {
    // const bucket = new S3(
    //   {
    //     accessKeyId: AWS_ACCESS_KEY,
    //     secretAccessKey: AWS_SECRET_KEY,
    //     region: AWS_REGION_ID
    //   }
    // );
    // var params = {
    //   Bucket: AWS_S3_BUCKET,
    //   Key: fileName
    //   /* 
    //      where value for 'Key' equals 'pathName1/pathName2/.../pathNameN/fileName.ext'
    //      - full path name to your file without '/' at the beginning
    //   */
    // };
    // var that = this;
    // bucket.deleteObject(params, (err, data) => {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else console.log(data)

    // });
  }
}
