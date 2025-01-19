import unittest
from flask import Flask, session
from flask.testing import FlaskClient
from server.server import Server
from unittest.mock import patch

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        self.server = Server()
        
    

if __name__ == '__main__':
    unittest.main()