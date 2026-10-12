// Migrated educational content; no legacy scripts, styles, or runtime dependencies.
export const resourceLessons = [
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
      " Variables in Python  A variable is a name bound to an object. Assignment creates or updates that binding. You do not need a separate variable declaration, and the same name can later refer to an object of another type.  A variable name is an  identifier . Identifiers also name functions and classes. Assigning a variable is not a request to the operating system for memory labeled with that name. \n 1. Integer and float   x = 5\nx = 4.23   First,  x  refers to an integer. Then it refers to a float. The objects have types; the name is rebound. \n 2. String   y = \"apple\"   Quotation marks create a string containing text. \n 3. Boolean   z = True   Boolean values are  True  and  False , with capital first letters. \n 4. Multiple assignments   a, b, c, d = 5, 4.26, \"apple\", True   This assigns  5  to a,  4.26  to b,  \"apple\"  to c and  True  to d.   a = 5; b = 4.26; c = \"apple\"; d = True   Semicolons can separate statements, but separate lines usually read more clearly. \n 5. One value, multiple names   a = b = c = 15   All three names refer to the same integer object. With mutable objects such as lists, changes through one name can be visible through the others. ",
      "",
      "",
      "<h2>Variables in Python</h2><p>A variable is a name bound to an object. Assignment creates or updates that binding. You do not need a separate variable declaration, and the same name can later refer to an object of another type.</p><p>A variable name is an <strong>identifier</strong>. Identifiers also name functions and classes. Assigning a variable is not a request to the operating system for memory labeled with that name.</p>\n<h3>1. Integer and float</h3><pre><code>x = 5\nx = 4.23</code></pre><p>First, <code>x</code> refers to an integer. Then it refers to a float. The objects have types; the name is rebound.</p>\n<h3>2. String</h3><pre><code>y = \"apple\"</code></pre><p>Quotation marks create a string containing text.</p>\n<h3>3. Boolean</h3><pre><code>z = True</code></pre><p>Boolean values are <code>True</code> and <code>False</code>, with capital first letters.</p>\n<h3>4. Multiple assignments</h3><pre><code>a, b, c, d = 5, 4.26, \"apple\", True</code></pre><p>This assigns <code>5</code> to a, <code>4.26</code> to b, <code>\"apple\"</code> to c and <code>True</code> to d.</p><pre><code>a = 5; b = 4.26; c = \"apple\"; d = True</code></pre><p>Semicolons can separate statements, but separate lines usually read more clearly.</p>\n<h3>5. One value, multiple names</h3><pre><code>a = b = c = 15</code></pre><p>All three names refer to the same integer object. With mutable objects such as lists, changes through one name can be visible through the others.</p>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "data",
    "card": [
      "What is data?",
      " What is data?  Data is information a program can store or process: text, numbers, logical values, images and more.    Text:   \"john\" ,  \"mango\"  and  \"book\" .   Numbers:   15 ,  84.13  and  5486 .   Alphanumeric text:   \"13street\" ,  \"alpha56\"  and  \"dx14c5\" .   “Facts” and “figures” are everyday descriptions, not Python data types. A string can contain letters, digits, punctuation or other characters.  \"4586\"  is text, while  4586  is an integer. ",
      "",
      "",
      "<h2>What is data?</h2><p>Data is information a program can store or process: text, numbers, logical values, images and more.</p><ul><li><strong>Text:</strong> <code>\"john\"</code>, <code>\"mango\"</code> and <code>\"book\"</code>.</li><li><strong>Numbers:</strong> <code>15</code>, <code>84.13</code> and <code>5486</code>.</li><li><strong>Alphanumeric text:</strong> <code>\"13street\"</code>, <code>\"alpha56\"</code> and <code>\"dx14c5\"</code>.</li></ul><p>“Facts” and “figures” are everyday descriptions, not Python data types. A string can contain letters, digits, punctuation or other characters. <code>\"4586\"</code> is text, while <code>4586</code> is an integer.</p>"
    ],
    "group": "Python Basic Concepts"
  },
  {
    "id": "types",
    "card": [
      "Data types in Python",
      " Data types in Python  A type describes an object's values and supported operations. Use  type(value)  to inspect a value's type. \n  Data types    Numeric  Integer · int  Complex · complex  Float · float    Mapping  Dictionary · dict    Boolean  bool    Set  set    Sequence  String · str  List · list  Tuple · tuple     A beginner overview, not an exhaustive list. Technically, bool is a subclass of int. \n   Common types and examples    Type  Meaning  Example      Integer · int  Whole numbers   56, 8, -493     Complex · complex  Real and imaginary components   9 + 21j     Float · float  Floating-point numbers   2.3, 18.12, 294.0     Boolean · bool  Logical values   True, False     String · str  Immutable text sequence   \"hello\", \"Peter\", \"4586\"     Dictionary · dict  Mutable key-value mapping; preserves insertion order   {\"name\": \"frankie\", \"age\": 18}     Set · set  Unordered collection of unique, hashable elements   {\"a\", \"b\", \"c\"}     List · list  Ordered, mutable collection   [\"apple\", \"banana\", \"cherry\"]     Tuple · tuple  Ordered, immutable collection   (15, \"Albert\", 18.20)        value = 4.23\nprint(type(value))  # &lt;class 'float'&gt;  ",
      "",
      "",
      "<h2>Data types in Python</h2><p>A type describes an object's values and supported operations. Use <code>type(value)</code> to inspect a value's type.</p>\n<div><strong>Data types</strong><div><div><h3>Numeric</h3><p>Integer · int</p><p>Complex · complex</p><p>Float · float</p></div><div><h3>Mapping</h3><p>Dictionary · dict</p></div><div><h3>Boolean</h3><p>bool</p></div><div><h3>Set</h3><p>set</p></div><div><h3>Sequence</h3><p>String · str</p><p>List · list</p><p>Tuple · tuple</p></div></div></div><p>A beginner overview, not an exhaustive list. Technically, bool is a subclass of int.</p>\n<div><table><caption>Common types and examples</caption><thead><tr><th>Type</th><th>Meaning</th><th>Example</th></tr></thead><tbody><tr><td>Integer · int</td><td>Whole numbers</td><td><code>56, 8, -493</code></td></tr><tr><td>Complex · complex</td><td>Real and imaginary components</td><td><code>9 + 21j</code></td></tr><tr><td>Float · float</td><td>Floating-point numbers</td><td><code>2.3, 18.12, 294.0</code></td></tr><tr><td>Boolean · bool</td><td>Logical values</td><td><code>True, False</code></td></tr><tr><td>String · str</td><td>Immutable text sequence</td><td><code>\"hello\", \"Peter\", \"4586\"</code></td></tr><tr><td>Dictionary · dict</td><td>Mutable key-value mapping; preserves insertion order</td><td><code>{\"name\": \"frankie\", \"age\": 18}</code></td></tr><tr><td>Set · set</td><td>Unordered collection of unique, hashable elements</td><td><code>{\"a\", \"b\", \"c\"}</code></td></tr><tr><td>List · list</td><td>Ordered, mutable collection</td><td><code>[\"apple\", \"banana\", \"cherry\"]</code></td></tr><tr><td>Tuple · tuple</td><td>Ordered, immutable collection</td><td><code>(15, \"Albert\", 18.20)</code></td></tr></tbody></table></div><pre><code>value = 4.23\nprint(type(value))  # &lt;class 'float'&gt;</code></pre>"
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
      " Typecasting  Type conversion produces a value of another type. Some numeric operations perform implicit conversion; explicit conversion uses functions such as  int() ,  float()  and  str() .  Implicit conversion   a = 5\nb = 2.5\nc = a + b\nprint(c)        # 7.5\nprint(type(c))  # &lt;class 'float'&gt;   The mixed numeric addition produces a float. The original  a  still refers to an integer.  Explicit conversions   a = 8\nb = float(a)  # 8.0\n\na = 5.8\nb = int(a)    # 5: truncates toward zero\n\na = 456\nb = str(a)    # \"456\"\n\na = \"18\"\nb = int(a)    # 18\n\na = 24.19\nb = str(a)    # \"24.19\"   Not every conversion succeeds:  int(\"apple\")  and  int(\"5.8\")  raise  ValueError . Converting a float to an integer truncates rather than rounds:  int(-5.8)  is  -5 . ",
      "",
      "",
      "<h2>Typecasting</h2><p>Type conversion produces a value of another type. Some numeric operations perform implicit conversion; explicit conversion uses functions such as <code>int()</code>, <code>float()</code> and <code>str()</code>.</p><h3>Implicit conversion</h3><pre><code>a = 5\nb = 2.5\nc = a + b\nprint(c)        # 7.5\nprint(type(c))  # &lt;class 'float'&gt;</code></pre><p>The mixed numeric addition produces a float. The original <code>a</code> still refers to an integer.</p><h3>Explicit conversions</h3><pre><code>a = 8\nb = float(a)  # 8.0\n\na = 5.8\nb = int(a)    # 5: truncates toward zero\n\na = 456\nb = str(a)    # \"456\"\n\na = \"18\"\nb = int(a)    # 18\n\na = 24.19\nb = str(a)    # \"24.19\"</code></pre><p>Not every conversion succeeds: <code>int(\"apple\")</code> and <code>int(\"5.8\")</code> raise <code>ValueError</code>. Converting a float to an integer truncates rather than rounds: <code>int(-5.8)</code> is <code>-5</code>.</p>"
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
      " Logical operators  Combine conditions with  and  and  or , and reverse truth with  not . For Boolean conditions the results are  True  or  False , not automatically the integers 1 and 0.  and: all conditions must be true   x, y, z, k = 15, 2, 6, 25\na = x &gt; 5 and y &lt; 6 and k &gt;= 25  # True\nb = x &gt; y and k &lt; 25              # False   or: at least one condition must be true   a = x &lt; 5 or y &lt; 6 or k &gt;= 25  # True\nb = x &lt; y or k &lt; 25             # False   In the first expression, both  y &lt; 6  and  k &gt;= 25  are true.  not: reverse the truth value   x, y = 15, 10\na = not (x &gt; 5)  # False\nb = not (y &lt; 5)  # True   Short-circuit evaluation   and  stops at the first false-like operand;  or  stops at the first true-like operand. They return an operand, which need not be a Boolean.  not  always produces a Boolean.   name = \"\" or \"Guest\"  # \"Guest\"\nresult = 0 and 99    # 0  ",
      "",
      "",
      "<h2>Logical operators</h2><p>Combine conditions with <code>and</code> and <code>or</code>, and reverse truth with <code>not</code>. For Boolean conditions the results are <code>True</code> or <code>False</code>, not automatically the integers 1 and 0.</p><h3>and: all conditions must be true</h3><pre><code>x, y, z, k = 15, 2, 6, 25\na = x &gt; 5 and y &lt; 6 and k &gt;= 25  # True\nb = x &gt; y and k &lt; 25              # False</code></pre><h3>or: at least one condition must be true</h3><pre><code>a = x &lt; 5 or y &lt; 6 or k &gt;= 25  # True\nb = x &lt; y or k &lt; 25             # False</code></pre><p>In the first expression, both <code>y &lt; 6</code> and <code>k &gt;= 25</code> are true.</p><h3>not: reverse the truth value</h3><pre><code>x, y = 15, 10\na = not (x &gt; 5)  # False\nb = not (y &lt; 5)  # True</code></pre><h3>Short-circuit evaluation</h3><p><code>and</code> stops at the first false-like operand; <code>or</code> stops at the first true-like operand. They return an operand, which need not be a Boolean. <code>not</code> always produces a Boolean.</p><pre><code>name = \"\" or \"Guest\"  # \"Guest\"\nresult = 0 and 99    # 0</code></pre>"
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
      " Membership operators   in  tests membership;  not in  tests absence. These work with strings and containers such as lists, tuples, sets and dictionaries. Sets and dictionaries are not sequence types.  in   a = \"I am learning Python\"\nb = {1: \"apple\", 2: \"ball\"}\nx = \"Python\" in a  # True: substring found\ny = 3 in b         # False: key 3 absent   not in   x = \"Hello\" not in a  # True\ny = 1 not in b        # False: key 1 is present   Dictionary keys versus values  Membership directly on a dictionary checks its keys. To check values, use  .values() ; to check key-value pairs, use  .items() .   print(\"apple\" in b)           # False\nprint(\"apple\" in b.values())  # True\nprint((1, \"apple\") in b.items())  # True  ",
      "",
      "",
      "<h2>Membership operators</h2><p><code>in</code> tests membership; <code>not in</code> tests absence. These work with strings and containers such as lists, tuples, sets and dictionaries. Sets and dictionaries are not sequence types.</p><h3>in</h3><pre><code>a = \"I am learning Python\"\nb = {1: \"apple\", 2: \"ball\"}\nx = \"Python\" in a  # True: substring found\ny = 3 in b         # False: key 3 absent</code></pre><h3>not in</h3><pre><code>x = \"Hello\" not in a  # True\ny = 1 not in b        # False: key 1 is present</code></pre><h3>Dictionary keys versus values</h3><p>Membership directly on a dictionary checks its keys. To check values, use <code>.values()</code>; to check key-value pairs, use <code>.items()</code>.</p><pre><code>print(\"apple\" in b)           # False\nprint(\"apple\" in b.values())  # True\nprint((1, \"apple\") in b.items())  # True</code></pre>"
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
      " Environment setup  To write and run Python, you need an editor for source code and a Python interpreter to execute it. An IDE combines editing and development tools in one interface.   Install Python from its official downloads page, or install a beginner IDE that includes an interpreter.  Open your editor or IDE and create a file named  hello.py .  Write  print(\"Hello World\") , save the file and use the IDE's Run command.  Check that the output panel displays  Hello World .   On Windows with Python installed, you can also run  py hello.py  in a terminal. On many macOS and Linux installations, use  python3 hello.py .  Editor and IDE options include Thonny, Spyder, PyDev, IDLE, Visual Studio Code and Wing. For this learning path, use Thonny as the beginner-oriented option. VS Code requires a separately configured Python interpreter. IDLE is included with many Python installations, but availability can depend on the installation package. ",
      "",
      "",
      "<h2>Environment setup</h2><p>To write and run Python, you need an editor for source code and a Python interpreter to execute it. An IDE combines editing and development tools in one interface.</p><ol><li>Install Python from its official downloads page, or install a beginner IDE that includes an interpreter.</li><li>Open your editor or IDE and create a file named <code>hello.py</code>.</li><li>Write <code>print(\"Hello World\")</code>, save the file and use the IDE's Run command.</li><li>Check that the output panel displays <code>Hello World</code>.</li></ol><p>On Windows with Python installed, you can also run <code>py hello.py</code> in a terminal. On many macOS and Linux installations, use <code>python3 hello.py</code>.</p><p>Editor and IDE options include Thonny, Spyder, PyDev, IDLE, Visual Studio Code and Wing. For this learning path, use Thonny as the beginner-oriented option. VS Code requires a separately configured Python interpreter. IDLE is included with many Python installations, but availability can depend on the installation package.</p>"
    ],
    "group": "Input and Output in Python"
  },
  {
    "id": "print",
    "card": [
      "Output with print()",
      " Output with print()   print()  writes text representations of values to standard output, usually your terminal. By default, it separates arguments with a space and ends with a newline.   print('Hello World')\nprint(\"Hello World\")   Output   Hello World\nHello World   Separate lines and escape sequences   print('Sunday')\nprint('Monday')\n# The same two lines using one call:\nprint('Sunday\\nMonday')    \\n  means newline,  \\t  means tab, and  \\\\  represents a backslash. Escapes let you include characters that are difficult to write directly in a string.  sep: between arguments   print('Sunday', 'Monday', sep='-')\nprint('18', '06', '2020', sep='/')\nprint('is Thursday')    Sunday-Monday\n18/06/2020\nis Thursday   end: after the output   print('Sunday', 'Monday', end='-')\nprint('Tuesday')\nprint('Wednesday')    Sunday Monday-Tuesday\nWednesday   Combine sep and end   print('thomas', 'wilson', sep='', end='@')\nprint('example.com')    thomaswilson@example.com   Print numeric values   a = 10\nb = 20.32\nprint('a=', a, ' b=', b, sep='', end='\\n\\n')\nprint('a=', a, sep='')\nprint('b=', b, sep='')    a=10 b=20.32\n\na=10\nb=20.32  ",
      "",
      "",
      "<h2>Output with print()</h2><p><code>print()</code> writes text representations of values to standard output, usually your terminal. By default, it separates arguments with a space and ends with a newline.</p><pre><code>print('Hello World')\nprint(\"Hello World\")</code></pre><h3>Output</h3><pre><samp>Hello World\nHello World</samp></pre><h3>Separate lines and escape sequences</h3><pre><code>print('Sunday')\nprint('Monday')\n# The same two lines using one call:\nprint('Sunday\\nMonday')</code></pre><p><code>\\n</code> means newline, <code>\\t</code> means tab, and <code>\\\\</code> represents a backslash. Escapes let you include characters that are difficult to write directly in a string.</p><h3>sep: between arguments</h3><pre><code>print('Sunday', 'Monday', sep='-')\nprint('18', '06', '2020', sep='/')\nprint('is Thursday')</code></pre><pre><samp>Sunday-Monday\n18/06/2020\nis Thursday</samp></pre><h3>end: after the output</h3><pre><code>print('Sunday', 'Monday', end='-')\nprint('Tuesday')\nprint('Wednesday')</code></pre><pre><samp>Sunday Monday-Tuesday\nWednesday</samp></pre><h3>Combine sep and end</h3><pre><code>print('thomas', 'wilson', sep='', end='@')\nprint('example.com')</code></pre><pre><samp>thomaswilson@example.com</samp></pre><h3>Print numeric values</h3><pre><code>a = 10\nb = 20.32\nprint('a=', a, ' b=', b, sep='', end='\\n\\n')\nprint('a=', a, sep='')\nprint('b=', b, sep='')</code></pre><pre><samp>a=10 b=20.32\n\na=10\nb=20.32</samp></pre>"
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
      " Comments and docstrings  A comment begins with  #  outside a string and continues to the end of the line. Comments explain the code and are not executed.   # Print a greeting.\nprint('Hello World')  # An inline comment\n\n# Explain longer ideas using\n# several consecutive comment lines.\n# print('This line will not run')   The only executed statement above prints  Hello World .  Triple-quoted strings are not comments  Triple quotes create a string literal. As the first statement in a module, class or function, that string can serve as a docstring. It is not correct to say a string is only processed when assigned to a variable.   def greet():\n    \"\"\"Display a friendly greeting.\"\"\"\n    print('Hello World')\n\ngreet()   Use  #  for comments and docstrings for documentation. ",
      "",
      "",
      "<h2>Comments and docstrings</h2><p>A comment begins with <code>#</code> outside a string and continues to the end of the line. Comments explain the code and are not executed.</p><pre><code># Print a greeting.\nprint('Hello World')  # An inline comment\n\n# Explain longer ideas using\n# several consecutive comment lines.\n# print('This line will not run')</code></pre><p>The only executed statement above prints <code>Hello World</code>.</p><h3>Triple-quoted strings are not comments</h3><p>Triple quotes create a string literal. As the first statement in a module, class or function, that string can serve as a docstring. It is not correct to say a string is only processed when assigned to a variable.</p><pre><code>def greet():\n    \"\"\"Display a friendly greeting.\"\"\"\n    print('Hello World')\n\ngreet()</code></pre><p>Use <code>#</code> for comments and docstrings for documentation.</p>"
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
      " Strings in Python  A string is an immutable sequence of Unicode code points used for text. A single character is also a string. Being a sequence describes ordered access, not a promise about physical memory layout.   text = 'DREMENDO'\nprint(text)\ntext = \"Dremendo\"\nprint(text)\nmessage = '''We are learning Python\nwith PYQUEST'''\nprint(message)    DREMENDO\nDremendo\nWe are learning Python\nwith PYQUEST   Use names like text rather than str, which would hide Python's built-in str type.   text = 'DREMENDO'\nprint(text[2])   # E\nprint(text[-2])  # D\n# text[0] = 'X' would raise TypeError   Indexing starts at 0; negative indices count from the end. An out-of-range index raises IndexError. ",
      "",
      "",
      "<h2>Strings in Python</h2><p>A string is an immutable sequence of Unicode code points used for text. A single character is also a string. Being a sequence describes ordered access, not a promise about physical memory layout.</p><pre><code>text = 'DREMENDO'\nprint(text)\ntext = \"Dremendo\"\nprint(text)\nmessage = '''We are learning Python\nwith PYQUEST'''\nprint(message)</code></pre><pre><samp>DREMENDO\nDremendo\nWe are learning Python\nwith PYQUEST</samp></pre><p>Use names like text rather than str, which would hide Python's built-in str type.</p><pre><code>text = 'DREMENDO'\nprint(text[2])   # E\nprint(text[-2])  # D\n# text[0] = 'X' would raise TypeError</code></pre><p>Indexing starts at 0; negative indices count from the end. An out-of-range index raises IndexError.</p>"
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
      " String operations and formatting   print('Python' + ' Programming')  # Python Programming\nprint('Go! ' * 3)                 # Go! Go! Go!\nprint(len('Dremendo'))            # 8\nfor ch in 'Python':\n    print(ch)  # One character per line\nprint('pp' in 'Apple')            # True\nprint('px' in 'Apple')            # False\nprint('mx' not in 'Apple')        # True   Escape sequences include  \\n  newline,  \\r  carriage return,  \\f  form feed,  \\b  backspace,  \\t  tab,  \\\\  backslash and escaped quotes.   print(\"David asked \\\"What's your name?\\\"\")\na, b, c, d = 5, 12.654, 'Andrew', True\nprint('{} {} {} {}'.format(a, b, c, d))\nprint('{1} {3} {0} {2}'.format(a, b, c, d))\nprint('{name}: {value:.2f}'.format(name=c, value=b))\n# Andrew: 12.65\nprint('Integer=%d Float=%.2f Name=%s Boolean=%s' % (a, b, c, d))   Percent formats include %d and %i for integers, %f for fixed-point numbers, %c for a character, %s for text, %o for octal and %x / %X for hexadecimal. Decimal formatting rounds the displayed value rather than always rounding upward. ",
      "",
      "",
      "<h2>String operations and formatting</h2><pre><code>print('Python' + ' Programming')  # Python Programming\nprint('Go! ' * 3)                 # Go! Go! Go!\nprint(len('Dremendo'))            # 8\nfor ch in 'Python':\n    print(ch)  # One character per line\nprint('pp' in 'Apple')            # True\nprint('px' in 'Apple')            # False\nprint('mx' not in 'Apple')        # True</code></pre><p>Escape sequences include <code>\\n</code> newline, <code>\\r</code> carriage return, <code>\\f</code> form feed, <code>\\b</code> backspace, <code>\\t</code> tab, <code>\\\\</code> backslash and escaped quotes.</p><pre><code>print(\"David asked \\\"What's your name?\\\"\")\na, b, c, d = 5, 12.654, 'Andrew', True\nprint('{} {} {} {}'.format(a, b, c, d))\nprint('{1} {3} {0} {2}'.format(a, b, c, d))\nprint('{name}: {value:.2f}'.format(name=c, value=b))\n# Andrew: 12.65\nprint('Integer=%d Float=%.2f Name=%s Boolean=%s' % (a, b, c, d))</code></pre><p>Percent formats include %d and %i for integers, %f for fixed-point numbers, %c for a character, %s for text, %o for octal and %x / %X for hexadecimal. Decimal formatting rounds the displayed value rather than always rounding upward.</p>"
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
