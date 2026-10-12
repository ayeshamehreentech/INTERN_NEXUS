// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/cheatsheet-data.js
var sheetCards = [
  ["Python basics", "Print, name values and read input.", `print("Hello, Python!")
# A comment
x = 10
pi = 3.14
name = "Alice"
is_valid = True
age = int(input("Age: "))`, "input() returns text. Convert it when you need a number."],
  ["Data types", "Common built-in types.", `number = 10           # int
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
missing = None        # NoneType`, "Mutable collections include lists, dictionaries and sets."],
  ["Operators", "Calculate, compare and combine conditions.", `a, b = 5, 2
a + b; a - b; a * b
a / b   # 2.5
a // b  # 2
a % b   # 1
a ** b  # 25
a += 1
a == b; a != b; a >= b; a <= b
a > 0 and b > 0
a > 0 or b > 0
not False`, "Use == for equality and = for assignment."],
  ["Control flow", "Choose a branch or repeat work.", `x = 1
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
    i += 1`, "break exits a loop; continue skips to the next iteration; pass is a placeholder."],
  ["Data structures", "Keep related values together.", `items = [1, 2, 3]
items.append(4)
items.extend([5, 6])
items.pop()
point = (1, 2, 3)
record = {"a": 1, "b": 2}
record["c"] = 3
unique = {1, 2, 3}
unique.add(4)
unique.discard(2)`, "Lists and tuples are sequences; dictionaries map keys to values; sets keep unique elements."],
  ["Functions", "Give a reusable task a name.", `def greet(name):
    return f"Hello, {name}!"

def power(x, y=2):
    return x ** y

def add(*nums):
    return sum(nums)

def info(**data):
    for key, value in data.items():
        print(key, value)`, "*args collects positional arguments; **kwargs collects keyword arguments."],
  ["Lambdas and higher-order functions", "Pass small functions into other functions.", `square = lambda x: x ** 2
nums = [1, 2, 3, 4]
print(list(map(square, nums)))
print(list(filter(lambda x: x % 2 == 0, nums)))
from functools import reduce
product = reduce(lambda x, y: x * y, nums)
print(product)  # 24`, "Comprehensions are often easier to read than map or filter with a lambda."],
  ["Strings", "Read and transform immutable text.", `s = "Hello, Python!"
s[0]       # H
s[-1]      # !
s[0:5]     # Hello
len(s)
s.lower(); s.upper(); s.strip()
s.replace("Hello", "Hi")
s.split(",")
" ".join(["a", "b"])`, "String methods return new values; they do not edit the original string."],
  ["List comprehensions", "Build a list from a loop expression.", `[x for x in range(5)]
# [0, 1, 2, 3, 4]
[x for x in range(10) if x % 2 == 0]
# [0, 2, 4, 6, 8]
[x * x for x in range(5)]
# [0, 1, 4, 9, 16]
[(i, j) for i in range(2) for j in range(3)]`, "Keep comprehensions simple enough to understand at a glance."],
  ["Working with files", "Use with to close a file automatically.", `with open("file.txt", "w", encoding="utf-8") as f:
    f.write("Hello")
with open("file.txt", "r", encoding="utf-8") as f:
    data = f.read()
with open("file.txt", "a", encoding="utf-8") as f:
    f.write("\\nNew line")`, "w replaces existing contents. a appends. readlines() returns a list of lines."],
  ["Exceptions", "Handle an expected failure.", `try:
    x = 10 / 0
except ZeroDivisionError:
    print("Cannot divide by zero")
else:
    print("No exception")
finally:
    print("Cleanup")`, "Catch specific exceptions. finally runs when leaving the try statement in ordinary execution."],
  ["Modules and packages", "Import reusable code.", `import math
print(math.sqrt(16))
from math import pi
print(pi)
# In mymodule.py:
def add(a, b):
    return a + b
# In another file:
import mymodule
print(mymodule.add(2, 3))`, "A module is a Python code unit; packages organize modules."],
  ["Classes and objects", "Combine instance data and behavior.", `class Person:
    def __init__(self, name, age):
        self.name = name
        self.age = age

    def greet(self):
        return f"Hi, I am {self.name}"

p = Person("Alice", 25)
print(p.greet())
print(p.name, p.age)`, "__init__ initializes an instance. self refers to that instance."],
  ["Popular built-in functions", "Useful tools that need no import.", `abs(-5)              # 5
all([True, False])   # False
any([True, False])   # True
len([1, 2, 3])       # 3
max([1, 2, 3]); min([1, 2, 3])
sum([1, 2, 3])       # 6
sorted([3, 1, 2])    # [1, 2, 3]
type(1)
list(enumerate(["a", "b"]))`, "sorted returns a new list; list.sort modifies a list in place."],
  ["Useful itertools", "Compose iterators for repeated work.", `from itertools import (
    count, cycle, repeat, chain,
    combinations, permutations, product, groupby
)
list(repeat("Hi", 3))
list(chain([1, 2], [3]))
list(combinations([1, 2, 3], 2))
list(product([1, 2], ["a", "b"]))`, "count and cycle can be unbounded. groupby groups consecutive equal keys, not all equal values automatically."],
  ["Popular libraries", "Standard-library modules for common tasks.", `import math         # Mathematics
import random       # Pseudorandom values
import datetime     # Dates and times
import os           # Operating system
import sys          # Runtime and arguments
import json         # JSON data
import re           # Regular expressions
import collections  # Specialized containers
import itertools    # Iterator tools`, "These modules are included in the standard library. Third-party packages need separate installation."],
  ["Regular expressions", "Find patterns in text.", `import re
text = "Order 123, Price 45"
pattern = r"\\d+"
print(re.findall(pattern, text))  # ['123', '45']
match = re.search(pattern, text)
if match:
    print(match.group())         # 123
print(re.sub(pattern, "#", text))`, "\\d: digit; \\w: word character; \\s: whitespace; ^/$: anchors; +: one or more; *: zero or more; ?: optional."],
  ["List methods", "Add, remove, inspect and reorder.", `items = [3, 1, 2]
items.append(4)
items.extend([5, 6])
items.insert(0, 0)
items.remove(3)
items.pop()
items.index(2); items.count(2)
items.sort(); items.reverse()
copy = items.copy()
items.clear()`, "remove uses a value; pop uses an index. copy is shallow."],
  ["Dictionary methods", "Work with key-value pairs.", `d = {"a": 1}
d.keys(); d.values(); d.items()
d.get("missing", 0)
d.update({"b": 2})
d.setdefault("c", 3)
d.pop("b")
d.popitem()
copy = d.copy()
d.clear()`, "popitem removes the last inserted pair. keys, values and items return dynamic views."],
  ["Set methods", "Work with unique elements.", `s = {1, 2, 3}
s.add(4)
s.update([5, 6])
s.remove(1)
s.discard(99)
s.union({7})
s.intersection({2, 3})
s.difference({2})
s.symmetric_difference({3, 8})
s.pop()
s.clear()`, "remove raises KeyError for a missing element; discard does not. pop removes an arbitrary element."],
  ["Python tips", "Write code you can explain.", `names = ["Alice", "Bob"]
for index, name in enumerate(names):
    print(index, name)

squares = [x * x for x in range(5)]
# Prefer clear names:
total_score = sum(squares)`, "Use four-space indentation, meaningful names, with for files, and simple functions. Follow PEP 8 style conventions."],
  ["Command-line arguments", "Read arguments passed to your script.", `# script.py
import sys
print(sys.argv)
print(sys.argv[0])   # Script name
print(sys.argv[1:])  # Remaining arguments

# Terminal:
# python script.py a b`, "Arguments arrive as strings. Use argparse for richer command-line interfaces."],
  ["Virtual environments", "Keep project dependencies separate.", `# Create:
python -m venv .venv

# Activate on Windows PowerShell:
.venv\\Scripts\\Activate.ps1

# Activate on macOS / Linux:
source .venv/bin/activate

# Leave the environment:
deactivate`, "Use the Python command available on your system, such as py or python3."],
  ["Magic methods (dunder)", "Define how objects interact with Python.", `__init__   # Initialize instance
__str__    # Readable string
__repr__   # Developer representation
__len__    # len(object)
__eq__     # Equality
__lt__     # Less than
__gt__     # Greater than`, "These methods are defined inside classes and called by Python operations."],
  ["Python versions", "Check the interpreter running your project.", `import sys
print(sys.version)
print(sys.version_info)

# Terminal:
# python --version`, "Use Python 3. Python 2 is legacy. Check project compatibility and official release information instead of relying on a static version timeline."]
];

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/pro-tips-data.js
var proTips = [{ "category": "VS Code shortcuts", "title": "Command Palette", "body": "Find commands without memorizing menus. Default Windows/Linux: Ctrl+Shift+P; macOS: Shift+Cmd+P. Keymaps can override shortcuts.", "code": "", "shortcut": "Ctrl+Shift+P", "source": "https://code.visualstudio.com/docs/reference/default-keybindings" }, { "category": "VS Code shortcuts", "title": "Quick Open", "body": "Open a file by name. Windows/Linux: Ctrl+P; macOS: Cmd+P.", "code": "", "shortcut": "Ctrl+P", "source": "https://code.visualstudio.com/docs/reference/default-keybindings" }, { "category": "VS Code shortcuts", "title": "Toggle line comment", "body": "Comment or uncomment the selected lines. Windows/Linux: Ctrl+/; macOS: Cmd+/. Keyboard layout and keymaps can change bindings.", "code": "", "shortcut": "Ctrl+/", "source": "https://code.visualstudio.com/docs/reference/default-keybindings" }, { "category": "VS Code shortcuts", "title": "Move a line", "body": "Move the current line up/down. Windows/Linux: Alt+Up/Down; macOS: Option+Up/Down.", "code": "", "shortcut": "Alt+Up/Down", "source": "https://code.visualstudio.com/docs/reference/default-keybindings" }, { "category": "VS Code shortcuts", "title": "Format a document", "body": "Windows: Shift+Alt+F; Linux: Ctrl+Shift+I; macOS: Shift+Option+F. Install/select a Python formatter first.", "code": "", "shortcut": "Shift+Alt+F", "source": "https://code.visualstudio.com/docs/reference/default-keybindings" }, { "category": "Python syntax", "title": "enumerate: index and value", "body": "Avoid manually managing a loop counter. start=1 changes the first index.", "code": 'for index, name in enumerate(["Byte", "Kai"], start=1):\n    print(index, name)', "output": "1 Byte\n2 Kai", "source": "https://docs.python.org/3.12/tutorial/datastructures.html" }, { "category": "Python syntax", "title": "Unpack a pair", "body": "Unpacking names the parts of a sequence. The number of targets must match.", "code": "width, height = (3, 4)\nprint(width * height)", "output": "12", "source": "https://docs.python.org/3.12/tutorial/datastructures.html" }, { "category": "Python syntax", "title": "Comprehensions with a purpose", "body": "A list comprehension builds a new list. Keep it readable; use a normal loop for complex logic.", "code": "squares = [n * n for n in range(4)]\nprint(squares)", "output": "[0, 1, 4, 9]", "source": "https://docs.python.org/3.12/tutorial/datastructures.html" }, { "category": "Python syntax", "title": "zip and unequal lengths", "body": "zip stops at the shortest iterable by default. strict=True raises ValueError on unequal lengths.", "code": 'for name, score in zip(["Byte", "Kai"], [8, 9], strict=True):\n    print(name, score)', "output": "Byte 8\nKai 9", "source": "https://docs.python.org/3.12/tutorial/datastructures.html" }, { "category": "Python syntax", "title": "Format numbers for display", "body": "An f-string can format decimal places; formatting does not make binary floats exact.", "code": 'price = 3.14159\nprint(f"Price: {price:.2f}")', "output": "Price: 3.14", "source": "https://docs.python.org/3.12/tutorial/inputoutput.html" }, { "category": "Python toolkit", "title": "Module", "body": "An importable unit, often a .py file. Built-in and extension modules also exist.", "code": "import math\nprint(math.sqrt(16))", "output": "4.0", "source": "https://docs.python.org/3.12/tutorial/modules.html" }, { "category": "Python toolkit", "title": "Package", "body": "A module that can contain submodules. Regular packages normally use __init__.py; namespace packages can omit it.", "code": "from collections import deque\nqueue = deque([1, 2])\nprint(queue.popleft())", "output": "1", "source": "https://docs.python.org/3.12/tutorial/modules.html" }, { "category": "Python toolkit", "title": "Library (lib)", "body": "Reusable tools used by your program; often a collection of modules and packages. lib is an abbreviation, not a Python keyword.", "code": "", "source": "https://docs.python.org/3.12/library/" }, { "category": "Python toolkit", "title": "Framework", "body": "Provides application structure and orchestrates work, calling your handlers. Django routes requests to your views. These labels can overlap.", "code": "", "source": "https://www.djangoproject.com/start/overview/" }, { "category": "Advanced & best practices", "title": "Avoid mutable default arguments", "body": "Defaults are evaluated once, when a function is defined. Use None and create a fresh list per call.", "code": "def collect(value, items=None):\n    if items is None:\n        items = []\n    items.append(value)\n    return items\nprint(collect(1), collect(2))", "output": "[1] [2]", "source": "https://docs.python.org/3.12/tutorial/controlflow.html" }, { "category": "Advanced & best practices", "title": "Generators are consumed", "body": "A generator yields values lazily. Iterating it again after exhaustion produces no values.", "code": "values = (n * n for n in range(3))\nprint(list(values))\nprint(list(values))", "output": "[0, 1, 4]\n[]", "source": "https://docs.python.org/3.12/tutorial/classes.html" }, { "category": "Advanced & best practices", "title": "Equality versus identity", "body": "== compares values. is compares object identity; use is None to test absence, not is to compare numbers or strings.", "code": "a = [1]\nb = [1]\nprint(a == b, a is b)", "output": "True False", "source": "https://docs.python.org/3.12/tutorial/datastructures.html" }, { "category": "Advanced & best practices", "title": "Shallow copies share nested objects", "body": "list.copy() copies the outer list. Nested objects remain shared. Choose deep copying only when it fits your data model.", "code": "a = [[1]]\nb = a.copy()\nb[0].append(2)\nprint(a)", "output": "[[1, 2]]", "source": "https://docs.python.org/3.12/library/copy.html" }, { "category": "Advanced & best practices", "title": "Catch specific exceptions", "body": "Catch errors you can handle. Avoid broad except blocks that hide defects; never use bare except for routine validation.", "code": 'try:\n    value = int("oops")\nexcept ValueError:\n    print("Enter a whole number")', "output": "Enter a whole number", "source": "https://docs.python.org/3.12/tutorial/errors.html" }, { "category": "Advanced & best practices", "title": "Type hints and tests have different roles", "body": "Annotations document expectations and support static tools; they do not automatically enforce runtime types. Test behavior and validate external input.", "code": "def double(value: int) -> int:\n    return value * 2\nprint(double(4))", "output": "8", "source": "https://docs.python.org/3.12/library/typing.html" }];

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/resource-lessons.js
var resourceLessons = [
  {
    "id": "name-input",
    "card": [
      "Print your name with input()",
      " Print your name with input()  Level 1: ask for a name, store the response, then print a greeting.   name = input('Enter your name: ')\nprint('Hello', name)   Example run   Enter your name: Alex\nHello Alex   input() returns a string. The variable name keeps that text, and print() displays it. Try entering your own name. ",
      "",
      "",
      "<h2>Print your name with input()</h2><p>Level 1: ask for a name, store the response, then print a greeting.</p><pre><code>name = input('Enter your name: ')\nprint('Hello', name)</code></pre><h3>Example run</h3><pre><samp>Enter your name: Alex\nHello Alex</samp></pre><p>input() returns a string. The variable name keeps that text, and print() displays it. Try entering your own name.</p>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "introduction",
    "card": [
      "Python Introduction",
      " Python Introduction  Python is a general-purpose, high-level programming language. It is commonly described as interpreted and supports object-oriented programming, as well as procedural and functional styles. You can use it to build websites, applications, automation tools and AI systems.   General-purpose  Designed for many application domains rather than one specific task.  Interpreted  A Python runtime executes your program. CPython, the most common implementation, first compiles source code to bytecode and then executes it; it does not simply translate each line directly into machine code.  High-level  Readable syntax and automatic memory management let you focus on the problem instead of low-level hardware details.  Object-oriented  Classes group related data and methods into objects. Concepts include inheritance, encapsulation and polymorphism. Python does not enforce strict private access to instance attributes.  ",
      "",
      "",
      "<h2>Python Introduction</h2><p>Python is a general-purpose, high-level programming language. It is commonly described as interpreted and supports object-oriented programming, as well as procedural and functional styles. You can use it to build websites, applications, automation tools and AI systems.</p><dl><dt>General-purpose</dt><dd>Designed for many application domains rather than one specific task.</dd><dt>Interpreted</dt><dd>A Python runtime executes your program. CPython, the most common implementation, first compiles source code to bytecode and then executes it; it does not simply translate each line directly into machine code.</dd><dt>High-level</dt><dd>Readable syntax and automatic memory management let you focus on the problem instead of low-level hardware details.</dd><dt>Object-oriented</dt><dd>Classes group related data and methods into objects. Concepts include inheritance, encapsulation and polymorphism. Python does not enforce strict private access to instance attributes.</dd></dl>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "history",
    "card": [
      "Who developed Python?",
      " Who developed Python?   Guido van Rossum , a Dutch programmer, created Python. Development began in 1989, and the first public release appeared in  1991 . ",
      "",
      "",
      "<h2>Who developed Python?</h2><p><strong>Guido van Rossum</strong>, a Dutch programmer, created Python. Development began in 1989, and the first public release appeared in <strong>1991</strong>.</p>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "applications",
    "card": [
      "Applications of Python",
      " Applications of Python   Web and internet development  Scientific and numeric computing  Education  Engineering applications  Software development  Business applications  Console applications  Enterprise applications  Artificial intelligence and automation  ",
      "",
      "",
      "<h2>Applications of Python</h2><ul><li>Web and internet development</li><li>Scientific and numeric computing</li><li>Education</li><li>Engineering applications</li><li>Software development</li><li>Business applications</li><li>Console applications</li><li>Enterprise applications</li><li>Artificial intelligence and automation</li></ul>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "features",
    "card": [
      "Key features",
      " Key features   Easy to learn  Readable syntax makes the language approachable. Building confidence still takes practice.  Free and open source  Python is available at no cost under an open-source license; its license terms still apply.  Interpreted execution  Run programs through a Python interpreter and experiment interactively.  Large standard library  Included modules support files, dates, math, networking and more. Additional third-party packages extend these capabilities.  Object-oriented programming  Organize related behavior with classes, objects, inheritance and encapsulation.  GUI support  Build graphical interfaces with tools such as tkinter, PyQt and wxPython.  Portability  Python runs on Windows, macOS and Linux. Platform-specific code and dependencies may need adjustments.  High-level abstractions  Built-in collections and managed memory simplify common programming tasks.  Language integration  Python can interact with code written in C, C++ and other languages through appropriate interfaces.  ",
      "",
      "",
      "<h2>Key features</h2><dl><dt>Easy to learn</dt><dd>Readable syntax makes the language approachable. Building confidence still takes practice.</dd><dt>Free and open source</dt><dd>Python is available at no cost under an open-source license; its license terms still apply.</dd><dt>Interpreted execution</dt><dd>Run programs through a Python interpreter and experiment interactively.</dd><dt>Large standard library</dt><dd>Included modules support files, dates, math, networking and more. Additional third-party packages extend these capabilities.</dd><dt>Object-oriented programming</dt><dd>Organize related behavior with classes, objects, inheritance and encapsulation.</dd><dt>GUI support</dt><dd>Build graphical interfaces with tools such as tkinter, PyQt and wxPython.</dd><dt>Portability</dt><dd>Python runs on Windows, macOS and Linux. Platform-specific code and dependencies may need adjustments.</dd><dt>High-level abstractions</dt><dd>Built-in collections and managed memory simplify common programming tasks.</dd><dt>Language integration</dt><dd>Python can interact with code written in C, C++ and other languages through appropriate interfaces.</dd></dl>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "variables",
    "card": [
      "Variables in Python",
      ' Variables in Python  A variable is a name bound to an object. Assignment creates or updates that binding. You do not need a separate variable declaration, and the same name can later refer to an object of another type.  A variable name is an  identifier . Identifiers also name functions and classes. Assigning a variable is not a request to the operating system for memory labeled with that name. \n 1. Integer and float   x = 5\nx = 4.23   First,  x  refers to an integer. Then it refers to a float. The objects have types; the name is rebound. \n 2. String   y = "apple"   Quotation marks create a string containing text. \n 3. Boolean   z = True   Boolean values are  True  and  False , with capital first letters. \n 4. Multiple assignments   a, b, c, d = 5, 4.26, "apple", True   This assigns  5  to a,  4.26  to b,  "apple"  to c and  True  to d.   a = 5; b = 4.26; c = "apple"; d = True   Semicolons can separate statements, but separate lines usually read more clearly. \n 5. One value, multiple names   a = b = c = 15   All three names refer to the same integer object. With mutable objects such as lists, changes through one name can be visible through the others. ',
      "",
      "",
      '<h2>Variables in Python</h2><p>A variable is a name bound to an object. Assignment creates or updates that binding. You do not need a separate variable declaration, and the same name can later refer to an object of another type.</p><p>A variable name is an <strong>identifier</strong>. Identifiers also name functions and classes. Assigning a variable is not a request to the operating system for memory labeled with that name.</p>\n<h3>1. Integer and float</h3><pre><code>x = 5\nx = 4.23</code></pre><p>First, <code>x</code> refers to an integer. Then it refers to a float. The objects have types; the name is rebound.</p>\n<h3>2. String</h3><pre><code>y = "apple"</code></pre><p>Quotation marks create a string containing text.</p>\n<h3>3. Boolean</h3><pre><code>z = True</code></pre><p>Boolean values are <code>True</code> and <code>False</code>, with capital first letters.</p>\n<h3>4. Multiple assignments</h3><pre><code>a, b, c, d = 5, 4.26, "apple", True</code></pre><p>This assigns <code>5</code> to a, <code>4.26</code> to b, <code>"apple"</code> to c and <code>True</code> to d.</p><pre><code>a = 5; b = 4.26; c = "apple"; d = True</code></pre><p>Semicolons can separate statements, but separate lines usually read more clearly.</p>\n<h3>5. One value, multiple names</h3><pre><code>a = b = c = 15</code></pre><p>All three names refer to the same integer object. With mutable objects such as lists, changes through one name can be visible through the others.</p>'
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "data",
    "card": [
      "What is data?",
      ' What is data?  Data is information a program can store or process: text, numbers, logical values, images and more.    Text:   "john" ,  "mango"  and  "book" .   Numbers:   15 ,  84.13  and  5486 .   Alphanumeric text:   "13street" ,  "alpha56"  and  "dx14c5" .   \u201CFacts\u201D and \u201Cfigures\u201D are everyday descriptions, not Python data types. A string can contain letters, digits, punctuation or other characters.  "4586"  is text, while  4586  is an integer. ',
      "",
      "",
      '<h2>What is data?</h2><p>Data is information a program can store or process: text, numbers, logical values, images and more.</p><ul><li><strong>Text:</strong> <code>"john"</code>, <code>"mango"</code> and <code>"book"</code>.</li><li><strong>Numbers:</strong> <code>15</code>, <code>84.13</code> and <code>5486</code>.</li><li><strong>Alphanumeric text:</strong> <code>"13street"</code>, <code>"alpha56"</code> and <code>"dx14c5"</code>.</li></ul><p>\u201CFacts\u201D and \u201Cfigures\u201D are everyday descriptions, not Python data types. A string can contain letters, digits, punctuation or other characters. <code>"4586"</code> is text, while <code>4586</code> is an integer.</p>'
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "types",
    "card": [
      "Data types in Python",
      ` Data types in Python  A type describes an object's values and supported operations. Use  type(value)  to inspect a value's type. 
  Data types    Numeric  Integer \xB7 int  Complex \xB7 complex  Float \xB7 float    Mapping  Dictionary \xB7 dict    Boolean  bool    Set  set    Sequence  String \xB7 str  List \xB7 list  Tuple \xB7 tuple     A beginner overview, not an exhaustive list. Technically, bool is a subclass of int. 
   Common types and examples    Type  Meaning  Example      Integer \xB7 int  Whole numbers   56, 8, -493     Complex \xB7 complex  Real and imaginary components   9 + 21j     Float \xB7 float  Floating-point numbers   2.3, 18.12, 294.0     Boolean \xB7 bool  Logical values   True, False     String \xB7 str  Immutable text sequence   "hello", "Peter", "4586"     Dictionary \xB7 dict  Mutable key-value mapping; preserves insertion order   {"name": "frankie", "age": 18}     Set \xB7 set  Unordered collection of unique, hashable elements   {"a", "b", "c"}     List \xB7 list  Ordered, mutable collection   ["apple", "banana", "cherry"]     Tuple \xB7 tuple  Ordered, immutable collection   (15, "Albert", 18.20)        value = 4.23
print(type(value))  # &lt;class 'float'&gt;  `,
      "",
      "",
      `<h2>Data types in Python</h2><p>A type describes an object's values and supported operations. Use <code>type(value)</code> to inspect a value's type.</p>
<div><strong>Data types</strong><div><div><h3>Numeric</h3><p>Integer \xB7 int</p><p>Complex \xB7 complex</p><p>Float \xB7 float</p></div><div><h3>Mapping</h3><p>Dictionary \xB7 dict</p></div><div><h3>Boolean</h3><p>bool</p></div><div><h3>Set</h3><p>set</p></div><div><h3>Sequence</h3><p>String \xB7 str</p><p>List \xB7 list</p><p>Tuple \xB7 tuple</p></div></div></div><p>A beginner overview, not an exhaustive list. Technically, bool is a subclass of int.</p>
<div><table><caption>Common types and examples</caption><thead><tr><th>Type</th><th>Meaning</th><th>Example</th></tr></thead><tbody><tr><td>Integer \xB7 int</td><td>Whole numbers</td><td><code>56, 8, -493</code></td></tr><tr><td>Complex \xB7 complex</td><td>Real and imaginary components</td><td><code>9 + 21j</code></td></tr><tr><td>Float \xB7 float</td><td>Floating-point numbers</td><td><code>2.3, 18.12, 294.0</code></td></tr><tr><td>Boolean \xB7 bool</td><td>Logical values</td><td><code>True, False</code></td></tr><tr><td>String \xB7 str</td><td>Immutable text sequence</td><td><code>"hello", "Peter", "4586"</code></td></tr><tr><td>Dictionary \xB7 dict</td><td>Mutable key-value mapping; preserves insertion order</td><td><code>{"name": "frankie", "age": 18}</code></td></tr><tr><td>Set \xB7 set</td><td>Unordered collection of unique, hashable elements</td><td><code>{"a", "b", "c"}</code></td></tr><tr><td>List \xB7 list</td><td>Ordered, mutable collection</td><td><code>["apple", "banana", "cherry"]</code></td></tr><tr><td>Tuple \xB7 tuple</td><td>Ordered, immutable collection</td><td><code>(15, "Albert", 18.20)</code></td></tr></tbody></table></div><pre><code>value = 4.23
print(type(value))  # &lt;class 'float'&gt;</code></pre>`
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "naming",
    "card": [
      "Naming conventions",
      " Naming conventions  Naming rules determine which identifiers Python accepts. Naming conventions are style recommendations that make variables, modules, packages, functions and classes easier to read.  Valid names versus recommended style   A name can begin with a letter or underscore, but not a digit. Python also supports many Unicode letters.  After the first character, letters, underscores and digits are allowed.  Spaces and punctuation such as hyphens and dollar signs are not allowed.  Reserved keywords such as  for ,  if ,  elif  and  while  cannot be identifiers.  Names are case-sensitive:  a  and  A  are different.  Prefer lowercase  snake_case  for variables, functions and methods. Modules use short lowercase names, optionally with underscores; packages generally avoid underscores.  Built-in names such as  print  are technically assignable, but avoid shadowing them.    x = 1\ntotal = 10\nar15 = 15\na6b2 = 62\ntotal_cost = 25\n_internal = 0\na = 1\nA = 2  # Legal, but lowercase is preferred for ordinary variables    # Invalid as single variable names:\n# total cost  (space)\n# total-cost  (parsed as subtraction)\n# total$      (punctuation)\n# 15ar        (starts with a digit)\n# for         (reserved keyword)   Class names  Use  CapWords  by convention:  Game ,  EmployeeInfo ,  TotalCostPrice . Class identifiers obey the same syntax rules as other names; uppercase is a style recommendation, not a language requirement. Exception classes conventionally end in  Error .   class Game:\n    pass\n\nclass ServerNotActiveError(Exception):\n    pass   Many built-in types use lowercase names, such as  int ,  str  and  list . ",
      "",
      "",
      "<h2>Naming conventions</h2><p>Naming rules determine which identifiers Python accepts. Naming conventions are style recommendations that make variables, modules, packages, functions and classes easier to read.</p><h3>Valid names versus recommended style</h3><ul><li>A name can begin with a letter or underscore, but not a digit. Python also supports many Unicode letters.</li><li>After the first character, letters, underscores and digits are allowed.</li><li>Spaces and punctuation such as hyphens and dollar signs are not allowed.</li><li>Reserved keywords such as <code>for</code>, <code>if</code>, <code>elif</code> and <code>while</code> cannot be identifiers.</li><li>Names are case-sensitive: <code>a</code> and <code>A</code> are different.</li><li>Prefer lowercase <code>snake_case</code> for variables, functions and methods. Modules use short lowercase names, optionally with underscores; packages generally avoid underscores.</li><li>Built-in names such as <code>print</code> are technically assignable, but avoid shadowing them.</li></ul><pre><code>x = 1\ntotal = 10\nar15 = 15\na6b2 = 62\ntotal_cost = 25\n_internal = 0\na = 1\nA = 2  # Legal, but lowercase is preferred for ordinary variables</code></pre><pre><code># Invalid as single variable names:\n# total cost  (space)\n# total-cost  (parsed as subtraction)\n# total$      (punctuation)\n# 15ar        (starts with a digit)\n# for         (reserved keyword)</code></pre><h3>Class names</h3><p>Use <strong>CapWords</strong> by convention: <code>Game</code>, <code>EmployeeInfo</code>, <code>TotalCostPrice</code>. Class identifiers obey the same syntax rules as other names; uppercase is a style recommendation, not a language requirement. Exception classes conventionally end in <code>Error</code>.</p><pre><code>class Game:\n    pass\n\nclass ServerNotActiveError(Exception):\n    pass</code></pre><p>Many built-in types use lowercase names, such as <code>int</code>, <code>str</code> and <code>list</code>.</p>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "typecasting",
    "card": [
      "Typecasting",
      ` Typecasting  Type conversion produces a value of another type. Some numeric operations perform implicit conversion; explicit conversion uses functions such as  int() ,  float()  and  str() .  Implicit conversion   a = 5
b = 2.5
c = a + b
print(c)        # 7.5
print(type(c))  # &lt;class 'float'&gt;   The mixed numeric addition produces a float. The original  a  still refers to an integer.  Explicit conversions   a = 8
b = float(a)  # 8.0

a = 5.8
b = int(a)    # 5: truncates toward zero

a = 456
b = str(a)    # "456"

a = "18"
b = int(a)    # 18

a = 24.19
b = str(a)    # "24.19"   Not every conversion succeeds:  int("apple")  and  int("5.8")  raise  ValueError . Converting a float to an integer truncates rather than rounds:  int(-5.8)  is  -5 . `,
      "",
      "",
      `<h2>Typecasting</h2><p>Type conversion produces a value of another type. Some numeric operations perform implicit conversion; explicit conversion uses functions such as <code>int()</code>, <code>float()</code> and <code>str()</code>.</p><h3>Implicit conversion</h3><pre><code>a = 5
b = 2.5
c = a + b
print(c)        # 7.5
print(type(c))  # &lt;class 'float'&gt;</code></pre><p>The mixed numeric addition produces a float. The original <code>a</code> still refers to an integer.</p><h3>Explicit conversions</h3><pre><code>a = 8
b = float(a)  # 8.0

a = 5.8
b = int(a)    # 5: truncates toward zero

a = 456
b = str(a)    # "456"

a = "18"
b = int(a)    # 18

a = 24.19
b = str(a)    # "24.19"</code></pre><p>Not every conversion succeeds: <code>int("apple")</code> and <code>int("5.8")</code> raise <code>ValueError</code>. Converting a float to an integer truncates rather than rounds: <code>int(-5.8)</code> is <code>-5</code>.</p>`
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "operators",
    "card": [
      "Operators in Python",
      " Operators in Python  Operators perform operations on operands. They can be symbols, such as  + , or keywords, such as  and .   a = 5\nb = 9\nc = a + b  # 14    +  is the addition operator;  a  and  b  are its operands. Assignment binds  c  to the result.   Assignment:  =, +=, -=  and more  Arithmetic:  +, -, *, /, %, **, //   Relational (comparison):  ==, !=, &lt;, &gt;, &lt;=, &gt;=   Logical:  and, or, not   Identity:  is, is not   Membership:  in, not in    Python also has bitwise operators. The next cards cover the groups above. ",
      "",
      "",
      "<h2>Operators in Python</h2><p>Operators perform operations on operands. They can be symbols, such as <code>+</code>, or keywords, such as <code>and</code>.</p><pre><code>a = 5\nb = 9\nc = a + b  # 14</code></pre><p><code>+</code> is the addition operator; <code>a</code> and <code>b</code> are its operands. Assignment binds <code>c</code> to the result.</p><ul><li>Assignment: <code>=, +=, -=</code> and more</li><li>Arithmetic: <code>+, -, *, /, %, **, //</code></li><li>Relational (comparison): <code>==, !=, &lt;, &gt;, &lt;=, &gt;=</code></li><li>Logical: <code>and, or, not</code></li><li>Identity: <code>is, is not</code></li><li>Membership: <code>in, not in</code></li></ul><p>Python also has bitwise operators. The next cards cover the groups above.</p>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "assignment",
    "card": [
      "Assignment operators",
      " Assignment operators  Assignment binds the target on the left to the value computed on the right. Augmented assignments combine an operation with assignment.  Assign: =   a = 5\nb = a  # 5   Add and assign: +=   a, b, c = 2, 10, 5\na += 2  # 4\nb += c  # 15   Subtract and assign: -=   a, b, c = 6, 10, 5\na -= 2  # 4\nb -= c  # 5   Multiply and assign: *=   a, b, c = 7, 10, 5\na *= 2  # 14\nb *= c  # 50   Divide and assign: /=   a, b, c = 18, 10, 5\na /= 2  # 9.0\nb /= c  # 2.0   True division of these integers produces floats, even when the result is mathematically a whole number.  Remainder and assign: %=   a, b, c = 6, 10, 8\na %= 2  # 0\nb %= c  # 2   For these numbers,  a += 2  has the same numeric result as  a = a + 2 . Mutable objects can behave differently because augmented assignment may update an object in place. Other augmented operators include  //=  and  **= .  Text following  #  outside a string is a comment; Python does not execute it. ",
      "",
      "",
      "<h2>Assignment operators</h2><p>Assignment binds the target on the left to the value computed on the right. Augmented assignments combine an operation with assignment.</p><h3>Assign: =</h3><pre><code>a = 5\nb = a  # 5</code></pre><h3>Add and assign: +=</h3><pre><code>a, b, c = 2, 10, 5\na += 2  # 4\nb += c  # 15</code></pre><h3>Subtract and assign: -=</h3><pre><code>a, b, c = 6, 10, 5\na -= 2  # 4\nb -= c  # 5</code></pre><h3>Multiply and assign: *=</h3><pre><code>a, b, c = 7, 10, 5\na *= 2  # 14\nb *= c  # 50</code></pre><h3>Divide and assign: /=</h3><pre><code>a, b, c = 18, 10, 5\na /= 2  # 9.0\nb /= c  # 2.0</code></pre><p>True division of these integers produces floats, even when the result is mathematically a whole number.</p><h3>Remainder and assign: %=</h3><pre><code>a, b, c = 6, 10, 8\na %= 2  # 0\nb %= c  # 2</code></pre><p>For these numbers, <code>a += 2</code> has the same numeric result as <code>a = a + 2</code>. Mutable objects can behave differently because augmented assignment may update an object in place. Other augmented operators include <code>//=</code> and <code>**=</code>.</p><p>Text following <code>#</code> outside a string is a comment; Python does not execute it.</p>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "arithmetic",
    "card": [
      "Arithmetic operators",
      " Arithmetic operators  Use arithmetic operators to calculate with numbers.   x, y = 5, 2\nprint(x + y)   # 7: addition\nprint(x - y)   # 3: subtraction\nprint(x * y)   # 10: multiplication\nprint(x / y)   # 2.5: true division\nprint(x % y)   # 1: remainder\nprint(x ** y)  # 25: exponentiation\nprint(27 // 4) # 6: floor division    x ** y  raises x to the power y. For a positive integer exponent, this corresponds to repeated multiplication.  Floor division is not truncation   print(-27 // 4)  # -7: rounds down toward negative infinity\nprint(int(-27 / 4))  # -6: truncates toward zero   Floor division rounds down, so simply removing the decimal part is not a correct explanation for negative results. Division, floor division and modulo by zero raise  ZeroDivisionError .  Order of operations   print(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20   Use parentheses to make the intended calculation clear. ",
      "",
      "",
      "<h2>Arithmetic operators</h2><p>Use arithmetic operators to calculate with numbers.</p><pre><code>x, y = 5, 2\nprint(x + y)   # 7: addition\nprint(x - y)   # 3: subtraction\nprint(x * y)   # 10: multiplication\nprint(x / y)   # 2.5: true division\nprint(x % y)   # 1: remainder\nprint(x ** y)  # 25: exponentiation\nprint(27 // 4) # 6: floor division</code></pre><p><code>x ** y</code> raises x to the power y. For a positive integer exponent, this corresponds to repeated multiplication.</p><h3>Floor division is not truncation</h3><pre><code>print(-27 // 4)  # -7: rounds down toward negative infinity\nprint(int(-27 / 4))  # -6: truncates toward zero</code></pre><p>Floor division rounds down, so simply removing the decimal part is not a correct explanation for negative results. Division, floor division and modulo by zero raise <code>ZeroDivisionError</code>.</p><h3>Order of operations</h3><pre><code>print(2 + 3 * 4)    # 14\nprint((2 + 3) * 4)  # 20</code></pre><p>Use parentheses to make the intended calculation clear.</p>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "comparison",
    "card": [
      "Relational operators",
      " Relational operators  Comparisons of these numbers produce Boolean values:  True  or  False .   x, y = 5, 2\nprint(x == y)  # False: equal values\nprint(x != y)  # True: unequal values\nprint(x &gt; y)   # True: greater than\nprint(x &lt; y)   # False: less than\nprint(x &gt;= 5)  # True: greater than or equal\nprint(y &lt;= 2)  # True: less than or equal    =  assigns a value;  ==  compares values. ",
      "",
      "",
      "<h2>Relational operators</h2><p>Comparisons of these numbers produce Boolean values: <code>True</code> or <code>False</code>.</p><pre><code>x, y = 5, 2\nprint(x == y)  # False: equal values\nprint(x != y)  # True: unequal values\nprint(x &gt; y)   # True: greater than\nprint(x &lt; y)   # False: less than\nprint(x &gt;= 5)  # True: greater than or equal\nprint(y &lt;= 2)  # True: less than or equal</code></pre><p><code>=</code> assigns a value; <code>==</code> compares values.</p>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "logical",
    "card": [
      "Logical operators",
      ' Logical operators  Combine conditions with  and  and  or , and reverse truth with  not . For Boolean conditions the results are  True  or  False , not automatically the integers 1 and 0.  and: all conditions must be true   x, y, z, k = 15, 2, 6, 25\na = x &gt; 5 and y &lt; 6 and k &gt;= 25  # True\nb = x &gt; y and k &lt; 25              # False   or: at least one condition must be true   a = x &lt; 5 or y &lt; 6 or k &gt;= 25  # True\nb = x &lt; y or k &lt; 25             # False   In the first expression, both  y &lt; 6  and  k &gt;= 25  are true.  not: reverse the truth value   x, y = 15, 10\na = not (x &gt; 5)  # False\nb = not (y &lt; 5)  # True   Short-circuit evaluation   and  stops at the first false-like operand;  or  stops at the first true-like operand. They return an operand, which need not be a Boolean.  not  always produces a Boolean.   name = "" or "Guest"  # "Guest"\nresult = 0 and 99    # 0  ',
      "",
      "",
      '<h2>Logical operators</h2><p>Combine conditions with <code>and</code> and <code>or</code>, and reverse truth with <code>not</code>. For Boolean conditions the results are <code>True</code> or <code>False</code>, not automatically the integers 1 and 0.</p><h3>and: all conditions must be true</h3><pre><code>x, y, z, k = 15, 2, 6, 25\na = x &gt; 5 and y &lt; 6 and k &gt;= 25  # True\nb = x &gt; y and k &lt; 25              # False</code></pre><h3>or: at least one condition must be true</h3><pre><code>a = x &lt; 5 or y &lt; 6 or k &gt;= 25  # True\nb = x &lt; y or k &lt; 25             # False</code></pre><p>In the first expression, both <code>y &lt; 6</code> and <code>k &gt;= 25</code> are true.</p><h3>not: reverse the truth value</h3><pre><code>x, y = 15, 10\na = not (x &gt; 5)  # False\nb = not (y &lt; 5)  # True</code></pre><h3>Short-circuit evaluation</h3><p><code>and</code> stops at the first false-like operand; <code>or</code> stops at the first true-like operand. They return an operand, which need not be a Boolean. <code>not</code> always produces a Boolean.</p><pre><code>name = "" or "Guest"  # "Guest"\nresult = 0 and 99    # 0</code></pre>'
    ],
    "group": "Operators in Python"
  },
  {
    "id": "identity",
    "card": [
      "Identity operators",
      " Identity operators   is  checks whether two references point to the same object.  is not  checks whether they point to different objects. Equal values do not guarantee identical objects.   a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)      # True: equal contents\nprint(a is b)      # False: separate lists\nprint(a is c)      # True: the same list\nprint(a is not b)  # True\nprint(a is not c)  # False   Do not use integer or string caching to predict identity: object reuse is an implementation detail. Compare numbers and strings using  ==  for value equality.   result = None\nprint(result is None)  # True   Checking against the singleton  None  is a common use of identity comparisons. ",
      "",
      "",
      "<h2>Identity operators</h2><p><code>is</code> checks whether two references point to the same object. <code>is not</code> checks whether they point to different objects. Equal values do not guarantee identical objects.</p><pre><code>a = [1, 2, 3]\nb = [1, 2, 3]\nc = a\n\nprint(a == b)      # True: equal contents\nprint(a is b)      # False: separate lists\nprint(a is c)      # True: the same list\nprint(a is not b)  # True\nprint(a is not c)  # False</code></pre><p>Do not use integer or string caching to predict identity: object reuse is an implementation detail. Compare numbers and strings using <code>==</code> for value equality.</p><pre><code>result = None\nprint(result is None)  # True</code></pre><p>Checking against the singleton <code>None</code> is a common use of identity comparisons.</p>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "membership",
    "card": [
      "Membership operators",
      ' Membership operators   in  tests membership;  not in  tests absence. These work with strings and containers such as lists, tuples, sets and dictionaries. Sets and dictionaries are not sequence types.  in   a = "I am learning Python"\nb = {1: "apple", 2: "ball"}\nx = "Python" in a  # True: substring found\ny = 3 in b         # False: key 3 absent   not in   x = "Hello" not in a  # True\ny = 1 not in b        # False: key 1 is present   Dictionary keys versus values  Membership directly on a dictionary checks its keys. To check values, use  .values() ; to check key-value pairs, use  .items() .   print("apple" in b)           # False\nprint("apple" in b.values())  # True\nprint((1, "apple") in b.items())  # True  ',
      "",
      "",
      '<h2>Membership operators</h2><p><code>in</code> tests membership; <code>not in</code> tests absence. These work with strings and containers such as lists, tuples, sets and dictionaries. Sets and dictionaries are not sequence types.</p><h3>in</h3><pre><code>a = "I am learning Python"\nb = {1: "apple", 2: "ball"}\nx = "Python" in a  # True: substring found\ny = 3 in b         # False: key 3 absent</code></pre><h3>not in</h3><pre><code>x = "Hello" not in a  # True\ny = 1 not in b        # False: key 1 is present</code></pre><h3>Dictionary keys versus values</h3><p>Membership directly on a dictionary checks its keys. To check values, use <code>.values()</code>; to check key-value pairs, use <code>.items()</code>.</p><pre><code>print("apple" in b)           # False\nprint("apple" in b.values())  # True\nprint((1, "apple") in b.items())  # True</code></pre>'
    ],
    "group": "Operators in Python"
  },
  {
    "id": "precedence",
    "card": [
      "Operator precedence",
      " Operator precedence  Precedence determines how an expression groups its operations. Associativity determines grouping when operators share a precedence level. Most binary operators group left to right; exponentiation groups right to left.   print(18 / 2 * 5)  # 45.0: (18 / 2) * 5\nprint(8 + 4 * 2)   # 16: 8 + (4 * 2)\nprint(2 ** 3 ** 2) # 512: 2 ** (3 ** 2)     Common operators, highest precedence first    Operators  Meaning       (...)   Explicit grouping     **   Exponentiation     +x, -x, ~x   Unary plus, minus and bitwise NOT     *, @, /, //, %   Multiplication, matrix multiplication, division, floor division, remainder     +, -   Addition and subtraction     &lt;&lt;, &gt;&gt;   Bit shifts     &amp;   Bitwise AND     ^   Bitwise XOR     |   Bitwise OR     &lt;, &lt;=, &gt;, &gt;=, ==, !=, is, is not, in, not in   Comparisons, identity and membership; comparisons can chain     not   Logical NOT     and   Logical AND     or   Logical OR      This covers the operators in these lessons, not every Python expression. Exponentiation has a unary-operator subtlety:  -2 ** 2  is  -4 , but  2 ** -2  is  0.25 . Parentheses make your intention clear.  Worked example 1   45 % 2 + 3 * 2\n# 1 + 3 * 2\n# 1 + 6\n# 7   Worked example 2   19 + (5 / 2) + 4 % 2 - 6 * 3\n# 19 + 2.5 + 4 % 2 - 6 * 3\n# 19 + 2.5 + 0 - 18\n# 21.5 - 18\n# 3.5  ",
      "",
      "",
      "<h2>Operator precedence</h2><p>Precedence determines how an expression groups its operations. Associativity determines grouping when operators share a precedence level. Most binary operators group left to right; exponentiation groups right to left.</p><pre><code>print(18 / 2 * 5)  # 45.0: (18 / 2) * 5\nprint(8 + 4 * 2)   # 16: 8 + (4 * 2)\nprint(2 ** 3 ** 2) # 512: 2 ** (3 ** 2)</code></pre><div><table><caption>Common operators, highest precedence first</caption><thead><tr><th>Operators</th><th>Meaning</th></tr></thead><tbody><tr><td><code>(...)</code></td><td>Explicit grouping</td></tr><tr><td><code>**</code></td><td>Exponentiation</td></tr><tr><td><code>+x, -x, ~x</code></td><td>Unary plus, minus and bitwise NOT</td></tr><tr><td><code>*, @, /, //, %</code></td><td>Multiplication, matrix multiplication, division, floor division, remainder</td></tr><tr><td><code>+, -</code></td><td>Addition and subtraction</td></tr><tr><td><code>&lt;&lt;, &gt;&gt;</code></td><td>Bit shifts</td></tr><tr><td><code>&amp;</code></td><td>Bitwise AND</td></tr><tr><td><code>^</code></td><td>Bitwise XOR</td></tr><tr><td><code>|</code></td><td>Bitwise OR</td></tr><tr><td><code>&lt;, &lt;=, &gt;, &gt;=, ==, !=, is, is not, in, not in</code></td><td>Comparisons, identity and membership; comparisons can chain</td></tr><tr><td><code>not</code></td><td>Logical NOT</td></tr><tr><td><code>and</code></td><td>Logical AND</td></tr><tr><td><code>or</code></td><td>Logical OR</td></tr></tbody></table></div><p>This covers the operators in these lessons, not every Python expression. Exponentiation has a unary-operator subtlety: <code>-2 ** 2</code> is <code>-4</code>, but <code>2 ** -2</code> is <code>0.25</code>. Parentheses make your intention clear.</p><h3>Worked example 1</h3><pre><code>45 % 2 + 3 * 2\n# 1 + 3 * 2\n# 1 + 6\n# 7</code></pre><h3>Worked example 2</h3><pre><code>19 + (5 / 2) + 4 % 2 - 6 * 3\n# 19 + 2.5 + 4 % 2 - 6 * 3\n# 19 + 2.5 + 0 - 18\n# 21.5 - 18\n# 3.5</code></pre>"
    ],
    "group": "Operators in Python"
  },
  {
    "id": "setup",
    "card": [
      "Environment setup",
      ` Environment setup  To write and run Python, you need an editor for source code and a Python interpreter to execute it. An IDE combines editing and development tools in one interface.   Install Python from its official downloads page, or install a beginner IDE that includes an interpreter.  Open your editor or IDE and create a file named  hello.py .  Write  print("Hello World") , save the file and use the IDE's Run command.  Check that the output panel displays  Hello World .   On Windows with Python installed, you can also run  py hello.py  in a terminal. On many macOS and Linux installations, use  python3 hello.py .  Editor and IDE options include Thonny, Spyder, PyDev, IDLE, Visual Studio Code and Wing. For this learning path, use Thonny as the beginner-oriented option. VS Code requires a separately configured Python interpreter. IDLE is included with many Python installations, but availability can depend on the installation package. `,
      "",
      "",
      `<h2>Environment setup</h2><p>To write and run Python, you need an editor for source code and a Python interpreter to execute it. An IDE combines editing and development tools in one interface.</p><ol><li>Install Python from its official downloads page, or install a beginner IDE that includes an interpreter.</li><li>Open your editor or IDE and create a file named <code>hello.py</code>.</li><li>Write <code>print("Hello World")</code>, save the file and use the IDE's Run command.</li><li>Check that the output panel displays <code>Hello World</code>.</li></ol><p>On Windows with Python installed, you can also run <code>py hello.py</code> in a terminal. On many macOS and Linux installations, use <code>python3 hello.py</code>.</p><p>Editor and IDE options include Thonny, Spyder, PyDev, IDLE, Visual Studio Code and Wing. For this learning path, use Thonny as the beginner-oriented option. VS Code requires a separately configured Python interpreter. IDLE is included with many Python installations, but availability can depend on the installation package.</p>`
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "print",
    "card": [
      "Output with print()",
      ` Output with print()   print()  writes text representations of values to standard output, usually your terminal. By default, it separates arguments with a space and ends with a newline.   print('Hello World')
print("Hello World")   Output   Hello World
Hello World   Separate lines and escape sequences   print('Sunday')
print('Monday')
# The same two lines using one call:
print('Sunday\\nMonday')    \\n  means newline,  \\t  means tab, and  \\\\  represents a backslash. Escapes let you include characters that are difficult to write directly in a string.  sep: between arguments   print('Sunday', 'Monday', sep='-')
print('18', '06', '2020', sep='/')
print('is Thursday')    Sunday-Monday
18/06/2020
is Thursday   end: after the output   print('Sunday', 'Monday', end='-')
print('Tuesday')
print('Wednesday')    Sunday Monday-Tuesday
Wednesday   Combine sep and end   print('thomas', 'wilson', sep='', end='@')
print('example.com')    thomaswilson@example.com   Print numeric values   a = 10
b = 20.32
print('a=', a, ' b=', b, sep='', end='\\n\\n')
print('a=', a, sep='')
print('b=', b, sep='')    a=10 b=20.32

a=10
b=20.32  `,
      "",
      "",
      `<h2>Output with print()</h2><p><code>print()</code> writes text representations of values to standard output, usually your terminal. By default, it separates arguments with a space and ends with a newline.</p><pre><code>print('Hello World')
print("Hello World")</code></pre><h3>Output</h3><pre><samp>Hello World
Hello World</samp></pre><h3>Separate lines and escape sequences</h3><pre><code>print('Sunday')
print('Monday')
# The same two lines using one call:
print('Sunday\\nMonday')</code></pre><p><code>\\n</code> means newline, <code>\\t</code> means tab, and <code>\\\\</code> represents a backslash. Escapes let you include characters that are difficult to write directly in a string.</p><h3>sep: between arguments</h3><pre><code>print('Sunday', 'Monday', sep='-')
print('18', '06', '2020', sep='/')
print('is Thursday')</code></pre><pre><samp>Sunday-Monday
18/06/2020
is Thursday</samp></pre><h3>end: after the output</h3><pre><code>print('Sunday', 'Monday', end='-')
print('Tuesday')
print('Wednesday')</code></pre><pre><samp>Sunday Monday-Tuesday
Wednesday</samp></pre><h3>Combine sep and end</h3><pre><code>print('thomas', 'wilson', sep='', end='@')
print('example.com')</code></pre><pre><samp>thomaswilson@example.com</samp></pre><h3>Print numeric values</h3><pre><code>a = 10
b = 20.32
print('a=', a, ' b=', b, sep='', end='\\n\\n')
print('a=', a, sep='')
print('b=', b, sep='')</code></pre><pre><samp>a=10 b=20.32

a=10
b=20.32</samp></pre>`
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "formatting",
    "card": [
      "Formatting output",
      " Formatting output  Formatting places values inside text and controls their displayed representation.   a = 5\nb = 1.326149\nc = 'apples'\nprint('weight of {} {} = {:.2f} kgs'.format(a, c, b))\nprint('weight of %d %s = %.2f kgs' % (a, c, b))\nprint(f'weight of {a} {c} = {b:.2f} kgs')   Each line prints:   weight of 5 apples = 1.33 kgs    {}  is a placeholder for  str.format() ; f-strings put expressions inside braces.  .2f  formats a number to two decimal places. It rounds the displayed representation, not always upward, and leaves the original value unchanged.  In percent formatting,  %d  formats an integer,  %s  formats text,  %f  formats fixed-point numbers and  %%  displays a percent sign. ",
      "",
      "",
      "<h2>Formatting output</h2><p>Formatting places values inside text and controls their displayed representation.</p><pre><code>a = 5\nb = 1.326149\nc = 'apples'\nprint('weight of {} {} = {:.2f} kgs'.format(a, c, b))\nprint('weight of %d %s = %.2f kgs' % (a, c, b))\nprint(f'weight of {a} {c} = {b:.2f} kgs')</code></pre><p>Each line prints:</p><pre><samp>weight of 5 apples = 1.33 kgs</samp></pre><p><code>{}</code> is a placeholder for <code>str.format()</code>; f-strings put expressions inside braces. <code>.2f</code> formats a number to two decimal places. It rounds the displayed representation, not always upward, and leaves the original value unchanged.</p><p>In percent formatting, <code>%d</code> formats an integer, <code>%s</code> formats text, <code>%f</code> formats fixed-point numbers and <code>%%</code> displays a percent sign.</p>"
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "input",
    "card": [
      "Input with input()",
      " Input with input()   input()  reads one line from standard input, usually the keyboard, and returns a string with the trailing newline removed. Its optional prompt is displayed before reading.   n = input('Enter your name: ')\nprint('Hello', n)    Enter your name: Peter\nHello Peter   Convert numeric input   print('Enter an integer and a float number')\na = int(input())\nb = float(input())\nprint('You have entered an integer number', a, 'and a float number', b)    Enter an integer and a float number\n15\n24.153\nYou have entered an integer number 15 and a float number 24.153   Invalid numeric text raises  ValueError ; use exception handling when accepting real user input.  Multiple input calls in one code line   print('Enter roll, name and percentage')\nr, n, p = int(input()), input(), float(input())\nprint('Roll:', r)\nprint('Name:', n)\nprint('Percentage:', p)    Enter roll, name and percentage\n1\nAmit\n87.36\nRoll: 1\nName: Amit\nPercentage: 87.36   There are three input calls, so the user enters three separate lines. To read three space-separated values from one input line instead:   roll, name, percentage = input('Roll name percentage: ').split()\nr, n, p = int(roll), name, float(percentage)   This simple split version expects exactly three fields and a name without spaces. ",
      "",
      "",
      "<h2>Input with input()</h2><p><code>input()</code> reads one line from standard input, usually the keyboard, and returns a string with the trailing newline removed. Its optional prompt is displayed before reading.</p><pre><code>n = input('Enter your name: ')\nprint('Hello', n)</code></pre><pre><samp>Enter your name: Peter\nHello Peter</samp></pre><h3>Convert numeric input</h3><pre><code>print('Enter an integer and a float number')\na = int(input())\nb = float(input())\nprint('You have entered an integer number', a, 'and a float number', b)</code></pre><pre><samp>Enter an integer and a float number\n15\n24.153\nYou have entered an integer number 15 and a float number 24.153</samp></pre><p>Invalid numeric text raises <code>ValueError</code>; use exception handling when accepting real user input.</p><h3>Multiple input calls in one code line</h3><pre><code>print('Enter roll, name and percentage')\nr, n, p = int(input()), input(), float(input())\nprint('Roll:', r)\nprint('Name:', n)\nprint('Percentage:', p)</code></pre><pre><samp>Enter roll, name and percentage\n1\nAmit\n87.36\nRoll: 1\nName: Amit\nPercentage: 87.36</samp></pre><p>There are three input calls, so the user enters three separate lines. To read three space-separated values from one input line instead:</p><pre><code>roll, name, percentage = input('Roll name percentage: ').split()\nr, n, p = int(roll), name, float(percentage)</code></pre><p>This simple split version expects exactly three fields and a name without spaces.</p>"
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "type-function",
    "card": [
      "Inspect values with type()",
      " Inspect values with type()   type()  returns the type of an object.   a = 'apple'\nb = 56\nc = 18.23\nd = True\nprint(type(a))\nprint(type(b))\nprint(type(c))\nprint(type(d))    &lt;class 'str'&gt;\n&lt;class 'int'&gt;\n&lt;class 'float'&gt;\n&lt;class 'bool'&gt;  ",
      "",
      "",
      "<h2>Inspect values with type()</h2><p><code>type()</code> returns the type of an object.</p><pre><code>a = 'apple'\nb = 56\nc = 18.23\nd = True\nprint(type(a))\nprint(type(b))\nprint(type(c))\nprint(type(d))</code></pre><pre><samp>&lt;class 'str'&gt;\n&lt;class 'int'&gt;\n&lt;class 'float'&gt;\n&lt;class 'bool'&gt;</samp></pre>"
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "comments",
    "card": [
      "Comments and docstrings",
      ` Comments and docstrings  A comment begins with  #  outside a string and continues to the end of the line. Comments explain the code and are not executed.   # Print a greeting.
print('Hello World')  # An inline comment

# Explain longer ideas using
# several consecutive comment lines.
# print('This line will not run')   The only executed statement above prints  Hello World .  Triple-quoted strings are not comments  Triple quotes create a string literal. As the first statement in a module, class or function, that string can serve as a docstring. It is not correct to say a string is only processed when assigned to a variable.   def greet():
    """Display a friendly greeting."""
    print('Hello World')

greet()   Use  #  for comments and docstrings for documentation. `,
      "",
      "",
      `<h2>Comments and docstrings</h2><p>A comment begins with <code>#</code> outside a string and continues to the end of the line. Comments explain the code and are not executed.</p><pre><code># Print a greeting.
print('Hello World')  # An inline comment

# Explain longer ideas using
# several consecutive comment lines.
# print('This line will not run')</code></pre><p>The only executed statement above prints <code>Hello World</code>.</p><h3>Triple-quoted strings are not comments</h3><p>Triple quotes create a string literal. As the first statement in a module, class or function, that string can serve as a docstring. It is not correct to say a string is only processed when assigned to a variable.</p><pre><code>def greet():
    """Display a friendly greeting."""
    print('Hello World')

greet()</code></pre><p>Use <code>#</code> for comments and docstrings for documentation.</p>`
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "decisions",
    "card": [
      "Decision making",
      " Decision making  Conditional statements choose which block runs based on a condition's truth value. The core forms are  if ,  if/else  and  if/elif/else .   score = 75\nif score &gt;= 90:\n    print('Excellent')\nelif score &gt;= 60:\n    print('Passed')\nelse:\n    print('Keep practicing')   Output:  Passed . Python checks conditions in order and runs the first matching branch. An optional  else  handles the case when none match. ",
      "",
      "",
      "<h2>Decision making</h2><p>Conditional statements choose which block runs based on a condition's truth value. The core forms are <code>if</code>, <code>if/else</code> and <code>if/elif/else</code>.</p><pre><code>score = 75\nif score &gt;= 90:\n    print('Excellent')\nelif score &gt;= 60:\n    print('Passed')\nelse:\n    print('Keep practicing')</code></pre><p>Output: <code>Passed</code>. Python checks conditions in order and runs the first matching branch. An optional <code>else</code> handles the case when none match.</p>"
    ],
    "group": "Decision Making in Python"
  },
  {
    "id": "if-statement",
    "card": [
      "if statements and indentation",
      " if statements and indentation  An  if  statement runs its indented block only when its condition is true. End the condition with a colon and indent the body. Use four spaces per indentation level; avoid mixing tabs and spaces.   a = 25\nif a &gt; 10:\n    print('Yes', a, 'is greater than 10')    Yes 25 is greater than 10   Arithmetic in a condition   a, b = 10, 5\nif a + b &gt; 10:\n    print('Yes', a + b, 'is greater than 10')    Yes 15 is greater than 10   Combine conditions   a = 18\nif a % 2 == 0 and a &gt; 10:\n    print(a, 'is an even number and is also greater than 10')   The remainder is zero and 18 is greater than 10, so the message prints. Python uses  and , not  &amp;&amp; . ",
      "",
      "",
      "<h2>if statements and indentation</h2><p>An <code>if</code> statement runs its indented block only when its condition is true. End the condition with a colon and indent the body. Use four spaces per indentation level; avoid mixing tabs and spaces.</p><pre><code>a = 25\nif a &gt; 10:\n    print('Yes', a, 'is greater than 10')</code></pre><pre><samp>Yes 25 is greater than 10</samp></pre><h3>Arithmetic in a condition</h3><pre><code>a, b = 10, 5\nif a + b &gt; 10:\n    print('Yes', a + b, 'is greater than 10')</code></pre><pre><samp>Yes 15 is greater than 10</samp></pre><h3>Combine conditions</h3><pre><code>a = 18\nif a % 2 == 0 and a &gt; 10:\n    print(a, 'is an even number and is also greater than 10')</code></pre><p>The remainder is zero and 18 is greater than 10, so the message prints. Python uses <code>and</code>, not <code>&amp;&amp;</code>.</p>"
    ],
    "group": "Decision Making in Python"
  },
  {
    "id": "if-else",
    "card": [
      "if else statements",
      " if else statements  Use  else  to run another block when the condition is false. Exactly one of the two branches runs.   a = 15\nif a % 2 == 0:\n    print(a, 'is an even number')\nelse:\n    print(a, 'is an odd number')    15 is an odd number   The remainder of 15 divided by 2 is 1, so the equality test is false and the else branch executes. ",
      "",
      "",
      "<h2>if else statements</h2><p>Use <code>else</code> to run another block when the condition is false. Exactly one of the two branches runs.</p><pre><code>a = 15\nif a % 2 == 0:\n    print(a, 'is an even number')\nelse:\n    print(a, 'is an odd number')</code></pre><pre><samp>15 is an odd number</samp></pre><p>The remainder of 15 divided by 2 is 1, so the equality test is false and the else branch executes.</p>"
    ],
    "group": "Decision Making in Python"
  },
  {
    "id": "nested-if",
    "card": [
      "Nested if statements",
      " Nested if statements  A nested if sits inside another conditional block. Its condition is checked only when execution reaches that block.   a = 24\nif a % 2 == 0:\n    if a &gt; 20:\n        print(a, 'is an even number and is also greater than 20')\n    else:\n        print(a, 'is an even number but not greater than 20')\nelse:\n    print(a, 'is an odd number')    24 is an even number and is also greater than 20   The outer condition is true, then the inner condition is true. Indentation determines which  if  each  else  belongs to. Try tracing the same program with 18 and 15. ",
      "",
      "",
      "<h2>Nested if statements</h2><p>A nested if sits inside another conditional block. Its condition is checked only when execution reaches that block.</p><pre><code>a = 24\nif a % 2 == 0:\n    if a &gt; 20:\n        print(a, 'is an even number and is also greater than 20')\n    else:\n        print(a, 'is an even number but not greater than 20')\nelse:\n    print(a, 'is an odd number')</code></pre><pre><samp>24 is an even number and is also greater than 20</samp></pre><p>The outer condition is true, then the inner condition is true. Indentation determines which <code>if</code> each <code>else</code> belongs to. Try tracing the same program with 18 and 15.</p>"
    ],
    "group": "Decision Making in Python"
  },
  {
    "id": "elif",
    "card": [
      "if elif: choosing among options",
      " if elif: choosing among options  Python checks an if/elif chain from top to bottom. It executes only the first matching branch and skips the remaining branches. The optional else runs when none match.   a = 20\nif a == 10:\n    print('value of a is 10')\nelif a == 15:\n    print('value of a is 15')\nelif a == 20:\n    print('value of a is 20')\nelse:\n    print('value of a is different')    value of a is 20   The first two comparisons are false. The third is true, so its block runs. Use four spaces for each indentation level. ",
      "",
      "",
      "<h2>if elif: choosing among options</h2><p>Python checks an if/elif chain from top to bottom. It executes only the first matching branch and skips the remaining branches. The optional else runs when none match.</p><pre><code>a = 20\nif a == 10:\n    print('value of a is 10')\nelif a == 15:\n    print('value of a is 15')\nelif a == 20:\n    print('value of a is 20')\nelse:\n    print('value of a is different')</code></pre><pre><samp>value of a is 20</samp></pre><p>The first two comparisons are false. The third is true, so its block runs. Use four spaces for each indentation level.</p>"
    ],
    "group": "Decision Making in Python"
  },
  {
    "id": "math-functions",
    "card": [
      "Mathematical functions",
      " Mathematical functions  Import the  math  module to use these real-number functions. Built-ins such as  abs()  and  pow()  do not require an import.   import math\n\nprint(math.fabs(-18))  # 18.0: absolute value\nprint(math.sqrt(25))   # 5.0: square root\nprint(math.ceil(12.4)) # 13: smallest integer greater than or equal\nprint(math.floor(12.4))# 12: largest integer less than or equal\nprint(f'{math.fmod(5.26, 3.17):.6f}')  # 2.090000\nprint(math.pow(5, 2))  # 25.0   Important details   Absolute value is nonnegative, including zero.  math.fabs()  returns a float.   math.sqrt()  accepts zero and positive real numbers. Negative real input raises ValueError; complex square roots are available through  cmath.sqrt() .  Ceiling and floor leave integers unchanged.  ceil(-12.4)  is -12 and  floor(-12.4)  is -13.   math.fmod(x, y)  has the sign of x. This differs from Python's  % , whose nonzero result has the sign of y.   math.pow()  converts arguments to floats.  5 ** 2  or built-in  pow(5, 2)  produces the integer 25.   Read values and calculate   import math\n\nn = float(input('Enter a nonnegative number: '))\nif n &gt;= 0:\n    print('Square root:', math.sqrt(n))\nelse:\n    print('Please enter zero or a positive number.')   The other examples can likewise use  int(input())  or  float(input())  for their arguments. Invalid numeric text needs exception handling. Avoid integer formatting for fractional results because it can hide the fraction. ",
      "",
      "",
      "<h2>Mathematical functions</h2><p>Import the <code>math</code> module to use these real-number functions. Built-ins such as <code>abs()</code> and <code>pow()</code> do not require an import.</p><pre><code>import math\n\nprint(math.fabs(-18))  # 18.0: absolute value\nprint(math.sqrt(25))   # 5.0: square root\nprint(math.ceil(12.4)) # 13: smallest integer greater than or equal\nprint(math.floor(12.4))# 12: largest integer less than or equal\nprint(f'{math.fmod(5.26, 3.17):.6f}')  # 2.090000\nprint(math.pow(5, 2))  # 25.0</code></pre><h3>Important details</h3><ul><li>Absolute value is nonnegative, including zero. <code>math.fabs()</code> returns a float.</li><li><code>math.sqrt()</code> accepts zero and positive real numbers. Negative real input raises ValueError; complex square roots are available through <code>cmath.sqrt()</code>.</li><li>Ceiling and floor leave integers unchanged. <code>ceil(-12.4)</code> is -12 and <code>floor(-12.4)</code> is -13.</li><li><code>math.fmod(x, y)</code> has the sign of x. This differs from Python's <code>%</code>, whose nonzero result has the sign of y.</li><li><code>math.pow()</code> converts arguments to floats. <code>5 ** 2</code> or built-in <code>pow(5, 2)</code> produces the integer 25.</li></ul><h3>Read values and calculate</h3><pre><code>import math\n\nn = float(input('Enter a nonnegative number: '))\nif n &gt;= 0:\n    print('Square root:', math.sqrt(n))\nelse:\n    print('Please enter zero or a positive number.')</code></pre><p>The other examples can likewise use <code>int(input())</code> or <code>float(input())</code> for their arguments. Invalid numeric text needs exception handling. Avoid integer formatting for fractional results because it can hide the fraction.</p>"
    ],
    "group": "Mathematical Functions"
  },
  {
    "id": "loops",
    "card": [
      "Introduction to loops",
      " Introduction to loops  A loop repeatedly executes a block. Writing the same print statement ten times is manual repetition; loops perform iteration without duplicating the statement.   for _ in range(10):\n    print('Hello World')   This prints ten greetings on separate lines. Change 10 to 100 to repeat one hundred times.    for:  visit items from an iterable, such as a list, string or range.   while:  repeat while a condition remains true.   A for loop is not limited to a predetermined number of iterations: its iterable may supply items dynamically. ",
      "",
      "",
      "<h2>Introduction to loops</h2><p>A loop repeatedly executes a block. Writing the same print statement ten times is manual repetition; loops perform iteration without duplicating the statement.</p><pre><code>for _ in range(10):\n    print('Hello World')</code></pre><p>This prints ten greetings on separate lines. Change 10 to 100 to repeat one hundred times.</p><ul><li><strong>for:</strong> visit items from an iterable, such as a list, string or range.</li><li><strong>while:</strong> repeat while a condition remains true.</li></ul><p>A for loop is not limited to a predetermined number of iterations: its iterable may supply items dynamically.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "for-loop",
    "card": [
      "for loops",
      " for loops  A for loop takes each item from an iterable and assigns it to the loop variable before executing the body. Lists, tuples, strings, sets and dictionaries are iterable; sets are not sequences and have no guaranteed iteration order.   numbers = [10, 12, 8, 25, 82, 64]\nfor x in numbers:\n    print(x)    10\n12\n8\n25\n82\n64   Visit characters   for letter in 'Pineapple':\n    print(letter)    P\ni\nn\ne\na\np\np\nl\ne  ",
      "",
      "",
      "<h2>for loops</h2><p>A for loop takes each item from an iterable and assigns it to the loop variable before executing the body. Lists, tuples, strings, sets and dictionaries are iterable; sets are not sequences and have no guaranteed iteration order.</p><pre><code>numbers = [10, 12, 8, 25, 82, 64]\nfor x in numbers:\n    print(x)</code></pre><pre><samp>10\n12\n8\n25\n82\n64</samp></pre><h3>Visit characters</h3><pre><code>for letter in 'Pineapple':\n    print(letter)</code></pre><pre><samp>P\ni\nn\ne\na\np\np\nl\ne</samp></pre>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "range",
    "card": [
      "Counting with range()",
      " Counting with range()   range(start, stop, step)  represents an integer sequence. Start defaults to 0 and step to 1. The stop value is always excluded; step cannot be zero. The last value is not necessarily stop minus one.   for x in range(1, 11):\n    print(x)  # 1 through 10, one per line\n\nfor x in range(10, 21, 2):\n    print(x)  # 10, 12, 14, 16, 18, 20, one per line\n\nfor x in range(10, 0, -1):\n    print(x)  # 10 down to 1, one per line   A negative step counts downward. If the step goes away from the stop boundary, the range is empty.   print(list(range(1, 10, 2)))  # [1, 3, 5, 7, 9]\nprint(list(range(1, 5, -1)))  # []  ",
      "",
      "",
      "<h2>Counting with range()</h2><p><code>range(start, stop, step)</code> represents an integer sequence. Start defaults to 0 and step to 1. The stop value is always excluded; step cannot be zero. The last value is not necessarily stop minus one.</p><pre><code>for x in range(1, 11):\n    print(x)  # 1 through 10, one per line\n\nfor x in range(10, 21, 2):\n    print(x)  # 10, 12, 14, 16, 18, 20, one per line\n\nfor x in range(10, 0, -1):\n    print(x)  # 10 down to 1, one per line</code></pre><p>A negative step counts downward. If the step goes away from the stop boundary, the range is empty.</p><pre><code>print(list(range(1, 10, 2)))  # [1, 3, 5, 7, 9]\nprint(list(range(1, 5, -1)))  # []</code></pre>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "nested-for",
    "card": [
      "Nested for loops",
      " Nested for loops  An inner loop runs inside each iteration of the outer loop. Here the outer loop chooses the row and the inner loop prints numbers from 1 through that row number.   for x in range(1, 6):\n    for y in range(1, x + 1):\n        print(y, end='')\n    print()    1\n12\n123\n1234\n12345    x + 1  is excluded by range, so the last printed number in each row is x. The empty print call moves to the next line. ",
      "",
      "",
      "<h2>Nested for loops</h2><p>An inner loop runs inside each iteration of the outer loop. Here the outer loop chooses the row and the inner loop prints numbers from 1 through that row number.</p><pre><code>for x in range(1, 6):\n    for y in range(1, x + 1):\n        print(y, end='')\n    print()</code></pre><pre><samp>1\n12\n123\n1234\n12345</samp></pre><p><code>x + 1</code> is excluded by range, so the last printed number in each row is x. The empty print call moves to the next line.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "while-loop",
    "card": [
      "while loops",
      " while loops  A while loop tests its condition before each iteration. It can run zero times. Update the relevant state or provide a way to exit so it can finish.   i = 1\nwhile i &lt;= 5:\n    print('Hello World')\n    i += 1   This prints five greetings on separate lines. Then i becomes 6 and the condition is false.  Count upward   i = 1\nwhile i &lt;= 10:\n    print(i)\n    i += 1   Even numbers from 10 to 20   i = 10\nwhile i &lt;= 20:\n    print(i)\n    i += 2   Count backward   i = 10\nwhile i &gt;= 1:\n    print(i)\n    i -= 1   Each print call outputs its number on a separate line. A while loop can also be used for a known count, though range with for is often clearer. ",
      "",
      "",
      "<h2>while loops</h2><p>A while loop tests its condition before each iteration. It can run zero times. Update the relevant state or provide a way to exit so it can finish.</p><pre><code>i = 1\nwhile i &lt;= 5:\n    print('Hello World')\n    i += 1</code></pre><p>This prints five greetings on separate lines. Then i becomes 6 and the condition is false.</p><h3>Count upward</h3><pre><code>i = 1\nwhile i &lt;= 10:\n    print(i)\n    i += 1</code></pre><h3>Even numbers from 10 to 20</h3><pre><code>i = 10\nwhile i &lt;= 20:\n    print(i)\n    i += 2</code></pre><h3>Count backward</h3><pre><code>i = 10\nwhile i &gt;= 1:\n    print(i)\n    i -= 1</code></pre><p>Each print call outputs its number on a separate line. A while loop can also be used for a known count, though range with for is often clearer.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "digit-sum",
    "card": [
      "While quest: sum the digits",
      " While quest: sum the digits  For a positive integer,  n % 10  extracts the last digit and  n // 10  removes it. Repeat until there are no digits left.   sd = 0\nn = int(input('Enter a 4 digit number: '))\nif 1000 &lt;= n &lt;= 9999:\n    while n &gt; 0:\n        r = n % 10\n        sd += r\n        n //= 10\n    print('Sum of digits =', sd)\nelse:\n    print('Not a 4 digit number')    Enter a 4 digit number: 2461\nSum of digits = 13   Trace it: extract 1, then 6, then 4, then 2. Their sum is 13. The loop changes n to zero; save a copy first if you need the original number later. Non-numeric input raises ValueError. ",
      "",
      "",
      "<h2>While quest: sum the digits</h2><p>For a positive integer, <code>n % 10</code> extracts the last digit and <code>n // 10</code> removes it. Repeat until there are no digits left.</p><pre><code>sd = 0\nn = int(input('Enter a 4 digit number: '))\nif 1000 &lt;= n &lt;= 9999:\n    while n &gt; 0:\n        r = n % 10\n        sd += r\n        n //= 10\n    print('Sum of digits =', sd)\nelse:\n    print('Not a 4 digit number')</code></pre><pre><samp>Enter a 4 digit number: 2461\nSum of digits = 13</samp></pre><p>Trace it: extract 1, then 6, then 4, then 2. Their sum is 13. The loop changes n to zero; save a copy first if you need the original number later. Non-numeric input raises ValueError.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "nested-while",
    "card": [
      "Nested while loops",
      " Nested while loops  Reset the inner counter for each outer iteration. Otherwise later rows may be skipped.   i = 1\nwhile i &lt;= 5:\n    j = 1\n    while j &lt;= i:\n        print(j, end='')\n        j += 1\n    print()\n    i += 1    1\n12\n123\n1234\n12345   The outer loop counts rows. The inner loop counts from 1 through the current row number, just as in the nested for example. ",
      "",
      "",
      "<h2>Nested while loops</h2><p>Reset the inner counter for each outer iteration. Otherwise later rows may be skipped.</p><pre><code>i = 1\nwhile i &lt;= 5:\n    j = 1\n    while j &lt;= i:\n        print(j, end='')\n        j += 1\n    print()\n    i += 1</code></pre><pre><samp>1\n12\n123\n1234\n12345</samp></pre><p>The outer loop counts rows. The inner loop counts from 1 through the current row number, just as in the nested for example.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "unbounded-loops",
    "card": [
      "Unbounded loops and break",
      " Unbounded loops and break   while True  has no condition-based end. A break statement exits the innermost loop. Python uses indentation, not braces, for the body.   i = 0\nwhile True:\n    print('Hello World')\n    i += 1\n    if i == 5:\n        break   This program finishes after five greetings because it includes an exit condition.  A for loop with an unbounded iterable   import itertools\n\ni = 0\nfor x in itertools.repeat(1):\n    print('Hello World')\n    i += 1\n    if i == 5:\n        break    itertools.repeat(1)  supplies 1 indefinitely, but break ends this loop after five iterations. itertools is one way to create an unbounded iterable; it is not required for every such loop. ",
      "",
      "",
      "<h2>Unbounded loops and break</h2><p><code>while True</code> has no condition-based end. A break statement exits the innermost loop. Python uses indentation, not braces, for the body.</p><pre><code>i = 0\nwhile True:\n    print('Hello World')\n    i += 1\n    if i == 5:\n        break</code></pre><p>This program finishes after five greetings because it includes an exit condition.</p><h3>A for loop with an unbounded iterable</h3><pre><code>import itertools\n\ni = 0\nfor x in itertools.repeat(1):\n    print('Hello World')\n    i += 1\n    if i == 5:\n        break</code></pre><p><code>itertools.repeat(1)</code> supplies 1 indefinitely, but break ends this loop after five iterations. itertools is one way to create an unbounded iterable; it is not required for every such loop.</p>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "break",
    "card": [
      "break: exit a loop",
      " break: exit a loop  break exits the innermost enclosing for or while loop. Execution continues after that loop; a loop's optional else block is skipped.   for x in range(2, 50, 2):\n    if x == 10:\n        break\n    print(x, end=' ')\n# Output: 2 4 6 8   Nested loops   for x in range(1, 6):\n    for y in range(1, 11):\n        if y &gt; 3:\n            break\n        print(y, end=' ')\n    print()    1 2 3\n1 2 3\n1 2 3\n1 2 3\n1 2 3   The inner loop reaches y = 4 but exits before printing it. The outer loop still runs five times.   import itertools\ni = 1\nfor x in itertools.repeat(1):\n    if i &gt; 10:\n        break\n    print(i, end=' ')\n    i += 1\n# Output: 1 2 3 4 5 6 7 8 9 10  ",
      "",
      "",
      "<h2>break: exit a loop</h2><p>break exits the innermost enclosing for or while loop. Execution continues after that loop; a loop's optional else block is skipped.</p><pre><code>for x in range(2, 50, 2):\n    if x == 10:\n        break\n    print(x, end=' ')\n# Output: 2 4 6 8</code></pre><h3>Nested loops</h3><pre><code>for x in range(1, 6):\n    for y in range(1, 11):\n        if y &gt; 3:\n            break\n        print(y, end=' ')\n    print()</code></pre><pre><samp>1 2 3\n1 2 3\n1 2 3\n1 2 3\n1 2 3</samp></pre><p>The inner loop reaches y = 4 but exits before printing it. The outer loop still runs five times.</p><pre><code>import itertools\ni = 1\nfor x in itertools.repeat(1):\n    if i &gt; 10:\n        break\n    print(i, end=' ')\n    i += 1\n# Output: 1 2 3 4 5 6 7 8 9 10</code></pre>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "continue",
    "card": [
      "continue: skip an iteration",
      " continue: skip an iteration  continue skips the remaining body of the current iteration. A for loop moves to the next item; a while loop retests its condition. Python has no native do-while statement.   for x in range(1, 11):\n    if x == 6:\n        continue\n    print(x, end=' ')\n# Output: 1 2 3 4 5 7 8 9 10   In a while loop, ensure required updates happen before continue; skipping a counter update can prevent the loop from ending.   i = 0\nwhile i &lt; 10:\n    i += 1\n    if i == 6:\n        continue\n    print(i, end=' ')  ",
      "",
      "",
      "<h2>continue: skip an iteration</h2><p>continue skips the remaining body of the current iteration. A for loop moves to the next item; a while loop retests its condition. Python has no native do-while statement.</p><pre><code>for x in range(1, 11):\n    if x == 6:\n        continue\n    print(x, end=' ')\n# Output: 1 2 3 4 5 7 8 9 10</code></pre><p>In a while loop, ensure required updates happen before continue; skipping a counter update can prevent the loop from ending.</p><pre><code>i = 0\nwhile i &lt; 10:\n    i += 1\n    if i == 6:\n        continue\n    print(i, end=' ')</code></pre>"
    ],
    "group": "Loops in Python"
  },
  {
    "id": "strings",
    "card": [
      "Strings in Python",
      ` Strings in Python  A string is an immutable sequence of Unicode code points used for text. A single character is also a string. Being a sequence describes ordered access, not a promise about physical memory layout.   text = 'DREMENDO'
print(text)
text = "Dremendo"
print(text)
message = '''We are learning Python
with PYQUEST'''
print(message)    DREMENDO
Dremendo
We are learning Python
with PYQUEST   Use names like text rather than str, which would hide Python's built-in str type.   text = 'DREMENDO'
print(text[2])   # E
print(text[-2])  # D
# text[0] = 'X' would raise TypeError   Indexing starts at 0; negative indices count from the end. An out-of-range index raises IndexError. `,
      "",
      "",
      `<h2>Strings in Python</h2><p>A string is an immutable sequence of Unicode code points used for text. A single character is also a string. Being a sequence describes ordered access, not a promise about physical memory layout.</p><pre><code>text = 'DREMENDO'
print(text)
text = "Dremendo"
print(text)
message = '''We are learning Python
with PYQUEST'''
print(message)</code></pre><pre><samp>DREMENDO
Dremendo
We are learning Python
with PYQUEST</samp></pre><p>Use names like text rather than str, which would hide Python's built-in str type.</p><pre><code>text = 'DREMENDO'
print(text[2])   # E
print(text[-2])  # D
# text[0] = 'X' would raise TypeError</code></pre><p>Indexing starts at 0; negative indices count from the end. An out-of-range index raises IndexError.</p>`
    ],
    "group": "String in Python"
  },
  {
    "id": "string-slicing",
    "card": [
      "String slicing",
      " String slicing  Use  text[start:stop:step] . The stop index is excluded. Omitted bounds depend on the step direction; step cannot be zero.   text = 'DREMENDO'\nprint(text[0])      # D\nprint(text[4])      # E\nprint(text[-7])     # R\nprint(text[0:3])    # DRE\nprint(text[2:6])    # EMEN\nprint(text[-7:-4])  # REM\nprint(text[::2])    # DEED\nprint(text[1::3])   # REO\nprint(text[2:5:2])  # EE\nprint(text[::-1])   # ODNEMERD   Slicing produces a string without modifying the original. Unlike single indexing, slice bounds can extend past the end. ",
      "",
      "",
      "<h2>String slicing</h2><p>Use <code>text[start:stop:step]</code>. The stop index is excluded. Omitted bounds depend on the step direction; step cannot be zero.</p><pre><code>text = 'DREMENDO'\nprint(text[0])      # D\nprint(text[4])      # E\nprint(text[-7])     # R\nprint(text[0:3])    # DRE\nprint(text[2:6])    # EMEN\nprint(text[-7:-4])  # REM\nprint(text[::2])    # DEED\nprint(text[1::3])   # REO\nprint(text[2:5:2])  # EE\nprint(text[::-1])   # ODNEMERD</code></pre><p>Slicing produces a string without modifying the original. Unlike single indexing, slice bounds can extend past the end.</p>"
    ],
    "group": "String in Python"
  },
  {
    "id": "string-operations",
    "card": [
      "String operations and formatting",
      ` String operations and formatting   print('Python' + ' Programming')  # Python Programming
print('Go! ' * 3)                 # Go! Go! Go!
print(len('Dremendo'))            # 8
for ch in 'Python':
    print(ch)  # One character per line
print('pp' in 'Apple')            # True
print('px' in 'Apple')            # False
print('mx' not in 'Apple')        # True   Escape sequences include  \\n  newline,  \\r  carriage return,  \\f  form feed,  \\b  backspace,  \\t  tab,  \\\\  backslash and escaped quotes.   print("David asked \\"What's your name?\\"")
a, b, c, d = 5, 12.654, 'Andrew', True
print('{} {} {} {}'.format(a, b, c, d))
print('{1} {3} {0} {2}'.format(a, b, c, d))
print('{name}: {value:.2f}'.format(name=c, value=b))
# Andrew: 12.65
print('Integer=%d Float=%.2f Name=%s Boolean=%s' % (a, b, c, d))   Percent formats include %d and %i for integers, %f for fixed-point numbers, %c for a character, %s for text, %o for octal and %x / %X for hexadecimal. Decimal formatting rounds the displayed value rather than always rounding upward. `,
      "",
      "",
      `<h2>String operations and formatting</h2><pre><code>print('Python' + ' Programming')  # Python Programming
print('Go! ' * 3)                 # Go! Go! Go!
print(len('Dremendo'))            # 8
for ch in 'Python':
    print(ch)  # One character per line
print('pp' in 'Apple')            # True
print('px' in 'Apple')            # False
print('mx' not in 'Apple')        # True</code></pre><p>Escape sequences include <code>\\n</code> newline, <code>\\r</code> carriage return, <code>\\f</code> form feed, <code>\\b</code> backspace, <code>\\t</code> tab, <code>\\\\</code> backslash and escaped quotes.</p><pre><code>print("David asked \\"What's your name?\\"")
a, b, c, d = 5, 12.654, 'Andrew', True
print('{} {} {} {}'.format(a, b, c, d))
print('{1} {3} {0} {2}'.format(a, b, c, d))
print('{name}: {value:.2f}'.format(name=c, value=b))
# Andrew: 12.65
print('Integer=%d Float=%.2f Name=%s Boolean=%s' % (a, b, c, d))</code></pre><p>Percent formats include %d and %i for integers, %f for fixed-point numbers, %c for a character, %s for text, %o for octal and %x / %X for hexadecimal. Decimal formatting rounds the displayed value rather than always rounding upward.</p>`
    ],
    "group": "String in Python"
  },
  {
    "id": "string-search",
    "card": [
      "String methods: search",
      " String methods: search   text = 'hello Python hello'\nprint(text.find('hello'))       # 0\nprint(text.find('hello', 1))    # 13\nprint(text.find('missing'))     # -1\nprint(text.rfind('hello'))      # 13\nprint(text.count('hello'))      # 2\nprint(text.count('hello', 1))   # 1\nprint(text.startswith('hello'))# True\nprint(text.endswith('Python')) # False   find returns the first matching index; rfind returns the last. Both return -1 for no match and accept optional start and stop bounds. count counts non-overlapping occurrences. startswith and endswith test prefixes and suffixes, optionally within a bounded slice. ",
      "",
      "",
      "<h2>String methods: search</h2><pre><code>text = 'hello Python hello'\nprint(text.find('hello'))       # 0\nprint(text.find('hello', 1))    # 13\nprint(text.find('missing'))     # -1\nprint(text.rfind('hello'))      # 13\nprint(text.count('hello'))      # 2\nprint(text.count('hello', 1))   # 1\nprint(text.startswith('hello'))# True\nprint(text.endswith('Python')) # False</code></pre><p>find returns the first matching index; rfind returns the last. Both return -1 for no match and accept optional start and stop bounds. count counts non-overlapping occurrences. startswith and endswith test prefixes and suffixes, optionally within a bounded slice.</p>"
    ],
    "group": "String in Python"
  },
  {
    "id": "string-checks",
    "card": [
      "String methods: validation",
      " String methods: validation   print('section2b'.isalnum())   # True\nprint('section 2b'.isalnum())  # False\nprint('sectionb'.isalpha())    # True\nprint('section-b'.isalpha())   # False\nprint('2586'.isdigit())        # True\nprint('2586a'.isdigit())       # False\nprint('2-apple 1-ball'.islower()) # True\nprint('2-APPLE 1-BALL'.isupper()) # True   isalnum, isalpha and isdigit require a nonempty string and use Unicode character classifications. islower and isupper require at least one cased character; digits and punctuation do not determine case. isdigit is not a general test for text accepted by float or int. ",
      "",
      "",
      "<h2>String methods: validation</h2><pre><code>print('section2b'.isalnum())   # True\nprint('section 2b'.isalnum())  # False\nprint('sectionb'.isalpha())    # True\nprint('section-b'.isalpha())   # False\nprint('2586'.isdigit())        # True\nprint('2586a'.isdigit())       # False\nprint('2-apple 1-ball'.islower()) # True\nprint('2-APPLE 1-BALL'.isupper()) # True</code></pre><p>isalnum, isalpha and isdigit require a nonempty string and use Unicode character classifications. islower and isupper require at least one cased character; digits and punctuation do not determine case. isdigit is not a general test for text accepted by float or int.</p>"
    ],
    "group": "String in Python"
  },
  {
    "id": "string-transform",
    "card": [
      "String methods: transform",
      " String methods: transform  These methods return new values; strings remain unchanged.   print('PYTHON'.lower())            # python\nprint('python'.upper())            # PYTHON\nprint('hello WORLD'.capitalize())  # Hello world\nprint('hello world'.title())       # Hello World\nprint('heLLo'.swapcase())          # HEllO\nprint('dog dog'.replace('dog', 'cat', 1)) # cat dog\nprint('  Hello World  '.strip())   # Hello World\nprint('***Hello***'.strip('*'))    # Hello\nprint('Hello   how are you'.split())\n# ['Hello', 'how', 'are', 'you']\nprint('apple-banana-orange'.split('-'))\n# ['apple', 'banana', 'orange']   capitalize also lowercases the rest of the string. strip removes any of the supplied characters from both ends, not an exact prefix or suffix. split returns a list; without a separator it groups whitespace. replace accepts an optional maximum replacement count. ",
      "",
      "",
      "<h2>String methods: transform</h2><p>These methods return new values; strings remain unchanged.</p><pre><code>print('PYTHON'.lower())            # python\nprint('python'.upper())            # PYTHON\nprint('hello WORLD'.capitalize())  # Hello world\nprint('hello world'.title())       # Hello World\nprint('heLLo'.swapcase())          # HEllO\nprint('dog dog'.replace('dog', 'cat', 1)) # cat dog\nprint('  Hello World  '.strip())   # Hello World\nprint('***Hello***'.strip('*'))    # Hello\nprint('Hello   how are you'.split())\n# ['Hello', 'how', 'are', 'you']\nprint('apple-banana-orange'.split('-'))\n# ['apple', 'banana', 'orange']</code></pre><p>capitalize also lowercases the rest of the string. strip removes any of the supplied characters from both ends, not an exact prefix or suffix. split returns a list; without a separator it groups whitespace. replace accepts an optional maximum replacement count.</p>"
    ],
    "group": "String in Python"
  },
  {
    "id": "arrays",
    "card": [
      "Arrays",
      " Arrays  The standard-library array type stores compact, mutable sequences of values restricted by a type code. It can grow and shrink. Use a list when you need a general collection of arbitrary objects.   from array import array\nnumbers = array('i', [15, 2, 49, 51, 86])\ndecimals = array('d', [18.23, 24.11, 44])\ncopy = array(numbers.typecode, numbers)\nempty = array('i')\nnumbers[0] = 12\nprint(numbers[:3])  # array('i', [12, 2, 49])\nfor value in decimals:\n    print(value)  # 18.23, 24.11, 44.0 on separate lines   Common codes: b/B for signed/unsigned byte integers, h/H for short integers, i/I for integers, l/L for long integers, and f/d for floating-point values. These integer codes map to Python int, not a separate Python 3 long type. Storage sizes depend on the code and platform; inspect  numbers.itemsize . For beginner text handling, use str rather than a character array. ",
      "",
      "",
      "<h2>Arrays</h2><p>The standard-library array type stores compact, mutable sequences of values restricted by a type code. It can grow and shrink. Use a list when you need a general collection of arbitrary objects.</p><pre><code>from array import array\nnumbers = array('i', [15, 2, 49, 51, 86])\ndecimals = array('d', [18.23, 24.11, 44])\ncopy = array(numbers.typecode, numbers)\nempty = array('i')\nnumbers[0] = 12\nprint(numbers[:3])  # array('i', [12, 2, 49])\nfor value in decimals:\n    print(value)  # 18.23, 24.11, 44.0 on separate lines</code></pre><p>Common codes: b/B for signed/unsigned byte integers, h/H for short integers, i/I for integers, l/L for long integers, and f/d for floating-point values. These integer codes map to Python int, not a separate Python 3 long type. Storage sizes depend on the code and platform; inspect <code>numbers.itemsize</code>. For beginner text handling, use str rather than a character array.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "array-methods",
    "card": [
      "Array methods",
      " Array methods   from array import array\na = array('i', [11, 9, 26, 34, 26])\na.append(88)       # Add one item\na.extend([7, 8])   # Add compatible values\nprint(a.count(26)) # 2\nprint(a.index(26)) # 2\na.insert(2, 59)    # Insert before index 2\nprint(a.pop())     # 8: remove last item\na.pop(2)          # Remove at index 2\na.remove(26)      # Remove first matching value\na.reverse()       # Reverse in place\nprint(a)          # array('i', [7, 88, 26, 34, 9, 11])   index and remove raise ValueError when no matching value exists. pop raises IndexError for an invalid index or empty array.   values = array('i')\nfor i in range(5):\n    values.append(int(input('Number: ')))\nfor i in range(len(values)):\n    print(values[i])  ",
      "",
      "",
      "<h2>Array methods</h2><pre><code>from array import array\na = array('i', [11, 9, 26, 34, 26])\na.append(88)       # Add one item\na.extend([7, 8])   # Add compatible values\nprint(a.count(26)) # 2\nprint(a.index(26)) # 2\na.insert(2, 59)    # Insert before index 2\nprint(a.pop())     # 8: remove last item\na.pop(2)          # Remove at index 2\na.remove(26)      # Remove first matching value\na.reverse()       # Reverse in place\nprint(a)          # array('i', [7, 88, 26, 34, 9, 11])</code></pre><p>index and remove raise ValueError when no matching value exists. pop raises IndexError for an invalid index or empty array.</p><pre><code>values = array('i')\nfor i in range(5):\n    values.append(int(input('Number: ')))\nfor i in range(len(values)):\n    print(values[i])</code></pre>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "lists",
    "card": [
      "Lists",
      " Lists  Lists are ordered, mutable collections that can hold values of different types. Create one with brackets or list(iterable).   numbers = [15, 2, 49, 51, 86]\ndecimals = [18.23, 24.11]\nvowels = ['a', 'e', 'i', 'o', 'u']\nmixed = [15, 'Henry', 70.33, True]\nempty = []\nprint(list('Python'))  # ['P', 'y', 't', 'h', 'o', 'n']\nprint(list((12, 89))) # [12, 89]\nnumbers[0] = 12\nprint(numbers[:3])   # [12, 2, 49]\nprint(numbers[-1])   # 86\nprint(numbers[::2])  # [12, 49, 86]\nprint(numbers + [7]) # [12, 2, 49, 51, 86, 7]\nprint(49 in numbers) # True   Slicing uses start:stop:step, excluding stop. list(existing_list) and slicing make shallow copies: nested objects are still shared. ",
      "",
      "",
      "<h2>Lists</h2><p>Lists are ordered, mutable collections that can hold values of different types. Create one with brackets or list(iterable).</p><pre><code>numbers = [15, 2, 49, 51, 86]\ndecimals = [18.23, 24.11]\nvowels = ['a', 'e', 'i', 'o', 'u']\nmixed = [15, 'Henry', 70.33, True]\nempty = []\nprint(list('Python'))  # ['P', 'y', 't', 'h', 'o', 'n']\nprint(list((12, 89))) # [12, 89]\nnumbers[0] = 12\nprint(numbers[:3])   # [12, 2, 49]\nprint(numbers[-1])   # 86\nprint(numbers[::2])  # [12, 49, 86]\nprint(numbers + [7]) # [12, 2, 49, 51, 86, 7]\nprint(49 in numbers) # True</code></pre><p>Slicing uses start:stop:step, excluding stop. list(existing_list) and slicing make shallow copies: nested objects are still shared.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "list-methods",
    "card": [
      "List methods and functions",
      " List methods and functions   a = [11, 9, 26, 34, 26]\na.append(88)\na.extend([7, 8])\nprint(a.count(26)) # 2\nprint(a.index(26)) # 2\na.insert(2, 59)\nprint(a.pop())     # 8\na.remove(26)\na.reverse()\na.sort()\nprint(a)          # [7, 9, 11, 26, 34, 59, 88]\na.sort(reverse=True)\nprint(max(a), min(a), len(a)) # 88 7 7\na.clear()\nprint(a)          # []   append adds one object; extend adds items from an iterable. pop removes by index and returns the item; remove removes the first equal value. sort and reverse change the list in place and return None. Sorting requires comparable items or a suitable key. max/min need nonempty input unless a default is provided.   values = []\nfor i in range(5):\n    values.append(int(input('Number: ')))\nfor i in range(len(values)):\n    print(values[i])  ",
      "",
      "",
      "<h2>List methods and functions</h2><pre><code>a = [11, 9, 26, 34, 26]\na.append(88)\na.extend([7, 8])\nprint(a.count(26)) # 2\nprint(a.index(26)) # 2\na.insert(2, 59)\nprint(a.pop())     # 8\na.remove(26)\na.reverse()\na.sort()\nprint(a)          # [7, 9, 11, 26, 34, 59, 88]\na.sort(reverse=True)\nprint(max(a), min(a), len(a)) # 88 7 7\na.clear()\nprint(a)          # []</code></pre><p>append adds one object; extend adds items from an iterable. pop removes by index and returns the item; remove removes the first equal value. sort and reverse change the list in place and return None. Sorting requires comparable items or a suitable key. max/min need nonempty input unless a default is provided.</p><pre><code>values = []\nfor i in range(5):\n    values.append(int(input('Number: ')))\nfor i in range(len(values)):\n    print(values[i])</code></pre>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "nested-lists",
    "card": [
      "Nested lists and matrices",
      " Nested lists and matrices   people = [[1, 'Allen', 15], [2, 'Peter', 17], [3, 'Stephen', 16]]\nprint(people[1][1])  # Peter\nfor row in people:\n    print(*row)   Access a cell with  matrix[row_index][column_index] .   matrix = [[], [], []]\ntotal = 0\nfor r in range(3):\n    for c in range(3):\n        matrix[r].append(int(input('Number: ')))\nfor row in matrix:\n    print(*row)\n    total += sum(row)\nprint('Sum of all the numbers =', total)   For rows [12, 18, 45], [63, 20, 47], [33, 84, 96], the total is 418. Create independent row lists;  [[]] * 3  repeats references to the same inner list. ",
      "",
      "",
      "<h2>Nested lists and matrices</h2><pre><code>people = [[1, 'Allen', 15], [2, 'Peter', 17], [3, 'Stephen', 16]]\nprint(people[1][1])  # Peter\nfor row in people:\n    print(*row)</code></pre><p>Access a cell with <code>matrix[row_index][column_index]</code>.</p><pre><code>matrix = [[], [], []]\ntotal = 0\nfor r in range(3):\n    for c in range(3):\n        matrix[r].append(int(input('Number: ')))\nfor row in matrix:\n    print(*row)\n    total += sum(row)\nprint('Sum of all the numbers =', total)</code></pre><p>For rows [12, 18, 45], [63, 20, 47], [33, 84, 96], the total is 418. Create independent row lists; <code>[[]] * 3</code> repeats references to the same inner list.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "tuples",
    "card": [
      "Tuples",
      " Tuples  Tuples are ordered, immutable sequences. Their element references cannot be replaced, but a mutable object stored inside a tuple can still change.   values = (15, 26, 49, 51, 86)\nsingle = (15,)  # The comma makes a one-item tuple\nempty = ()\nmixed = (15, 'Henry', 70.33)\nprint(tuple('Py'))    # ('P', 'y')\nprint(values[0:3])   # (15, 26, 49)\nprint(values[-1])    # 86\nprint(values + (7,)) # (15, 26, 49, 51, 86, 7)\nprint(49 in values)  # True\nprint(values.count(49), values.index(49)) # 1 2\nprint(max(values), min(values), len(values)) # 86 15 5   index raises ValueError when a value is absent. Tuples support iteration and slicing but have no append or remove methods.   people = ((1, 'Allen', 15), (2, 'Peter', 17))\nprint(people[1][1])  # Peter\nfor row in people:\n    print(*row)  ",
      "",
      "",
      "<h2>Tuples</h2><p>Tuples are ordered, immutable sequences. Their element references cannot be replaced, but a mutable object stored inside a tuple can still change.</p><pre><code>values = (15, 26, 49, 51, 86)\nsingle = (15,)  # The comma makes a one-item tuple\nempty = ()\nmixed = (15, 'Henry', 70.33)\nprint(tuple('Py'))    # ('P', 'y')\nprint(values[0:3])   # (15, 26, 49)\nprint(values[-1])    # 86\nprint(values + (7,)) # (15, 26, 49, 51, 86, 7)\nprint(49 in values)  # True\nprint(values.count(49), values.index(49)) # 1 2\nprint(max(values), min(values), len(values)) # 86 15 5</code></pre><p>index raises ValueError when a value is absent. Tuples support iteration and slicing but have no append or remove methods.</p><pre><code>people = ((1, 'Allen', 15), (2, 'Peter', 17))\nprint(people[1][1])  # Peter\nfor row in people:\n    print(*row)</code></pre>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "sets",
    "card": [
      "Sets",
      " Sets  A set is an unordered collection of unique, hashable elements. Sets are mutable but do not support indexing or slicing. Printed order is not guaranteed.   a = {1, 2, 2, 3}\nprint(len(a))       # 3\nprint(2 in a)       # True\nprint(set('apple') == {'a', 'p', 'l', 'e'}) # True\nempty = set()       # {} makes a dictionary\na.add(4)\na.discard(99)       # Missing value: no error\na.remove(2)        # Missing value would raise KeyError\ncopy = a.copy()\nitem = a.pop()      # Removes an arbitrary element, not a random sample\na.clear()   Lists and dictionaries cannot be set elements because they are unhashable. Use len to count elements and max/min for comparable, nonempty sets. pop on an empty set raises KeyError. copy is shallow. ",
      "",
      "",
      "<h2>Sets</h2><p>A set is an unordered collection of unique, hashable elements. Sets are mutable but do not support indexing or slicing. Printed order is not guaranteed.</p><pre><code>a = {1, 2, 2, 3}\nprint(len(a))       # 3\nprint(2 in a)       # True\nprint(set('apple') == {'a', 'p', 'l', 'e'}) # True\nempty = set()       # {} makes a dictionary\na.add(4)\na.discard(99)       # Missing value: no error\na.remove(2)        # Missing value would raise KeyError\ncopy = a.copy()\nitem = a.pop()      # Removes an arbitrary element, not a random sample\na.clear()</code></pre><p>Lists and dictionaries cannot be set elements because they are unhashable. Use len to count elements and max/min for comparable, nonempty sets. pop on an empty set raises KeyError. copy is shallow.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "set-operations",
    "card": [
      "Set operations",
      " Set operations   a, b = {1, 2, 3}, {3, 4}\nprint(sorted(a.union(b)))                # [1, 2, 3, 4]\nprint(sorted(a.intersection(b)))         # [3]\nprint(sorted(a.difference(b)))           # [1, 2]\nprint(sorted(a.symmetric_difference(b))) # [1, 2, 4]\nprint(a.isdisjoint(b))                   # False\nprint({1, 2}.issubset(a))                # True\nprint(a.issuperset({1, 2}))              # True   Union includes either set; intersection includes both; difference keeps only the left set's unmatched elements; symmetric difference excludes shared elements. sorted is used only to display deterministic numeric output.   a = {1, 2, 3}\na.update([4, 5])             # {1, 2, 3, 4, 5}\na.intersection_update({2, 3, 4}) # {2, 3, 4}\na.difference_update({2})     # {3, 4}\na.symmetric_difference_update({4, 5}) # {3, 5}   The update variants modify the original set. union, intersection and difference can accept multiple iterables; symmetric_difference accepts one. ",
      "",
      "",
      "<h2>Set operations</h2><pre><code>a, b = {1, 2, 3}, {3, 4}\nprint(sorted(a.union(b)))                # [1, 2, 3, 4]\nprint(sorted(a.intersection(b)))         # [3]\nprint(sorted(a.difference(b)))           # [1, 2]\nprint(sorted(a.symmetric_difference(b))) # [1, 2, 4]\nprint(a.isdisjoint(b))                   # False\nprint({1, 2}.issubset(a))                # True\nprint(a.issuperset({1, 2}))              # True</code></pre><p>Union includes either set; intersection includes both; difference keeps only the left set's unmatched elements; symmetric difference excludes shared elements. sorted is used only to display deterministic numeric output.</p><pre><code>a = {1, 2, 3}\na.update([4, 5])             # {1, 2, 3, 4, 5}\na.intersection_update({2, 3, 4}) # {2, 3, 4}\na.difference_update({2})     # {3, 4}\na.symmetric_difference_update({4, 5}) # {3, 5}</code></pre><p>The update variants modify the original set. union, intersection and difference can accept multiple iterables; symmetric_difference accepts one.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "dictionaries",
    "card": [
      "Dictionaries",
      " Dictionaries  A dictionary maps unique, hashable keys to values. It is mutable and preserves insertion order. Brackets access a value by key, not by numeric position.   emp = {'id': 'e156', 'name': 'Allen', 'age': 34, 'salary': 15000}\nemp['city'] = 'California'\nemp['age'] = 42\nprint(emp['name'])  # Allen\ndel emp['salary']\nfor key in emp:\n    print(key, ':', emp[key])\nprint('name' in emp) # True\nprint('Allen' in emp.values()) # True\nempty = {}\nanother = dict()   Looking up or deleting a missing key with brackets raises KeyError. Direct membership tests check keys. Updating an existing key does not move its position. ",
      "",
      "",
      "<h2>Dictionaries</h2><p>A dictionary maps unique, hashable keys to values. It is mutable and preserves insertion order. Brackets access a value by key, not by numeric position.</p><pre><code>emp = {'id': 'e156', 'name': 'Allen', 'age': 34, 'salary': 15000}\nemp['city'] = 'California'\nemp['age'] = 42\nprint(emp['name'])  # Allen\ndel emp['salary']\nfor key in emp:\n    print(key, ':', emp[key])\nprint('name' in emp) # True\nprint('Allen' in emp.values()) # True\nempty = {}\nanother = dict()</code></pre><p>Looking up or deleting a missing key with brackets raises KeyError. Direct membership tests check keys. Updating an existing key does not move its position.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  },
  {
    "id": "dictionary-methods",
    "card": [
      "Dictionary methods",
      " Dictionary methods   emp = {'name': 'Allen', 'age': 34, 'salary': 15000}\nbackup = emp.copy()  # Shallow copy\nprint(emp.get('city'))              # None\nprint(emp.get('city', 'Unknown'))   # Unknown\nprint(emp.pop('salary'))            # 15000\nemp.update({'age': 42, 'city': 'California'})\nprint(len(emp))                    # 3\nfor key, value in emp.items():\n    print(key, value)\nprint(list(emp.keys()))   # ['name', 'age', 'city']\nprint(list(emp.values())) # ['Allen', 42, 'California']\nemp.clear()\nprint(emp)               # {}   keys, values and items return dynamic view objects, not independent lists. items yields key-value pairs. pop raises KeyError for a missing key unless you supply a default. A shallow copy shares nested values with the original. ",
      "",
      "",
      "<h2>Dictionary methods</h2><pre><code>emp = {'name': 'Allen', 'age': 34, 'salary': 15000}\nbackup = emp.copy()  # Shallow copy\nprint(emp.get('city'))              # None\nprint(emp.get('city', 'Unknown'))   # Unknown\nprint(emp.pop('salary'))            # 15000\nemp.update({'age': 42, 'city': 'California'})\nprint(len(emp))                    # 3\nfor key, value in emp.items():\n    print(key, value)\nprint(list(emp.keys()))   # ['name', 'age', 'city']\nprint(list(emp.values())) # ['Allen', 42, 'California']\nemp.clear()\nprint(emp)               # {}</code></pre><p>keys, values and items return dynamic view objects, not independent lists. items yields key-value pairs. pop raises KeyError for a missing key unless you supply a default. A shallow copy shares nested values with the original.</p>"
    ],
    "group": "Built-in Data Structures in Python"
  }
];

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/resources.js
var escape = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function resourceMatches(query) {
  return sheetCards.map((card, index) => ({ card, index })).filter(({ card }) => card.join(" ").toLowerCase().includes(query.trim().toLowerCase()));
}
function lessonMatches(query) {
  return resourceLessons.filter(({ card }) => card.join(" ").toLowerCase().includes(query.trim().toLowerCase()));
}
function mountResources(host, cheatSheet = false) {
  const tipCards = proTips.map((tip) => ({ group: "Pro-Tips \xB7 " + tip.category, card: [tip.title, tip.body, tip.code || tip.shortcut || "", tip.output || "", `<h2>${escape(tip.title)}</h2><p class="resource-eyebrow">${escape(tip.category)}</p><p>${escape(tip.body)}</p>${tip.code || tip.shortcut ? "<pre><code>" + escape(tip.code || tip.shortcut) + "</code></pre>" : ""}${tip.output !== void 0 ? "<details><summary>Reveal output</summary><pre>" + escape(tip.output) + "</pre></details>" : ""}<a href="${escape(tip.source)}" target="_blank" rel="noopener noreferrer">Reference \u2197</a>`] }));
  const search = cheatSheet ? ((query) => [...resourceMatches(query), ...tipCards.filter(({ card: card2, group }) => (group + " " + card2.slice(0, 4).join(" ")).toLowerCase().includes(query.trim().toLowerCase()))]) : lessonMatches;
  let matches = search(""), position = 0;
  host.innerHTML = `<section class="resources-page"><h1>${cheatSheet ? "Python Cheat Sheet" : "Learning Resources"}</h1><p>${cheatSheet ? "Quick syntax reminders, compact examples, and the Pythonist Pro-Tips Vault." : "Understand each topic with the original detailed explanations, worked examples, and tables."}</p>
 ${cheatSheet ? '<details class="panel"><summary>Watch the Python toolkit animation</summary><video controls preload="none" style="width:100%;max-width:900px" poster="/app/static/app/static/assets/learning/python-toolkit-poster.png"><source src="/app/static/app/static/assets/learning/python-toolkit.mp4" type="video/mp4"><track kind="captions" src="/app/static/app/static/assets/learning/python-toolkit.vtt" srclang="en" label="English" default></video></details>' : ""}<div class="resource-layout"><section class="resource-sidebar" aria-label="Learning topics"><h2>Explore topics</h2><input type="search" id="resource-search" placeholder="Find a topic\u2026" aria-label="Search learning topics"><nav class="resource-topics" aria-label="Resource topics"></nav><a href="#${cheatSheet ? "resources" : "cheatsheet"}">${cheatSheet ? "Open detailed Resources" : "\u25A4 Open Cheat Sheet"} \u2192</a></section>
 <section class="resource-reader" aria-label="Topic cards"><div id="resource-card" aria-live="polite"></div>
 <div class="resource-navigation"><button id="resource-back">\u2190 Previous</button><span id="resource-count" role="status"></span><button id="resource-next">Next \u2192</button></div>
 <label class="resource-slider-label" for="resource-slider">Slide through topics</label><input type="range" id="resource-slider" min="1" value="1" aria-label="Resource card slider">
 <p class="resource-note">These are reference examples. Some Python features are not yet supported by the restricted practice terminal.</p><a href="#map">\u2190 Back to adventure</a></section></div></section>`;
  const topics = host.querySelector(".resource-topics"), card = host.querySelector("#resource-card"), back = host.querySelector("#resource-back"), next = host.querySelector("#resource-next"), slider = host.querySelector("#resource-slider");
  function render() {
    topics.innerHTML = matches.map(({ card: card2, group }, i) => `${group && group !== matches[i - 1]?.group ? '<h3 class="resource-group">' + escape(group) + "</h3>" : ""}<button class="resource-topic" data-resource="${i}" aria-current="${i === position ? "true" : "false"}">${escape(card2[0])}</button>`).join("");
    topics.querySelectorAll("button").forEach((button) => button.onclick = () => {
      position = Number(button.dataset.resource);
      render();
    });
    back.disabled = position === 0;
    next.disabled = !matches.length || position === matches.length - 1;
    slider.max = String(Math.max(1, matches.length));
    slider.value = String(position + 1);
    slider.disabled = matches.length < 2;
    host.querySelector("#resource-count").textContent = matches.length ? `Card ${position + 1} of ${matches.length}` : "0 matching topics";
    if (!matches.length) {
      card.innerHTML = '<article class="resource-card"><h2>No topics found</h2><p>Try another search or clear the search box to see every topic.</p></article>';
      return;
    }
    const [title, description, code, tip, lessonHtml] = matches[position].card;
    card.innerHTML = lessonHtml ? `<article class="resource-card resource-lesson">${lessonHtml}</article>` : `<article class="resource-card"><p class="resource-eyebrow">PYTHON CHEAT SHEET</p><h2>${escape(title)}</h2><section class="resource-concept"><h3>Concept / Explanation</h3><p>${escape(description)}</p></section><section><h3>Syntax &amp; Example</h3><pre><code>${escape(code)}</code></pre></section><section class="resource-tip"><h3>Key concept</h3><p>${escape(tip)}</p></section></article>`;
    topics.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
  back.onclick = () => {
    position = Math.max(0, position - 1);
    render();
  };
  next.onclick = () => {
    position = Math.min(matches.length - 1, position + 1);
    render();
  };
  slider.oninput = () => {
    position = Number(slider.value) - 1;
    render();
  };
  host.querySelector("#resource-search").oninput = (event) => {
    matches = search(event.target.value);
    position = 0;
    render();
  };
  render();
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/character-animator.js
var STATE_PRIORITY = Object.freeze({ idle: 0, blink: 1, thinking: 3, happy: 4, motivating: 4 });
var DURATION = { blink: 240, happy: 1800, motivating: 1800 };
var FALLBACK = { happy: ["idle"], motivating: ["idle"], thinking: ["idle"], blink: ["idle"], idle: [] };
var browserClock = { now: () => performance.now(), request: (fn) => requestAnimationFrame(fn), cancel: (id) => cancelAnimationFrame(id), later: (fn, ms) => setTimeout(fn, ms), clear: (id) => clearTimeout(id) };
var CharacterAnimator = class {
  constructor(host, { characterId = "byte", outfit = "outfit_01", resolveCharacter, renderStatic, clock = browserClock, reducedMotion = () => false, loadImage, document: doc = globalThis.document } = {}) {
    this.host = host;
    this.resolveCharacter = resolveCharacter;
    this.renderStatic = renderStatic;
    this.clock = clock;
    this.reducedMotion = reducedMotion;
    this.doc = doc;
    this.loadImage = loadImage || ((url) => new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    }));
    this.cache = /* @__PURE__ */ new Map();
    this.generation = 0;
    this.destroyed = false;
    this.paused = false;
    this.visibility = () => {
      if (doc.hidden) this.pause();
      else this.resume();
    };
    doc?.addEventListener?.("visibilitychange", this.visibility);
    this.setCharacter(characterId, outfit);
  }
  getState() {
    return this.state;
  }
  config(state) {
    if (!(state in STATE_PRIORITY)) return null;
    const entry = this.character.animations?.states?.[state];
    const frames = entry?.frames;
    const prefix = "/app/static/assets/characters/animated/" + this.character.id + "/";
    if (entry?.status !== "READY" || this.character.animations.outfit !== this.outfit || !Array.isArray(frames) || !frames.length || !frames.every((p) => typeof p === "string" && p.startsWith(prefix) && !p.includes("..") && !p.includes("?") && /\.(png|webp)$/.test(p))) return null;
    if (frames.length > 1 && !(entry.fps > 0 && entry.fps <= 30)) return null;
    return entry;
  }
  resolve(state) {
    for (const candidate of [state, ...this.character.fallbacks?.[state] || FALLBACK[state] || ["idle"]]) {
      const config = this.config(candidate);
      if (config) return { state: candidate, config };
    }
    return { state: this.character.staticStates?.includes(state) ? state : "idle", config: null };
  }
  preload(state) {
    const config = this.config(state);
    if (!config) return Promise.resolve([]);
    return Promise.all(config.frames.map((url) => {
      if (!this.cache.has(url)) this.cache.set(url, Promise.resolve().then(() => this.loadImage(url)));
      return this.cache.get(url);
    }));
  }
  setCharacter(id, outfit = this.outfit || "outfit_01") {
    if (this.destroyed) return;
    const character = this.resolveCharacter(id);
    if (!character) throw new Error("Unknown companion: " + id);
    this.stop();
    this.character = character;
    this.outfit = outfit;
    this.cache.clear();
    this.state = "idle";
    this.play("idle", { force: true });
    for (const s of ["idle", "thinking", "happy", "motivating"]) this.preload(s).catch(() => {
    });
  }
  play(state, options = {}) {
    if (this.destroyed) return false;
    if (!(state in STATE_PRIORITY)) state = "idle";
    if (!options.force && STATE_PRIORITY[state] < STATE_PRIORITY[this.state]) return false;
    this.cancelWork();
    const generation = ++this.generation;
    this.state = state;
    this.elapsed = 0;
    this.last = null;
    this.frameIndex = -1;
    this.duration = options.duration ?? DURATION[state] ?? null;
    this.host.dataset.state = state;
    this.host.dataset.animator = "true";
    const resolved = this.resolve(state);
    this.activeConfig = resolved.config;
    this.host.dataset.renderedState = resolved.state;
    this.renderStatic(this.host, this.character.id, this.outfit, resolved.state);
    this.host.dataset.renderMode = "static-css";
    this.ready = false;
    this.frozen = !!options.static;
    if (resolved.config) {
      this.preload(resolved.state).then(() => {
        if (this.destroyed || generation !== this.generation) return;
        this.image = this.doc.createElement("img");
        this.image.alt = this.character.name + ", " + state;
        this.image.className = "character-frame";
        this.host.replaceChildren(this.image);
        this.image.src = resolved.config.frames[0];
        this.frameIndex = 0;
        this.host.dataset.renderMode = resolved.config.frames.length > 1 ? "frames" : "static";
        this.ready = true;
        this.schedule();
      }).catch(() => {
        if (this.destroyed || generation !== this.generation) return;
        this.activeConfig = null;
        this.ready = true;
        this.schedule();
      });
    } else {
      this.ready = true;
      this.schedule();
    }
    return true;
  }
  cancelWork() {
    if (this.raf != null) this.clock.cancel(this.raf);
    if (this.timer != null) this.clock.clear(this.timer);
    this.raf = null;
    this.timer = null;
  }
  schedule() {
    this.cancelWork();
    if (this.destroyed || this.paused || !this.ready) return;
    this.last = this.clock.now();
    const reduced2 = this.frozen || this.reducedMotion();
    this.host.dataset.motion = reduced2 ? "reduced" : "full";
    if (this.activeConfig?.frames.length > 1 && !reduced2) {
      this.raf = this.clock.request((t) => this.tick(t));
      return;
    }
    if (this.duration != null) this.timer = this.clock.later(() => this.finish(), Math.max(0, this.duration - this.elapsed));
    else if (this.state === "idle" && this.config("blink") && !reduced2) this.timer = this.clock.later(() => this.play("blink"), 6e3);
  }
  tick(now) {
    this.raf = null;
    if (this.destroyed || this.paused) return;
    this.elapsed += Math.max(0, now - this.last);
    this.last = now;
    if (this.reducedMotion()) {
      this.image.src = this.activeConfig.frames[0];
      this.schedule();
      return;
    }
    const config = this.activeConfig, step = Math.floor(this.elapsed * config.fps / 1e3);
    if (!config.loop && step >= config.frames.length || this.duration != null && this.elapsed >= this.duration) {
      this.finish();
      return;
    }
    const index = step % config.frames.length;
    if (index !== this.frameIndex) {
      this.image.src = config.frames[index];
      this.frameIndex = index;
    }
    this.raf = this.clock.request((t) => this.tick(t));
  }
  finish() {
    if (!this.destroyed) this.play("idle", { force: true });
  }
  stop() {
    this.cancelWork();
    this.generation++;
    this.ready = false;
    if (this.host?.dataset) this.host.dataset.motion = "paused";
  }
  pause() {
    if (this.destroyed || this.paused) return;
    if (this.last != null) this.elapsed += Math.max(0, this.clock.now() - this.last);
    this.paused = true;
    this.cancelWork();
    this.host.dataset.motion = "paused";
  }
  resume() {
    if (this.destroyed || !this.paused) return;
    this.paused = false;
    this.schedule();
  }
  refreshMotion() {
    if (this.destroyed) return;
    if (this.activeConfig && this.image && this.reducedMotion()) this.image.src = this.activeConfig.frames[0];
    this.schedule();
  }
  destroy() {
    if (this.destroyed) return;
    this.stop();
    this.destroyed = true;
    this.cache.clear();
    this.doc?.removeEventListener?.("visibilitychange", this.visibility);
    this.host.replaceChildren();
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/characters.js
var definitions = [
  ["byte", "Byte", "Friendly & Intelligent", "Let\u2019s learn Python together and explore amazing possibilities!", "#16b9ff"],
  ["nova", "Nova", "Creative & Cheerful", "Let\u2019s learn Python together and create amazing things!", "#ab5bff"],
  ["kai", "Kai", "Curious & Determined", "Let\u2019s explore Python together and take on exciting challenges!", "#ff5265"],
  ["mira", "Mira", "Calm & Supportive", "Let\u2019s learn Python together and grow step by step!", "#43d999"],
  ["zed", "Zed", "Cool & Analytical", "Let\u2019s dive into Python, analyze problems, and build amazing projects!", "#a967ff"]
];
var CHARACTERS = definitions.map(([id, name, role, tagline, color]) => ({
  id,
  name,
  role,
  tagline,
  color,
  image: `/app/static/assets/characters/studio-${id}.${id === "zed" ? "jpeg" : "png"}`,
  outfits: [{ id: "outfit_01", name: "Classic", x: 1080 }],
  poses: ["idle", "blink", "thinking", "happy", "motivating"]
}));
var actualCharacterAsset = (character) => `/app/static/assets/characters/studio-${character.id}.${character.id === "zed" ? "jpeg" : "png"}`;
var CharacterRegistry = Object.freeze(Object.fromEntries(CHARACTERS.map((character) => [
  character.name,
  {
    id: character.id,
    name: character.name,
    image: actualCharacterAsset(character),
    outfits: character.outfits,
    manifestUrl: "/app/static/assets/characters/animated/manifest.json",
    animations: { outfit: "outfit_01", states: {} },
    staticStates: ["idle", "thinking", "happy"],
    fallbacks: { happy: ["idle"], motivating: ["idle"], thinking: ["idle"], blink: ["idle"], idle: [] },
    reactions: {
      idle: { state: "idle", asset: actualCharacterAsset(character) },
      thinking: { state: "thinking", asset: actualCharacterAsset(character) },
      happy: { state: "happy", asset: actualCharacterAsset(character) },
      motivating: { state: "idle", asset: actualCharacterAsset(character) }
    }
  }
])));
var getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
var animationCharacter = (id) => Object.values(CharacterRegistry).find((c) => c.id === id);
var manifestRequest;
function loadAnimations() {
  if (!manifestRequest) manifestRequest = fetch("/app/static/assets/characters/animated/manifest.json").then((r) => {
    if (!r.ok) throw Error("Animation manifest unavailable");
    return r.json();
  }).then((data) => {
    if (data.version !== 1) throw Error("Unsupported animation manifest");
    for (const c of Object.values(CharacterRegistry)) if (data.characters?.[c.id]) c.animations = data.characters[c.id];
  }).catch(() => {
  });
  return manifestRequest;
}
function selectedCompanion(settings = {}) {
  const character = getCharacter(settings.selected_character || settings.companion);
  const outfit = character.outfits.find((o) => o.id === settings.character_outfits?.[character.id]) || character.outfits[0];
  return { character, outfit };
}
var reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("reduce-motion");
function characterArtwork(character, outfitId = "outfit_01", pose = "idle", kind = "body", staticFallback = false) {
  const outfit = character.outfits.find((o) => o.id === outfitId) || character.outfits[0];
  const index = { idle: 0, blink: 0, happy: 1, thinking: 2, motivating: 0 }[pose] ?? 0;
  if (kind === "face" && ["byte", "kai"].includes(character.id)) {
    const state = character.id === "kai" && pose === "idle" ? "blink" : pose;
    const frame = pose === "blink" ? character.id === "byte" ? "02" : "03" : "01";
    const width = character.id === "byte" ? 640 : state === "happy" ? 704 : 543;
    const height = character.id === "byte" ? 768 : 760;
    const box2 = character.id === "byte" ? "95 60 450 415" : state === "happy" ? "200 0 345 290" : "135 0 345 290";
    return `<svg class="expression-portrait" viewBox="${box2}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${character.name}, ${pose}"><image href="/app/static/assets/characters/animated/${character.id}/${state}/${frame}.png" width="${width}" height="${height}"/></svg>`;
  }
  if (staticFallback && character.id === "kai" && outfit.id === "outfit_01" && kind === "body") return `<img class="character-frame" src="/app/static/assets/characters/animated/kai/blink/01.png" alt="Kai, Classic, ${pose}">`;
  if (!staticFallback && character.id === "kai" && outfit.id === "outfit_01" && kind === "body") {
    const state = ["thinking", "happy", "motivating"].includes(pose) ? pose : "blink";
    return `<img class="character-frame" data-static-character="kai" data-static-pose="${pose}" src="/app/static/assets/characters/animated/kai/${state}/01.png" alt="Kai, Classic, ${pose}">`;
  }
  if (!staticFallback && outfit.id === "outfit_01" && kind === "body" && ["byte", "nova", "mira", "zed"].includes(character.id)) {
    const state = character.id === "byte" && ["blink", "thinking", "happy", "motivating"].includes(pose) ? pose : "idle";
    return `<img class="character-frame" data-static-character="${character.id}" data-static-pose="${pose}" src="/app/static/assets/characters/animated/${character.id}/${state}/01.png" alt="${character.name}, Classic, ${pose}">`;
  }
  const box = kind === "face" ? `${1075 + index * 71} 612 65 70` : `${outfit.x} 254 198 290`;
  const marker = kind === "body" && outfitId === "outfit_01" ? '<circle cx="1179" cy="519" r="23" fill="#e1eeff"/>' : "";
  return `<svg viewBox="${box}" role="img" aria-label="${character.name}, ${outfit.name}, ${pose}"><image href="${character.image}" width="1536" height="1024"/>${marker}</svg>`;
}
document.addEventListener("error", (event) => {
  const image = event.target, id = image?.dataset?.staticCharacter;
  if (!id || image.tagName !== "IMG" || !CHARACTERS.some((character) => character.id === id)) return;
  const holder = document.createElement("div");
  holder.innerHTML = characterArtwork(getCharacter(id), "outfit_01", image.dataset.staticPose, "body", true);
  image.replaceWith(holder.firstElementChild);
}, true);
var CharacterController = class {
  constructor(host, character = "byte", outfit = "outfit_01") {
    this.host = host;
    host.innerHTML = '<div class="character-figure"></div><p class="speech-bubble" aria-live="polite"></p>';
    this.figure = host.querySelector(".character-figure");
    this.bubble = host.querySelector(".speech-bubble");
    this.character = getCharacter(character);
    this.outfit = outfit;
    this.animator = new CharacterAnimator(this.figure, {
      characterId: this.character.id,
      outfit,
      resolveCharacter: animationCharacter,
      reducedMotion: reduced,
      renderStatic: (figure, id, outfit2, pose) => {
        const c = getCharacter(id);
        figure.innerHTML = characterArtwork(c, outfit2, pose, "body", true) + (pose !== "idle" ? '<span class="expression-inset">' + characterArtwork(c, outfit2, pose, "face") + "</span>" : "");
      }
    });
    this.say(this.character.tagline);
    this.motion = matchMedia("(prefers-reduced-motion: reduce)");
    this.motionChanged = () => this.animator.refreshMotion();
    this.motion.addEventListener?.("change", this.motionChanged);
    this.observer = new MutationObserver(this.motionChanged);
    this.observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    loadAnimations().then(() => {
      if (!this.animator.destroyed) {
        for (const state of ["idle", "thinking", "happy", "motivating"]) this.animator.preload(state).catch(() => {
        });
        if (this.animator.getState() === "idle") this.play("idle");
      }
    });
  }
  setCharacter(id, outfit = "outfit_01") {
    this.character = getCharacter(id);
    this.outfit = outfit;
    this.animator.setCharacter(this.character.id, outfit);
    this.say(this.character.tagline);
  }
  setOutfit(id) {
    this.setCharacter(this.character.id, id);
  }
  setPose(pose) {
    this.play(pose, { force: true });
  }
  setReaction(reaction, message) {
    this.play(reaction, { force: reaction === "thinking" });
    if (message !== void 0 && message !== null && message !== "") this.say(message);
  }
  say(message) {
    this.bubble.textContent = message;
  }
  play(state, options = {}) {
    return this.animator.play(state, options);
  }
  getState() {
    return this.animator.getState();
  }
  dispatch(event, payload = {}) {
    const state = {
      QUESTION_LOADED: "idle",
      CHECK_PENDING: "thinking",
      ANSWER_CORRECT: "happy",
      ANSWER_INCORRECT: "motivating",
      HINT_REQUESTED: "thinking",
      HINT_RECEIVED: "idle",
      SOLUTION_RECEIVED: "idle",
      DIALOGUE_FINISHED: "idle",
      TOPIC_MASTERED: "happy"
    }[event];
    if (state) this.play(state, { force: ["QUESTION_LOADED", "CHECK_PENDING", "HINT_REQUESTED", "HINT_RECEIVED", "SOLUTION_RECEIVED", "DIALOGUE_FINISHED"].includes(event) });
    if (payload.message) this.say(payload.message);
  }
  destroy() {
    this.observer?.disconnect();
    this.motion?.removeEventListener?.("change", this.motionChanged);
    this.animator.destroy();
    this.host.replaceChildren();
  }
};
var receiptStorage = typeof sessionStorage === "undefined" ? null : sessionStorage;
var animatedReceipts = new Set(JSON.parse(receiptStorage?.getItem("pyquest:coin-receipts") || "[]"));
function rewardAnimation(result, receipt, origin) {
  if (!result || Number(result.coins_awarded || 0) <= 0 || !receipt || animatedReceipts.has(receipt)) return;
  animatedReceipts.add(receipt);
  receiptStorage?.setItem("pyquest:coin-receipts", JSON.stringify([...animatedReceipts]));
  const wallet = document.querySelector("#wallet");
  if (!wallet || reduced()) return;
  if (!origin || typeof origin.getBoundingClientRect !== "function") return;
  const source = origin.getBoundingClientRect(), target = wallet.getBoundingClientRect();
  const coin = document.createElement("span");
  coin.className = "flying-coin";
  coin.textContent = "\u{1FA99}";
  coin.setAttribute("aria-hidden", "true");
  coin.style.left = source.left + source.width / 2 + "px";
  coin.style.top = source.top + "px";
  document.body.append(coin);
  const dx = target.left - source.left - source.width / 2, dy = target.top - source.top;
  const animation = coin.animate([
    { transform: "translate(0,0) scale(.6)", opacity: 0 },
    { transform: "translate(0,-30px) scale(1.1)", opacity: 1, offset: 0.2 },
    { transform: `translate(${dx}px,${dy}px) scale(.4) rotate(360deg)`, opacity: 0 }
  ], { duration: 850, easing: "ease-in-out" });
  animation.finished.then(() => {
    coin.remove();
    wallet.animate([{ transform: "scale(1)" }, { transform: "scale(1.15)" }, { transform: "scale(1)" }], { duration: 300 });
  }).catch(() => coin.remove());
}
function mountStudio(host, settings, save) {
  const studioCharacters = CHARACTERS.filter((c) => ["byte", "kai"].includes(c.id));
  let preview = studioCharacters.some((c) => c.id === settings.companion) ? settings.companion : "byte";
  const outfits = { ...settings.character_outfits };
  let outfit = "outfit_01";
  host.innerHTML = `<div class="studio-title"><div><p class="eyebrow">MAKE THE JOURNEY YOURS</p><h1>Character Studio</h1></div><span class="free-badge">\u2726 All companions are free</span></div>
 <div class="studio-layout"><section class="studio-panel companion-picker"><h2>Choose Your Companion</h2><div class="character-carousel" aria-label="Choose a character to preview"></div></section>
 <section class="studio-stage"><div class="stage-heading"><h2 id="character-name"></h2><p id="character-role"></p></div><div id="studio-companion" class="companion large"></div><div class="glowing-platform" aria-hidden="true"></div><p id="active-label"></p></section>
 <section class="studio-panel studio-customize"><h2>Preview Expressions</h2><div id="pose-controls" class="pose-grid"></div><button id="choose-character" class="save-companion">\u25A3 Save as My Companion</button><p id="studio-status" role="status"></p></section></div>
 <div class="studio-benefits"><article><span>\u{1F3A8}</span><div><h3>Personalize</h3><p>Choose your favourite companion.</p></div></article><article><span>\u2726</span><div><h3>Free for Everyone</h3><p>All characters are completely free.</p></div></article><article><span>\u2699</span><div><h3>Supports Learning</h3><p>Your companion stays with you throughout your Python journey.</p></div></article><article><span>\u2665</span><div><h3>Motivating Experience</h3><p>Friendly reactions that celebrate your progress.</p></div></article></div>`;
  const controller = new CharacterController(host.querySelector("#studio-companion"), preview, outfit);
  const carousel = host.querySelector(".character-carousel");
  for (const c of studioCharacters) {
    const b = document.createElement("button");
    b.className = "companion-card";
    b.style.setProperty("--card-color", c.color);
    b.dataset.character = c.id;
    b.innerHTML = characterArtwork(c, "outfit_01", "idle", "face") + `<span><strong>${c.name}</strong><small>${c.role}</small></span><span aria-hidden="true">\u203A</span>`;
    b.setAttribute("aria-label", `Preview ${c.name}`);
    b.onclick = () => {
      preview = c.id;
      outfit = "outfit_01";
      render();
      controller.play("happy");
    };
    carousel.append(b);
  }
  function render() {
    const c = getCharacter(preview);
    controller.setCharacter(preview, outfit);
    host.style.setProperty("--companion-accent", c.color);
    host.querySelector("#character-name").textContent = c.name;
    host.querySelector("#character-role").textContent = c.role;
    const active = (settings.companion || "byte") === preview && (settings.character_outfits?.[preview] || "outfit_01") === outfit;
    host.querySelector("#active-label").textContent = active ? "\u2713 ACTIVE COMPANION" : "Preview only \u2014 save to use on your journey";
    host.querySelector("#choose-character").textContent = active ? "\u2713 Saved as My Companion" : "\u25A3 Save as My Companion";
    carousel.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.character === preview)));
    const poses = host.querySelector("#pose-controls");
    poses.replaceChildren();
    for (const pose of c.poses) {
      const b = document.createElement("button");
      b.innerHTML = characterArtwork(c, outfit, pose, "face") + "<span>" + pose[0].toUpperCase() + pose.slice(1) + "</span>";
      b.setAttribute("aria-label", "Preview " + pose);
      b.setAttribute("aria-pressed", String(pose === "idle"));
      b.onclick = () => {
        controller.setPose(pose);
        poses.querySelectorAll("button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      };
      poses.append(b);
    }
  }
  async function commit() {
    const status = host.querySelector("#studio-status");
    outfits[preview] = outfit;
    try {
      const change = { character_outfits: { ...outfits }, companion: preview };
      host.querySelector("#choose-character").disabled = true;
      await save(change);
      Object.assign(settings, change);
      render();
      status.textContent = "Your companion is saved.";
    } catch (e) {
      status.textContent = e.message;
    } finally {
      host.querySelector("#choose-character").disabled = false;
    }
  }
  host.querySelector("#choose-character").onclick = commit;
  render();
  return controller;
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/audio.js
var AudioController = class {
  constructor() {
    this.context = null;
    this.enabled = false;
    this.effectsEnabled = true;
    this.volume = 0.15;
    this.effectVolume = 0.2;
    this.mode = "map";
    this.timer = null;
    this.step = 0;
  }
  async enable() {
    this.context ??= new AudioContext();
    await this.context.resume();
    this.enabled = true;
    if (!this.timer) {
      this.beat();
      this.timer = setInterval(() => this.beat(), 900);
    }
  }
  disable() {
    this.enabled = false;
    clearInterval(this.timer);
    this.timer = null;
  }
  unlockEffects() {
    if (!this.effectsEnabled) return;
    this.context ??= new AudioContext();
    return this.context.resume();
  }
  destroy() {
    this.disable();
    this.context?.close();
    this.context = null;
  }
  setVolume(value) {
    this.volume = Math.max(0, Math.min(1, Number(value) || 0));
  }
  setEffectsEnabled(value) {
    this.effectsEnabled = Boolean(value);
  }
  setEffectVolume(value) {
    this.effectVolume = Math.max(0, Math.min(1, Number(value) || 0));
  }
  setMode(mode) {
    this.mode = mode;
  }
  tone(frequency, duration = 0.3, offset = 0, gain = 0.08, effect = false) {
    if (!effect && !this.enabled || !this.context || document.hidden) return;
    const oscillator = this.context.createOscillator(), envelope = this.context.createGain();
    const now = this.context.currentTime + offset;
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    envelope.gain.setValueAtTime(0, now);
    envelope.gain.linearRampToValueAtTime(gain * (effect ? 1 : this.volume), now + 0.03);
    envelope.gain.exponentialRampToValueAtTime(1e-4, now + duration);
    oscillator.connect(envelope);
    envelope.connect(this.context.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
  }
  beat() {
    const notes = this.mode === "practice" ? [220, 261.63, 329.63, 261.63] : [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
    this.tone(notes[this.step++ % notes.length], 0.75, 0, 0.04);
  }
  effect(event) {
    if (!this.effectsEnabled) return;
    const notes = { correct: [523.25, 659.25, 783.99], coin: [987.77, 1318.51], mastered: [523.25, 659.25, 783.99, 1046.5] }[event] || [];
    notes.forEach((note, index) => this.tone(note, 0.22, index * 0.1, 0.12 * this.effectVolume / 0.2, true));
  }
};
var CelebrationController = class {
  constructor(audio2) {
    this.audio = audio2;
    this.particles = /* @__PURE__ */ new Set();
    const storage = typeof sessionStorage === "undefined" ? null : sessionStorage;
    this.receiptStorage = storage;
    this.receipts = new Set(JSON.parse(storage?.getItem("pyquest:celebration-receipts") || "[]"));
  }
  result(value, receipt, origin) {
    const committedReward = Boolean(value && value.correct && Number(value.coins_awarded || 0) > 0);
    if (!committedReward || this.receipts.has(receipt)) return;
    this.receipts.add(receipt);
    this.audio.effect(value.topic_mastered ? "mastered" : "correct");
    this.receiptStorage?.setItem("pyquest:celebration-receipts", JSON.stringify([...this.receipts]));
    this.audio.effect("coin");
    if (!origin || typeof origin.getBoundingClientRect !== "function") return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("reduce-motion")) return;
    const box = origin.getBoundingClientRect();
    for (let i = 0; i < 8; i++) {
      const particle = document.createElement("span");
      particle.className = "celebration-particle";
      particle.textContent = "\u2726";
      particle.setAttribute("aria-hidden", "true");
      particle.style.left = box.left + box.width / 2 + "px";
      particle.style.top = box.top + "px";
      document.body.append(particle);
      this.particles.add(particle);
      const angle = i * Math.PI / 4;
      const animation = particle.animate([{ transform: "translate(0,0) scale(.5)", opacity: 1 }, { transform: `translate(${Math.cos(angle) * 100}px,${Math.sin(angle) * 65 - 35}px) scale(0)`, opacity: 0 }], { duration: 850 });
      const cleanup = () => {
        particle.remove();
        this.particles.delete(particle);
      };
      animation.finished.then(cleanup, cleanup);
    }
  }
  stop() {
    for (const particle of this.particles) {
      particle.getAnimations().forEach((a) => a.cancel());
      particle.remove();
    }
    this.particles.clear();
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/terminal.js
var escape2 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function renderPractice(app2, session2, worlds2, stats2) {
  const q = session2.question, w = worlds2.find((w2) => w2.id === q.world_id), topic = w.topics.find((t) => t.id === q.subtopic_id);
  const mastery = stats2.mastery[q.subtopic_id] || 0;
  app2.innerHTML = `<a href="#world/${w.id}">\u2190 Back to ${escape2(w.name)}</a>
  <button id="review-concept">Review Concept</button><div class="quest-meta"><span>${escape2(w.name)} / ${escape2(topic?.name || q.subtopic_id)}</span><span>${escape2(q.difficulty)}</span><span>Mastery ${Math.round(mastery * 100)}%</span></div>
  <section class="quest-header"><div id="companion-slot"></div><article class="panel quest-task"><p class="eyebrow">CODING QUEST</p><h1 data-question-text>${escape2(q.title)}</h1><p data-question-text>${escape2(q.prompt)}</p><h3>Requirements</h3><ul>${q.requirements.map((r) => `<li data-question-text>${escape2(r)}</li>`).join("")}</ul><details open><summary>Example input / output</summary><div class="example-pair"><div><small>INPUT</small><pre>${escape2(q.example.inputs.join("\n") || "(none)")}</pre></div><div><small>OUTPUT</small><pre>${escape2(q.example.expected)}</pre></div></div></details></article></section>
  <section class="terminal"><div><label for="code">main.py</label><textarea id="code" spellcheck="false" aria-label="Python code editor">${escape2(session2.draft_saved ? session2.draft : session2.draft || q.starter_code)}</textarea><small>Tab moves focus \xB7 Ctrl+] indents \xB7 Ctrl+Enter runs</small></div><div><label for="inputs">Input \u2014 one value per line</label><textarea id="inputs">${escape2(q.example.inputs.join("\n"))}</textarea><h2>Output</h2><pre id="output" aria-live="polite">Run your code to see output.</pre></div></section>
  <div class="actions terminal-actions"><button data-action="run">Run \u25B6</button><button id="clear">Clear</button><button data-action="check">Check Answer</button><button data-action="hint">Get Hint</button><button data-action="reveal">Use Coin for Solution</button><button data-action="next">Next Question \u2192</button></div>
  <p id="action-status" role="status" aria-live="polite" aria-busy="false">Ready</p>
  <section id="result" class="panel" aria-live="polite">Your result will appear here.</section>`;
}
function buildResultPresentation(value) {
  const heading = value.correct ? "Correct!" : "Try again!";
  const message = (value.message || value.result_message || (value.correct ? "Great work!" : "Check how you are handling the input.")).trim();
  const scoreText = value.score !== void 0 ? `Score: ${value.score}` : value.tests_total ? `Tests ${value.tests_passed} / ${value.tests_total}` : "";
  const details = [];
  if (value.tests_total) {
    details.push(`Tests ${value.tests_passed} / ${value.tests_total}`);
  }
  if (value.marks_awarded !== void 0 && value.marks_possible !== void 0) {
    details.push(`Marks ${value.marks_awarded} / ${value.marks_possible}`);
  }
  if (value.xp_awarded !== void 0) {
    details.push(`XP +${value.xp_awarded}`);
  }
  if (value.coins_awarded !== void 0) {
    details.push(`Coins +${value.coins_awarded}`);
  }
  if (value.previous_mastery !== void 0 && value.new_mastery !== void 0) {
    details.push(`Mastery ${Math.round(value.previous_mastery * 100)}% \u2192 ${Math.round(value.new_mastery * 100)}%`);
  }
  const summary = details.join(" \xB7 ");
  const rewardAmount = Number(value.coins_awarded || value.events?.find((event) => Number(event?.payload?.coins_awarded || 0) > 0)?.payload?.coins_awarded || 0 || 0);
  return { heading, message, summary, scoreText, rewardAmount };
}
function renderResult(host, value, { animate = true } = {}) {
  host.replaceChildren();
  const { heading, message, summary, scoreText, rewardAmount } = buildResultPresentation(value);
  const title = document.createElement("h2");
  title.textContent = heading;
  host.append(title);
  const feedback = document.createElement("p");
  feedback.textContent = message;
  host.append(feedback);
  if (rewardAmount > 0) {
    const reward = document.createElement("p");
    reward.className = "reward-badge";
    reward.textContent = `\u{1FA99} +${rewardAmount} Coins`;
    host.append(reward);
  }
  if (summary) {
    const meta = document.createElement("p");
    meta.textContent = summary;
    host.append(meta);
  }
  if (scoreText) {
    const score = document.createElement("p");
    score.textContent = scoreText;
    host.append(score);
  }
  if (value.new_mastery !== void 0) {
    const bar = document.createElement("div");
    bar.className = "mastery-track";
    bar.setAttribute("role", "progressbar");
    bar.setAttribute("aria-valuemin", "0");
    bar.setAttribute("aria-valuemax", "100");
    bar.setAttribute("aria-valuenow", String(Math.round(value.new_mastery * 100)));
    bar.setAttribute("aria-label", "Topic mastery");
    const fill = document.createElement("span");
    fill.style.transform = `scaleX(${animate ? value.previous_mastery ?? 0 : value.new_mastery})`;
    bar.append(fill);
    host.append(bar);
    if (animate) requestAnimationFrame(() => requestAnimationFrame(() => fill.style.transform = `scaleX(${value.new_mastery})`));
  }
  if (!value.correct) {
    const retry = document.createElement("button");
    retry.textContent = "Try Again";
    retry.onclick = () => document.querySelector("#code").focus();
    host.append(retry);
  }
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/progression.js
var ProgressionEvents = class {
  constructor(storage = globalThis.sessionStorage) {
    this.storage = storage;
    this.seen = /* @__PURE__ */ new Set();
    try {
      this.seen = new Set(JSON.parse(storage?.getItem("pyquest:progression") || "[]"));
    } catch {
    }
  }
  consume(key) {
    if (!key || this.seen.has(key)) return false;
    this.seen.add(key);
    try {
      this.storage?.setItem("pyquest:progression", JSON.stringify([...this.seen]));
    } catch {
    }
    return true;
  }
  accept(value, receipt) {
    const correct = value.correct === true;
    const completion = correct && value.world_completion?.completed === true && !!value.world_completion.completion_id;
    return {
      xp: correct && value.xp_awarded > 0 && this.consume("xp:" + receipt),
      completion: !!completion,
      celebrate: !!completion && this.consume("complete:" + value.world_completion.completion_id),
      topic: correct && value.topic_mastered === true
    };
  }
};
function presentProgression(host, value, events, { settings = {}, companion: companion2, audio: audio2, reducedMotion = false } = {}) {
  const add = (tag, text, parent = host) => {
    const node = document.createElement(tag);
    node.textContent = text;
    parent.append(node);
    return node;
  };
  if (value.correct && value.xp_awarded > 0) {
    const badge = add("p", `\u2726 +${value.xp_awarded} XP`);
    badge.className = "xp-gain";
    if (events.xp && !reducedMotion) badge.className += " progression-pop";
  }
  if (value.xp_total !== void 0) add("p", `Total XP: ${value.xp_total}`);
  if (events.topic) add("h3", "\u2713 Topic Mastered");
  else if (value.topic_status) add("p", `Topic status: ${value.topic_status}`);
  if (!events.completion) return;
  const c = value.world_completion;
  const card = add("section", "");
  card.className = "level-complete";
  card.setAttribute("aria-label", "Level Complete");
  add("h2", "Level Complete!", card);
  add("h3", c.world_name, card);
  const { character, outfit } = selectedCompanion(settings);
  const portrait = add("div", "", card);
  portrait.className = "completion-portrait";
  portrait.innerHTML = characterArtwork(character, outfit.id, "happy");
  add("p", `${character.name}: Great work! Keep learning together.`, card);
  add("p", `Final score: ${c.final_score} \xB7 World XP earned: ${c.xp_gained} \xB7 World coins earned: ${c.coins_gained}`, card);
  add("p", `Topics completed: ${c.topics_mastered} / ${c.topics_total}`, card);
  for (const [topic, mastery] of Object.entries(c.mastery || {})) add("p", `${topic}: ${Math.round(mastery * 100)}% mastery`, card);
  if (c.next_world_id && c.next_world_id !== "W14") {
    const next = add("a", "Next Level \u2192", card);
    next.href = "#world/" + encodeURIComponent(c.next_world_id);
  }
  const back = add("a", "Back to Map", card);
  back.href = "#home";
  if (events.celebrate) {
    if (!reducedMotion) {
      portrait.className += " progression-pop";
      companion2?.play("happy");
    } else companion2?.animator?.play("happy", { static: true });
    companion2?.say("Level complete! Wonderful work.");
    if (settings.sound_effects_enabled !== false) audio2?.effect("mastered");
  }
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/request.js
async function requestJson(path, data) {
  return uiRequest(path, data);
}
function handleEditorKey(event, editor, run) {
  if (event.ctrlKey && event.key === "]") {
    event.preventDefault();
    editor.setRangeText("    ", editor.selectionStart, editor.selectionEnd, "end");
  }
  if (event.ctrlKey && event.key === "Enter") {
    event.preventDefault();
    run();
  }
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/concepts.js
var escape3 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
function conceptMarkup(state) {
  const lesson = state.lesson;
  return `<a class="concept-back" href="#world/${escape3(lesson.world_id)}">\u2190 Back to world</a><article class="concept-card panel"><div class="concept-hero"><p class="eyebrow">${escape3(lesson.world_id)} \xB7 YOUR CONCEPT GUIDE \xB7 2\u20135 MINUTES</p><h1 tabindex="-1">${escape3(lesson.title)}</h1><p>${escape3(lesson.learning_objective)}</p><div class="concept-path"><span>01 Understand</span><span>02 Explore</span><span>03 Try it yourself</span></div></div><div class="concept-columns"><section><h2>What it means</h2><p>${escape3(lesson.simple_explanation)}</p><div class="concept-purpose"><h3>Why you\u2019ll use it</h3><p>${escape3(lesson.why_it_matters)}</p></div><h2>${escape3(lesson.example_heading || "A small, worked example")}</h2>${lesson.practice_reference ? `<p class="reference-note">${escape3(lesson.practice_reference)}</p>` : ""}${lesson.worked_examples.map((example) => `<div class="example-window"><div class="example-bar"><span>\u25CF \u25CF \u25CF</span><b>PYTHON</b></div><pre><code>${escape3(example.code)}</code></pre><div class="output-label">Expected output</div><pre class="expected-output">${escape3(example.output)}</pre></div>`).join("")}${lesson.line_by_line ? `<details class="line-guide" open><summary>Understand every line</summary><ol>${lesson.line_by_line.map((text) => `<li>${escape3(text)}</li>`).join("")}</ol></details>` : ""}</section><section class="concept-explore"><p class="eyebrow">LEARN BY DOING</p><h2>Explore the concept</h2><div id="concept-visual"></div><div class="concept-mistakes"><h3>Watch out for</h3><ul>${lesson.common_mistakes.map((text) => `<li>${escape3(text)}</li>`).join("")}</ul></div><h3>Keep these in mind</h3><ul>${lesson.remember.map((text) => `<li>${escape3(text)}</li>`).join("")}</ul><div class="concept-predict"><h3>Your turn to predict</h3><p>${escape3(lesson.practice_prompt)}</p></div></section></div><details class="toolkit-explainer"><summary>\u25B6 Python toolkit explained \xB7 module, package, library & framework</summary><p>A 70-second captioned animation. No sound needed: every explanation is on screen.</p><button id="toolkit-video-load">Watch animated explainer</button><div id="toolkit-video-player" aria-live="polite"></div><div class="toolkit-terms"><p><b>Module</b> An importable unit, often one .py file.</p><p><b>Package</b> Organizes related submodules.</p><p><b>Library (lib)</b> Reusable tools your code calls.</p><p><b>Framework</b> App structure that runs a workflow and calls your handlers.</p></div><p>These labels can overlap. Modules and packages describe organization; libraries and frameworks describe roles.</p><p class="reference-note">Learn more: <a href="https://docs.python.org/3.12/tutorial/modules.html" target="_blank" rel="noopener noreferrer">Python modules & packages</a> \xB7 <a href="https://www.djangoproject.com/start/overview/" target="_blank" rel="noopener noreferrer">Django framework</a></p></details><footer class="concept-footer"><p id="concept-status" role="status">${state.completed ? "Concept completed. Review whenever you need." : "Read and explore, then start your challenge."}</p><div class="actions"><button id="concept-start">${state.session_id ? "Continue Challenge" : "Start Challenge"}</button></div></footer></article>`;
}
function mountConcept(host, state, onStart) {
  host.innerHTML = conceptMarkup(state);
  host.querySelector("h1").focus();
  const watch = host.querySelector("#toolkit-video-load");
  watch.onclick = async () => {
    watch.disabled = true;
    watch.textContent = "Loading animation\u2026";
    try {
      const media = await requestJson("toolkit-video");
      const player = host.querySelector("#toolkit-video-player");
      player.innerHTML = '<video controls playsinline preload="metadata" aria-label="Python modules, packages, libraries and frameworks animated explainer"><track kind="captions" srclang="en" label="English" default></video>';
      const video = player.querySelector("video");
      video.src = media.video;
      video.querySelector("track").src = media.captions;
      watch.hidden = true;
    } catch (error) {
      watch.disabled = false;
      watch.textContent = "Retry animated explainer";
      host.querySelector("#toolkit-video-player").textContent = error.message;
    }
  };
  const visual = host.querySelector("#concept-visual"), lesson = state.lesson;
  if (lesson.visualization_type === "strings") {
    visual.innerHTML = '<label>Text <input id="visual-text" value="Python" maxlength="20"></label><label>Start <input id="slice-start" type="number" value="0"></label><label>Stop <input id="slice-stop" type="number" value="6"></label><label>Step <input id="slice-step" type="number" value="1"></label><div id="string-cells"></div><output id="slice-output" aria-live="polite"></output>';
    const draw = () => {
      const text = Array.from(visual.querySelector("#visual-text").value), n = text.length, step = Number(visual.querySelector("#slice-step").value), start2 = Number(visual.querySelector("#slice-start").value), stop = Number(visual.querySelector("#slice-stop").value);
      const normalize = (v) => Math.max(step > 0 ? 0 : -1, Math.min(step > 0 ? n : n - 1, v < 0 ? v + n : v));
      let positions = [];
      if (step) for (let i = normalize(start2), end = normalize(stop); step > 0 ? i < end : i > end; i += step) positions.push(i);
      visual.querySelector("#string-cells").innerHTML = text.map((char, i) => `<span class="string-cell ${positions.includes(i) ? "selected" : ""}"><small>${i} / ${i - n}</small><b>${escape3(char)}</b></span>`).join("");
      visual.querySelector("#slice-output").textContent = step ? `[${start2}:${stop}:${step}] \u2192 ${positions.map((i) => text[i]).join("")}` : "Step cannot be zero.";
    };
    visual.oninput = draw;
    draw();
  } else if (lesson.visualization_type === "operators" || lesson.visualization_type === "decision") {
    visual.innerHTML = '<label>Value <input id="operand" type="number" value="7"></label><output aria-live="polite"></output>';
    const draw = () => {
      const value = Number(visual.querySelector("input").value);
      visual.querySelector("output").textContent = lesson.visualization_type === "decision" ? `${value} >= 9? ${value >= 9}
${value} >= 5? ${value >= 5}
if/elif/else branch: ${value >= 9 ? "Excellent" : value >= 5 ? "Pass" : "Retry"}
Inline equivalent: "Pass" if score >= 5 else "Retry"` : `${value} + 2 = ${value + 2}
${value} // 2 = ${Math.floor(value / 2)}
${value} % 2 = ${value - Math.floor(value / 2) * 2}
${value} >= 5 = ${value >= 5}
${value} & 1 = ${value & 1} (bitwise AND for this integer example)`;
    };
    visual.oninput = draw;
    draw();
  } else if (lesson.visualization_type === "types") {
    const rows = [["int", "immutable", "whole numbers"], ["float", "immutable", "approximate real numbers"], ["complex", "immutable", "real + imaginary"], ["bool", "immutable", "True / False"], ["str", "immutable, ordered", "Unicode text"], ["list", "mutable, ordered", "duplicates allowed"], ["tuple", "immutable, ordered", "duplicates allowed"], ["set", "mutable, unordered", "unique items"], ["frozenset", "immutable, unordered", "unique items"], ["dict", "mutable, insertion order", "unique keys"], ["range", "immutable, ordered", "integer sequence"], ["bytes", "immutable, ordered", "byte sequence"], ["bytearray", "mutable, ordered", "byte sequence"], ["memoryview", "depends on buffer", "buffer view"], ["NoneType", "immutable", "absence"]];
    visual.innerHTML = '<label>Compare a type <select aria-label="Python type">' + rows.map((row) => `<option>${row[0]}</option>`).join("") + '</select></label><output aria-live="polite"></output><details><summary>All type comparisons</summary><table><caption>Python value types</caption><thead><tr><th>Type</th><th>Behavior</th><th>Use</th></tr></thead><tbody>' + rows.map((row) => "<tr>" + row.map((value) => `<td>${value}</td>`).join("") + "</tr>").join("") + "</tbody></table></details>";
    const draw = () => {
      const row = rows.find((row2) => row2[0] === visual.querySelector("select").value);
      visual.querySelector("output").textContent = row.join(" \xB7 ");
    };
    visual.onchange = draw;
    draw();
  } else if (lesson.world_id === "W11") {
    visual.innerHTML = '<label>Search target <input type="number" value="5"></label><label>Method <select><option>Linear search</option><option>Binary search</option></select></label><output aria-live="polite"></output>';
    const draw = () => {
      const values = [1, 3, 5, 7, 9], target = Number(visual.querySelector("input").value), binary = visual.querySelector("select").value === "Binary search";
      let visited = [], found = -1;
      if (binary) {
        let lo = 0, hi = values.length - 1;
        while (lo <= hi) {
          const mid = Math.floor((lo + hi) / 2);
          visited.push(mid);
          if (values[mid] === target) {
            found = mid;
            break;
          }
          if (values[mid] < target) lo = mid + 1;
          else hi = mid - 1;
        }
      } else {
        for (let i = 0; i < values.length; i++) {
          visited.push(i);
          if (values[i] === target) {
            found = i;
            break;
          }
        }
      }
      visual.querySelector("output").textContent = `Sorted values: [${values.join(", ")}]
Visited indexes: ${visited.join(" \u2192 ")}
${found < 0 ? "Not found" : "Found at index " + found}`;
    };
    visual.oninput = draw;
    visual.onchange = draw;
    draw();
  } else if (lesson.world_id === "W13") {
    visual.innerHTML = '<p>Class Counter defines behavior. Two objects keep separate instance state.</p><button id="instance-a">Increment object A</button><button id="instance-b">Increment object B</button><output aria-live="polite"></output>';
    let a = 0, b = 0;
    const draw = () => visual.querySelector("output").textContent = `Counter class \u2192 object A: value=${a}
Counter class \u2192 object B: value=${b}`;
    visual.querySelector("#instance-a").onclick = () => {
      a++;
      draw();
    };
    visual.querySelector("#instance-b").onclick = () => {
      b++;
      draw();
    };
    draw();
  } else if (["W09_LINKED_LIST", "W09_APPLICATIONS"].includes(lesson.subtopic_id)) {
    visual.innerHTML = '<p>Follow next references from the head node to None.</p><button>Advance node</button><output aria-live="polite"></output>';
    let index = 0;
    const nodes = ["head: 1", "node: 2", "node: 3", "None"];
    const draw = () => visual.querySelector("output").textContent = nodes.map((node, i) => (i === index ? "[current] " : "") + node).join(" \u2192 ");
    visual.querySelector("button").onclick = () => {
      index = Math.min(index + 1, 3);
      draw();
      if (index === 3) visual.querySelector("button").disabled = true;
    };
    draw();
  } else if (lesson.visualization_type === "loop" || lesson.visualization_type === "structure" || lesson.visualization_type === "algorithm" || lesson.visualization_type === "function" && lesson.subtopic_id === "W12_FUNCTIONS") {
    const kind = lesson.visualization_type;
    visual.innerHTML = kind === "structure" ? '<p>Compare removal order. Add items, then remove with stack (LIFO) or queue (FIFO).</p><button id="add-item">Add item</button><button id="pop-item">Stack pop</button><button id="shift-item">Queue remove</button><output aria-live="polite"></output>' : kind === "loop" ? '<label>Rows <input id="rows" type="number" min="1" max="5" value="2"></label><label>Columns <input id="columns" type="number" min="1" max="5" value="3"></label><p>Outer loop selects a row; inner loop visits each column.</p><output aria-live="polite"></output>' : kind === "algorithm" ? '<p>One bubble-sort pass: compare adjacent values, swap when out of order.</p><button id="compare-next">Next comparison</button><output aria-live="polite"></output>' : '<label>Argument <input type="number" value="4"></label><p>Example data flow: argument \u2192 double(value) \u2192 return value * 2 \u2192 caller.</p><output aria-live="polite"></output>';
    const output = visual.querySelector("output");
    if (kind === "structure") {
      let values = ["A", "B"], number = 3;
      const draw = (message) => output.textContent = `${message}
[${values.join(" \u2192 ")}]`;
      visual.querySelector("#add-item").onclick = () => {
        values.push(String(number++));
        draw("Added at the right end");
      };
      visual.querySelector("#pop-item").onclick = () => draw("Removed: " + (values.pop() ?? "empty"));
      visual.querySelector("#shift-item").onclick = () => draw("Removed: " + (values.shift() ?? "empty"));
      draw("Current items");
    }
    if (kind === "loop") {
      const draw = () => {
        const rows = Math.max(1, Math.min(5, Number(visual.querySelector("#rows").value))), cols = Math.max(1, Math.min(5, Number(visual.querySelector("#columns").value)));
        output.textContent = Array.from({ length: rows }, (_, r) => Array.from({ length: cols }, (_2, c) => `(${r}, ${c})`).join(" \u2192 ")).join("\n") + `
${rows * cols} inner iterations`;
      };
      visual.oninput = draw;
      draw();
    }
    if (kind === "algorithm") {
      let values = [3, 1, 2], index = 0;
      output.textContent = values.join(" \xB7 ");
      visual.querySelector("button").onclick = () => {
        const swapped = values[index] > values[index + 1];
        if (swapped) [values[index], values[index + 1]] = [values[index + 1], values[index]];
        output.textContent = `Compare positions ${index} and ${index + 1}: ${swapped ? "swap" : "keep"}
${values.join(" \xB7 ")}`;
        if (++index === values.length - 1) visual.querySelector("button").disabled = true;
      };
    }
    if (kind === "function") {
      const draw = () => {
        const value = Number(visual.querySelector("input").value);
        output.textContent = `double(${value}) \u2192 ${value} * 2 \u2192 return ${value * 2}`;
      };
      visual.oninput = draw;
      draw();
    }
  } else {
    visual.innerHTML = '<p>Step through the example and predict its result.</p><ol id="trace-lines"></ol><button id="trace-next">Reveal next line</button><output id="trace-output" aria-live="polite"></output>';
    let index = 0;
    const lines = lesson.visualization_data.steps;
    visual.querySelector("#trace-next").onclick = () => {
      if (index < lines.length) {
        const li = document.createElement("li");
        li.textContent = lines[index++];
        visual.querySelector("#trace-lines").append(li);
      }
      if (index === lines.length) {
        visual.querySelector("#trace-output").textContent = "Expected final output: " + lesson.visualization_data.result;
        visual.querySelector("#trace-next").disabled = true;
      }
    };
  }
  if (lesson.subtopic_id === "W02_FLOAT") {
    const math = document.createElement("section");
    math.innerHTML = '<h3>Floor, ceil, and round</h3><label>Number <input type="number" value="-2.5" step="0.5"></label><output aria-live="polite"></output><p>floor moves toward negative infinity; ceil toward positive infinity. Python round uses ties to even: round(2.5) = 2, round(3.5) = 4. Binary floating-point representation can affect decimal rounding.</p>';
    const draw = () => {
      const value = Number(math.querySelector("input").value), lower = Math.floor(value), rounded = value - lower === 0.5 ? lower % 2 === 0 ? lower : lower + 1 : Math.round(value);
      math.querySelector("output").textContent = `floor(${value}) = ${lower}
ceil(${value}) = ${Math.ceil(value)}
round(${value}) = ${rounded}`;
    };
    math.oninput = draw;
    draw();
    visual.append(math);
  }
  const start = host.querySelector("#concept-start");
  start.onclick = async () => {
    start.disabled = true;
    try {
      await onStart();
    } catch (error) {
      host.querySelector("#concept-status").textContent = error.message;
      start.disabled = false;
    }
  };
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/success-celebration.js
var SuccessEvents = class {
  constructor(storage = globalThis.sessionStorage) {
    this.storage = storage;
    this.seen = /* @__PURE__ */ new Set();
    try {
      this.seen = new Set(JSON.parse(storage?.getItem("pyquest:success-events") || "[]"));
    } catch {
    }
  }
  claim(value, sid, qid) {
    if (value?.correct !== true || !sid || !qid) return null;
    const key = `${sid}:${qid}`;
    if (this.seen.has(key)) return null;
    this.seen.add(key);
    try {
      this.storage?.setItem("pyquest:success-events", JSON.stringify([...this.seen]));
    } catch {
    }
    return key;
  }
};
var successRewards = (value) => ({
  xp: Number.isFinite(value.xp_awarded) ? value.xp_awarded : null,
  coins: Number.isFinite(value.coins_awarded) ? value.coins_awarded : null
});
var successCharacter = (settings) => ["byte", "kai"].includes(settings.selected_character || settings.companion) ? settings.selected_character || settings.companion : "byte";
var SuccessCelebration = class {
  constructor({ events = new SuccessEvents(), persist = async () => ({ show: true }) } = {}) {
    this.events = events;
    this.persist = persist;
    this.active = null;
  }
  destroy() {
    this.cleanupCurrent?.();
    this.cleanupCurrent = null;
  }
  async show(value, { sid, qid, settings = {}, onContinue = () => {
  }, isCurrent = () => true } = {}) {
    const key = this.events.claim(value, sid, qid);
    if (!key || this.active) return false;
    const wasInert = document.body.inert;
    document.body.inert = true;
    let claim;
    try {
      claim = await this.persist("celebration-claim", { event_id: key });
    } finally {
      document.body.inert = wasInert;
    }
    if (claim.show === false || !isCurrent()) return false;
    const previous = document.body.getRootNode().activeElement || document.activeElement;
    const dialog = document.createElement("dialog");
    dialog.className = "success-celebration";
    const reduced2 = !!settings.reduced_motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced2) dialog.classList.add("celebration-reduced");
    dialog.setAttribute("aria-labelledby", "success-title");
    dialog.setAttribute("aria-describedby", "success-message");
    dialog.innerHTML = '<div class="success-confetti" aria-hidden="true"></div><p class="success-label">CHALLENGE COMPLETED</p><div class="success-character" aria-hidden="true"></div><h2 id="success-title">HOORAY! \u{1F389}</h2><p id="success-message">You wrote the correct Python code!</p><p class="success-support">Amazing work! You\u2019ve successfully completed this challenge.</p><div class="success-rewards"></div><button class="success-continue">Continue Adventure \u2192</button><button class="success-stay">Stay on This Question</button>';
    const rewardHost = dialog.querySelector(".success-rewards"), reward = successRewards(value);
    for (const [label, amount] of [["XP", reward.xp], ["Coins", reward.coins]]) if (amount !== null) {
      const badge = document.createElement("span");
      badge.textContent = `${label === "XP" ? "\u2726" : "\u{1FA99}"} +${amount} ${label}`;
      rewardHost.append(badge);
    }
    if (reward.xp === 0 && reward.coins === 0) {
      const note = document.createElement("p");
      note.className = "success-repeat-note";
      note.textContent = "No additional rewards were awarded for this submission.";
      rewardHost.after(note);
    }
    if (!reduced2) for (let i = 0; i < 18; i++) {
      const piece = document.createElement("i");
      piece.style.setProperty("--particle", i);
      dialog.querySelector(".success-confetti").append(piece);
    }
    document.body.append(dialog);
    this.active = dialog;
    const character = successCharacter(settings), controller = new CharacterController(dialog.querySelector(".success-character"), character, "outfit_01");
    controller.say("");
    controller.play("happy", { static: reduced2 });
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    let acknowledged = false;
    this.cleanupCurrent = () => {
      acknowledged = true;
      controller.destroy();
      dialog.close();
      dialog.remove();
      this.active = null;
      document.body.style.overflow = oldOverflow;
    };
    const close = async (advance = false) => {
      if (acknowledged) return;
      acknowledged = true;
      dialog.querySelectorAll("button").forEach((b) => b.disabled = true);
      try {
        await this.persist("celebration-ack", { event_id: key });
      } catch {
      }
      if (!dialog.isConnected) return;
      controller.destroy();
      dialog.close();
      dialog.remove();
      this.active = null;
      document.body.style.overflow = oldOverflow;
      if (previous?.isConnected) previous.focus();
      if (advance) onContinue();
    };
    dialog.querySelector(".success-continue").onclick = () => close(true);
    dialog.querySelector(".success-stay").onclick = () => close(false);
    dialog.addEventListener("cancel", (event) => {
      event.preventDefault();
      close(false);
    });
    dialog.addEventListener("keydown", (event) => {
      if (event.key !== "Tab") return;
      const buttons = [...dialog.querySelectorAll("button:not(:disabled)")], first = buttons[0], last = buttons.at(-1);
      const focused = dialog.getRootNode().activeElement || document.activeElement;
      if (event.shiftKey && focused === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && focused === last) {
        event.preventDefault();
        first.focus();
      }
    });
    dialog.showModal();
    dialog.querySelector(".success-continue").focus();
    if (!reduced2 && reward.coins > 0) {
      const box = dialog.getBoundingClientRect(), source = dialog.querySelector(".success-character").getBoundingClientRect(), target = rewardHost.getBoundingClientRect();
      for (let i = 0; i < 5; i++) {
        const coin = document.createElement("span");
        coin.className = "flying-coin success-flying-coin";
        coin.textContent = "\u{1FA99}";
        coin.setAttribute("aria-hidden", "true");
        Object.assign(coin.style, { position: "absolute", left: source.left - box.left + source.width / 2 + "px", top: source.top - box.top + source.height / 2 + "px", zIndex: "200", fontSize: "28px", pointerEvents: "none" });
        dialog.append(coin);
        const dx = target.left + target.width / 2 - source.left - source.width / 2 + (i - 2) * 12, dy = target.top - source.top - source.height / 2;
        const animation = coin.animate([{ transform: "translate(0,0) scale(.6)", opacity: 0 }, { transform: `translate(${(i - 2) * 25}px,-35px) scale(1.1)`, opacity: 1, offset: 0.3 }, { transform: `translate(${dx}px,${dy}px) scale(.5) rotate(360deg)`, opacity: 0 }], { duration: 950, delay: i * 70, easing: "ease-in-out" });
        animation.finished.then(() => coin.remove(), () => coin.remove());
      }
    }
    return true;
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/companion-controller.js
var BlinkScheduler = class {
  constructor(visual, { later = (fn, ms) => setTimeout(fn, ms), clear = (id) => clearTimeout(id), random = Math.random, paused = () => document.hidden || matchMedia("(prefers-reduced-motion: reduce)").matches || document.documentElement.classList.contains("reduce-motion") } = {}) {
    this.visual = visual;
    this.later = later;
    this.clear = clear;
    this.random = random;
    this.paused = paused;
    this.destroyed = false;
    this.arm();
  }
  arm() {
    if (this.destroyed) return;
    this.timer = this.later(() => {
      if (!this.paused() && this.visual.getState() === "idle") this.visual.play("blink");
      this.arm();
    }, 1200 + Math.floor(Math.max(0, Math.min(1, this.random())) * 1e3));
  }
  destroy() {
    this.destroyed = true;
    this.clear(this.timer);
  }
};
function companionOutcome(action, result) {
  if (action === "check" && result?.correct === true) return { state: "happy", message: result.message || "Correct! Explain why your solution works." };
  if (action === "check" && result?.correct === false) return { state: "motivating", message: result.message || "Compare your output with the example and try one small change." };
  if (action === "run" && result?.status === "ok") return { state: "happy", message: "Your code ran successfully. Check Answer will verify the challenge requirements." };
  if (action === "run" && result?.status === "learner_error") return { state: "motivating", message: result.message || "Read the error, check the indicated line, and try again." };
  if (result?.status && result.status !== "ok") return { state: "motivating", message: result.message || "Execution is unavailable. Your code remains saved." };
  return { state: "idle", message: "Ready when you are." };
}
var CompanionController = class extends CharacterController {
  constructor(host, character = "byte", outfit = "outfit_01", options = {}) {
    super(host, character, outfit);
    this.pending = /* @__PURE__ */ new Map();
    this.dead = false;
    this.blinks = new BlinkScheduler(this, options);
  }
  beginRequest(action) {
    if (this.dead) return null;
    const token = Symbol(action);
    this.pending.set(token, action);
    const message = { check: "Checking your code against the challenge tests\u2026", run: "Running your Python code\u2026", next: "Waiting for the challenge generator\u2026", start: "Waiting for the challenge generator\u2026", hint: "Preparing a hint\u2026", query: "Waiting for the AI response\u2026" }[action];
    if (message) this.setReaction("thinking", message);
    return token;
  }
  finishRequest(token, result, error = null) {
    if (this.dead || !this.pending.has(token)) return;
    const action = this.pending.get(token);
    this.pending.delete(token);
    if (this.pending.size) return;
    const outcome = error ? { state: "motivating", message: "The request could not finish. Your code is saved; try again when the service is available." } : companionOutcome(action, result);
    if (outcome.state === "idle") {
      this.play("idle", { force: true });
      this.say(outcome.message);
    } else this.setReaction(outcome.state, outcome.message);
  }
  destroy() {
    if (this.dead) return;
    this.dead = true;
    this.blinks?.destroy();
    this.pending?.clear();
    super.destroy();
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/difficulty-support.js
function difficultySupport(recent, topic) {
  let failures = 0;
  for (const attempt of recent || []) {
    if (attempt.topic !== topic) continue;
    if (attempt.correct) break;
    failures++;
  }
  return failures >= 2 ? `${failures} recent tries on this topic have not passed yet. Compare one example input with your output, trace each line, and change one thing at a time. Review Concept or request a hint when you need a smaller step.` : null;
}

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/draft-saver.js
var DraftSaver = class {
  constructor(send) {
    this.send = send;
    this.pending = /* @__PURE__ */ new Map();
    this.tail = Promise.resolve();
  }
  save(payload) {
    const key = JSON.stringify(payload);
    if (this.pending.has(key)) return this.pending.get(key);
    const promise = this.tail.catch(() => {
    }).then(() => this.send(payload));
    this.tail = promise;
    this.pending.set(key, promise);
    const clear = () => this.pending.delete(key);
    promise.then(clear, clear);
    return promise;
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/question-reveal.js
var QuestionReveal = class {
  constructor(parts, { later = (fn, ms) => setTimeout(fn, ms), clear = (id) => clearTimeout(id), reduced: reduced2 = false, onStart = () => {
  }, onDone = () => {
  } } = {}) {
    this.parts = parts.map((node) => ({ node, letters: Array.from(node.textContent) }));
    this.later = later;
    this.clear = clear;
    this.onDone = onDone;
    this.active = false;
    this.index = 0;
    this.offset = 0;
    const count = this.parts.reduce((sum, part) => sum + part.letters.length, 0);
    this.delay = Math.max(3, Math.min(16, 4500 / Math.max(1, count)));
    if (reduced2 || !count) return;
    this.active = true;
    for (const part of this.parts) {
      part.node.setAttribute("aria-label", part.letters.join(""));
      part.node.textContent = "";
    }
    onStart();
    this.tick();
  }
  tick() {
    if (!this.active) return;
    while (this.index < this.parts.length && this.offset >= this.parts[this.index].letters.length) {
      this.index++;
      this.offset = 0;
    }
    if (this.index >= this.parts.length) {
      this.finish();
      return;
    }
    const part = this.parts[this.index];
    part.node.textContent += part.letters[this.offset++];
    this.timer = this.later(() => this.tick(), this.delay);
  }
  finish() {
    if (!this.active) return;
    this.active = false;
    this.clear(this.timer);
    for (const part of this.parts) part.node.textContent = part.letters.join("");
    this.onDone();
  }
  destroy() {
    this.active = false;
    this.clear(this.timer);
  }
};

// ../../AppData/Local/Temp/pyquest-ui-hxgj4y7x/app.js
var successCelebration = new SuccessCelebration({ persist: requestJson });
var progression = new ProgressionEvents();
var audio = new AudioController();
var celebrations = new CelebrationController(audio);
var app = document.querySelector("#app");
var escape4 = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
var worlds = [];
var stats = {};
var session = null;
var epoch = 0;
var companion = null;
var questionReveal = null;
var revealedQuestions = /* @__PURE__ */ new Set();
var api = requestJson;
var drafts = new DraftSaver((payload) => api("draft", payload));
var nativeNavigationPending = false;
var nativePassThrough = false;
async function nativeNavigation(event) {
  const link = event.composedPath?.().find((node) => node.tagName === "A") || event.target.closest?.("a");
  if (nativePassThrough || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || !link || link.origin !== location.origin || !["/tips", "/visual-studio"].includes(link.pathname.replace(/\/$/, ""))) return;
  event.preventDefault();
  event.stopImmediatePropagation();
  if (nativeNavigationPending) return;
  nativeNavigationPending = true;
  const href = link.href;
  try {
    if (document.querySelector("#code")) {
      notice("Saving your draft before opening the page\u2026");
      await saveDraft();
    }
    const current = [...globalThis.document.querySelectorAll("a")].find((node) => node.href === href);
    if (!current) throw Error("Your draft is saved. Select the page link again.");
    nativePassThrough = true;
    current.click();
  } catch (error) {
    notice(error.message);
  } finally {
    nativePassThrough = false;
    nativeNavigationPending = false;
  }
}
globalThis.document.addEventListener("click", nativeNavigation, true);
document.body._pyquest.dispose = () => {
  epoch++;
  questionReveal?.destroy();
  questionReveal = null;
  globalThis.document.removeEventListener("click", nativeNavigation, true);
  companion?.destroy();
  companion = null;
  successCelebration.destroy();
  celebrations.stop();
  audio.destroy();
};
function notice(text) {
  document.querySelector("#notice").textContent = text;
}
async function update() {
  stats = await api("progress");
  const wallet = document.querySelector("#wallet");
  if (wallet) {
    wallet.textContent = "\u{1FA99} " + stats.coins;
  }
  const background = stats.settings.background;
  document.body.style.backgroundImage = "";
  document.documentElement.classList.toggle("reduce-motion", !!stats.settings.reduced_motion);
  audio.setEffectsEnabled(stats.settings.sound_effects_enabled ?? true);
  audio.setEffectVolume(stats.settings.sound_effect_volume ?? 0.2);
}
var top = ["Home", "Resources", "Cheat Sheet"];
document.querySelector("#top").innerHTML = top.map((x) => '<a href="#' + x.toLowerCase().replaceAll(" ", "") + '">' + x + "</a>").join("");
document.querySelector("#top").insertAdjacentHTML("beforeend", '<a href="#characters">Character Studio</a><a href="/visual-studio">Diagrams</a>');
var worldCard = (w) => '<article class="card world-card"><img src="' + w.image + '" alt="' + escape4(w.name) + ' artwork"><button class="marker" data-go="world/' + w.id + '" aria-label="Open ' + escape4(w.name) + '">' + w.number + "</button><h2>" + escape4(w.name) + '</h2><a href="#world/' + w.id + '">Explore topics \u2192</a></article>';
async function route() {
  questionReveal?.destroy();
  questionReveal = null;
  celebrations.stop();
  companion?.destroy();
  companion = null;
  const ticket = ++epoch;
  notice("");
  const [page = "home", id, reviewSid] = (location.hash.slice(1) || "home").split("/");
  document.body.classList.toggle("studio-page", page === "characters");
  document.body.classList.toggle("practice-page", ["practice", "learn"].includes(page));
  audio.setMode(["practice", "learn"].includes(page) ? "practice" : "map");
  document.querySelectorAll("#top a").forEach((a) => a.classList.toggle("active", a.hash === "#" + (page === "map" ? "home" : page)));
  await update();
  if (ticket !== epoch) return;
  if (page === "home" || page === "map") {
    const p = id === "2" ? 1 : 0;
    app.innerHTML = '<h1>Explore the worlds</h1><p>Every world is open. Choose your own learning path.</p><div class="grid">' + worlds.slice(p * 7, p * 7 + 7).map(worldCard).join("") + '</div><div class="pager"><button data-go="home/1" aria-label="Worlds 1 to 7">\u2190</button><strong>Worlds ' + (p ? "8\u201313" : "1\u20137") + '</strong><button data-go="home/2" aria-label="Worlds 8 to 13">\u2192</button></div>';
  } else if (page === "world") {
    const w = worlds.find((w2) => w2.id === id);
    if (!w) throw Error("Unknown world");
    app.innerHTML = '<a href="#map/' + (w.number > 7 ? 2 : 1) + '">\u2190 Back to worlds</a><h1>' + escape4(w.name) + '</h1><div class="split"><img class="art" src="' + w.image + '" alt="' + escape4(w.name) + '"><div class="grid">' + w.topics.map((t) => '<article class="panel"><button class="marker" data-topic="' + t.id + '">' + t.number + "</button><h2>" + escape4(t.name) + "</h2><small>" + escape4(t.content_status) + '</small><progress max="1" value="' + (stats.mastery[t.id] || 0) + '"></progress></article>').join("") + '</div></div><div class="pager">' + (w.number > 1 ? '<button data-go="world/' + worlds[w.number - 2].id + '">\u2190 Previous World</button>' : "") + (w.number < worlds.length ? '<button data-go="world/' + worlds[w.number].id + '">Next World \u2192</button>' : "") + "</div>";
  } else if (page === "learn" || page === "concept") {
    await showConcept(id, ticket, reviewSid);
    return;
  } else if (page === "practice") {
    session = await api("session/" + id);
    if (ticket !== epoch) return;
    practice();
  } else if (page === "progress") app.innerHTML = '<h1>Your learning progress</h1><p>Real practice. Small steps. Steady growth.</p><div class="grid">' + [["Attempts", stats.attempts], ["Correct answers", stats.correct], ["Coins", stats.coins]].map(([k, v]) => '<article class="panel">' + k + '<div class="metric">' + v + "</div></article>").join("") + '</div><div class="split"><section class="panel"><h2>World progress</h2>' + worlds.map((w) => '<p><a href="#world/' + w.id + '">' + w.name + "</a> " + Math.round(stats.worlds[w.id] * 100) + '%</p><progress max="1" value="' + stats.worlds[w.id] + '"></progress>').join("") + "</section></div>";
  else if (page === "cheatsheet") mountResources(app, true);
  else if (page === "resources") mountResources(app);
  else if (page === "about") app.innerHTML = '<h1>About Python</h1><article class="panel"><h2>A readable, general-purpose language</h2><p>Guido van Rossum began Python in 1989; the first public release appeared in 1991. Python is used for automation, web services, education, data analysis and scientific computing.</p><h2>How it runs</h2><p>CPython compiles source into bytecode and executes it in an interpreter. Values have types; variable names can be rebound to different values.</p><h2>Your first program</h2><pre>print("Hello, Python!")</pre><p>Explore input/output, variables, decisions, loops and collections before functions and objects.</p></article>';
  else if (page === "characters") companion = mountStudio(app, stats.settings, async (settings) => {
    await api("settings", { settings });
    await update();
  });
  else if (page === "settings") app.innerHTML = '<h1>Settings</h1><section class="panel settings-panel"><label><input type="checkbox" id="motion" ' + (stats.settings.reduced_motion ? "checked" : "") + '> Reduce motion</label><label><input type="checkbox" id="effects" ' + (stats.settings.sound_effects_enabled ? "checked" : "") + '> Sound effects</label><label>Sound effect volume <input type="range" id="effects-volume" min="0" max="1" step="0.05" value="' + (stats.settings.sound_effect_volume ?? 0.2) + '"></label><p>Your companion and audio choices are saved to this profile.</p></section>';
  else app.innerHTML = '<h1>Page not found</h1><a href="#home">Return Home</a>';
  if (["world", "progress"].includes(page)) mountCompanion();
  bind();
}
function mountCompanion() {
  companion?.destroy();
  document.querySelector("#active-companion")?.remove();
  const host = document.createElement("section");
  host.id = "active-companion";
  host.className = "companion";
  const slot = document.querySelector("#companion-slot");
  if (slot) slot.append(host);
  else app.prepend(host);
  const { character, outfit } = selectedCompanion(stats.settings);
  companion = new CompanionController(host, character.id, outfit.id);
  if (slot) {
    const label = document.createElement("p");
    label.className = "practice-companion-label";
    label.textContent = character.name + " \xB7 " + outfit.name;
    host.prepend(label);
    host.style.setProperty("--companion-accent", character.color);
  }
}
function practice() {
  if (!worlds.some((w) => w.id === session.question.world_id)) {
    app.innerHTML = '<h1>This level is no longer available</h1><a href="#home">Choose another world</a>';
    return;
  }
  questionReveal?.destroy();
  questionReveal = null;
  companion?.destroy();
  companion = null;
  renderPractice(app, session, worlds, stats);
}
async function showConcept(id, ticket, reviewSid) {
  if (!worlds.some((w) => w.topics.some((t) => t.id === id))) {
    app.innerHTML = '<h1>This level is no longer available</h1><a href="#home">Choose another world</a>';
    return;
  }
  const state = await api("concept/" + id);
  if (ticket !== epoch) return;
  if (reviewSid) {
    const saved = await api("session/" + reviewSid);
    if (ticket !== epoch) return;
    if (saved.question.subtopic_id !== id) throw Error("Topic mismatch");
    state.session_id = reviewSid;
  }
  mountConcept(app, state, async () => {
    await api("concept-complete", { topic: id });
    if (ticket !== epoch) return;
    let waiting = null, value;
    if (!reviewSid && !state.session_id) {
      const holder = document.createElement("section");
      holder.className = "companion concept-request-companion";
      holder.setAttribute("aria-label", "Challenge preparation companion");
      app.querySelector(".concept-footer").before(holder);
      const { character, outfit } = selectedCompanion(stats.settings);
      waiting = new CompanionController(holder, character.id, outfit.id);
      waiting.beginRequest("start");
    }
    try {
      value = reviewSid ? await api("session/" + reviewSid) : await api("concept-start", { topic: id });
    } finally {
      if (waiting) {
        const holder = waiting.host;
        waiting.destroy();
        holder.remove();
      }
    }
    if (ticket !== epoch) return;
    localStorage.setItem("pyquest_session", value.session_id);
    location.hash = "practice/" + value.session_id;
  });
  bind();
}
async function saveDraft() {
  if (!session || !document.querySelector("#code")) return;
  return drafts.save({ session_id: session.session_id, question_id: session.question.question_id, code: document.querySelector("#code").value });
}
function bind() {
  audio.disable();
  if (document.querySelector("#code") && !document.querySelector("#active-companion")) {
    mountCompanion();
    companion.dispatch("QUESTION_LOADED", { message: "Read the task, try your code, and check when you are ready." });
  }
  if (document.querySelector("#code") && !revealedQuestions.has(session.question.question_id)) {
    const qid = session.question.question_id, ticket = epoch, visual = companion;
    const reduced2 = !!stats.settings.reduced_motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealedQuestions.add(qid);
    questionReveal = new QuestionReveal([...document.querySelectorAll("[data-question-text]")], {
      reduced: reduced2,
      onStart: () => {
        visual.setReaction("thinking", "Reading the new question with you\u2026");
      },
      onDone: () => {
        if (ticket === epoch && visual === companion) {
          visual.dispatch("QUESTION_LOADED", { message: "Your turn. Write your code, then check your answer." });
        }
      }
    });
  }
  document.querySelectorAll("[data-go]").forEach((b) => b.onclick = () => location.hash = b.dataset.go);
  document.querySelectorAll("[data-topic]").forEach((b) => {
    const card = b.closest("article");
    card.classList.add("topic-node");
    card.tabIndex = 0;
    card.setAttribute("role", "link");
    card.setAttribute("aria-label", "Open practice terminal: " + card.querySelector("h2").textContent);
    b.tabIndex = -1;
    const open = () => {
      location.hash = "learn/" + b.dataset.topic;
    };
    card.onclick = open;
    card.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        open();
      }
    };
  });
  const resume = document.querySelector("#resume");
  if (resume) resume.onclick = () => location.hash = localStorage.getItem("pyquest_session") ? "practice/" + localStorage.getItem("pyquest_session") : "map";
  const motion = document.querySelector("#motion");
  if (motion) motion.onchange = async () => {
    try {
      await api("settings", { settings: { reduced_motion: motion.checked } });
      await update();
    } catch (e) {
      notice(e.message);
    }
  };
  const effects = document.querySelector("#effects");
  if (effects) effects.onchange = async () => {
    try {
      await api("settings", { settings: { sound_effects_enabled: effects.checked } });
      await update();
    } catch (e) {
      notice(e.message);
    }
  };
  const effectsVolume = document.querySelector("#effects-volume");
  if (effectsVolume) effectsVolume.onchange = async () => {
    try {
      await api("settings", { settings: { sound_effect_volume: Number(effectsVolume.value) } });
      await update();
    } catch (e) {
      notice(e.message);
    }
  };
  const code = document.querySelector("#code");
  if (code) {
    code.oninput = () => {
      questionReveal?.finish();
      if (!companion?.pending.size) companion?.dispatch("QUESTION_LOADED", { message: "Take your time. I\u2019m here while you write." });
    };
    code.onblur = () => saveDraft().catch((e) => notice(e.message));
    code.onkeydown = (e) => handleEditorKey(e, code, () => document.querySelector("[data-action=run]").click());
  }
  const review = document.querySelector("#review-concept");
  if (review) review.onclick = async () => {
    try {
      await saveDraft();
      location.hash = "concept/" + session.question.subtopic_id + "/" + session.session_id;
    } catch (e) {
      notice(e.message);
    }
  };
  const clear = document.querySelector("#clear");
  if (clear) clear.onclick = () => document.querySelector("#output").textContent = "";
  document.querySelectorAll("[data-action]").forEach((b) => b.onclick = async () => {
    if (b.disabled) return;
    questionReveal?.finish();
    audio.unlockEffects()?.catch(() => {
    });
    const action = b.dataset.action;
    if (action === "reveal" && !confirm(`Spend ${session.question.solution_cost} coins to view the solution?`)) return;
    const sid = session.session_id, qid = session.question.question_id, ticket = epoch;
    const requestCompanion = companion, requestToken = requestCompanion?.beginRequest(action);
    document.querySelectorAll("[data-action]").forEach((x) => x.disabled = true);
    const actionStatus = document.querySelector("#action-status");
    if (actionStatus) {
      actionStatus.textContent = { check: "Checking your answer\u2026", run: "Running your code\u2026", hint: "Preparing a hint\u2026", reveal: "Processing solution purchase\u2026", next: "Generating the next question\u2026" }[action];
      actionStatus.setAttribute("aria-busy", "true");
    }
    let confirmedSuccess = null;
    try {
      await saveDraft();
      const value = await api(action, { session_id: sid, question_id: qid, code: code.value, confirmed: action === "reveal", operation_id: crypto.randomUUID(), inputs: document.querySelector("#inputs").value.split("\n") });
      if (ticket !== epoch) return;
      requestCompanion?.finishRequest(requestToken, value);
      if (action === "next") {
        session = value;
        practice();
        bind();
      } else if (action === "hint") {
        document.querySelector("#result").textContent = value.hint;
        companion?.dispatch("HINT_RECEIVED", { message: value.hint });
      } else if (action === "reveal") {
        code.value = value.solution;
        notice("Solution shown. This question will not award independent mastery.");
        companion?.dispatch("SOLUTION_RECEIVED", { message: "Read the solution and trace how each step works." });
      } else {
        document.querySelector("#output").textContent = (value.outputs || []).join("\n") || value.message || "";
        if (action === "check") document.querySelector("#result").textContent = value.correct !== void 0 ? (value.correct ? "Correct" : "Incorrect") + " \xB7 Marks " + value.marks_awarded + "/" + value.marks_possible + " \xB7 XP +" + value.xp_awarded + " \xB7 Coins +" + value.coins_awarded + " \xB7 Mastery " + Math.round(value.previous_mastery * 100) + "% \u2192 " + Math.round(value.new_mastery * 100) + "%" : value.message;
      }
      if (action === "check" && value.correct !== void 0) {
        if (value.correct === true) confirmedSuccess = value;
        const progressReceipt = value.events?.find((event) => event.event_id)?.event_id || qid;
        const progressEvents = progression.accept(value, progressReceipt);
        const reducedMotion = !!stats.settings.reduced_motion || matchMedia("(prefers-reduced-motion: reduce)").matches;
        renderResult(document.querySelector("#result"), value, { animate: progressEvents.xp && !reducedMotion });
        const reaction = value.correct ? "happy" : "motivating";
        companion?.setReaction(reaction, (value.correct ? "" : "\u{1F614} ") + (value.message || value.result_message || "Good effort."));
        const receipt = value.events?.find((event) => event.event_id)?.event_id || qid;
        rewardAnimation(value, receipt, document.querySelector("#result"));
        celebrations.result(value, receipt, document.querySelector("#result"));
        presentProgression(document.querySelector("#result"), value, progressEvents, { settings: stats.settings, companion, audio, reducedMotion });
        if (value.topic_mastered && value.next_subtopic_id && worlds.some((w) => w.topics.some((t) => t.id === value.next_subtopic_id))) {
          const next = document.createElement("button");
          next.textContent = "Continue to recommended topic \u2192";
          next.onclick = () => location.hash = "learn/" + value.next_subtopic_id;
          document.querySelector("#result").append(next);
        }
      }
      await update();
      if (action === "check" && value.correct === false) {
        const support = difficultySupport(stats.recent, session.question.subtopic_id);
        if (support) companion?.setReaction("motivating", "\u{1F614} " + support);
      }
    } catch (e) {
      requestCompanion?.finishRequest(requestToken, null, e);
      if (ticket !== epoch) return;
      notice(e.message);
      if (action === "check" || action === "hint") companion?.setReaction("motivating", "The request failed. Please try again.");
      if (e.code === "QUESTION_GENERATION_UNAVAILABLE") {
        const retry = document.querySelector("[data-action=next]");
        if (retry) retry.textContent = "Try Again \u2014 Next Question";
      }
    } finally {
      if (ticket === epoch) {
        document.querySelectorAll("[data-action]").forEach((x) => x.disabled = false);
        if (actionStatus) {
          actionStatus.textContent = "Ready";
          actionStatus.setAttribute("aria-busy", "false");
        }
        if (confirmedSuccess) successCelebration.show(confirmedSuccess, { sid, qid, settings: stats.settings, isCurrent: () => ticket === epoch && session?.question.question_id === qid, onContinue: () => document.querySelector("[data-action=next]")?.click() }).catch((error) => notice(error.message));
      }
    }
  });
}
document.addEventListener("click", async (e) => {
  const b = e.target.closest("[data-copy]");
  if (b) {
    try {
      await navigator.clipboard.writeText(sheetCards[Number(b.dataset.copy)][2]);
      b.textContent = "Copied";
    } catch {
      notice("Copy unavailable; select the code to copy.");
    }
  }
});
window.addEventListener("hashchange", () => route().catch((e) => notice(e.message)));
var health = await api("health");
if (health.verification_mode) {
  const banner = document.createElement("p");
  banner.className = "verification-banner";
  banner.textContent = "TEST SESSION \u2014 mock question provider, isolated verification data. Not live AI.";
  document.body.prepend(banner);
}
worlds = await api("catalog");
await route();
