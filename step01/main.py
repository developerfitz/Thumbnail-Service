import boto3
import json
from pathlib import PurePath
from io import BytesIO
from PIL import Image
from urllib.parse import unquote_plus
from botocore.exceptions import ClientError
from sqlalchemy.exc import DBAPIError, SQLAlchemyError
from models import Images
import db
import SQSQuery

BUCKET_NAME = 'gg-photo-bucket'
OUTPUT_FOLDER = 'thumbnails'
# QUEUE_URL = 'https://queue.amazonaws.com/862347804731/thumbnail-uploads'

session = boto3.Session(profile_name='thumbnail-service')
s3 = session.client('s3')
# sqs = session.client('sqs')

# class S3Message:
#   '''
#   This class encapsulates logic and data so that receiving messages and
#   processing images can be handled separately. This is sometimes referred
#   to as a Data Transfer Object (DTO).
#   '''
#
#   def __init__(self, _id, key, receipt_handle):
#     '''
#     The constructor for S3Message.
#     '''
#     self._id = _id
#     self.key = key
#     self.receipt_handle = receipt_handle
#     print(key)
#
#   @classmethod
#   def parse(cls, message):
#     '''
#     This class method parses the raw message from SQS in JSON form and
#     returns an instance of S3Message.
#
#     unquote_plus used to replace "+" with spaces from files uploaded
#     '''
#     _id = message['MessageId']
#     body = json.loads(message['Body'])
#     # assumes only on record
#     record = body['Records'].pop()
#     key = unquote_plus(record['s3']['object']['key'])
#     receipt_handle = message['ReceiptHandle']
#
#     return cls(_id, key, receipt_handle)

# class SQS:
#   '''
#   SQS context manager that processes a single incoming message
#   deleting occurs only if no exceptions are raised when exiting
#
#   :param message: S3Message object to process
#   :param queue_url:
#   :return: SQS context manager object (enter + exit)
#   '''
#
#   def __init__(self, message, queue_url):
#     # TODO: something is wrong i'm redefining the S3Message inside of SQS
#     self.queue_url = queue_url
#     self.id = message._id
#     self.key = message.key
#     self.receipt_handle = message.receipt_handle
#
#   def delete_message(self):
#     print(f'Deleting message {self.id}')
#     sqs.delete_message(
#       QueueUrl=self.queue_url,
#       ReceiptHandle=self.receipt_handle
#     )
#     print('Message deleted.')
#
#   def __enter__(self):
#     return self
#
#   def __exit__(self, type, value, traceback):
#     if type:
#       # can probably logo this and use monitor using alerts
#       print('Error occured while processing SQS message: ')
#       print(f'{value}')
#     else:
#       self.delete_message()
#     return True


# def gen_messages_from_response(response):
#   '''
#   This function parses a response from AWS ReceiveMessages and returns
#   a generator that yields one message at a time for each message in the response.
#
#   Gets only one message: MaxNumberOfMessages = 1
#   Long Polling: WaitTimeSeconds = 2
#   '''
#   raw_messages = response.get('Messages', [])
#   for raw_message in raw_messages:
#     yield S3Message.parse(raw_message)


def create_thumbnail(input_stream, size=(128, 128)):
  '''
  This function creates a thumbnail of an image. It expects bytes and returns
  bytes.
  '''

  output_stream = BytesIO()
  image = Image.open(BytesIO(input_stream))
  image.thumbnail(size)
  image.save(output_stream, image.format)
  output_stream.seek(0)
  return output_stream


def create_thumbnail_key(key):
  '''
  This function creates the S3 key for the thumbnail to be uploaded to S3
  based on the key of the original image.
  '''

  key_path = PurePath(key)
  file_stem = key_path.stem
  file_ext = key_path.suffix
  return '{}/{}.thumbnail{}'.format(OUTPUT_FOLDER, file_stem, file_ext)


def create_image_record(bucket, key):
  '''
  creates an Image object to store in DB
  stores in Images table

  :param bucket: S3 bucket to use
  :param key: path to image in specified S3 bucket
  :return: Images Object
  '''
  return Images(bucket=bucket, filename=PurePath(key).name,
                key=key)


def main():
  print('Waiting for Messages...')
  while True:
    response = sqs.receive_message(
      QueueUrl=QUEUE_URL,
      MaxNumberOfMessages=1,
      WaitTimeSeconds=2
    )

    # returned genergator object from S3.parased(raw_message)
    # as messages added gets next one
    messages = gen_messages_from_response(response)
    for message in messages:
      try:
        with SQS(message, QUEUE_URL) as sqs_message:
        get_object_response = s3.get_object(
          Bucket=BUCKET_NAME,
          Key=message.key
        )

        print(f'Creating Thumbnail for {message._id}')
        stream = get_object_response['Body'].read()
        thumbnail_stream = create_thumbnail(stream)

        print(f'Uploading Thumbnail for {message._id}')
        thumbnail_key = create_thumbnail_key(message.key)

        # creates and adds image record to DB
        image_for_database = create_image_record(BUCKET_NAME, message.key)
        db.session.add(image_for_database)

        # updates image record with thumbnail key
        image_for_database.thumbnail_key = thumbnail_key
        db.session.commit()

        s3.put_object(
          Bucket=BUCKET_NAME,
          Key=thumbnail_key,
          Body=thumbnail_stream
        )

        # # TODO: if no errors delete message in __exit__ (finally)
        # print(f'Deleting Message {message._id}')
        # sqs.delete_message(
        #   QueueUrl=QUEUE_URL,
        #   ReceiptHandle=message.receipt_handle
        # )


      except ClientError as boto_error:
        '''        
        ClientError
        - boto3 errors (s3, sqs)
        '''
        print(f'Botocore Error: {boto_error}')

      except DBAPIError as db_error:
        '''error from DB API'''
        print(f'DB API Error: {db_error.statement}')

      except SQLAlchemyError as alchemy_error:
        '''error from ORM'''
        print(f'SQL Alchemy Error: {alchemy_error}')

      except KeyError:
        '''error from no output format'''
        print(f'Output error: {KeyError}')

      except IOError as e:
        '''  
        - errors from file not found or opened
        - errors if file not written
        
        Note: most errors from an image file or unsupported image file
        '''
        print(f'IO Error: {e}')
        print('Thumbnail not created.')
        print(f'Deleting Message {message._id}')

        # Deletes message to prevent further processing
        sqs.delete_message(
          QueueUrl=QUEUE_URL,
          ReceiptHandle=message.receipt_handle
        )

        # Removes uploaded files not able to be processed
        print(f'Removing file from bucket: {message.key}')
        s3.delete_object(
          Bucket=BUCKET_NAME,
          Key=message.key
        )

      except OSError as e:
        '''errors from BytesIO'''
        print(f'OS Error: {e}')
        print('Thumnail not created.')

      except Exception as e:
        '''errors not caught from above'''
        print(f'Uncaught Exception: {e}')
        raise e



if __name__ == '__main__':
  main()