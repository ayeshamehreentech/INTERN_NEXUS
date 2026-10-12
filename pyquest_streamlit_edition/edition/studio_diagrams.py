"""Bounded deterministic visual traces. No learner code is executed."""
import streamlit as st

def binary_trace(values,target):
    low,high=0,len(values)-1;trace=[]
    while low<=high:
        mid=(low+high)//2
        trace.append({'low':low,'mid':mid,'high':high,'value':values[mid]})
        if values[mid]==target:return trace,mid
        if values[mid]<target:low=mid+1
        else:high=mid-1
    return trace,None

def bubble_trace(values):
    values=list(values);trace=[{'values':values.copy(),'note':'Starting values'}]
    for end in range(len(values)-1,0,-1):
        for index in range(end):
            swapped=values[index]>values[index+1]
            if swapped:values[index],values[index+1]=values[index+1],values[index]
            trace.append({'values':values.copy(),'note':f'Compare indexes {index} and {index+1}: '+('swap' if swapped else 'keep')})
    return trace

def boxes(labels):
    # All text is derived from bounded numeric values or trusted strings.
    import html
    st.html('<div class="visual-boxes" role="img" aria-label="'+html.escape(' · '.join(map(str,labels)))+'">'+''.join('<span>'+html.escape(str(value))+'</span>' for value in labels)+'</div>')

def insertion_trace(values):
    values=list(values);trace=[{'values':values.copy(),'note':'Starting values'}]
    for index in range(1,len(values)):
        current=values[index];position=index-1
        while position>=0 and values[position]>current:
            values[position+1]=values[position]
            trace.append({'values':values.copy(),'note':f'Shift {values[position]} right; hold {current} separately'})
            position-=1
        values[position+1]=current
        trace.append({'values':values.copy(),'note':f'Insert held {current} at index {position+1}'})
    return trace

def render_diagram(key):
    st.subheader('Explore the interactive diagram',anchor=False)
    st.caption('Deterministic learning tool — no LLM request or reward changes.')
    if key=='binary_integer':
        value=st.slider('Integer',0,255,13,key='binary_value');bits=f'{value:08b}'
        boxes([f'{bit} × {2**(7-i)}' for i,bit in enumerate(bits)])
        st.code(f'{value} = '+ ' + '.join(str(2**(7-i)) for i,b in enumerate(bits) if b=='1') if value else '0 = 0',language=None)
        st.caption('Eight positions are shown for learning. Python integers are not fixed-width eight-bit values.')
    elif key=='bitwise_operators':
        a=st.slider('First integer',0,15,6);b=st.slider('Second integer',0,15,3)
        operation=st.selectbox('Operator',['AND (&)','OR (|)','XOR (^)','Left shift (<<)','Right shift (>>)'])
        shift=st.slider('Shift count',0,4,1) if 'shift' in operation else None
        result={'AND (&)':a&b,'OR (|)':a|b,'XOR (^)':a^b}.get(operation)
        if shift is not None:result=a<<shift if operation.startswith('Left') else a>>shift
        st.code(f'A = {a:04b}\nB = {b:04b}\nResult = {result:b} ({result})',language=None)
        boxes(list(f'{result:04b}'));st.caption('Shifts use the selected shift count. Python ~a equals -a-1; it is not a four-bit unsigned complement.')
    elif key=='memory_references':
        action=st.radio('Operation',['Share the list','Append through b','Rebind b'],horizontal=True)
        if action=='Share the list':labels=['a → list object X [1, 2]','b → same object X']
        elif action=='Append through b':labels=['a → object X [1, 2, 3]','b → same object X [1, 2, 3]']
        else:labels=['a → object X [1, 2, 3]','b → new object Y [9]']
        boxes(labels);st.code('a = [1, 2]\nb = a\nb.append(3)\nb = [9]',language='python')
        st.caption('The controls select successive snapshots. X and Y are symbolic object labels, not physical addresses. Rebinding follows the shown append step.')
    elif key=='stack_queue':
        st.session_state.setdefault('studio_stack',['A','B']);st.session_state.setdefault('studio_queue',['A','B'])
        with st.container(horizontal=True):
            if st.button('Add item C',key='structures_add'):
                if len(st.session_state.studio_stack)<8:st.session_state.studio_stack.append('C')
                if len(st.session_state.studio_queue)<8:st.session_state.studio_queue.append('C')
            if st.button('Stack pop'):st.session_state['stack_removed']=st.session_state.studio_stack.pop() if st.session_state.studio_stack else 'empty'
            if st.button('Queue dequeue'):st.session_state['queue_removed']=st.session_state.studio_queue.pop(0) if st.session_state.studio_queue else 'empty'
            if st.button('Reset structures'):st.session_state.studio_stack=['A','B'];st.session_state.studio_queue=['A','B'];st.session_state.pop('stack_removed',None);st.session_state.pop('queue_removed',None)
        st.write('Stack · newest item removed first');boxes(st.session_state.studio_stack or ['empty'])
        st.write('Queue · oldest item removed first');boxes(st.session_state.studio_queue or ['empty'])
        st.caption('Removed: stack '+str(st.session_state.get('stack_removed','—'))+' · queue '+str(st.session_state.get('queue_removed','—'))+'. In production use deque.popleft() for efficient queue removal.')
    elif key=='sorting_algorithms':
        method=st.selectbox('Sorting method',['Bubble sort','Insertion sort'])
        preset=st.selectbox('Starting values',[[4,1,3,2],[3,3,1,2],[1,2,3,4]],format_func=str)
        trace=bubble_trace(preset) if method=='Bubble sort' else insertion_trace(preset)
        step=st.slider('Comparison step',0,len(trace)-1,0)
        boxes(trace[step]['values']);st.write(trace[step]['note'])
        st.caption('Both algorithms are O(n²) in the worst case. Insertion sort builds a sorted prefix. Prefer sorted() or list.sort() for everyday Python code.')
    elif key=='binary_search':
        values=[1,3,5,7,9,11,13];target=st.slider('Search target',0,14,9)
        trace,found=binary_trace(values,target);step=st.slider('Search step',0,len(trace)-1,0) if len(trace)>1 else 0
        row=trace[step];boxes([f'{v}'+(' ← mid' if i==row['mid'] else '') for i,v in enumerate(values)])
        st.write(f"Active interval: {row['low']}…{row['high']}; middle value: {row['value']}")
        st.write('Final result: '+('not found' if found is None else f'found at index {found}'));st.caption('Binary search needs sorted input. A target need not exist in the sequence.')
    elif key=='recursion':
        n=st.slider('Factorial input',0,6,3);phase=st.radio('Trace phase',['Calls','Returns'],horizontal=True)
        if phase=='Calls':boxes([f'factorial({i})' for i in range(n,-1,-1)])
        else:
            result=1;labels=['factorial(0) → 1']
            for i in range(1,n+1):result*=i;labels.append(f'factorial({i}) → {result}')
            boxes(labels)
        st.code('def factorial(n):\n    if n == 0:\n        return 1\n    return n * factorial(n - 1)',language='python')
        st.caption('This example assumes nonnegative integers. The base case stops recursion; Python has a recursion limit.')
    else:
        st.session_state.setdefault('studio_object_a',0);st.session_state.setdefault('studio_object_b',0)
        with st.container(horizontal=True):
            if st.button('Increment object A'):st.session_state.studio_object_a+=1
            if st.button('Increment object B'):st.session_state.studio_object_b+=1
            if st.button('Reset objects'):st.session_state.studio_object_a=0;st.session_state.studio_object_b=0
        boxes([f'Object A · value {st.session_state.studio_object_a}',f'Object B · value {st.session_state.studio_object_b}'])
        st.code('class Counter:\n    def __init__(self):\n        self.value = 0\n    def increment(self):\n        self.value += 1',language='python')
        st.caption('self.value belongs to each instance. Mutable class attributes would be shared; inheritance and polymorphism can extend compatible behavior.')
        with st.expander('Inheritance, polymorphism and encapsulation'):
            st.write('Inheritance reuses or specializes a parent class. Polymorphism lets different objects support the same operation. Encapsulation exposes a useful interface for state changes; a leading underscore signals internal use, not security.')
            st.code('class Animal:\n    def speak(self):\n        return "sound"\nclass Dog(Animal):\n    def speak(self):\n        return "woof"\nclass Cat(Animal):\n    def speak(self):\n        return "meow"\nfor animal in [Dog(), Cat()]:\n    print(animal.speak())',language='python')
            boxes(['Animal → Dog.speak() → woof','Animal → Cat.speak() → meow'])
