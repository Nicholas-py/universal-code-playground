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
    return <div><h3 className="inline-block border-border mb-4 leading-[1.05] mt-4 tracking-tight text-foreground md:text-2xl text-primary">{children}&nbsp; </h3></div>
}

function Link(args: { href: string, children: ReactNode }) {
    return <a href={args.href} style={{ textDecoration: 'underline', color: '#0000EE' }}>{args.children}</a>
}
function Universal() {
    return <span className='text-primary'>Universal</span>
}

function Code({ children }: { children: ReactNode }) {
    return <div className='border bg-gray-50 rounded-l p-2 mt-2 mb-2 pl-4'><pre><code>{children} </code></pre></div>
}
function InlineCode({ children }: { children: ReactNode }) {
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
        <style>{` p { text-indent: 25px; margin-bottom: 10px} `}</style>

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
                    <p>This documentation will use <InlineCode>code blocks</InlineCode> to refer to raw <Universal /> code and "Python Syntax" to refer to the
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
                    <p>Using <InlineCode>print hello world</InlineCode> as an example, interpretation is as follows:</p>
                    <ol className='ml-4'>
                        <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> Look up <InlineCode>world</InlineCode> in the store. This should return a string with value "World!" </span></li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>2. </span> Look up <InlineCode>hello</InlineCode> similarly, receiving "Hello".</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>3. </span> Attempt to execute "Hello"("World!") and "World!"("Hello"). Since they're both strings, both fail.</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>4. </span> Create a list ["Hello", "World!"].</li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>5. </span> Look up <InlineCode>print</InlineCode> in the store, receiving a function.</li>
                        <li className='mt-1 ml-5 -indent-4 mb-3'><span className='text-primary'>6. </span> Execute print(["Hello", "World!"]). Printing a list prints it space-separated, outputting <InlineCode>Hello World!</InlineCode></li>
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
                    <p>The second case has to do with trailing numbers in a variable name. When setting a variable name (e.g. <InlineCode>burgers = yummy</InlineCode>) for the first time, you also
                        set every variable with trailing numbers (e.g. <InlineCode>burgers1</InlineCode>, <InlineCode>burgers76</InlineCode>, <InlineCode>burgers181262</InlineCode>) to the same value.
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
                    <Ind/>Use the numbers after variable names for security.
                    </Code>
                    <p>
                        Numbers are stored as floating points, inherited from Javascript. 0.5, -66, and -129873.17264 are all examples of numbers. However,
                        1e12, +16, and 1.2.3 are not. Strings can contain any unicode characters, in any lengths. Note that including whitespace in your string
                        will cause it to be created as a list instead; use <InlineCode>+</InlineCode> and <InlineCode>space</InlineCode> to avoid this.
                        Basic binary operators work on both numbers and strings, in intuitive ways. (For details, see Operators below).
                    </p>
                    <Code>
                        print 123 + 456<br />
                        print hii + bii<br />
                        print 123 - 456<br />
                        print hii equals hii<br/>
                        <Ind/>will output 1, which is the boolean true value
                        <OPL />
                        OUTPUT: 579<br />
                        OUTPUT: hiibii<br />
                        OUTPUT: -333<br />
                        OUTPUT: 1
                    </Code>
                    <p> Both strings and numbers simply display themselves when printed.</p>
                    <SubSection>Lists</SubSection>
                        <p>Lists are the only way to store sequential data in <Universal/>. They can store any type of data at any length. To create one,
                        simply separate two numbers or strings with spaces. </p>
                        <Code>
                            <Ind/> mylst will equal [1, 2, hello]<br/>
                            mylst = 1 2 hello
                        </Code>

                    <SubSection>Functions</SubSection>
                </section>

                <section className='mt-10'>
                    <SectionTitle> Builtins</SectionTitle>
                    <SubSection>Operators</SubSection>
                    <SubSection>Control Flow</SubSection>
                    <SubSection>Miscellany</SubSection>
                </section>

            </div>

        </main>

        <Footer />
    </div>
}
