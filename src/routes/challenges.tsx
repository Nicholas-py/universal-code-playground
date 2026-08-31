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
                <span className="text-primary md:text-5xl font-serif">Challenges</span>
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



            </div>

        </main>

        <Footer />
    </div>
}
