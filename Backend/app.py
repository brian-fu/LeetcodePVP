from enum import Enum
from flask import Flask, request, jsonify
from datetime import datetime
import signal
import sys
import random
import string
from Backend.run_code import execute_code

# Configuration class to store game constants
class GameConfig:
    MAX_PLAYERS = 10
    MIN_PLAYERS = 1
    CODE_LENGTH = 5
    QUESTIONS = 1

# Enum to track the current state of the game
class GameState(Enum):
    WAITING = 0    # Game created, waiting for players
    STARTED = 1    # Game in progress
    STOPPED = -1   # No game running

# Main game class to handle game state and logic
class Game:
    def __init__(self):
        self.host = ""                          # Username of the host
        self.players = []                       # List of player usernames
        self.game_code = ""                     # Unique game identifier
        self.game_state = GameState.STOPPED     # Current game state
        self.config = GameConfig()              # Game configuration
        self.problems = []
        self.winner = None
    
    # Reset the game state to initial values
    def reset(self):
        self.host = ""
        self.players = []
        self.game_code = ""
        self.game_state = GameState.STOPPED
        self.problems = []
        self.winner = None
    
    # Check if a username is either the host or a player
    def is_valid_player(self, username):
        return username == self.host or username in self.players
    
    # Check if new players can join the game
    # def can_join(self):
    #     return (self.game_state == GameState.WAITING and 
    #             len(self.players) < self.config.MAX_PLAYERS)
    
    # Check if the game has enough players to start
    def can_start(self):
        return (len(self.players) >= self.config.MIN_PLAYERS and 
                self.game_state == GameState.WAITING)
    

app = Flask(__name__)
game = Game()

# Helper function to create consistent JSON responses
def make_response(success=True, data=None, error=None, status_code=200):
    response = {
        "success": success,
        "timestamp": datetime.now().isoformat()
    }
    if data is not None:
        response["data"] = data
    if error is not None:
        response["error"] = error
    return jsonify(response), status_code

# Creates a new game and sets the requesting user as host
@app.route('/create', methods=['POST'])
def create_game():
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'username' not in data:
        return make_response(False, error="username is required", status_code=400)

    if game.host != "":
        # TODO remove
        game.reset()
        return make_response(False, 
                           error="Cannot create a game when game is running", 
                           status_code=405)
    
    # pick questions
    pick_questions()

    # Generate random game code
    characters = string.ascii_letters + string.digits
    game.game_code = ''.join(random.choices(characters, 
                                          k=game.config.CODE_LENGTH))
    game.host = data['username']
    print("game host is: ", game.host)
    game.game_state = GameState.WAITING
    
    return make_response(True, {
        "game_code": game.game_code,
        "status": "success"
    })

# TODO: Allow multiple games to happen at the same time, so require a game_code to join
# the correct one
# Allows players to join an existing game that hasn't started
@app.route('/join', methods=['POST'])
def join_game():
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'username' not in data:
        return make_response(False, error="username is required", status_code=400)

    # if not game.can_join():
    #     return make_response(False, error="Cannot join game", status_code=405)
    
    if data['username'] in game.players or data['username'] == game.host:
        return make_response(False, error="Username already taken", 
                           status_code=400)
    
    game.players.append(data['username'])
    
    return make_response(True, {
        "game_code": game.game_code,
        "status": "success"
    })

# Allows the host to start the game when enough players have joined
@app.route('/start', methods=['POST'])
def start_game():
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'username' not in data:
        return make_response(False, error="username is required", status_code=400)

    # if data['username'] != game.host:
    #     return make_response(False, 
    #         error="You are not the host, you may not start the game", 
    #         status_code=405)

    if not game.can_start():
        return make_response(False, 
            error="Not enough players to start the game", 
            status_code=400)
    
    game.game_state = GameState.STARTED
    
    return make_response(True, {"game_state": "STARTED"})

# Handles code execution submissions from players
@app.route('/execute', methods=['POST'])
def exec():
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'username' not in data or 'code' not in data or 'game_code' not in data:
        return make_response(False, error="Missing required fields", status_code=400)

    print(data['code'])
    # Execute the submitted code and check result
    result = execute_code(game.problems[0], data['code'])
    print(result)
    
    if result == True:
        game.winner = data['username']          # Set the winner
        game.game_state = GameState.STOPPED     # End the game
        return make_response(True, {
            "winner": game.winner,
            "game_over": True
        })
    
    return make_response(True, {
        "output": result,
        "game_over": False
    })

@app.route('/stop', methods=['POST'])
def stop_game():
    print(request.get_json())
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'username' not in data:
        return make_response(False, error="username is required", status_code=400)

    if data['username'] != game.host:
        return make_response(False, 
            error="You are not the host, you may not stop the game", 
            status_code=405)
    
    if game.game_state == GameState.STOPPED:
        return make_response(False, error="No game is running", status_code=400)
    
    game.reset()
    
    return make_response(True, {"game_state": "STOPPED"})

from Backend.run_code import read_file
def pick_questions():
    problems = read_file("questions.json")
    random_key = random.choice(list(problems.keys()))
    game.problems = [random_key]

# return questions that are being tested on in this game instace
@app.route('/questions', methods=['POST'])
def return_questions():
    return make_response(True, {"questionids": game.problems})

# return the details for a specific question
@app.route('/question', methods=['POST'])
def question():
    return make_response(True, {f"question{id}": read_file("questions.json")[game.problems[0]]})

# return game status
@app.route('/status', methods=['POST'])
def get_status():
    if not request.is_json:
        return make_response(False, error="Content-Type must be application/json", 
                           status_code=400)
    
    data = request.get_json()
    if not data or 'game_code' not in data:
        return make_response(False, error="game_code is required", status_code=400)

    status_data = {
        "game_state": game.game_state.name,
        "players": game.players,
        "host": game.host,
        "winner": game.winner
    }
    
    return make_response(True, status_data)

# Handle graceful shutdown
def signal_handler(sig, frame):
    game.reset()
    sys.exit(0)



if __name__ == '__main__':
    # Register signal handlers for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    game.reset()
    app.run(debug=True)

