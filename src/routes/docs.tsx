import { createFileRoute } from '@tanstack/react-router'
import { Header, Footer } from './index'
import { ReactNode } from 'react'

export const Route = createFileRoute('/docs')({
    component: RouteComponent,
})

function SectionTitle({ children }: { children: ReactNode }) {
    return <h2 className="inline-block border-b-2 border-border mb-4 text-3xl leading-[1.05] tracking-tight text-foreground md:text-3xl text-primary bold">{children}&nbsp; </h2>
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

function Ind() {
    return <span>&nbsp;&nbsp;</span>
}

function RouteComponent() {
    return <div className="min-h-screen" style={{ background: "var(--gradient-soft)" }}>
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
                    <p className=''><Universal /> as a language aims to follow three guiding priciples.</p>
                    <ol className='ml-4'>
                        <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> All data should be saved to the cloud wherever possible. </span></li>
                        <li className='mt-1 ml-6 -indent-5'><span className='text-primary'>2. </span> There should be no special characters or keywords.</li>
                        <li className='mt-1 ml-5 -indent-4 mb-3'><span className='text-primary'>3. </span> Errors should be avoided at all costs</li>
                    </ol>
                    <p className='mb-5'>These principles lead naturally into the syntax and design of the language. It has a cloud database, the Universal Store, that saves
                        all variables used in a program for future use. These variables can be literally everything - even operators like a + sign are saved to
                        the store. In fact, in accordance with principle 2, the only forbidden characters are the = sign and whitespace.


                    </p>

                    <p><Universal /> is hosted on <Link href='https://waslander.ca'>waslander.ca</Link>. It currently
                        has an interpreter built into the browser, which connects to the default store; at present there's no downloadable
                        version. If you want a different setup for your use case, contact <Link href='mailto:nicholas@waslander.ca'>nicholas@waslander.ca</Link>.</p>
                </section>
                <section className='mt-10'>
                    <SectionTitle> Getting Started</SectionTitle>
                    
                </section>

                <section className='mt-10'>
                    <SectionTitle> Names and Types</SectionTitle>
                    <p> In <Universal />, everything is a variable, and all variables work the same way.
                        To declare a variable, use the following syntax.</p>
                    <Code>newvar = 123 </Code>
                    The left hand side will be evaluated as a <Universal/> statement, e.g. 
                    <Code>newvar2 = 2 + 2 <br/>
                            <Ind/> newvar2 will equal 4
                    </Code>
                </section>
            </div>

        </main>

        <Footer />
    </div>
}
