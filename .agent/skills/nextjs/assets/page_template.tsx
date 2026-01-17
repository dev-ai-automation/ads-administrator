// Template for a new Next.js page in App Router

interface PageProps {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ExamplePage({ params, searchParams }: PageProps) {
    const { id } = await params;
    const query = await searchParams;

    return (
        <main>
            <h1>Example Page</h1>
            <p>ID: {id}</p>
            <pre>{JSON.stringify(query, null, 2)}</pre>
        </main>
    );
}
