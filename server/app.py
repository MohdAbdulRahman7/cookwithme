from flask import Flask, render_template
import json
import openai
from openai import OpenAI

from config import GPT_API_KEY

app = Flask(__name__)

openai.api_key = GPT_API_KEY

# Default Router
@app.route("/")
def home():
    return render_template("index.html")

def load_prompt():
    with open("prompts.json", "r") as file:
        prompts = json.load(file)
    return prompts["recipe_prompt"]

smart_prompt = load_prompt()

print(smart_prompt)

# POST API -- Text - Image
@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_input = data.get("prompt")

    if not user_input:
        return jsonify({"error": "Prompt is required"}), 400

    # stores the conversation history
    if "messages" not in session:
        session["messages"] = [
            {"role": "system", "content": smart_prompt}
        ]

    # Add users message to convo
    session["messages"].append({"role": "user", "content": user_input})

    try:
        completion = openai.chat.completions.create(
            model="gpt-4o-mini",
            messages=session["messages"]
        )
        response_message = completion.choices[0].message["content"]

        # Add GPT's response to the convo
        session["messages"].append({"role": "assistant", "content": response_message})

        return jsonify({"response": response_message}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# POST API -- Text - Image
@app.route("/generate-image", methods=["POST"])
def generate_image():
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



if __name__ == "__main__":
    app.run(debug=True)
