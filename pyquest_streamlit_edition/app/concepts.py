"""Static teaching content keyed to the unchanged canonical curriculum."""
from app.catalog import TOPICS

LESSONS = {}

def add(key, definition, code, output, mistake, takeaway, visual='trace'):
    topic = TOPICS[key]
    LESSONS[key] = dict(world_id=topic['world_id'], subtopic_id=key,
        title=topic['name'], learning_objective='Use ' + topic['name'] + ' in a small Python program.',
        simple_explanation=definition, why_it_matters=takeaway, syntax=code,
        worked_examples=[dict(code=code, output=output)], visualization_type=visual,
        visualization_data=dict(steps=code.splitlines(), result=output),
        comparison_table=[], common_mistakes=[mistake], remember=[takeaway],
        practice_prompt='Predict the output, then change one value and explain what changes.',
        version=1, source='Newly authored; canonical catalog objectives. No external reference files supplied.')

def group(world, entries, visual='trace'):
    for suffix, values in entries.items():
        add(world+'_'+suffix, *values, visual=visual)

group('W01', {
 'PRINT': ('print() writes values to standard output; sep joins values and end finishes the line.', 'print("Hello", "Python", sep=" / ")', 'Hello / Python', 'Quoted text is a literal; an unquoted name must already exist.', 'Use print() to inspect a program’s values.'),
 'INPUT': ('input() reads a line and returns text, even when the user types digits.', 'age_text = "21"  # example response from input("Age: ")\nage = int(age_text)\nprint(age + 1)', '22', 'Adding an integer to input text raises TypeError; convert and validate first.', 'Convert text only when the program needs a numeric value.'),
 'FSTRINGS': ('An f-string evaluates expressions inside braces and inserts formatted values.', 'name = "Alex"\nprint(f"Hello, {name}! {3.14159:.2f}")', 'Hello, Alex! 3.14', 'Without the f prefix, braces remain ordinary text.', 'Format values without manually concatenating conversions.')})

group('W02', {
 'VARIABLES': ('Assignment binds a name to an object. Reassignment changes that binding.', 'score = 10\nscore = score + 5\nprint(score)', '15', 'Use == to compare; = assigns. Avoid naming variables list, dict, or str.', 'Names describe values; Python values carry types.'),
 'INT': ('int represents whole numbers with arbitrary precision, limited by memory.', 'count = 7\nprint(count // 2, count % 2)', '3 1', '/ produces a float; // performs floor division.', 'Use integers for exact counts.'),
 'FLOAT': ('float approximates real numbers using binary floating point.', 'price = 2.5\nprint(price * 2)', '5.0', 'Many decimal fractions are approximate; do not expect 0.1 + 0.2 == 0.3.', 'Use formatting for display and tolerances for approximate comparisons.'),
 'COMPLEX': ('complex stores real and imaginary components; Python uses j for the imaginary unit.', 'value = 2 + 3j\nprint(value.real, value.imag)', '2.0 3.0', 'Complex values cannot be ordered with < or >.', 'Use .real and .imag to inspect components.'),
 'STR': ('str is an immutable sequence of Unicode characters.', 'text = "Python"\nprint(text[0], len(text))', 'P 6', 'Assigning text[0] fails because strings are immutable.', 'Create a new string when changing text.'),
 'LIST': ('list is an ordered, mutable sequence that allows duplicates.', 'items = [1, 1]\nitems.append(2)\nprint(items)', '[1, 1, 2]', 'append() changes the list and returns None.', 'Lists suit collections that grow or change.'),
 'TUPLE': ('tuple is an ordered, immutable sequence; duplicates are allowed.', 'pair = (2, 2)\nprint(pair[0], len(pair))', '2 2', 'A one-item tuple needs a comma. A tuple is hashable only when every element is hashable.', 'Use tuples for fixed groups of values.'),
 'RANGE': ('range is an immutable, memory-efficient arithmetic sequence; its stop is excluded.', 'print(list(range(1, 6, 2)))', '[1, 3, 5]', 'range(5) ends at 4, not 5.', 'Describe integer iteration without storing every number.'),
 'DICT': ('dict maps unique hashable keys to values and preserves insertion order.', 'scores = {"Alex": 8}\nscores["Sam"] = 9\nprint(scores["Alex"])', '8', 'Missing keys raise KeyError; use get() when absence is expected.', 'Look up values by meaningful keys.'),
 'SET': ('set is a mutable, unordered collection of unique hashable elements.', 'values = {1, 1, 2}\nprint(len(values), 2 in values)', '2 True', 'Sets have no positional indexing; {} creates a dictionary.', 'Use sets for membership and removing duplicates.'),
 'FROZENSET': ('frozenset is an immutable, unordered collection of unique hashable elements.', 'values = frozenset([1, 1, 2])\nprint(len(values), 2 in values)', '2 True', 'A frozenset has neither positional indexing nor add().', 'A frozenset can be a dictionary key.'),
 'BOOL': ('bool represents True or False; conditions use truth testing.', 'print(bool(0), bool("False"))', 'False True', 'The nonempty string "False" is truthy.', 'Empty collections, zero, and None are falsy.'),
 'BYTES': ('bytes is an immutable sequence of byte values from 0 to 255.', 'data = b"ABC"\nprint(data[0], data.decode("utf-8"))', '65 ABC', 'Indexing bytes returns an integer, not a one-character string.', 'Encode text to bytes; decode bytes to text.'),
 'BYTEARRAY': ('bytearray is a mutable sequence of bytes.', 'data = bytearray(b"ABC")\ndata[0] = 90\nprint(bytes(data))', "b'ZBC'", 'Every stored integer must be between 0 and 255.', 'Use bytearray to edit binary data.'),
 'MEMORYVIEW': ('memoryview exposes a buffer without copying its data.', 'data = bytearray(b"ABC")\nview = memoryview(data)\nview[0] = 90\nprint(bytes(data))', "b'ZBC'", 'A view of immutable bytes is read-only.', 'A writable view changes the underlying buffer.'),
 'NONE': ('None is the singleton value used to represent absence; its type is NoneType.', 'result = None\nprint(result is None)', 'True', 'None is not the same value as 0, False, or an empty string.', 'Use is None when checking for absence.')}, 'types')

group('W03', {
 'NAMING_CONVENTIONS': ('Use snake_case for variables and functions, CapWords for classes, and UPPER_CASE for constants.', 'student_score = 12\nprint(student_score)', '12', 'Style conventions improve readability but do not change execution.', 'Choose consistent names that explain intent.'),
 'VALID_IDENTIFIERS': ('Identifiers may contain letters, underscores, and digits, but cannot start with a digit or be keywords.', 'score_2 = 7\nprint(score_2)', '7', 'Spaces and hyphens cannot appear inside a variable identifier.', 'Prefer simple descriptive identifiers.'),
 'INVALID_IDENTIFIERS': ('Invalid identifiers violate naming grammar or use reserved keywords.', 'print("2score".isidentifier(), "score_2".isidentifier())', 'False True', 'isidentifier() alone does not reject keywords; check keyword.iskeyword() too.', 'Validate both identifier grammar and reserved words.'),
 'KEYWORDS': ('Keywords such as if, for, and class are reserved syntax.', 'import keyword\nprint(keyword.iskeyword("class"), keyword.iskeyword("score"))', 'True False', 'Do not use reserved words as variable names.', 'Keywords express Python’s language structure.'),
 'CASE_SENSITIVITY': ('Python identifiers are case-sensitive: score and Score are different names.', 'score = 1\nScore = 2\nprint(score, Score)', '1 2', 'A capitalization typo may cause NameError.', 'Use consistent capitalization.'),
 'MEANINGFUL_NAMES': ('A meaningful name communicates a value’s role and units.', 'distance_km = 12\nhours = 3\nprint(distance_km / hours)', '4.0', 'A name such as x hides intent when the program grows.', 'Include units when they prevent ambiguity.'),
 'TYPE_CASTING': ('Conversion constructs a value of another type when the input supports it.', 'text = "12"\nprint(int(text) + 3)', '15', 'Conversion is not validation; unsupported text raises an exception.', 'Convert at input boundaries.'),
 'INT_CONVERSION': ('int() parses whole-number text or truncates a finite float toward zero.', 'print(int("12"), int(-2.9))', '12 -2', 'int("2.9") raises ValueError; truncation differs from floor.', 'Check the input format before conversion.'),
 'FLOAT_CONVERSION': ('float() parses numeric text or converts a number to a floating-point approximation.', 'print(float("2.5") + 1)', '3.5', 'float() does not make decimal arithmetic exact.', 'Use float for approximate measurements.'),
 'STR_CONVERSION': ('str() creates a readable textual representation of a value.', 'print("Score: " + str(8))', 'Score: 8', 'str(bytes_value) is a representation, not decoded text.', 'Use decode() when converting encoded bytes to text.'),
 'BOOL_CONVERSION': ('bool() applies Python truth rules to a value.', 'print(bool([]), bool([0]), bool(""))', 'False True False', 'Nonempty collections remain truthy even if their elements are falsy.', 'Truth testing checks the container itself.'),
 'CONVERSION_ERRORS': ('Handle ValueError when text has the wrong numeric format, and TypeError for unsupported input types.', 'try:\n    number = int("hello")\nexcept ValueError:\n    print("Enter a whole number")', 'Enter a whole number', 'Do not hide every error with a bare except. ast.literal_eval() is not risk-free for arbitrary untrusted inputs.', 'Catch specific expected exceptions.')})

group('W04', {
 'ASSIGNMENT': ('= binds a value; augmented assignment combines an operation with assignment.', 'score = 5\nscore += 2\nprint(score)', '7', 'Assignment is different from equality comparison.', 'Track state changes explicitly.'),
 'ARITHMETIC': ('Arithmetic operators include +, -, *, /, //, %, and **.', 'print(7 / 2, 7 // 2, 7 % 2, 2 ** 3)', '3.5 3 1 8', '// floors toward negative infinity; division by zero fails.', 'Choose the operation that matches your numeric intent.'),
 'COMPARISON': ('Comparisons test relationships and return booleans; comparisons can be chained.', 'age = 18\nprint(16 <= age < 21)', 'True', 'Use == for equality; = assigns.', 'Chained comparisons express bounded intervals.'),
 'LOGICAL': ('and, or, and not combine truth tests; and/or short-circuit and return operands.', 'print(True and False, not False, "" or "fallback")', 'False True fallback', 'Bitwise & and | are not replacements for logical and/or.', 'The right operand may not be evaluated.'),
 'IDENTITY': ('is checks whether two names refer to the same object, rather than equal values.', 'first = [1]\nsecond = [1]\nprint(first == second, first is second)', 'True False', 'Do not use is to compare strings or numbers by value.', 'Use == for value equality and is None for absence.'),
 'PRECEDENCE': ('Precedence determines grouping; parentheses make the intended order explicit.', 'print(2 + 3 * 4, (2 + 3) * 4)', '14 20', 'Evaluation does not always proceed strictly left to right.', 'Use parentheses when grouping is important.'),
 'MEMBERSHIP': ('in and not in test whether an element belongs to a container; dictionary membership checks keys.', 'print("a" in "cat", "age" in {"age": 20})', 'True True', 'in tests membership; is tests identity.', 'Membership avoids manual searching for simple checks.')}, 'operators')

for key, topic in TOPICS.items():
    if topic['world_id'] == 'W05':
        suffix=key[4:]
        variants={
          'IF': ('if score >= 5:\n    print("Pass")', 'Pass'),
          'IF_ELSE': ('if score >= 5:\n    print("Pass")\nelse:\n    print("Retry")', 'Pass'),
          'IF_ELIF_ELSE': ('if score >= 9:\n    print("Excellent")\nelif score >= 5:\n    print("Pass")\nelse:\n    print("Retry")', 'Pass'),
          'LADDER_IF': ('if score >= 5:\n    print("Pass")\nif score >= 7:\n    print("Strong")', 'Pass\nStrong'),
          'NESTED_IF': ('if score >= 5:\n    if score >= 7:\n        print("Strong pass")', 'Strong pass'),
          'NESTED_IF_ELSE': ('if score >= 5:\n    if score >= 9:\n        print("Excellent")\n    else:\n        print("Pass")\nelse:\n    print("Retry")', 'Pass'),
          'MULTIPLE_CONDITIONS': ('if score >= 5 and score <= 10:\n    print("Valid pass")', 'Valid pass')}
        code,out=variants[suffix]
        add(key, 'Conditions choose which indented block runs. An if/elif chain selects the first true branch; separate if statements can each run.', 'score = 7\n'+code, out, 'Indentation defines blocks. Put narrower tests before broader ones in an elif chain.', 'Trace each condition in order before predicting output.', 'decision')

group('W06', {
 'FOR': ('for visits each item of an iterable.', 'for item in ["a", "b"]:\n    print(item)', 'a\nb', 'Changing the collection while iterating can skip or repeat work.', 'Use for when you have a sequence of items.'),
 'RANGE': ('range(start, stop, step) describes integer positions, excluding stop.', 'print(list(range(5, 0, -2)))', '[5, 3, 1]', 'A zero step is invalid; direction must match the bounds.', 'Use a negative step to count down.'),
 'FOR_RANGE': ('Combine for and range to repeat a block a known number of times.', 'for index in range(3):\n    print(index)', '0\n1\n2', 'The final value is stop minus one for positive unit steps.', 'Count iterations using the generated positions.'),
 'WHILE': ('while repeats a block while its condition is truthy.', 'count = 0\nwhile count < 3:\n    print(count)\n    count += 1', '0\n1\n2', 'Forgetting the state update can create an infinite loop.', 'Ensure the condition eventually becomes false.'),
 'NESTED_LOOPS': ('An inner loop runs for each iteration of the outer loop.', 'for row in range(2):\n    for col in range(2):\n        print(row, col)', '0 0\n0 1\n1 0\n1 1', 'Two n-sized loops usually perform n squared iterations.', 'Trace row and column coordinates together.'),
 'BREAK': ('break exits the nearest enclosing loop immediately.', 'for value in range(5):\n    if value == 2:\n        break\n    print(value)', '0\n1', 'break does not exit every surrounding nested loop.', 'Use break when further searching is unnecessary.'),
 'CONTINUE': ('continue skips the remainder of the current loop iteration.', 'for value in range(3):\n    if value == 1:\n        continue\n    print(value)', '0\n2', 'continue does not end the loop.', 'Skip unwanted items without stopping the sequence.'),
 'BREAK_WHILE': ('break can stop a while loop before its condition becomes false.', 'value = 0\nwhile value < 5:\n    if value == 2:\n        break\n    print(value)\n    value += 1', '0\n1', 'Keep exit conditions visible to avoid accidental infinite loops.', 'Use an explicit early exit for a sentinel or match.'),
 'CONTINUE_FOR': ('In a for loop, continue advances to the next iterable item.', 'for value in range(4):\n    if value % 2:\n        continue\n    print(value)', '0\n2', 'Statements after continue do not run in that iteration.', 'Filter iteration with an explicit condition.'),
 'CONTINUE_WHILE': ('In while, continue retests the condition; update state before skipping.', 'value = 0\nwhile value < 3:\n    value += 1\n    if value == 2:\n        continue\n    print(value)', '1\n3', 'A skipped increment may make the loop run forever.', 'Every path must make progress toward termination.')}, 'loop')

group('W07', {
 'INTRODUCTION': ('Strings store immutable Unicode text.', 'text = "Python"\nprint(text.upper())', 'PYTHON', 'String methods return new strings rather than changing the original.', 'Keep the returned value when transforming text.'),
 'SINGLE_LINE': ('A single-line string uses matching single or double quotes.', 'text = "Hello"\nprint(text)', 'Hello', 'An unescaped newline cannot occur inside ordinary single-line quotes.', 'Use matching delimiters.'),
 'MULTILINE': ('Triple-quoted strings can contain actual newline characters.', 'text = """Hello\nPython"""\nprint(text)', 'Hello\nPython', 'Indentation inside the quotes becomes part of the string.', 'Use triple quotes for text spanning lines.'),
 'SINGLE_QUOTES': ('Single quotes delimit strings; escape an embedded matching quote.', 'text = \'It\\\'s Python\'\nprint(text)', "It's Python", 'An unescaped matching quote closes the string.', 'Choose delimiters that minimize escaping.'),
 'DOUBLE_QUOTES': ('Double quotes allow single quotes inside without escaping.', 'print("It\'s Python")', "It's Python", 'Single and double quotes have the same string semantics.', 'Quote style is a readability choice.'),
 'TRIPLE_QUOTES': ('Triple quotes delimit multiline text and are also used for docstrings.', 'text = """First\nSecond"""\nprint(text)', 'First\nSecond', 'Triple-quoted text is a string, not a general comment syntax.', 'Docstrings document modules, classes, and functions.'),
 'ACCESS_CHARACTERS': ('Use text[index] to retrieve one character at a position.', 'text = "Python"\nprint(text[1])', 'y', 'An out-of-range index raises IndexError.', 'Check bounds when positions come from input.'),
 'POSITIVE_INDEXING': ('Positive indexes start at zero at the left edge.', 'text = "Python"\nprint(text[0], text[5])', 'P n', 'The last positive index is len(text) - 1.', 'Count positions from zero.'),
 'NEGATIVE_INDEXING': ('Negative indexes count from the right; -1 is the last character.', 'text = "Python"\nprint(text[-1], text[-2])', 'n o', '-0 is the same as 0, not the last position.', 'Use negative indexes to refer to the end.'),
 'SLICING': ('text[start:stop] selects characters from start up to, but excluding, stop.', 'text = "Python"\nprint(text[1:4])', 'yth', 'The stop position is excluded. Slices tolerate bounds beyond the string.', 'A slice describes a half-open interval.'),
 'STEP_SLICING': ('text[start:stop:step] selects spaced positions; a negative step reverses direction.', 'text = "Python"\nprint(text[::2], text[::-1])', 'Pto nohtyP', 'A slice step of zero raises ValueError.', 'Use [::-1] for a reversed copy.'),
 'CONCATENATION': ('+ joins strings into a new string.', 'print("Py" + "thon")', 'Python', 'Concatenating a string and integer requires converting the integer.', 'Use join() for many pieces.'),
 'REPETITION': ('Multiplying a string by an integer repeats it.', 'print("ha" * 3)', 'hahaha', 'A float cannot be the repetition count.', 'Repetition returns new text.'),
 'LENGTH': ('len() counts Unicode code points in a Python string.', 'print(len("Python"))', '6', 'User-visible characters can contain multiple code points.', 'Length measures sequence elements.'),
 'ESCAPE_SEQUENCES': ('Backslash escapes represent special characters such as newline and tab.', 'print("Hello\\nPython")', 'Hello\nPython', 'A backslash can change the meaning of the next character.', 'Distinguish source notation from the resulting text.'),
 'RAW_STRINGS': ('An r prefix treats backslashes literally in most situations.', 'print(r"C:\\temp")', 'C:\\temp', 'A raw string cannot end with an odd number of backslashes.', 'Raw strings help express paths and regular expressions.'),
 'PERCENT_FORMATTING': ('The % operator can substitute values into older-style format strings.', 'print("%s: %d" % ("Score", 8))', 'Score: 8', 'The number and type of placeholders must match values.', 'Recognize percent formatting when reading older code.'),
 'FORMAT_METHOD': ('str.format() substitutes arguments into brace placeholders.', 'print("{}: {:.1f}".format("Score", 8.25))', 'Score: 8.2', 'Missing arguments or malformed format fields raise errors.', 'Use named fields to clarify repeated values.'),
 'FSTRING_FORMATTING': ('f-strings support expressions and format specifications after a colon.', 'score = 8.25\nprint(f"Score: {score:.1f}")', 'Score: 8.2', 'Formatted rounding reflects floating-point values and ties-to-even rules.', 'Format at the display boundary.')}, 'strings')

group('W08', {
 'LISTS': ('Lists preserve order and allow mutation and duplicates.', 'values = [3, 1, 3]\nvalues.append(2)\nprint(values)', '[3, 1, 3, 2]', 'sort() changes a list in place and returns None.', 'Use sorted() when you need a new sorted collection.'),
 'TUPLES': ('Tuples preserve order and duplicates but their element bindings cannot be changed.', 'point = (2, 3)\nx, y = point\nprint(x + y)', '5', 'A tuple containing a list is not hashable; contained mutable objects can still change.', 'Use tuples for fixed records.'),
 'SETS': ('Sets store unique hashable items without a positional order.', 'left = {1, 2}\nright = {2, 3}\nprint(sorted(left | right), sorted(left & right))', '[1, 2, 3] [2]', 'Do not rely on set display order.', 'Union combines membership; intersection finds common items.'),
 'DICTIONARIES': ('Dictionaries associate unique hashable keys with values in insertion order.', 'person = {"name": "Alex"}\nprint(person.get("age", "unknown"))', 'unknown', 'Iterating a dictionary yields keys unless you use values() or items().', 'Use get() for optional data.'),
 'DATA_OPERATIONS': ('Choose an operation according to collection semantics: append, membership, lookup, or transformation.', 'values = [3, 1, 3]\nprint(sorted(set(values)))', '[1, 3]', 'Deduplicating with a set loses the original positional ordering.', 'Check whether order and duplicates matter.')}, 'types')

group('W09', {
 'STACK': ('A stack removes the most recently added item first: last in, first out.', 'stack = []\nstack.append("A")\nstack.append("B")\nprint(stack.pop())', 'B', 'Popping an empty stack raises IndexError.', 'Use append() and pop() at the same end.'),
 'QUEUE': ('A queue removes the oldest item first: first in, first out.', 'from collections import deque\nqueue = deque(["A", "B"])\nqueue.append("C")\nprint(queue.popleft())', 'A', 'list.pop(0) shifts remaining items and costs linear time.', 'deque supports efficient operations at both ends.'),
 'CIRCULAR_QUEUE': ('A circular queue wraps indexes around a fixed buffer using modulo; track size to distinguish full and empty.', 'capacity = 3\nindex = 2\nprint((index + 1) % capacity)', '0', 'Overwriting a full queue silently loses data unless explicitly intended.', 'Modulo maps the next position back into the buffer.'),
 'LINKED_LIST': ('A linked list stores nodes with values and references to the next node.', 'head = {"value": 1, "next": {"value": 2, "next": None}}\nnode = head\nwhile node is not None:\n    print(node["value"])\n    node = node["next"]', '1\n2', 'Failing to advance the node creates an infinite traversal.', 'Traversal follows references rather than numeric indexes.'),
 'APPLICATIONS': ('Linked structures represent chains such as navigation history; queues and stacks support distinct processing orders.', 'nodes = {"start": "middle", "middle": "end", "end": None}\ncurrent = "start"\nwhile current is not None:\n    print(current)\n    current = nodes[current]', 'start\nmiddle\nend', 'Cycles require detection or traversal can run forever.', 'Choose the structure that matches the processing order.')}, 'structure')

group('W10', {
 'BUBBLE_SORT': ('Bubble sort repeatedly swaps adjacent out-of-order values; larger values move right.', 'values = [3, 1, 2]\nfor end in range(len(values) - 1, 0, -1):\n    for index in range(end):\n        if values[index] > values[index + 1]:\n            values[index], values[index + 1] = values[index + 1], values[index]\nprint(values)', '[1, 2, 3]', 'One pass does not necessarily sort the entire list.', 'Typical time is quadratic; an early-exit variant can improve the best case.'),
 'SELECTION_SORT': ('Selection sort finds the smallest remaining value and moves it into the next position.', 'values = [3, 1, 2]\nfor index in range(len(values)):\n    smallest = min(range(index, len(values)), key=values.__getitem__)\n    values[index], values[smallest] = values[smallest], values[index]\nprint(values)', '[1, 2, 3]', 'The standard swapping variant is not stable.', 'Selection sort makes quadratic comparisons with few swaps.'),
 'INSERTION_SORT': ('Insertion sort expands a sorted prefix by inserting each next value into its position.', 'values = [3, 1, 2]\nfor index in range(1, len(values)):\n    value = values[index]\n    position = index\n    while position > 0 and values[position - 1] > value:\n        values[position] = values[position - 1]\n        position -= 1\n    values[position] = value\nprint(values)', '[1, 2, 3]', 'Save the current value before shifting elements.', 'Insertion sort is useful for small or nearly sorted inputs.'),
 'COMPARE_ALGORITHMS': ('Compare sorting by time, space, stability, and whether the original collection changes.', 'values = [3, 1, 2]\nprint(sorted(values), values)', '[1, 2, 3] [3, 1, 2]', 'sorted() returns a new list; list.sort() mutates and returns None.', 'Python’s built-in sorting is stable and usually preferable.'),
 'TIME_COMPLEXITY': ('Complexity describes how work grows with input size, rather than exact elapsed time.', 'for size in [2, 4, 8]:\n    print(size, size * size)', '2 4\n4 16\n8 64', 'Doubling n roughly quadruples quadratic work; Big O is not a stopwatch.', 'Reason about the dominant growth term.'),
 'REAL_WORLD_USES': ('Sorting by a key organizes records without comparing entire records.', 'records = [("Alex", 8), ("Sam", 5)]\nprint(sorted(records, key=lambda record: record[1]))', "[('Sam', 5), ('Alex', 8)]", 'A key function should return comparable values.', 'Use a key to express the ordering rule.')}, 'algorithm')

group('W11', {
 'LINEAR_SEARCH': ('Linear search checks values one by one and works on unsorted sequences.', 'values = [4, 2, 7]\nfor index, value in enumerate(values):\n    if value == 7:\n        print(index)\n        break', '2', 'Handle the not-found case separately.', 'Worst-case work is linear in the sequence length.'),
 'BINARY_SEARCH': ('Binary search repeatedly halves a sorted search interval.', 'from bisect import bisect_left\nvalues = [1, 3, 5, 7]\nposition = bisect_left(values, 5)\nprint(position, position < len(values) and values[position] == 5)', '2 True', 'Binary search requires sorted data and an insertion position is not proof of a match.', 'Check the value at the returned position.'),
 'SEARCH_IN_ARRAYS': ('Search a sequence by value or by a condition; enumerate provides positions.', 'values = [2, 4, 6]\nprint(next((i for i, value in enumerate(values) if value > 3), -1))', '1', 'A default prevents StopIteration when no match exists.', 'Define the match condition before choosing a search.'),
 'SEARCH_IN_LISTS': ('Membership checks existence; index() retrieves the first matching position.', 'values = [2, 4, 4]\nprint(4 in values, values.index(4))', 'True 1', 'index() raises ValueError if the value is absent.', 'Duplicates mean a first position is only one possible match.'),
 'EFFICIENCY': ('Linear search is O(n); binary search on a sorted random-access sequence is O(log n). Sorting first has a cost.', 'print([2 ** step for step in range(5)])', '[1, 2, 4, 8, 16]', 'Do not ignore sorting cost when searching only once.', 'Repeated queries can justify preprocessing.'),
 'PROBLEM_SOLVING': ('State the target, constraints, and not-found behavior before implementing search.', 'records = [{"id": 1}, {"id": 2}]\nmatch = next((record for record in records if record["id"] == 2), None)\nprint(match)', "{'id': 2}", 'Returning None needs a caller-side absence check.', 'Test first, last, absent, and duplicate matches.')}, 'algorithm')

group('W12', {
 'FUNCTIONS': ('A function groups reusable behavior with parameters and an optional return value.', 'def double(value):\n    return value * 2\nprint(double(4))', '8', 'Printing a result is different from returning it; missing return produces None.', 'Separate calculation from display.'),
 'RECURSIVE_FUNCTIONS': ('Recursion solves a problem using smaller instances of the same function and a terminating base case.', 'def factorial(number):\n    if number <= 1:\n        return 1\n    return number * factorial(number - 1)\nprint(factorial(4))', '24', 'Validate nonnegative inputs; missing a base case can exceed the recursion limit.', 'Each call must move closer to the base case.'),
 'LAMBDA_FUNCTIONS': ('lambda creates a small function with one expression.', 'double = lambda value: value * 2\nprint(double(4))', '8', 'A lambda cannot contain statement blocks.', 'Use def when a function needs more explanation.'),
 'CLOSURES': ('A closure retains access to names in its enclosing function scope.', 'def multiplier(factor):\n    def apply(value):\n        return value * factor\n    return apply\nprint(multiplier(3)(4))', '12', 'Loop-created closures can share a changing binding unless you capture a value deliberately.', 'Closures let functions retain configuration.'),
 'DECORATORS': ('A decorator wraps or transforms a function when it is defined.', 'from functools import wraps\ndef twice(function):\n    @wraps(function)\n    def wrapper(value):\n        return function(value) * 2\n    return wrapper\n@twice\ndef increment(value):\n    return value + 1\nprint(increment(3))', '8', 'Return the wrapper rather than calling it during decoration.', 'Use wraps() to preserve function metadata.'),
 'GENERATORS': ('yield creates a lazy iterator that pauses between produced values.', 'def numbers():\n    for value in range(3):\n        yield value\nitems = numbers()\nprint(list(items), list(items))', '[0, 1, 2] []', 'A consumed generator does not restart automatically.', 'Generators produce values incrementally.')}, 'function')

group('W13', {
 'CLASSES_AND_OBJECTS': ('A class defines behavior; instances hold their own state.', 'class Counter:\n    def __init__(self):\n        self.value = 0\n    def increment(self):\n        self.value += 1\ncounter = Counter()\ncounter.increment()\nprint(counter.value)', '1', 'Instance methods need self to access instance state.', 'Keep related data and behavior together.'),
 'INHERITANCE': ('Inheritance lets a subclass reuse and specialize a parent class.', 'class Animal:\n    def speak(self):\n        return "sound"\nclass Dog(Animal):\n    def speak(self):\n        return "woof"\nprint(Dog().speak())', 'woof', 'Inheritance should model a meaningful is-a relationship.', 'Override behavior while respecting the parent contract.'),
 'POLYMORPHISM': ('Different objects can support the same operation with different implementations.', 'class Cat:\n    def speak(self):\n        return "meow"\nclass Dog:\n    def speak(self):\n        return "woof"\nfor animal in [Cat(), Dog()]:\n    print(animal.speak())', 'meow\nwoof', 'Sharing a method name is useful only when the behavior follows a compatible contract.', 'Program against supported behavior.'),
 'ENCAPSULATION': ('Encapsulation manages state through a defined interface; underscore names signal internal details by convention.', 'class Wallet:\n    def __init__(self):\n        self._balance = 0\n    def deposit(self, amount):\n        if amount < 0:\n            raise ValueError("negative deposit")\n        self._balance += amount\nwallet = Wallet()\nwallet.deposit(5)\nprint(wallet._balance)', '5', 'An underscore does not enforce security or prevent access.', 'Validate changes at the object interface.'),
 'ABSTRACTION': ('Abstraction exposes useful operations while hiding implementation details.', 'from abc import ABC, abstractmethod\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\nclass Square(Shape):\n    def area(self):\n        return 4\nprint(Square().area())', '4', 'Abstract classes cannot be instantiated until abstract methods are implemented.', 'Define the contract that implementations must satisfy.')}, 'function')

group('W14', {
 'MINI_PROJECTS': ('A mini project combines a small input, a transformation, and a visible output.', 'expenses = [12, 8, 5]\nprint("Total:", sum(expenses))', 'Total: 25', 'Keep the first version small enough to test completely.', 'Build one useful end-to-end behavior first.'),
 'PROBLEM_SOLVING': ('Decompose a requirement into inputs, rules, outputs, and edge cases.', 'def is_leap(year):\n    return year % 400 == 0 or (year % 4 == 0 and year % 100 != 0)\nprint(is_leap(1900), is_leap(2000))', 'False True', 'Divisibility by 4 alone is not a correct leap-year rule.', 'Turn edge cases into explicit checks.'),
 'REAL_WORLD_CHALLENGES': ('Real inputs may be missing or malformed; validate them at the boundary.', 'text = "12"\ntry:\n    quantity = int(text)\n    print(max(quantity, 0))\nexcept ValueError:\n    print("Invalid quantity")', '12', 'A successful conversion does not guarantee the value satisfies business rules.', 'Validate format and meaning separately.'),
 'COMBINE_CONCEPTS': ('Combine functions, loops, and collections around a clear data flow.', 'def total_even(values):\n    return sum(value for value in values if value % 2 == 0)\nprint(total_even([1, 2, 3, 4]))', '6', 'Avoid mixing unrelated responsibilities in one function.', 'Keep transformations small and composable.'),
 'BUILD_AND_PRESENT': ('Build and improve a project by demonstrating behavior with concrete expected results.', 'def total(values):\n    return sum(values)\nassert total([]) == 0\nassert total([2, 3]) == 5\nprint("Checks passed")', 'Checks passed', 'Assertions alone are not a substitute for input validation.', 'Explain the problem, show the behavior, and document limitations.'),
 'PYTHON_CAPSTONE': ('A capstone connects data modeling, calculations, and presentation in a coherent program.', 'def summary(records):\n    return {"count": len(records), "total": sum(record["amount"] for record in records)}\nprint(summary([{"amount": 3}, {"amount": 7}]))', "{'count': 2, 'total': 10}", 'Start with one complete workflow before adding many features.', 'Use the simplest design that satisfies the requirement.')}, 'function')

from edition.beginner_references import enrich
enrich(LESSONS)
assert set(LESSONS) == set(TOPICS), 'Every canonical subtopic needs a concept card'
