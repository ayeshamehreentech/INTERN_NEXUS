"""Reviewed adaptations of practice notes; never execute the source file."""
def enrich(lessons):
    examples = {
        'W01_PRINT': ('Make Python say hello', 'print("Hello, Python!")\nprint("I am learning one step at a time.")', 'Hello, Python!\nI am learning one step at a time.', ['print() sends a value to the screen. Text belongs inside matching quotes.', 'Each print() ends with a new line by default.'], 'Change the greeting. How many output lines will you see?'),
        'W01_INPUT': ('Text first, numbers second', 'first = "2"  # a sample response from input()\nsecond = "3"\nprint(first + second)\nprint(int(first) + int(second))', '23\n5', ['input() returns text; fixed sample responses let you trace this example.', 'The second response is also text.', '+ joins two strings: "2" followed by "3" becomes "23".', 'int() converts each response before addition. Invalid numeric text raises ValueError.'], 'Predict the result with "10" and "5" before changing the values.'),
        'W01_FSTRINGS': ('A personal greeting', 'guest = "Ayesha"\nprint(f"Hello, {guest}!")', 'Hello, Ayesha!', ['Store a name in guest.', 'The f prefix replaces {guest} with its value.'], 'Remove the f prefix and predict what changes.'),
        'W02_VARIABLES': ('Give a value a useful name', 'score = 10\nscore = score + 5\nprint(score)', '15', ['Bind the name score to 10.', 'Read the old score, add 5, then assign the new value.', 'Display the current value.'], 'Choose descriptive names; avoid list, str, int, and dict.'),
        'W02_FLOAT': ('Convert a temperature', 'celsius = 25.0\nfahrenheit = celsius * 9 / 5 + 32\nprint(fahrenheit)', '77.0', ['25.0 is a float.', 'Multiplication and division happen before addition.', 'Display the converted temperature.'], 'Try 0 degrees Celsius. Predict the Fahrenheit value first.'),
        'W02_BOOL': ('Two conditions for access', 'logged_in = True\npremium = False\nprint(logged_in and premium)', 'False', ['True says the user is signed in.', 'False says the user does not have premium access.', 'and is True only when both conditions are True.'], 'Change premium to True and explain the result.'),
        'W02_SET': ('Remove repeated values', 'numbers = {1, 1, 2, 3}\nprint(len(numbers))\nprint(2 in numbers)', '3\nTrue', ['A set keeps each unique value once.', 'len() counts three unique values.', 'in checks membership without an index.'], 'Sets are unordered. set() creates an empty set; {} creates a dictionary.'),
        'W02_FROZENSET': ('A set you cannot change', 'allowed = frozenset([1, 1, 2])\nprint(len(allowed), 2 in allowed)', '2 True', ['frozenset removes duplicates and prevents adding or removing elements.', 'Count unique values and check membership.'], 'A frozenset is immutable and unordered.'),
        'W02_LIST': ('Keep items in order', 'numbers = [10, 6, 7]\nnumbers.append(2)\nprint(numbers)', '[10, 6, 7, 2]', ['A list preserves item order.', 'append() adds one item at the end and returns None.', 'The original list now has four items.'], 'Add a duplicate number. Lists allow duplicates.'),
        'W02_DICT': ('Look up a score by name', 'scores = {"Ayesha": 90, "Alex": 80}\nprint(scores["Ayesha"])\nprint(scores.get("Sam", 0))', '90\n0', ['A dictionary connects unique keys to values.', 'Square brackets look up an existing key.', 'get() returns the supplied default for an absent key.'], 'Compare a missing-key lookup with get().'),
    }
    examples.update({
        'W04_ARITHMETIC': ('Share a total equally', 'first = 10\nsecond = 6\naverage = (first + second) / 2\nprint(average)', '8.0', ['Store the first number.', 'Store the second number.', 'Parentheses add the numbers first; / divides their sum.', 'Division produces a float here.'], 'Try 10 and 7. Predict the decimal part.'),
        'W04_COMPARISON': ('Compare a score', 'score = 75\nprint(score >= 50)\nprint(score == 100)', 'True\nFalse', ['Store a score.', '>= asks whether the score is at least 50.', '== compares equality; = would assign a value.'], 'Which comparisons change when score is 100?'),
        'W04_LOGICAL': ('Decide whether to travel', 'raining = False\nhas_license = True\nprint(not raining and has_license)', 'True', ['False means it is not raining.', 'True means a license is available.', 'Both not raining and has_license must be True.'], 'Try both flags as False and explain the result.'),
        'W05_IF': ('Run a block when a condition is true', 'age = 20\nif age >= 18:\n    print("Adult")', 'Adult', ['Store an age.', 'A colon starts the conditional block.', 'Indentation makes this print belong to the if block.'], 'Set age to 16. Why is there no output?'),
        'W05_IF_ELSE': ('Choose one of two paths', 'number = 7\nif number % 2 == 0:\n    print("Even")\nelse:\n    print("Odd")', 'Odd', ['Store the number.', '% gives the remainder after division by 2.', 'Run this line only for an even number.', 'else handles a false condition.', '7 has remainder 1, so this line runs.'], 'Try 8 and then 0. Both are even.'),
        'W05_IF_ELIF_ELSE': ('Choose a grade in order', 'marks = 82\nif marks >= 90:\n    print("A")\nelif marks >= 80:\n    print("B")\nelse:\n    print("Keep practicing")', 'B', ['Store the marks.', 'Test the highest threshold first.', 'This branch is skipped for 82.', 'elif tests another condition after the first fails.', 'The first matching branch prints B.', 'else runs when no condition matched.', 'This fallback is skipped here.'], 'Try 95. Why does B not also print?'),
        'W06_FOR_RANGE': ('Count a few steps', 'for step in range(1, 4):\n    print(step)', '1\n2\n3', ['range(1, 4) yields 1, 2, 3; the stop is excluded.', 'The indented print runs once per value.'], 'Change the stop to 5. Predict how many lines print.'),
        'W06_WHILE': ('Repeat until the condition changes', 'count = 1\nwhile count <= 3:\n    print(count)\n    count += 1', '1\n2\n3', ['Start the counter at 1.', 'Check the condition before every iteration.', 'Display the current value.', 'Increment the counter so the loop can finish.'], 'What would happen if you forgot to increment count?'),
    })
    for key, lesson in lessons.items():
        if lesson['world_id'] == 'W07' and 'SLIC' in key:
            examples[key] = ('Take a slice of text', 'text = "Python Programming"\nprint(text[:6])\nprint(text[::-1])', 'Python\ngnimmargorP nohtyP', ['A string is an ordered sequence of characters.', 'Start at 0 and stop before index 6.', 'A step of -1 walks through the string backwards.'], 'Try text[1:5]. The stop index is excluded.')
    for key, (heading, code, output, notes, prompt) in examples.items():
        if key not in lessons: continue
        lesson = lessons[key]
        lesson.update(example_heading=heading, syntax=code,
            worked_examples=[{'code': code, 'output': output}], line_by_line=notes,
            practice_prompt=prompt,
            practice_reference='Adapted from your codewithharry/prctice/1.py notes; reviewed and corrected.',
            source='Learner practice notes, reviewed adaptation: codewithharry/prctice/1.py')
        lesson['visualization_data'] = {'steps': code.splitlines(), 'result': output}
