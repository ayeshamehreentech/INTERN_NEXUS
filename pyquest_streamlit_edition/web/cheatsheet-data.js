export const sheetCards = [
['Python basics', 'Print, name values and read input.', `print("Hello, Python!")
# A comment
x = 10
pi = 3.14
name = "Alice"
is_valid = True
age = int(input("Age: "))`, 'input() returns text. Convert it when you need a number.'],
['Data types', 'Common built-in types.', `number = 10           # int
decimal = 3.14        # float
complex_number = 2+3j # complex
text = "Hello"       # str
items = [1, 2, 3]     # list
point = (1, 2)        # tuple
steps = range(5)
record = {"a": 1}     # dict
unique = {1, 2}       # set
fixed = frozenset({1, 2})
ready = True          # bool
missing = None        # NoneType`, 'Mutable collections include lists, dictionaries and sets.'],
['Operators', 'Calculate, compare and combine conditions.', `a, b = 5, 2
a + b; a - b; a * b
a / b   # 2.5
a // b  # 2
a % b   # 1
a ** b  # 25
a += 1
a == b; a != b; a >= b; a <= b
a > 0 and b > 0
a > 0 or b > 0
not False`, 'Use == for equality and = for assignment.'],
['Control flow', 'Choose a branch or repeat work.', `x = 1
if x > 0:
    print("Positive")
elif x == 0:
    print("Zero")
else:
    print("Negative")

for i in range(5):
    print(i)
i = 0
while i < 5:
    i += 1`, 'break exits a loop; continue skips to the next iteration; pass is a placeholder.'],
['Data structures', 'Keep related values together.', `items = [1, 2, 3]
items.append(4)
items.extend([5, 6])
items.pop()
point = (1, 2, 3)
record = {"a": 1, "b": 2}
record["c"] = 3
unique = {1, 2, 3}
unique.add(4)
unique.discard(2)`, 'Lists and tuples are sequences; dictionaries map keys to values; sets keep unique elements.'],
['Functions', 'Give a reusable task a name.', `def greet(name):
    return f"Hello, {name}!"

def power(x, y=2):
    return x ** y

def add(*nums):
    return sum(nums)

def info(**data):
    for key, value in data.items():
        print(key, value)`, '*args collects positional arguments; **kwargs collects keyword arguments.'],
['Lambdas and higher-order functions', 'Pass small functions into other functions.', `square = lambda x: x ** 2
nums = [1, 2, 3, 4]
print(list(map(square, nums)))
print(list(filter(lambda x: x % 2 == 0, nums)))
from functools import reduce
product = reduce(lambda x, y: x * y, nums)
print(product)  # 24`, 'Comprehensions are often easier to read than map or filter with a lambda.'],
['Strings', 'Read and transform immutable text.', `s = "Hello, Python!"
s[0]       # H
s[-1]      # !
s[0:5]     # Hello
len(s)
s.lower(); s.upper(); s.strip()
s.replace("Hello", "Hi")
s.split(",")
" ".join(["a", "b"])`, 'String methods return new values; they do not edit the original string.'],
['List comprehensions', 'Build a list from a loop expression.', `[x for x in range(5)]
# [0, 1, 2, 3, 4]
[x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]
[x * x for x in range(5)]
# [0, 1, 4, 9, 16]
[(i, j) for i in range(2) for j in range(3)]`, 'Keep comprehensions simple enough to understand at a glance.'],
['Working with files', 'Use with to close a file automatically.', `with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Hello")
with open("file.txt", "r", encoding="utf-8") as f:
    data = f.read()
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("\\nNew line")`, 'w replaces existing contents. a appends. readlines() returns a list of lines.'],
['Exceptions', 'Handle an expected failure.', `try:
    x = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print("No exception")
finally:
    print("Cleanup")`, 'Catch specific exceptions. finally runs when leaving the try statement in ordinary execution.'],
['Modules and packages', 'Import reusable code.', `import math
print(math.sqrt(16))
from math import pi
print(pi)
# In mymodule.py:
def add(a, b):
    return a + b
# In another file:
import mymodule
print(mymodule.add(2, 3))`, 'A module is a Python code unit; packages organize modules.'],
['Classes and objects', 'Combine instance data and behavior.', `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hi, I am {self.name}"

p = Person("Alice", 25)
print(p.greet())
print(p.name, p.age)`, '__init__ initializes an instance. self refers to that instance.'],
['Popular built-in functions', 'Useful tools that need no import.', `abs(-5)              # 5
all([True, False])   # False
any([True, False])   # True
len([1, 2, 3])       # 3
max([1, 2, 3]); min([1, 2, 3])
sum([1, 2, 3])       # 6
sorted([3, 1, 2])    # [1, 2, 3]
type(1)
list(enumerate(["a", "b"]))`, 'sorted returns a new list; list.sort modifies a list in place.'],
['Useful itertools', 'Compose iterators for repeated work.', `from itertools import (
    count, cycle, repeat, chain,
    combinations, permutations, product, groupby
)
list(repeat("Hi", 3))
list(chain([1, 2], [3]))
list(combinations([1, 2, 3], 2))
list(product([1, 2], ["a", "b"]))`, 'count and cycle can be unbounded. groupby groups consecutive equal keys, not all equal values automatically.'],
['Popular libraries', 'Standard-library modules for common tasks.', `import math         # Mathematics
import random       # Pseudorandom values
import datetime     # Dates and times
import os           # Operating system
import sys          # Runtime and arguments
import json         # JSON data
import re           # Regular expressions
import collections  # Specialized containers
import itertools    # Iterator tools`, 'These modules are included in the standard library. Third-party packages need separate installation.'],
['Regular expressions', 'Find patterns in text.', `import re
text = "Order 123, Price 45"
pattern = r"\\d+"
print(re.findall(pattern, text))  # ['123', '45']
match = re.search(pattern, text)
if match:
    print(match.group())         # 123
print(re.sub(pattern, "#", text))`, '\\d: digit; \\w: word character; \\s: whitespace; ^/$: anchors; +: one or more; *: zero or more; ?: optional.'],
['List methods', 'Add, remove, inspect and reorder.', `items = [3, 1, 2]
items.append(4)
items.extend([5, 6])
items.insert(0, 0)
items.remove(3)
items.pop()
items.index(2); items.count(2)
items.sort(); items.reverse()
copy = items.copy()
items.clear()`, 'remove uses a value; pop uses an index. copy is shallow.'],
['Dictionary methods', 'Work with key-value pairs.', `d = {"a": 1}
d.keys(); d.values(); d.items()
d.get("missing", 0)
d.update({"b": 2})
d.setdefault("c", 3)
d.pop("b")
d.popitem()
copy = d.copy()
d.clear()`, 'popitem removes the last inserted pair. keys, values and items return dynamic views.'],
['Set methods', 'Work with unique elements.', `s = {1, 2, 3}
s.add(4)
s.update([5, 6])
s.remove(1)
s.discard(99)
s.union({7})
s.intersection({2, 3})
s.difference({2})
s.symmetric_difference({3, 8})
s.pop()
s.clear()`, 'remove raises KeyError for a missing element; discard does not. pop removes an arbitrary element.'],
['Python tips', 'Write code you can explain.', `names = ["Alice", "Bob"]
for index, name in enumerate(names):
    print(index, name)

squares = [x * x for x in range(5)]
# Prefer clear names:
total_score = sum(squares)`, 'Use four-space indentation, meaningful names, with for files, and simple functions. Follow PEP 8 style conventions.'],
['Command-line arguments', 'Read arguments passed to your script.', `# script.py
import sys
print(sys.argv)
print(sys.argv[0])   # Script name
print(sys.argv[1:])  # Remaining arguments

# Terminal:
# python script.py a b`, 'Arguments arrive as strings. Use argparse for richer command-line interfaces.'],
['Virtual environments', 'Keep project dependencies separate.', `# Create:
python -m venv .venv

# Activate on Windows PowerShell:
.venv\\Scripts\\Activate.ps1

# Activate on macOS / Linux:
source .venv/bin/activate

# Leave the environment:
deactivate`, 'Use the Python command available on your system, such as py or python3.'],
['Magic methods (dunder)', 'Define how objects interact with Python.', `__init__   # Initialize instance
__str__    # Readable string
__repr__   # Developer representation
__len__    # len(object)
__eq__     # Equality
__lt__     # Less than
__gt__     # Greater than`, 'These methods are defined inside classes and called by Python operations.'],
['Python versions', 'Check the interpreter running your project.', `import sys
print(sys.version)
print(sys.version_info)

# Terminal:
# python --version`, 'Use Python 3. Python 2 is legacy. Check project compatibility and official release information instead of relying on a static version timeline.']
];
