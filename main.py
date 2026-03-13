from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client

app = Flask(__name__)
CORS(app)

# Supabase configuration - REPLACE WITH YOUR PROJECT DETAILS
SUPABASE_URL = "YOUR_SUPABASE_URL"
SUPABASE_KEY = "YOUR_SUPABASE_ANON_KEY"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    full_name = data.get('full_name')
    role = data.get('role') # 'student' or 'mentor'
    subject = data.get('subject', '')

    try:
        # 1. Sign up user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
        })

        if auth_response.user:
            # 2. Add profile details to 'profiles' table
            user_id = auth_response.user.id
            supabase.table('profiles').insert({
                "id": user_id,
                "full_name": full_name,
                "role": role,
                "subject": subject,
                "email": email,
                "is_online": False
            }).execute()

            return jsonify({"success": True, "message": "Signup successful! Please check your email for verification if enabled."}), 201
        else:
            return jsonify({"success": False, "message": "Signup failed."}), 400

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    try:
        # Sign in with Supabase Auth
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password,
        })

        if response.user:
            user_id = response.user.id
            # Set user as online
            supabase.table('profiles').update({"is_online": True}).eq("id", user_id).execute()
            
            # Get user profile
            profile = supabase.table('profiles').select("*").eq("id", user_id).single().execute()
            
            return jsonify({
                "success": True, 
                "user": profile.data,
                "access_token": response.session.access_token
            }), 200
        else:
            return jsonify({"success": False, "message": "Invalid credentials"}), 401

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 401

@app.route('/logout', methods=['POST'])
def logout():
    data = request.json
    user_id = data.get('user_id')
    try:
        # Set user as offline
        supabase.table('profiles').update({"is_online": False}).eq("id", user_id).execute()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

@app.route('/online-users', methods=['GET'])
def get_online_users():
    try:
        response = supabase.table('profiles').select("*").eq("is_online", True).execute()
        return jsonify({"success": True, "users": response.data}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, port=5000)
