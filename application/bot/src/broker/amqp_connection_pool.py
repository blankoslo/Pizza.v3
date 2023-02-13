import pika
import queue
import threading
import os

class AmqpConnectionPool:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, max_connections=20, timeout=60):
        self._host = os.environ.get('MQ_URL') if 'MQ_URL' in os.environ else os.environ.get('CLOUDAMQP_URL')
        self._max_connections = max_connections
        # Keep tracks of all connections currently in use
        self._connections_count = 0
        # Queue that keep tracks of all connections not in use
        self._wait_queue = queue.Queue(max_connections)
        self._condition = threading.Condition()
        self._timeout = timeout

    def get_connection(self):
        with self._condition:
            return self._get_connection()

    def release_connection(self, connection):
        # Put connection into wait_queue to indicate it's ready to be used
        with self._condition:
            self._wait_queue.put(connection)
            self._connections_count -= 1
            self._condition.notify()

    def _get_connection(self):
        if not self._wait_queue.empty():
            connection = self._try_get_connection()
            return connection

        if self._connections_count < self._max_connections:
            connection = self._create_and_get_connection()
            return connection

        # Wait for a connection to be released
        return self._try_get_connection()

    def _try_get_connection(self):
        try:
            connection = self._get_connection_from_queue()
        except queue.Empty:
            if not self._condition.wait(self._timeout):
                raise Exception("Timeout reached while waiting for a connection to become available")
            connection = self._get_connection_from_queue()

        if connection.is_closed or connection._impl.is_closing:
            return self._get_connection()

        return connection

    def _get_connection_from_queue(self):
        # Try to get a connection ready to be used from wait queue
        connection = self._wait_queue.get()
        self._wait_queue.task_done()
        # Added connection to connections queue to indicate it's in use
        self._connections_count += 1
        return connection

    def _create_and_get_connection(self):
        # Create a connection and add it to the connections pool to indicate it's in use
        connection = self._create_connection()
        self._connections_count += 1
        return connection

    def _create_connection(self):
        # create a new connection
        parameters = pika.URLParameters(self._host)
        connection = pika.BlockingConnection(parameters)
        return connection
