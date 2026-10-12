"""Scene and exercise definitions; the renderer contains no curriculum rules."""
def grid(cols, rows, top=0, bottom=1):
    return [[c/cols, top+r*(bottom-top)/rows, 1/cols, (bottom-top)/rows]
            for r in range(rows) for c in range(cols)]

CHAPTERS = [
    dict(title='Grocery adventure', topic='print()', image='level 1.png', rects=grid(3,3),
         captions=['Meet the shopkeeper. print() displays text on the screen.', 'Print the name of an apple.', 'Print the name of a banana.', 'Try an orange next.', 'Carrots are on the shopping list.', 'Print tomato using quotation marks.', 'Potatoes come next.', 'Finish the list with broccoli.', 'Shopping complete! Now write your own print statements.']),
    dict(title='Say it with f-strings', topic='Formatted output', image='level-2.png', rects=grid(3,2),
         captions=['Put an f before the opening quote and variables inside braces.', 'Create item and qty before using them.', 'An f-string combines your quantity and item.', 'Change the values for bananas.', 'Use the same idea for carrots.', 'Your turn: build a shopping sentence from variables.']),
    dict(title='The doracake shop', topic='F-string practice', image='level 3.png', rects=grid(3,3),
         captions=['F-strings work for any shopping item.', 'Store doracake in item and 50 in qty.', 'Print the item once: I want 50 doracake. The picture repeats the word; your code does not need to.', 'Order five chocolates.', 'Change the variables to seven apples.', 'Try twelve bananas.', 'Six carrots are next.', 'Finish with ten potatoes.', 'Choose a new item and build your message.']),
    dict(title='Chat with Doraemon', topic='input()', image='level-4.png', rects=grid(3,3),
         captions=['input() reads text while your program runs.', 'Store the name and greet the person with an f-string.', 'Ask about a favourite food.', 'Use int() when you need a whole-number quantity.', 'A mood is text. You can print it in a sentence.', 'Ask about a dream and include it in your reply.', 'Your messages can change with every input.', 'Read input, store it, then format your output.', 'Time to build your own short conversation.']),
    dict(title='Variables workshop', topic='Variables', image='level-5.png', rects=grid(3,3),
         captions=['A variable is a name referring to a value. Assignment binds the name to that value.', 'Assign several values to several names.', 'Chain assignments to share one value.', 'Unpack a list into the same number of variables.', 'Commas in print() add spaces between values; string addition does not.', 'Convert a number to text before joining it to a string.', 'Names are case-sensitive and can begin with a letter or underscore.', 'Use meaningful names to make programs easier to read.', 'Create three food variables and print them.']),
    dict(title='Shopping missions', topic='Variables + f-strings', image='level-6.png', rects=grid(3,3,.165,.92),
         captions=['Order four apples using item and qty.', 'Order six carrots.', 'Combine two items and their quantities.', 'Assign pizza to three variables.', 'Convert a price to str and float; inspect the types.', 'Unpack the fruits list before printing.', 'Build a friendly food request.', 'Choose an item and quantity of your own.', 'Calculate a total from quantity and price.']),
    dict(title='Escape-sequence lab', topic='Escape sequences', image='level 7.png', rects=grid(5,2,.16,.95),
         captions=['Use \\n to start a new line. Follow the expected output below.', 'Use \\t to separate menu columns.', 'Escape each backslash in a Windows path.', 'Escape a quote, or choose a different outer quote.', 'Two backslashes in code represent one in text.', 'Carriage return moves a terminal cursor. The output viewer shows raw characters without terminal cursor emulation.', 'Backspace is a control character; it does not delete characters from a Python string.', 'Form feed and vertical tab are control characters. Inspect Escaped output to see them clearly.', 'Octal and hexadecimal escapes can represent the same character.', 'Unicode escapes can represent symbols and emoji.']),
    dict(title='Semicolon bonus', topic='Optional semicolons', image='level -7.png', rects=[[0,0,1,.23]]+grid(3,2,.23,1),
         captions=['Semicolons separate statements on one line. Separate lines are usually easier to read.', 'Each statement is still a separate instruction.', 'Run several print statements.', 'Each print() still ends with a newline by default.', 'Order three ice-cream flavours.', 'Variables also work with semicolons.', 'Print Dream, Learn and Grow.']),
]

EXERCISES=[]
def add(chapter, title, task, starter, solution, hint, inputs=None, required=None):
    EXERCISES.append(dict(id=len(EXERCISES), chapter=chapter, title=title, task=task,
        starter=starter, solution=solution, hint=hint, inputs=inputs or [], required=required or []))

for item in ['apple','banana','orange','carrot','tomato','potato','broccoli']:
    add(0, 'Shopping for '+item, 'Print '+item+' in lowercase.', '# Print the item name\n', 'print('+repr(item)+')', 'Put the item name in quotes inside print().',required=['print'])
for chapter, pairs in [(1,[('Apple',3),('Banana',5),('Carrot',4)]),(2,[('doracake',50),('chocolate',5),('apple',7),('banana',12),('carrot',6),('potato',10)])]:
    for item,qty in pairs:
        setup=f'item = {item!r}\nqty = {qty}\n'
        add(chapter, 'Order '+item, 'Use item and qty in an f-string to produce the expected sentence.', setup+'# Add your print statement\n', setup+'print(f"I want {qty} {item}")', 'Place qty and item in separate pairs of braces after I want.', required=['fstring'])
for title,var,prompt,value,message in [('A friendly hello','name','Your name: ','Nobita','Hello {name}!'),('Favourite food','food','Your favourite food: ','doracake','Wow! You like {food}!'),('Your dream','dream','Your dream: ','scientist','Awesome! You will be a {dream}!')]:
    setup=f'{var} = input({prompt!r})\n'
    add(3,title,'Read the supplied input and respond with an f-string.',setup+'# Print your reply\n',setup+f'print(f{message!r})','Keep the variable inside braces and the rest of the sentence outside.',[value],['input','fstring'])
add(3,'How many doracakes?','Read a quantity with int(input()) and include it in your message.','qty = int(input("How many? "))\n','qty = int(input("How many? "))\nprint(f"Here are {qty} doracakes for you!")','Use qty in an f-string.',['5'],['input','fstring'])
add(4,'Three favourite foods','Create food1, food2 and food3 and print each on its own line.','# Create three variables\n','food1 = "Pizza"\nfood2 = "Burger"\nfood3 = "Fries"\nprint(food1)\nprint(food2)\nprint(food3)','Assign the strings first; then use three print calls.',required=['assign'])
add(4,'One value, three names','Assign Orange to x, y and z with one chained assignment. Print each name.','# Use a chained assignment\n','x = y = z = "Orange"\nprint(x)\nprint(y)\nprint(z)','You can put several names on the left of the same value.',required=['assign'])
add(4,'Unpack your fruit','Unpack fruits into x, y, z, then print all three on one line.','fruits = ["apple", "banana", "cherry"]\n','fruits = ["apple", "banana", "cherry"]\nx, y, z = fruits\nprint(x, y, z)','The number of names must equal the number of list items.',required=['unpack'])
for item,qty in [('apple',4),('carrot',6)]:
    setup=f'item = {item!r}\nqty = {qty}\n'
    add(5,'Order '+item+'s','Use an f-string. Add s after the item to make it plural.',setup,setup+'print(f"I want {qty} {item}s")','The letter s belongs just after the closing item brace.',required=['fstring'])
add(5,'Two-item order','Print both quantities and both items in one f-string.','item1 = "banana"\nqty1 = 2\nitem2 = "milk"\nqty2 = 1\n','item1 = "banana"\nqty1 = 2\nitem2 = "milk"\nqty2 = 1\nprint(f"I want {qty1} {item1}s and {qty2} {item2}")','Use four brace pairs, one for each variable.',required=['fstring'])
add(5,'Shared pizza','Assign pizza to x, y and z. Print them on one line.','# Create your variables\n','x = y = z = "pizza"\nprint(f"{x} {y} {z}")','A chained assignment gives the same value to all three names.',required=['fstring'])
add(5,'Convert a price','Print the type and value of price, str(price), and float(price).','price = 50\n','price = 50\nprint(type(price), price)\nprint(type(str(price)), str(price))\nprint(type(float(price)), float(price))','Use type() to inspect each converted value.',required=['print'])
add(5,'Fruit unpacking','Unpack the list and show all fruits with an f-string.','fruits = ["apple", "banana", "cherry"]\n','fruits = ["apple", "banana", "cherry"]\nx, y, z = fruits\nprint(f"{x} {y} {z}")','Unpack to x, y, z before building your f-string.',required=['unpack','fstring'])
add(5,'A friendly food request','Print a request using food and qty.','food = "pizza"\nqty = 2\n','food = "pizza"\nqty = 2\nprint(f"I want {qty} {food}")','Combine the two variables in an f-string.',required=['fstring'])
add(5,'Checkout challenge','Compute total as qty times price. Print the order and total on separate lines.','item = "apple"\nqty = 4\nprice = 20\n','item = "apple"\nqty = 4\nprice = 20\ntotal = qty * price\nprint(f"I want {qty} {item}(s) at ₹{price} each.")\nprint(f"Total cost is ₹{total}.")','Calculate total first, then use it in the second f-string.',required=['fstring'])
for title,text,hint in [
 ('Greeting card','Happy Birthday!\nStay Happy and Healthy!','Use \\n inside a string to create a new line.'),
 ('Tabbed menu','1. Pizza\t$5\n2. Burger\t$4\n3. Pasta\t$6\n4. Juice\t$2','Use \\t for a tab and \\n for a new line.'),
 ('Windows path','C:\\Users\\Mahre\\Desktop\\project','Double every backslash, or use a raw string.'),
 ('Quotes inside quotes','She said, "It\'s a great day!"','Escape a quote that matches your outer quotes.'),
 ('Backslash character','C:\\Folder\\File','Write two backslashes to produce one.'),
 ('Carriage return','Loading...\rProgress: 100%','Use \\r between the messages. Escaped output shows the control character.'),
 ('Backspace','Hello\b','Use \\b. It remains part of the string even when a terminal moves the cursor.'),
 ('Form feed and vertical tab','Hello\fWorld\nHello\vWorld','Use \\f and \\v in separate printed strings.'),
 ('Octal and hexadecimal','A\nA','Use \\101 and \\x41 inside strings.'),
 ('Unicode symbols','Ω 😀','Use \\u03A9 and \\U0001F600, separated by a space.')]:
    add(6,title,'Print the exact output shown. Control characters are also shown in escaped form.','# Write your print statement\n','print('+repr(text)+')',hint,required=['print'])
add(7,'Dream, learn, grow','Put three print statements on one line separated by semicolons.','# Write three statements on one line\n','print("Dream"); print("Learn"); print("Grow")','Separate the calls with semicolons. Each print still creates its own line.',required=['semicolon'])
