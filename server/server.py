from flask import Flask, render_template, request, jsonify, session
import json
import openai
import os
from flask_cors import CORS
from config import GPT_API_KEY

from mockGPT import choose_response, choose_specific_response
import re

class Server:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        self.app.secret_key = os.urandom(24)  # This generates a random 24-byte string
        openai.api_key = GPT_API_KEY

        self.smart_prompt = self.load_prompt()
        self.last_seen_ingredient = ""
        self.general_list = []

        self.app.add_url_rule("/", "home", self.home)
        self.app.add_url_rule("/api/next", "next_prompt", self.next_prompt, methods=["GET"])
        self.app.add_url_rule("/api/prompt", "chat", self.chat, methods=["POST"])
        self.app.add_url_rule("/generate-image", "generate_image", self.generate_image, methods=["POST"])

    def load_prompt(self):
        with open("prompts.json", "r") as file:
            prompts = json.load(file)
        return prompts["recipe_prompt"]

    def home(self):
        return render_template("index.html")

    def next_prompt(self):
        val = self.general_list.pop(0) if len(self.general_list) > 0 else "Looks like you got all the ingredients! Shall we start cookin?"
        self.last_seen_ingredient = val
        print("Returning value: ", val)
        return jsonify({"response": val}), 200

    def chat(self):
        data = request.json
        print(data)
        user_input = data.get("prompt")

        if not user_input:
            return jsonify({"error": "Prompt is required"}), 400

        # stores the conversation history
        if "messages" not in session:
            session["messages"] = [
                {"role": "system", "content": self.smart_prompt},
                {"role": "system", "content": self.last_seen_ingredient}
            ]

        # Add users message to convo
        session["messages"].append({"role": "user", "content": user_input})

        # Check if the prompt is asking for an image (contains image-related keywords)
        image_keywords = [
        "image", "picture", "illustration", "photo", "visual", 
        "drawing", "sketch", "graphic", "artwork", "design", 
        "rendering", "scene", "snapshot", "composition", "depiction",
        "look", "create", "draw", "depict", "illustrate", "paint", "design", "capture", "generate", "build"
        ]
        if any(keyword in user_input.lower() for keyword in image_keywords):
            try:
                # Generate image using the prompt
                response = openai.images.generate(
                    prompt=user_input,
                    n=1,  # Generate 1 image
                    size="512x512"
                )
                # Return the URL of the generated image
                image_url = response.data[0].url
                return jsonify({"image_url": image_url}), 200
            except Exception as e:
                return jsonify({"error": str(e)}), 500

    # Else go for textual information!
        try:
            completion = openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=session["messages"]
            )
            response_message = completion.choices[0].message.content
            print(response_message)
            # response_message = json.loads(response_message)
            # print(response_message)

            # response_message = choose_specific_response(input_type)
            # print(response_message)
            # Add GPT's response to the convo
            session["messages"].append({"role": "assistant", "content": response_message})

            return self.handle_response(response_message)
        except Exception as e:
            print(e)
            return jsonify({"error": str(e)}), 500

    def generate_image(self):
        data = request.json
        prompt = data.get("prompt")

        if not prompt:
            return jsonify({"error": "Prompt is required"}), 400

        try:
            # Generate image using the prompt
            response = openai.images.generate(
                prompt=prompt,
                n=1,  # Generate 1 image
                size="512x512"
            )
            # Return the URL of the generated image
            image_url = response.data[0].url
            return jsonify({"image_url": image_url}), 200
        except Exception as e:
            return jsonify({"error": str(e)}), 500
        
    
    def handle_response(self, response):
        response.replace("'", "\"")
        response = response.strip('```json').strip('```')

        response_json = json.loads(response)
        response_type = response_json["response_type"]
        print("response type:", response_type)
        data = response_json["data"]
        print("response data:", data)
        if response_type == "alternative":
            return self.handle_alternative(data)
        elif response_type == "ideas":
            return self.handle_ideas(data)
        elif response_type == "ingredients":
            return self.handle_ingredients(data)
        elif response_type == "steps":
            return self.handle_steps(data)
        elif response_type == "general":
            return self.handle_general(data)
        else:
            print("Here")
            return jsonify({"response": "Invalid response type"}), 400

    def handle_general(self, data):
        value = data.get("data", list(data.values())[0])
        if not value:
            return jsonify({"response": "I'm not sure what you mean by that."}), 200
        return jsonify({"response": value}), 200

    def handle_alternative(self, data):
        value = data.get("alternative", list(data.values())[0])
        self.last_seen_ingredient = value
        if not value:
            return jsonify({"response": "No alternatives found! You might need to get the item or just skip it!"}), 200
        return jsonify({"response": value, "flag": "alternate"}), 200
    
    def handle_ideas(self, data):
        self.general_list = []
        self.last_seen_ingredient = ""
        for key, value in data.items():
            self.general_list.append(value)

        value = self.general_list.pop(0) if len(self.general_list) > 0 else "None Available"
        return jsonify({"response": value}), 200
    
    def handle_ingredients(self, data):
        self.general_list = []
        self.last_seen_ingredient = ""
        prep_time = data.get("Preparation time")
        ingredients = data.get("Ingredients")
        for key, value in ingredients.items():
            self.general_list.append(key + ": " + value)

        self.last_seen_ingredient = self.general_list.pop(0) if len(self.general_list) > 0 else "No Ingredients"
        return jsonify({"response": prep_time + ", First Ingredient: " + self.last_seen_ingredient}), 200
    
    def handle_steps(self, data):
        self.general_list = []
        self.last_seen_ingredient = ""
        for key, value in data.items():
            self.general_list.append(value)

        first_step = self.general_list.pop(0) if len(self.general_list) > 0 else "No Steps"
        return jsonify({"response": "First step: " + first_step}), 200

    def run(self):
        self.app.run(debug=True)

if __name__ == "__main__":
    server = Server()
    server.run()
