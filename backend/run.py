from app import create_app, db, socketio

app = create_app('development')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    socketio.run(app, cors_allowed_origins="*", debug=True)
