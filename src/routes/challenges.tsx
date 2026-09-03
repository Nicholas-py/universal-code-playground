import { createFileRoute } from '@tanstack/react-router'
import { Header, Footer } from './index'
import { ReactNode } from 'react'

export const Route = createFileRoute('/challenges')({
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
                <span className="text-primary md:text-5xl font-serif"></span>
            </section>
            <div className='border bg-card border-border rounded-3xl p-6 mb-6'>  {/*can consider adding border-l-22*/}
                <section>
                    <SectionTitle> Challenges</SectionTitle>
                    Here's a couple fun challenges to test your <Universal /> skills!
                    <SubSection>1. Fibonacci Numbers</SubSection>
                    Create a function that takes in a positive integer n and outputs the nth Fibonacci number.
                    <Code>
                        print fibonacci 3<br />
                        print fibonacci 6<br />
                        print fibonacci 15<br />
                        <OPL />
                        OUTPUT: 2<br />
                        OUTPUT: 8<br />
                        OUTPUT: 610

                    </Code>
                    <SubSection>2. String Splitting</SubSection>
                    Take a string as input, and split into substrings at every instance of the character "+". Return a list of each substring.

                    <Code>
                        ex1 = stringsplit 12+13+14+15<br />
                        print len ex1<br />
                        print type ex2<br />
                        print ex1<br />
                        ex2 = stringsplit pi33pi+a<br />
                        print len ex2<br />
                        print ex2<OPL />
                        OUTPUT: 4<br />
                        OUTPUT: lzt<br />
                        OUTPUT: 12 13 14 15<br />
                        OUTPUT: 2<br />
                        OUTPUT: pi33pi a<br />
                    </Code>
                    <SubSection>3. Prime Factorization</SubSection><p>
                    Take in an integer and output a list of its prime factors. It may be helpful to first define an "isinteger" function
                    and then use recursion. 
                    <Code>
                        primefactor 242 <br/>
                        <OPL/>
                        OUTPUT: 2 11 11


                    </Code>
                    </p>
                    <SubSection>4. List Sorting</SubSection>
                    Take in a list of numbers, and then sort it using the &lt; and &gt; operators! Return the sorted list.
                    <Code>
                        print sort 7 1 0.2 -4 -5 18
                        <OPL/>
                        OUTPUT: -5 -4 0.2 1 7 18
                    </Code>
                    There are a couple ways to do this. The easiest is probably <Link href='https://en.wikipedia.org/wiki/Quicksort'>quicksort</Link>, with <Link href='https://en.wikipedia.org/wiki/Merge_sort'>merge sort</Link> or <Link href='https://en.wikipedia.org/wiki/Selection_sort'>selection sort</Link> also good options,
                     but 
                    every other sorting algorithm is doable in theory!
                    <SubSection>5. Brainf***</SubSection>
                    Implement an interpreter for <Link href='https://en.wikipedia.org/wiki/Brainfuck'>Brainf***</Link>. This challenge
                    has the bonus of proving <Universal/> to be Turing-complete. For input, there are several options:
                    <Code>brainimp [-&gt;+&lt;]</Code>
                    <Code>[<br/>
                        -<br/>
                        &gt;<br/>
                        +<br/>
                        &lt;<br/>
                    ]
                    </Code>
                    <Code>[ - &gt; + &lt; ]</Code>
                    The first option is the safest, as it doesn't deal with overriding common operators like <ILCode>+</ILCode> or <ILCode>&lt;</ILCode>. 
                    Simply use <ILCode>[code] get i</ILCode> to get each character from the string. For the second and third, good luck!
                </section>



            </div>

        </main>

        <Footer />
    </div>
}
