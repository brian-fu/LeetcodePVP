from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
socketio = SocketIO(app)

# Game state
game_state = {
    'players': [],
    'current_question': None,
    'answers': [],
    'scores': {}
}

# Sample questions
questions = [
    {"question": "What is 2 + 2?", "answer": "4"},
    {"question": "Capital of France?", "answer": "Paris"}
]

@app.route('/')
def index():
    return "Welcome to the PvP Quiz Game!"

@socketio.on('connect')
def handle_connect():
    if len(game_state['players']) < 1:
        player_id = request.sid
        game_state['players'].append(player_id)
        game_state['scores'][player_id] = 0
        emit('player_joined', {'player_id': player_id})
        
        if len(game_state['players']) == 2:
            start_game()

def start_game():
    game_state['current_question'] = questions.pop(0)
    socketio.emit('new_question', {'question': game_state['current_question']['question']})

@socketio.on('submit_answer')
def handle_answer(data):
    player_id = request.sid
    answer = data['answer']
    game_state['answers'].append({'player_id': player_id, 'answer': answer})
    
    if len(game_state['answers']) == 2:
        check_answers()

def check_answers():
    correct_answer = game_state['current_question']['answer']
    for answer in game_state['answers']:
        if answer['answer'].lower() == correct_answer.lower():
            game_state['scores'][answer['player_id']] += 1
    
    socketio.emit('round_result', {
        'scores': game_state['scores'],
        'correct_answer': correct_answer
    })
    
    game_state['answers'] = []
    if questions:
        start_game()
    else:
        end_game()

def end_game():
    winner = max(game_state['scores'], key=game_state['scores'].get)
    socketio.emit('game_over', {
        'winner': winner,
        'final_scores': game_state['scores']
    })
    reset_game_state()

def reset_game_state():
    game_state['players'] = []
    game_state['current_question'] = None
    game_state['answers'] = []
    game_state['scores'] = {}

if __name__ == '__main__':
    socketio.run(app, debug=True)
