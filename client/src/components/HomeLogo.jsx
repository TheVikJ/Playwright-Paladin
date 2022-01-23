function HomeLogo() {
    return (
        <section className={'fixed l-0 t-0 h-screen flex flex-col w-1/6 z-10 items-center justify-items-center'}>
            <span className={'my-auto block'}>
                <img alt={'Logo'} src={'/logo.png'} className={'w-48'}/>
                <h2 className={'text-2xl font-bold text-gray-800 text-center'}>Playwright Paladin</h2>
                <p className={'text-md text-gray-600 text-center'}>Write effectively!</p>
            </span>
        </section>
    );
}

export default HomeLogo;
