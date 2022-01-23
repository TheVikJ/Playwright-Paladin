import MetaDecorator from "../components/MetaDecorator";
import React, {useEffect, useState} from "react";
import InputHandler from "../components/InputHandler";
import ParagraphDisplay from "../components/ParagraphDisplay";
import Button from "../components/UI/Button";

const getParagraphFromText = (text) => {
    let paragraphs = text.split('\n\n')
    paragraphs = paragraphs.map(x => x.split('\n'))
    return paragraphs
}

export default function Home() {
    const [text, setText] = useState('');
    const [paragraphs, setParagraphs] = useState([]);
    const [isTyping, setIsTyping] = useState(true);

    const updateParagraphs = (text) => {
        const paragraphs = getParagraphFromText(text)
        if (paragraphs.length <= 1) {
            return
        }


        if (paragraphs[paragraphs.length - 1][0].trim().length <= 0) {
            const unused = paragraphs.pop().join('\n')
            setText(unused)
        }
        addParagraphs(paragraphs)
    }

    useEffect(() => {
        if (!isTyping) return;
        updateParagraphs(text)

    }, [text]);

    const addParagraphs = (newP) => {
        setParagraphs(old => {
            return [...old, ...newP];
        })
    }

    const toggleEditingState = () => {
        if (isTyping) {
            // Going to edit mode
            const newText = paragraphs.map(lines => lines.join('\n')).join('\n\n')
            setText(newText)
            setParagraphs([])
        } else {
            // Going to paragraph mode
            updateParagraphs(text + '\n\n') // hacking around my system :)
        }
        setIsTyping(!isTyping)
    }


    return (
        <main className={'flex flex-col h-screen'}>
            <MetaDecorator title={"Home"} description={"Productivity application for writers"}/>

            {/*<div className={"fixed top-0 right-0 bg-white rounded-lg mt-3 mr-3 outline outline-1 outline-gray-300 px-4 py-3 shadow"}>*/}
            {/*<div className={'flex flex-col fixed top-0 right-0 mt-3 mr-3'}>*/}
            {/*<Button className={'mr-3 w-24'}>Login</Button>*/}
            {/*<Button className={'w-24'}>Register</Button>*/}
            {/*    <Button className={'w-24'}>Logout</Button>*/}
            {/*    <span>*/}
            {/*            <h1>*/}
            {/*                Your Articles*/}
            {/*            </h1>*/}
            {/*        </span>*/}
            {/*</div>*/}
            {/*</div>*/}

            <div className="mb-1 pt-0 w-full">
                <input type="text"
                       placeholder="Document Heading"
                       className="mx-auto font-bold block text-lg mt-4 w-full md:max-w-screen-sm lg:max-w-screen-md xl:max-w-screen-lg px-3 py-4 placeholder-blueGray-300 text-blueGray-600 relative bg-white bg-white rounded text-base border border-blueGray-300 w-full outline outline-1 outline-gray-300 focus:bg-white focus:border-blue-600 focus:outline-none"/>
            </div>
            {isTyping && <ParagraphDisplay paragraphs={paragraphs}/>}
            <InputHandler text={text} setText={setText}/>
            <Button onClick={toggleEditingState}>
                {isTyping ? 'Leave' : 'Enter'} Typing Mode
            </Button>
        </main>
    )
}
