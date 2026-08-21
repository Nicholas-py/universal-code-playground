import { createFileRoute } from '@tanstack/react-router'
import { Header, Footer } from './index'
import { ReactNode } from 'react'

export const Route = createFileRoute('/docs')({
    component: RouteComponent,
})

function SectionTitle({ children }: { children: ReactNode }) {
    return <h2 className="inline-block border-b-2 border-border mb-4 text-3xl leading-[1.05] tracking-tight text-foreground md:text-3xl text-primary bold">{children}&nbsp; </h2>
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
            <div className='border bg-card border-border rounded-3xl p-6'>  {/*can consider adding border-l-22*/}
                <section>
                    <SectionTitle> Introduction</SectionTitle>
                    <div className='prose prose-neutral dark:prose-invert'>
                        <p>Universal as a language aims to follow three guiding priciples.</p>
                            <ol className='ml-4'>
                                <li className='mt-2 ml-5 -indent-4'><span className='text-primary'>1. </span><span className=''> All data should be saved to the cloud wherever possible. </span></li>
                                <li className='mt-1'><span className='text-primary'>2. </span> There should be no special characters or keywords.</li>
                                <li className='mt-1 mb-3'><span className='text-primary'>3. </span> Errors should be avoided at all costs</li>
                                </ol>
                        <p>These principles lead naturally into the syntax and design of the language. It has a cloud database, the Universal Store, that saves
                            all variables used in a program for future use. These variables can be literally everything - even operators like a + sign are saved to 
                            the store. In fact, in accordance with principle 2, the only forbidden characters are the = sign and whitespace. You can see more details below.
                            
                        </p>


                    </div>
                </section>
            </div>
        </main>

        <Footer />
    </div>
}
