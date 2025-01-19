from flask import Flask, render_template, request, jsonify, session
import json
from mockGPT import choose_response, choose_specific_response


def handle_response(response):
    response_type = response["response_type"]
    data = response["data"]
    if response_type == "alternatives":
        return handle_alternatives(data)
    elif response_type == "ideas":
        return handle_ideas(data)
    elif response_type == "ingredients":
        return handle_ingredients(data)
    elif response_type == "steps":
        return handle_steps(data)
    else:
        return jsonify({"response": "Invalid response type"}), 400


def handle_alternatives(data):
    return jsonify({"response": list(data.values())[0] if len(data) > 0 else "No Alternatives"}), 200

def handle_ideas(data):
    for key, value in data.items():
        idea_list.append(value)
    return jsonify({"response": idea_list[0]}), 200

def handle_ingredients(data):
    return jsonify({"response": list(data.values())[0] if len(data) > 0 else "No Ingredients"}), 200

def handle_steps(data):
    return jsonify({"response": list(data.values())[0] if len(data) > 0 else "No Steps"}), 200

def test():
    response = choose_response()
    print(response)
    handle_response(response)

if __name__ == "__main__":
    test()