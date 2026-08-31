import { createFileRoute } from '@tanstack/react-router'
import { Header, Footer } from './index'
import { ReactNode } from 'react'

export const Route = createFileRoute('/docs')({
    component: RouteComponent,
})

function SectionTitle({ children }: { children: ReactNode }) {
    return <div><h2 className="inline-block border-b-2 border-border mb-4 leading-[1.05] tracking-tight text-foreground md:text-3xl text-primary bold">{children}&nbsp; </h2></div>
}

function SubSection({ children }: { children: ReactNode }) {
    return <div><Ind /><h3 className="inline-block border-border mb-4 leading-[1.05] mt-4 tracking-tight text-foreground md:text-2xl text-primary">{children}&nbsp; </h3></div>
}
function Builtin({ children }: { children: ReactNode }) {
    return <div><Ind /><Ind /><h4 className="inline-block italic border-b-2 border-border mb-4 mt-1 leading-[1.05]  tracking-tight text-foreground md:text-xl text-primary">{children} </h4></div>
}


function Link(args: { href: string, children: ReactNode }) {
    return <a href={args.href} style={{ textDecoration: 'underline', color: '#0000EE' }}>{args.children}</a>
}
function Universal() {
    return <span className='text-primary'>Universal</span>
}

function Code({ children }: { children: ReactNode }) {
    return <p style={{ textIndent: "0" }}>
        <div className='border bg-gray-50 rounded-l p-2 mt-2 mb-2 pl-4'><pre><code>{children} </code></pre></div></p>
}
function ILCode({ children }: { children: ReactNode }) {
    return <span className='border bg-gray-50 rounded-md ml-1 mr-1 pl-1 pr-1'><code>{children}</code></span>
}


function Ind() {
    return <span>&nbsp;&nbsp;</span>
}

function OPL() {
    return <hr className=' border-t-4 border-border mt-2 mb-3' />
}

function RouteComponent() {
    return <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
        <style>{` p {margin-left: 10px; text-indent: 25px; margin-bottom: 10px} `}</style>

        <Header />
        <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-12 md:pt-20">
            <section className="mb-12 max-w-6xl">
                <h1 className="font-serif text-3xl leading-[1.05] tracking-tight text-foreground md:text-7xl">
                    Universal<span className="text-primary">.</span>

                </h1>
                <span className="text-primary md:text-5xl font-serif">Documentation</span>
            </section>
            <div className='border bg-card border-border rounded-3xl p-6 mb-6'>  {/*can consider adding border-l-22*/}
                <section>
                    <SectionTitle> Introduction</SectionTitle>
                    <p className=''><Universal /> as a language aims to follow three guiding principles.</p>
                    <ol className='ml-4'>
                        <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> All data should be saved to the cloud wherever possible. </span></li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>2. </span> There should be no special characters or keywords to memorize.</li>
                        <li className='mt-1 ml-5 -indent-4 mb-3'><span className='text-primary'>3. </span> Errors should be avoided at all costs</li>
                    </ol>
                    <p className='mb-5'>These principles lead naturally into the syntax and design of the language. It has a cloud database, the Universal Store, that saves
                        all variables used in a program for future use. These variables can be literally everything - even operators like a + sign are saved to
                        the store. In fact, in accordance with principle 2, the only forbidden characters for variable names are the = sign and whitespace.


                    </p>

                    <p><Universal /> is hosted on <Link href='https://waslander.ca'>waslander.ca</Link>. It currently
                        has an interpreter built into the browser, which connects to the default store; at present there's no downloadable
                        version. If you want a different setup for your use case, contact <Link href='mailto:nicholas@waslander.ca'>nicholas@waslander.ca</Link>.</p>
                </section>
                <section className='mt-10'>
                    <SectionTitle> Getting Started</SectionTitle>
                    <SubSection>Conventions</SubSection>
                    <p>This documentation will use <ILCode>code blocks</ILCode> to refer to raw <Universal /> code and "Python Syntax" to refer to the
                        objects created by said code.</p>
                    <SubSection>Code Execution</SubSection>
                    <p> A <Universal /> script is executed as a collection of lines, for example: </p>
                    <Code>print hello world
                        <OPL />
                        OUTPUT: Hello World!</Code>
                    <p>Lines are executed right to left. To start execution, the rightmost word is looked up in the store creating an object, which is the initial object.
                        Then, it looks the next word to the left up in the store, and checks the following steps:
                    </p>
                    <ol className='ml-4'>
                        <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> If the new object created can execute on the current object, do so. </span></li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>2. </span> If the current object can execute on the new one, do so.</li>
                        <li className='mt-1 ml-5 -indent-4 mb-3'><span className='text-primary'>3. </span> Otherwise, create a list of the two objects.</li>
                    </ol>
                    <p> Every operation returns a value, and this is set to the current object. This continues until the line finishes, at which point the current object
                        is discarded.
                    </p>
                    <p>Using <ILCode>print hello world</ILCode> as an example, interpretation is as follows:</p>
                    <ol className='ml-4'>
                        <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> Look up <ILCode>world</ILCode> in the store. This should return a string with value "World!" </span></li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>2. </span> Look up <ILCode>hello</ILCode> similarly, receiving "Hello".</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>3. </span> Attempt to execute "Hello"("World!") and "World!"("Hello"). Since they're both strings, both fail.</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>4. </span> Create a list ["Hello", "World!"].</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>5. </span> Look up <ILCode>print</ILCode> in the store, receiving a function.</li>
                        <li className='mt-1 ml-5 -indent-4 mb-3'><span className='text-primary'>6. </span> Execute print(["Hello", "World!"]). Printing a list prints it space-separated, outputting <ILCode>Hello World!</ILCode></li>
                    </ol>
                    <SubSection>Comments</SubSection>
                    <p> In keeping with the principle of no special characters, Comments are denoted with indentation, like so: </p>
                    <Code>
                        <Ind /> this is a comment and will not be executed <br />
                        <Ind /> this is part of a multiline comment<br />
                        <Ind /> <Ind /> this is also a comment<br /><br />
                        print hello world<br /><br />

                        <Ind />this is more comments
                    </Code>
                    <p> Note that loops and functions are also denoted with indentation. In that case, the lines will not be treated as comments, for example:</p>
                    <Code>
                        <Ind />this is a comment<br /><br />
                        for i range 6 <br />
                        <Ind />print i <br />
                        <Ind /><Ind />this line will not be executed, unlike the previous<br />
                        <Ind />print this will run<br /><br />
                        print this will run<br />
                        <Ind />this will not



                    </Code>
                </section>

                <section className='mt-10'>
                    <SectionTitle> Names and Types</SectionTitle>
                    <SubSection>Variables</SubSection>
                    <p> In <Universal />, everything is a variable, and all variables work the same way.
                        To declare a variable, use the following syntax.</p>
                    <Code>newvar = 123 </Code>
                    <p>The left hand side will be evaluated as a <Universal /> statement, e.g.</p>
                    <Code>newvar2 = 2 + 2 <br />
                        <Ind /> newvar2 will equal 4
                    </Code>
                    <p>There are two special cases to be aware of. When a variable has never been assigned a value, using that variable will return
                        a string with the variable's name. This contrasts other programming languages, which throw an error (violating the third principle of  <Universal />).</p>
                    <Code>
                        <Ind /> replace abasljha with any unused name<br />
                        print abasljha<br />
                        abasljha = 12345<br />
                        print abasljha
                        <OPL />
                        OUTPUT: abasljha<br />
                        OUTPUT: 12345
                    </Code>
                    <p>After the first time you run this code, the output will be 12345 12345.</p>
                    <p>The second case has to do with trailing numbers in a variable name. When setting a variable name (e.g. <ILCode>burgers = yummy</ILCode>) for the first time, you also
                        set every variable with trailing numbers (e.g. <ILCode>burgers1</ILCode>, <ILCode>burgers76</ILCode>, <ILCode>burgers181262</ILCode>) to the same value.
                        If any other user later changes the value of the original variable, the values of variables with trailing numbers stay the same. This is especially useful
                        with builtin functions. If one gets overridden, the original is reobtainable with large number prefixes.
                    </p>
                    <Code>
                        + = plus<br />
                        print 1 + 2 + 3 + 4<br />
                        + = plus123<br />
                        print 1 + 2 + 3 + 4
                        <OPL />
                        OUTPUT: 1 plus 2 plus 3 plus 4<br />
                        OUTPUT: 10<br />
                    </Code>
                    <SubSection>Numbers and Strings</SubSection>
                    <p> The most important types are numbers and strings. In many ways, they work similarily. Both can be created as the default value of variable names:

                    </p>
                    <Code>
                        num1 = 123<br />
                        str1 = iamastring
                    </Code>
                    <p> If those variable names have been taken, numbers can be generated by using subtraction or division of large numbers, while strings can be
                        reconstructed from single letter strings.
                    </p>
                    <Code>13 = 187263871 - 187263858<br></br>
                        chat = c12 + h12 + a12 + t12
                        <Ind />Use the numbers after variable names for security.
                    </Code>
                    <p>
                        Numbers are stored as floating points, inherited from Javascript. 0.5, -66, and -129873.17264 are all examples of numbers. However,
                        1e12, +16, and 1.2.3 are not. Strings can contain any unicode characters, in any lengths. Note that including whitespace in your string
                        will cause it to be created as a list instead; use <ILCode>+</ILCode> and <ILCode>space</ILCode> to avoid this.
                        Basic binary operators work on both numbers and strings, in intuitive ways. (For details, see Operators below).
                    </p>
                    <Code>
                        print 123 + 456<br />
                        print hii + bii<br />
                        print 123 - 456<br />
                        print hii equals hii<br />
                        <Ind />will output 1, which is the boolean true value
                        <OPL />
                        OUTPUT: 579<br />
                        OUTPUT: hiibii<br />
                        OUTPUT: -333<br />
                        OUTPUT: 1
                    </Code>
                    <p> Both strings and numbers simply display themselves when printed.</p>
                    <SubSection>Lists</SubSection>
                    <p>Lists are the only way to store sequential data in <Universal />. They can store any type of data at any length. To create one,
                        simply separate two numbers or strings with spaces. </p>
                    <Code>
                        <Ind /> mylst will equal [1, 2, "hello"]<br />
                        mylst = 1 2 hello
                    </Code>
                    <p>Lists can execute on any value other than lambda functions. Doing so will return a new list with the value inserted into the start.
                        During the execution of <ILCode>1 2 hello</ILCode>, <ILCode>2 hello</ILCode>
                        is made into a list, which then executes on <ILCode>1</ILCode>. <ILCode>1</ILCode> is inserted into the start to assemble
                        the final list.</p><p>
                        To get a given element of a list, use the <ILCode>get</ILCode> operator, like so (lists are zero-indexed):</p>
                    <Code>
                        print mylst get 2
                        <OPL />
                        OUTPUT: hello
                    </Code>
                    <p>Setting values is slightly harder - without square brackets, there isn't a natural syntax.  You can do it using the slice
                        operators, as shown below.</p>
                    <Code>
                        <Ind />Set the nth value of mylst to "pizza"<br />
                        mylst1 = mylst sliceleft n <br />
                        mylst2 = mylst sliceright n + 1<br />
                        mylst = mylst1 + pizza mylst2<br />
                    </Code>
                    <p>
                        Depending on usecase, this can be made into a function.
                    </p>
                    <p>When printing a list, it will print each element separated by spaces.</p>
                    <SubSection>Functions</SubSection>
                    <p>There are three types of function datatypes.</p>
                    <Code>
                        functionbuiltin = print<br />
                        functionlambda = + 2<br />
                        functionuser = function ()<br />
                        <Ind /> print hello world
                    </Code>
                    <p>A builtin function is an object that stores a function tied to a behind-the-scenes method. Examples of this are
                        <ILCode>print</ILCode>, <ILCode>+</ILCode>, or <ILCode>len</ILCode>. They can be stored
                        to other variables for aliases, or added to lists. When executed, they call the behind-the-scenes method to provide
                        functionality that can't be implemented with objects alone.
                    </p>
                    <p>A lambda function is a trick to make infix operators work. It takes the form of &lt;operator&gt; &lt;value&gt;. It can
                        execute on any type, and will apply the operator with the value it's executing on and &lt;value&gt;. For example,
                        using functionlambda from earlier:
                    </p>
                    <Code>print functionlambda 2<br />
                        print 2 functionlambda<OPL />
                        OUTPUT: 4<br />
                        OUTPUT: 4
                    </Code>
                    <p>
                        User-defined functions work very similarily to builtin functions, except that they store a few lines of
                        <Universal /> code instead of a behind-the-scenes method, as well as an argument name. When executed, they set the argument
                        name to any provided argument then execute the code.
                    </p>
                    <Code>
                        functionuser ()
                        <OPL />
                        OUTPUT: Hello World!
                    </Code>
                </section>

                <section className='mt-10'>
                    <SectionTitle> Builtins</SectionTitle>
                    <p>Below are all the builtin functions and values that are provided. In keeping with the second principle of <Universal />, these are not keywords:
                        they simply provide functionality that doesn't exist elsewhere. You're encouraged to rename these to versions that you prefer!
                        However, the originals can always be accessed by simply adding numbers to the
                        end of the variable name, such as <ILCode>print82645</ILCode>.</p>
                    <style>{` p {margin-left: 20px;} `}</style>

                    <SubSection>Basics</SubSection>
                    <Builtin>print</Builtin>
                    <p>The <ILCode>print</ILCode> command is the only way to produce output in a <Universal /> program. It will convert whatever argument is passed to it
                        into a string and then output that. Some examples:</p>
                    <Code>
                        print 123<br />
                        print "caterpillar"<br />
                        jjj = cat<br />
                        print jjj<OPL />
                        OUTPUT: 123<br />
                        OUTPUT: "caterpillar"<br />
                        OUTPUT: cat
                    </Code>
                    <p>Most of the time, the output will be similar to the code.</p>
                    <Builtin>type</Builtin>
                    <p> The <ILCode>type</ILCode> builtin will output a string containing the type of its argument: <ILCode>num</ILCode> for number,
                        <ILCode>str</ILCode> for string,
                        <ILCode>lzt</ILCode> for liszt,
                        <ILCode>fun</ILCode> for user funtion,
                        <ILCode>fub</ILCode> for builtin function, or
                        <ILCode>ful</ILCode> for lambda function.

                    </p>
                    <Builtin>len</Builtin>
                    <p>The <ILCode>len</ILCode> function will output the length of its argument. This is most useful for strings and lists, which behave
                        normally. For functions it will convert the function to a string first and give you the value of that, and for numbers
                        it uses logarithms to give you a continuous length.
                    </p>
                    <Builtin>lower</Builtin>
                    <p>The <ILCode>lower</ILCode> function converts a string to lowercase. It works with the full set of unicode characters, and leaves punctuation
                        and the like unchanged, similar to a CapsLock key on a keyboard. For a list, it will apply to every string in a list.
                        Numbers and functions are left unchanged. There is also an upper function that functions identically in reverse.
                    </p>
                    <SubSection>Binary Operators</SubSection>
                    <p style={{ textIndent: "25px" }}>Binary operators (the "+" in 2 + 2) have a complicated implementation. The "+" is a builtin
                        function, and can be passed and modified as such. When executing a statement like <ILCode>2 + 2</ILCode>, the first thing to
                        be executed is the <ILCode>+ 2</ILCode>. This returns a lambda function, which in this example is immediately applied to the
                        <ILCode>2</ILCode>. When this happens, the + builtin function is called, which then outputs <ILCode>4</ILCode>.
                    </p>
                    <Builtin>+</Builtin>
                    <p>The <ILCode>+</ILCode> operator handles addition and concatenation. Two numbers are simply added according to normal rules of arithmetic.
                        Two strings or lists are concatenated, creating a new object of the same type. If a non-list is added to a list,
                        it gets inserted into the end of the list if added from behind, or the front if the other way around. The functions
                        are converted to strings then concatenated.</p>
                    <Builtin>-, *, /</Builtin>
                    <p>These operators work mostly as you'd expect; - is subtraction, * multiplication, and / division. When applied to a string or
                        a list, they apply the relevant operation to the length of the string/list.
                    </p>
                    <Builtin>equals</Builtin>
                    <p>The <ILCode>equals</ILCode> operator (not ==, which confuses many beginners) checks for equality of two objects. It's strict checking, which
                        means both types and values must match. The operator will return the number 1 if they match and 0 if they do not.
                    </p>
                    <Builtin>&lt;, &gt;</Builtin>
                    <p> The &lt; and &gt; operators work on numbers, strings, and lists - for numbers they compare the value of the numbers, and for
                        strings and lists the lengths. They return 1 and 0 just like equals. For &lt;=, use the <ILCode>not</ILCode> funtion with &gt;, and vice
                        versa.
                    </p>
                    <Builtin>get</Builtin>
                    <p>The <ILCode>get</ILCode> command for lists actually works as an binary operator. The left argument must be a list or string, and the right a positive
                        integer. It will return the element of the list or character of the string in that position.</p>
                    <Builtin>sliceleft, sliceright</Builtin>
                    <p>Similarly to <ILCode>get</ILCode>, <ILCode>sliceleft</ILCode> and <ILCode>sliceright</ILCode> are implemented as binary operators.
                    Sliceleft takes a string/list and integer (call it n) and returns the first n values of the string/list. Sliceright does the same, but reversed;
                    you instead get the last n values. They will have the same type as the original argument, and the values will be unchanged.
                    </p>

                    <SubSection>Control Flow</SubSection>

                    <SubSection>Miscellany</SubSection>
                    <Builtin>range</Builtin>
                    <p>The <ILCode>range</ILCode> builtin provides a way of creating a list that "counts up" to a value. When passed a number, it creates a list 
                    [0,1,2,3,4, ...], up to but not including the number passed. For a string/list, it does the same thing with subsequences: range kitty will return 
                    ["k","ki","kit","kitt","kitty"]. Note that in this case, the initial length is 1 and it includes the full string. You can, of course, define your own
                    function with different rules. 
                    </p>
                    <Builtin>str</Builtin>
                    <p>If you need to convert a value to a string explicitly, the <ILCode>str</ILCode> builtin has you covered. It doesn't do anything else
                    though.</p>
                </section>

            </div>

        </main>

        <Footer />
    </div>
}
