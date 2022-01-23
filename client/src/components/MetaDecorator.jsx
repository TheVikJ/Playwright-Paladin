import Head from 'next/head'

function MetaDecorator({title, description}) {
    return (
        <Head>
            <title>{title} | Playwright Paladin</title>
            <meta name="description" content={description} />
        </Head>
    );
}

export default MetaDecorator;