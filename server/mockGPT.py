import json
import random

# Load JSON files
with open('json_responses/alternative.json') as f:
    alternative = json.load(f)

with open('json_responses/ideas.json') as f:
    ideas = json.load(f)

with open('json_responses/ingredients.json') as f:
    ingredients = json.load(f)

with open('json_responses/steps.json') as f:
    steps = json.load(f)

# Print loaded JSON data (optional)
# print(alternatives)
# print(ideas)
# print(ingredients)
# print(steps)

def choose_response():
    responses = [alternative, ideas, ingredients, steps]
    return random.choice(responses)

def choose_specific_response(value):
    if value == "alternative":
        return alternative
    elif value == "ideas":
        return ideas
    elif value == "ingredients":
        return ingredients
    elif value == "steps":
        return steps
    else:
        return "Invalid value"