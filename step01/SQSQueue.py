import boto3
import json
from contextlib import contextmanager
from urllib.parse import unquote_plus



class SQSMessage:
  '''
    This class encapsulates logic and data so that receiving messages and
    processing images can be handled separately. This is sometimes referred
    to as a Data Transfer Object (DTO).
  '''

  def __init__(self, _id, key, receipt_handle):
    '''The constructor for SQSMessage.'''
    self._id = _id
    self.key = key
    self.receipt_handle = receipt_handle
    print(f'SQSMessage being processed for incoming {key}')

  @classmethod
  def parse(cls, message):
    '''
      This class method parses the raw message from SQS in JSON form and
      returns an instance of SQSMessage.

      unquote_plus used to replace "+" with spaces from files uploaded

      :returns: SQSMessage object
    '''
    _id = message['MessageId']
    body = json.loads(message['Body'])

    # assumes only on record
    record = body['Records'].pop()
    key = unquote_plus(record['s3']['object']['key'])
    receipt_handle = message['ReceiptHandle']

    return cls(_id, key, receipt_handle)


class SQSQueue:
  '''
    This class has a context manager for processing an
    incoming message.

    Uses a decorator with a try-except-else pattern.
    Deleting occurs only if no exceptions are raised.
    Exceptions are raised and caught by outer exceptions.

    :param queue_url:
    :param client: sqs client
    :param session: boto3 session
  '''


  def __init__(self, queue_url, client=None, session=None):
    self.url = queue_url
    self.set_client(client=client, session=session)


  @contextmanager
  def get(self):
    '''
      Context Manager that provides setup and cleanup for
      handling SQS messages.

      Upon successfully executing the nested code block it will
      handle acknowledging the SQS message.

      :returns: SQSMessage object
    '''
    response = self.client.receive_message(
      QueueUrl=self.url,
      MaxNumberOfMessages=1,
      WaitTimeSeconds=2
    )

    messages = response.get('Messages')

    if not messages:
      # context manager generator needs to yield something after entering
      yield None

    if messages and len(messages) == 1:
      message = SQSMessage.parse(messages[0])
      try:
        yield message

      except Exception as e:
        # Notify that an exception occured, raised be caught by outer Exceptions
        print(f'An error occured, see below.')
        print(f'Message was not deleted.')
        raise e

      else:
          print(f'Deleting Message {message._id}')
          self.client.delete_message(
            QueueUrl=self.url,
            ReceiptHandle=message.receipt_handle
          )

  @property
  def client(self):
    '''
      Property getter for queue.client.

      :returns: boto3 client provided by user or creates default with credentials
    '''
    if self._client:
      return self._client

    print('Using default boto3 client for SQS')
    return boto3.client('sqs')

  def set_client(self, client=None, session=None):
    '''
      Creates a boto3 client to interact with AWS APIs
      If a client is passed it's used as is.
      If a session is passed a client is created with it.

      :returns: client (sqs)
    '''
    if client:
      self._client = client
      return

    if session:
      self.session = session
      self._client = session.client('sqs')
      return