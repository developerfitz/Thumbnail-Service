import boto3
import json
from pathlib import PurePath
from io import BytesIO
from PIL import Image
from urllib.parse import unquote_plus

BUCKET_NAME = 'gg-photo-bucket'
OUTPUT_FOLDER = 'thumbnails'
QUEUE_URL = 'https://queue.amazonaws.com/862347804731/thumbnail-uploads'

session = boto3.Session(profile_name='thumbnail-service')
s3 = session.client('s3')
sqs = session.client('sqs')

class S3Message:
  '''
  This class encapsulates logic and data so that receiving messages and
  processing images can be handled separately. This is sometimes referred
  to as a Data Transfer Object (DTO).
  '''

  def __init__(self, _id, key, receipt_handle):
    '''
    The constructor for S3Message.
    '''
    self._id = _id
    self.key = key
    self.receipt_handle = receipt_handle
    print(key)

  @classmethod
  def parse(cls, message):
    '''
    This class method parses the raw message from SQS in JSON form and
    returns an instance of S3Message.
    '''
    _id = message['MessageId']
    body = json.loads(message['Body'])
    key = body['Records'][0]['s3']['object']['key']
    receipt_handle = message['ReceiptHandle']

    return cls(_id, key, receipt_handle)


def gen_messages_from_response(response):
  '''
  This function parses a response from AWS ReceiveMessages and returns
  a generator that yields one message at a time for each message in the response.

  Gets only one message: MaxNumberOfMessages = 1
  Long Polling: WaitTimeSeconds = 2
  '''
  raw_messages = response.get('Messages', [])
  for raw_message in raw_messages:
    yield S3Message.parse(raw_message)


def create_thumbnail(input_stream, size=(128, 128)):
  '''
  This function creates a thumbnail of an image. It expects bytes and returns
  bytes.
  '''

  output_stream = BytesIO()
  image = Image.open(BytesIO(input_stream))
  image.thumbnail(size)
  image.save(output_stream, "JPEG")
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


def main():
  print('Waiting for Messages...')
  #TODO: should this always be True? does it ever stop?
  while True:
    response = sqs.receive_message(
      QueueUrl=QUEUE_URL,
      MaxNumberOfMessages=1,
      WaitTimeSeconds=2
    )

    messages = gen_messages_from_response(response)
    for message in messages:
      try:
        get_object_response = s3.get_object(
          Bucket=BUCKET_NAME,
          Key=message.key
        )

        print(f'Creating Thumbnail for {message._id}')
        #TODO: does this need to be closed?
        stream = get_object_response['Body'].read()
        thumbnail_stream = create_thumbnail(stream)

        print(f'Uploading Thumbnail for {message._id}')
        thumbnail_key = create_thumbnail_key(message.key)
        s3.put_object(
          Bucket=BUCKET_NAME,
          Key=thumbnail_key,
          Body=thumbnail_stream
        )

        print(f'Deleting Message {message._id}')
        sqs.delete_message(
          QueueUrl=QUEUE_URL,
          ReceiptHandle=message.receipt_handle
        )

      except Exception as e:
        '''
        IMPLEMENT - this should be updated to only catch exceptions that 
        are expected and print appropriate error messages. It is meant to 
        prevent SQS messages from being deleted if the image was not properly
        processed. Make sure to look for all failure scenarios, including those 
        caused by boto3.
        
        For example, if a failure occurs the error should be printed and the 
        message should be left in the queue for later processing. This way the 
        image can be kept in the queue and processed later when the code is 
        updated to fix the bug.
        '''
        # raise error_class(parsed_response, operation_name)
        # botocore.errorfactory.ReceiptHandleIsInvalid: An error occurred
        # (ReceiptHandleIsInvalid) when calling the DeleteMessage operation:
        # The input receipt handle is invalid.
        raise e



if __name__ == '__main__':
  main()