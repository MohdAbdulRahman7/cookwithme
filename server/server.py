import logging
from flask import Flask, jsonify, request
from flask_cors import CORS

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('server.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

@app.route('/api/prompt', methods=['POST'])
def prompt():
    req = request.json
    logger.info('Request: %s', req)
    logger.info('Prompt: %s', req['prompt'])
    return jsonify({
        'message': 'Response Message (Logic later)'
    })

if __name__ == '__main__':
    app.run(debug=True)