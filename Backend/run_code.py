
import io
from contextlib import redirect_stdout
from flask import jsonify
import builtins
import json
import ast
import re

JSON_FILE = 'questions.json'

def read_file(json_file): 
    with open(json_file, 'r', encoding='utf-8') as file:
        data = json.load(file)  # Load JSON data
        problems = {}

        for problem in data:
            problem_id = problem["id"]  # Extract problem ID
            
            # Gather all examples into a list
            examples = []
            for key, value in problem.items():
                if key.startswith("exampleInputs"):
                    example_index = key.replace("exampleInputs", "")
                    output_key = f"exampleOutputs{example_index}"
                    examples.append({
                        "input": value,
                        "output": problem.get(output_key, "N/A")
                    })

            # Add the problem to the dictionary
            problems[problem_id] = {
                "title": problem["title"],
                "description": problem["description"],
                "examples": examples  # Store examples as a list
            }

        return problems

problems_dict = read_file(JSON_FILE)



def convert_output(output):
    if output.lower() == "null" or output.lower() == "none":
        return None
    elif output.lower() == "true" or output.lower() == "false":
        return output.lower() == "true"
    try: 
        return int(output)
    except: pass
    try:
        return float(output)
    except: pass
    try:
        return json.loads(output)
    except: pass

def convert_input(input):
    variables = {}
    
    # Regex to match key=value pairs, allowing for lists in values
    pattern = r'(\w+)\s*=\s*(\[.*?\]|[^,]+)'
    matches = re.findall(pattern, input)
    
    for key, value in matches:
        key = key.strip()
        value = value.strip()
        variables[key] = convert_output(value)
    
    return variables


def execute_code(problem_id, code):
    # Get the problem title and create the function name
    problem_title = problems_dict[problem_id]['title']
    function_name = problem_title.split('. ')[1].replace(' ', '')
    function_name = function_name[0].lower() + function_name[1:]  # camelCase

    # Add print statement to the code
    code_with_print = code + f"\nprint({function_name}(nums, target))"

    for example in problems_dict[problem_id]['examples']:
        print("Cur prob: ", problems_dict[problem_id])
        input_params = convert_input(example['input'])
        print("input params: ", input_params)
        output_params = convert_output(example['output'])
        print("output params: ", output_params)
        
        output = io.StringIO()
        with redirect_stdout(output):
            try:
                exec(code_with_print, {'builtins': builtins}, input_params)
            except Exception:
                print("Exception: ", output.getvalue())
                return False
        
        print("End of execute, false: ", output.getvalue())
        if output.getvalue().strip() != str(output_params):
            return False

    return True

    
print(len(problems_dict))
