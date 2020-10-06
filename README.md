# Thumbnail Service
This project is broken into smaller mini challenges to learn individual concepts and bring the smaller challenges together for an end-to-end thumbnail service keeping track of user's pictures and the generated thumbnails.

The goal of the project is to better understand challenges and decisions encountered during the software development process.


### Tech. Stack:  
- Python 3.7  (Logic)
- JavaScript/ES6 (Frontend)
- AWS
  - Boto3 (SDK)
  - SQS (Messages)
  -  S3  (Storage)
  - Elastic Beanstalk (EC2)
  - CLI
- Flask (Server)
- SQLite (Database)
- SQLAlchemy (ORM)
- Alembic (Database Management)
  - Flask-Alembic
  - Flask-Migration
- Pillow (Image Processor)


**Fill free to look over the code or try to run the individual steps.**
There are demo snippets below and demos videos in the **demos/videos/** dir for quick viewing.

Code containing `< >` are to be replaced with a name of choice. 


### Initial Setup to run the Mini Challenges below
1. Clone repo in the directory of your choice:  
    ```
    git clone https://github.com/developerfitz/Thumbnail-Service.git
    ```

2. Create and activate a virtual environment in Python  
    ```
    python3 -m venv <name-of-virtual-env>
    source <name-of-virtual-env>/bin/activate
    ```

3. Update and Install required tools
    ```
    pip install --upgrade pip
    ```

4. Install the AWS CLI (AWS services) and Elastic Beanstalk (EB) CLI using your method of choice. I have decide to use homebrew:    
    ```
    brew install awscli awsebcli
    ```  

For alternative methods [click here](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html)



### AWS IAM user required
1. Create a user to interact with the CLIs that has IAM permissions to access AWS services mainly S3 and EB, and IAM permissions for passing roles.
2. Take note of the **AWS Access Key ID** and the **AWS Secrete Access Key** generated.
3. After creating the user with the appropriate IAM permissions, use the **AWS Access Key ID** and the **AWS Secrete Access Key** to configure the AWS CLI with a profile.    
    ```
    aws configure --profile <profile-name>
    ```  
- Input: `AWS Access Key ID`
- Input: `AWS Secrete Access Key`
- Input: `AWS Region`

    To view the newly created profile run:     
    ```
    aws configure list-profiles
    ```    

    Set the profile as an environment variable to avoid specifying the profile for each command input    
    ```
    export AWS_PROFILE=<profile-name>
    ```    



## Mini Challenges (Steps)
### Step 00 Local Python 
- A - Local Python Development (thumbnail generation)
- B - Added a Database for storage
- C - Combined to have a functional local script (logic)

![Demo of Step00](demos/step00-demo.gif)

1. From inside the **Thumbnail-Service** directory (dir):  
- Change into the step dir `cd step00`  
- Install dependencies `pip install -r requirements.txt`  
- Run the image processing script:  
    ```
    python3 imageProcessor.py
    ```  
    *The script waits for images to be uploaded*
2. Follow the prompt and enter an image name from the **uploads** dir  
- Input: `nobscat` or `nobscat.jpg`    

    **NOTE:** The `text.txt` file will throw an error since only images are processed  

3. After running the `imageProcessor.py` script you should find a **thumbnails** dir with the generated thumbnail  

4. Additionally, a database has been generated capturing the image and thumbnail info.   
-------



### Step 01 AWS Integration
- A - Setup AWS configuration
- B - Using Boto3 to interact with AWS S3 and SQS
- C - Synced DB and AWS (the local script with AWS S3 and SQS)
- D - Refactored with context manager to delete messages from SQS after processing

![Step01 Demo Gif](demos/step01-demo.gif)


1. From inside the **Thumbnail-Service** change into the following dir:   
    `cd step01` change into the step dir  
    `pip install -r requirements.txt`  install dependencies  

2. Open the `main.py` file and update the below variables to match your AWS account:
- `BUCKET_NAME` - S3 bucket will need to be setup specifying an event when new files are upload to `<bucket-name>/images` 
- `OUTPUT_FOLDER` - the dir to place processed thumbnails
- `QUEUE_URL` - A Standard SQS will also need to be setup to accept messages from the S3 bucket when new files are uploaded
- `AWS_PROFILE` - profile created when setting up the AWS CLI

**NOTE:** Ensure the AWS CLI is installed and a profile has been setup for use with boto3

3. Run script:
    ```
    python3 main.py
    ``` 
    *The script waits for images to be uploaded.*

4. Upload an image to the S3 bucket you specified (e.g., gg-photo-bucket/images/)

5. After uploading, the images will be processed and sent to S3 (e.g., gg-photo-bucket/thumbnails/) with the generated thumbnail. 

6. In the terminal running main.py there are logs showing the image being processed.  
   Press `ctrl + c` to stop the script.

7. Additionally, the **GG.db** database is updated. To see the entry in the database run the command below and input the filename including extension:  
    ```
    python3 query.py
    <photo-name-with-extension>
    ```
------ 



### Step 02 Frontend Integration
- A - Designed an API using OpenAPI (Swagger)
- B - Developed the designed API to upload images with presigned url from AWS
- C - Integrated frontend with a generated an SDK to build an end-to-end microservice

![Step02 Demo Gif](demos/step02-demo.gif)

1. From inside the **Thumbnail-Service** dir run:  
    `cd step02` change into the step dir  
    `pip install -r requirements.txt`  install dependencies

2. Open the `main.py` and `app.py` files and update the variables to match your AWS account accordingly:
- `BUCKET_NAME` - S3 bucket will need to be setup specifying an event when new file is upload to `<photo-name>/images` 
-  `OUTPUT_FOLDER` - the dir to place processed thumbnails
- `QUEUE_URL` - A Standard SQS will also need to be setup to accept messages from the S3 bucket when new file uploaded
-  `AWS_PROFILE` - profile created when setting up the AWS CLI

3. In a terminal run `pthyon3 main.py` to start the script for processing images.

4. In a separate terminal run `flask run` to start the server for the frontend

5. Go to address running on the server in a browser (e.g., http://127.0.0.1:5000)

6. Upload any image of your choice

7. View process logs
- View the `main.py` terminal to see the processed images. 
- Vew the `flask` terminal to see the server requests.
- Open database to see image info ([DB Browser](https://sqlitebrowser.org/))

    *BUG: There is a bug regarding duplication of the entry in the DB and the file ext missed that is addressed in a later step.*

**NOTE:** Ensure proper S3 Permissions and CORS is configured for the S3 Bucket ([more info](https://docs.aws.amazon.com/AmazonS3/latest/dev/cors.html)). 

-------



### Step 03 Deployment, DB Management, and Authorization
- A - Deployed the thumbnail-microservice using EB
- B - Performed database management (changes, migrations, versioning)
- C - Implemented OAuth with Github for user authorization and creating user profiles

#### EB Deployment Demo
![Step03 Demo](demos/step03-demo-eb-deploy.gif)

1. Ensure the EB CLI is installed
2. Open the `options.config` file and replace the `WorkerQueueURL` value or `<AWS#>` section of the URL 
   ```
   nvim .ebextensions/options.config
   ```

3. Create a **role** with programmatic access in IAM to limit the permissions available to the EC2 instance. The `thumbnail-worker` is the **role** created and attached with S3 and SQS permissions.
- S3 Full Access
- SQS Full Access

4. Set the EB environment variable (same as the AWS_PROFILE)  
    ```
    export AWS_EB_PROFILE=<profile>
    ```
5. Initialize EB dir
    ```
    eb init --region <aws-region> --platform 'Python 3.7' <application-name>
    ```  
6. Create a worker EC2 instance
    ``` 
    eb create -t worker -i t2.micro  -ip 'thumbnail-worker' <environment-name>
    ```

    ``` 
    eb status
    ```

7. Upload an image to the specified S3 bucket (e.g., gg-photo-bucket/images/).  
   A thumbnail for the image will be processed and sent to the S3 bucket (e.g., gg-photo-bucket/thumbnails/).

8. View activity in the EB logs (CLI or AWS console) under the section labeled **/var/log/web.stdout.log**. You can see the message data, search for **"key"** for a quick find.  
   ```
   eb logs
   ```  

### Clean up EB
9. To take down all the resources created run:
    ```
    eb terminate --all 
    ```
    then 
    ```
    <environment-name>
    ``` 




### Database Migrations Demo
Too keep up with changes that may occur during evolution of the app. 


### OAuth with Github Demo
OAuth currently under PR changes.




--------
## Full Serverless App Coming Soon!😎 
- Lambda
- S3
- SQS
- DynamoDB
- CloudFront
- API Gateway
- CloudFormation