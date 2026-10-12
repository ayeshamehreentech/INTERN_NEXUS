from app.legacy_catalog import WORLDS as LEGACY

EXTRA = [
 ('Data Structure Land', ['Lists','Tuples','Sets','Dictionaries','Data operations']),
 ('DS Quest', ['Stack','Queue','Circular queue','Linked list','Applications']),
 ('Sorting Summit', ['Bubble sort','Selection sort','Insertion sort','Compare algorithms','Time complexity','Real-world uses']),
 ('Search Island', ['Linear search','Binary search','Search in arrays','Search in lists','Efficiency','Problem solving']),
 ('Function Falls', ['Functions','Recursive functions','Lambda functions','Closures','Decorators','Generators']),
 ('OOP World', ['Classes and objects','Inheritance','Polymorphism','Encapsulation','Abstraction']),
 ('Project Planet', ['Mini projects','Problem solving','Real-world challenges','Combine concepts','Build and present','Python capstone'])]

WORLDS = []
for w in LEGACY:
    topics = []
    for n,t in enumerate(w['topics'],1):
        if t['id']=='W06_BREAK_FOR': continue
        topics.append(dict(id=t['id'],number=n,name=t['title'],objective=t['teaching'],
                           allowed_concepts=[t['title']],content_status='legacy review required'))
    WORLDS.append(dict(id=w['id'],number=len(WORLDS)+1,name=w['title'],topics=topics))
for name, names in EXTRA:
    number=len(WORLDS)+1
    WORLDS.append(dict(id=f'W{number:02}',number=number,name=name,topics=[
        dict(id=f'W{number:02}_'+name.upper().replace(' ','_').replace('-','_'),
             number=i,name=name,objective='Understand '+name,
             allowed_concepts=[name],content_status='reference curriculum; execution support limited')
        for i,name in enumerate(names,1)]))
OFFICIAL_NAMES = {
 'W02_VARIABLES':'Variables','W05_IF_ELSE':'if-else','W05_IF_ELIF_ELSE':'if-elif-else',
 'W05_LADDER_IF':'Decision ladders','W05_NESTED_IF_ELSE':'Nested if-else',
 'W06_FOR_RANGE':'for loop with range()','W07_LENGTH':'String length','W07_FORMAT_METHOD':'str.format()',
 'W08_DATA_OPERATIONS':'Data-structure operations','W09_APPLICATIONS':'Linked List Applications',
 'W10_COMPARE_ALGORITHMS':'Comparing sorting algorithms','W10_REAL_WORLD_USES':'Real-world uses of sorting',
 'W11_SEARCH_IN_ARRAYS':'Search in arrays/sequences','W11_EFFICIENCY':'Search efficiency',
 'W11_PROBLEM_SOLVING':'Search problem solving','W14_BUILD_AND_PRESENT':'Build and Improve'}
for w in WORLDS:
    w['image']=f"/assets/maps/{w['number']}.jpeg"
    for i,t in enumerate(w['topics'],1):
        t['world_id']=w['id'];t['number']=i
        t['name']=OFFICIAL_NAMES.get(t['id'],t['name'])
        t['allowed_concepts']=list(dict.fromkeys([t['name'],*t['allowed_concepts']]))
TOPICS={t['id']:t for w in WORLDS for t in w['topics']}
