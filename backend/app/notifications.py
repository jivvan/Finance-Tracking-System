from flask_socketio import emit
from . import socketio


@socketio.on('connect')
def handle_connect():
    emit('notification', {'message': 'Connected to server'})


@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')
